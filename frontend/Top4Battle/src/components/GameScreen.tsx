import React, { useState, useEffect } from 'react';
import PlayerCard from './MovieCard';
import BossCardDisplay from './BossCard';
import GameSidebar from './GameSidebar';
import type { MovieCard, BossCard } from '../types';
import { fetchPopularMovies, fetchMovieDetails } from '../utils/tmdbApi';
import { enhanceMovie } from '../utils/enhanceMovie';
import { calculateBattle } from '../utils/battleCalc';
import PickTopFilms from './PickTopFilms';
import DeckPopup from './DeckPopup';
import ShopScreen from './ShopScreen';
import { PREBUILT_BOSSES } from '../data/prebuiltBosses';
import { createPrebuiltBossCard } from '../utils/bossCard';
import spinnerImg from '../assets/imgs/top4-spinner.png';

let bossCycle: number[] = [];

const getRandomBoss = () => {
  // If we've cycled through all bosses, reset the cycle
  if (bossCycle.length === 0) {
    bossCycle = Array.from({ length: PREBUILT_BOSSES.length }, (_, i) => i);
    // Shuffle the cycle
    for (let i = bossCycle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bossCycle[i], bossCycle[j]] = [bossCycle[j], bossCycle[i]];
    }
  }
  // Pop the next boss index from the cycle
  const idx = bossCycle.pop()!;
  return PREBUILT_BOSSES[idx];
};

const GameScreen: React.FC = () => {
  const [collectionDeck, setCollectionDeck] = useState<MovieCard[]>([]); // Full collection for viewing
  const [playDeck, setPlayDeck] = useState<MovieCard[]>([]); // Shuffled deck for drawing
  const [discardPile, setDiscardPile] = useState<MovieCard[]>([]); // Cards that have been used
  const [hand, setHand] = useState<MovieCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [boss, setBoss] = useState<BossCard | null>(null);
  const [bossHP, setBossHP] = useState(0);
  const [playerHP, setPlayerHP] = useState(3000);
  const [turn, setTurn] = useState(1);
  const [hasDiscarded, setHasDiscarded] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost' | 'shop'>('playing');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pickedMovies, setPickedMovies] = useState<MovieCard[] | null>(null);
  const [round, setRound] = useState(1);
  const [isAttacking, setIsAttacking] = useState(false);
  
  useEffect(() => {
    // Don't initialize until we have picked movies
    if (!pickedMovies) return;
    
    let isMounted = true;
    
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch deck from random page (1-100) for variety
        const randomPage = Math.floor(Math.random() * 100) + 1;
        const deckMovies = await fetchPopularMovies(randomPage);

        if (!isMounted) return;

        if (deckMovies.length < 10) {
          throw new Error('Not enough movies fetched');
        }

        // Enhance picked movies and add them to the deck first
        const enhancedPicked = pickedMovies.map(enhanceMovie);

        // Fetch details for the 10 random movies
        const randomDetails = await Promise.all(
          deckMovies.slice(0, 10).map(m => fetchMovieDetails(m.id))
        );
        const enhancedRandom = randomDetails.map(enhanceMovie);

        // Combine: picked movies first, then random
        const enhancedDeck = [...enhancedPicked, ...enhancedRandom];

        // Collection deck (for viewing) - not shuffled
        setCollectionDeck(enhancedDeck);

        // Play deck (for drawing) - shuffled
        const shuffledPlayDeck = [...enhancedDeck].sort(() => Math.random() - 0.5);
        
        // Draw initial hand from play deck
        const initialHand = shuffledPlayDeck.slice(0, 7);
        const remainingPlayDeck = shuffledPlayDeck.slice(7);
        
        setHand(initialHand);
        setPlayDeck(remainingPlayDeck);
        setDiscardPile([]);

        // Set boss from prebuilt list with TMDB data
        const rawBoss = getRandomBoss();
        const bossCard = await createPrebuiltBossCard(rawBoss, fetchMovieDetails);
        setBoss(bossCard);
        setBossHP(bossCard.maxHP);

        setIsLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to initialize game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load movies');
        setIsLoading(false);
      }
    };
    
    initializeGame();
    
    return () => {
      isMounted = false;
    };
  }, [pickedMovies]);

  const toggleCardSelection = (cardId: number) => {
    if (isAttacking) return; // Prevent selection during attack phase
    
    setSelectedCards(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      if (prev.length < 4) {
        return [...prev, cardId];
      }
      return prev;
    });
  };

  const handleDiscard = () => {
    if (hasDiscarded) return;

    const discardedCards = hand.filter(card => selectedCards.includes(card.id));
    const remainingHand = hand.filter(card => !selectedCards.includes(card.id));
    const cardsNeeded = 7 - remainingHand.length;
    
    let updatedHand = [...remainingHand];
    let updatedPlayDeck = [...playDeck];
    let updatedDiscardPile = [...discardPile, ...discardedCards]; // Include the cards we're discarding
    
    // Draw cards one by one
    for (let i = 0; i < cardsNeeded; i++) {
      if (updatedPlayDeck.length > 0) {
        // Draw from play deck
        updatedHand.push(updatedPlayDeck[0]);
        updatedPlayDeck = updatedPlayDeck.slice(1);
      } else if (updatedDiscardPile.length > 0) {
        // Play deck empty, reshuffle discard pile
        const shuffledDiscard = [...updatedDiscardPile].sort(() => Math.random() - 0.5);
        updatedPlayDeck = shuffledDiscard;
        updatedDiscardPile = [];
        setBattleLog(prev => [...prev, '♻️ Reshuffled discard pile back into play deck!']);
        
        // Draw from newly shuffled deck
        if (updatedPlayDeck.length > 0) {
          updatedHand.push(updatedPlayDeck[0]);
          updatedPlayDeck = updatedPlayDeck.slice(1);
        }
      } else {
        // Both empty - shouldn't happen but break to avoid infinite loop
        break;
      }
    }

    setHand(updatedHand);
    setPlayDeck(updatedPlayDeck);
    setDiscardPile(updatedDiscardPile);
    setSelectedCards([]);
    setHasDiscarded(true);
    setBattleLog(prev => [...prev, `🗑️ Discarded ${cardsNeeded} cards`, '---']);
  };

  const handleAttack = () => {
    const playedCards = hand.filter(card => selectedCards.includes(card.id));
    if (playedCards.length === 0 || isAttacking) return;

    setIsAttacking(true);

    const result = calculateBattle(playedCards);
    let playerDamage = result.damage;
    
    // PHASE 1: Player attacks boss
    const newBossHP = Math.max(0, bossHP - playerDamage);
    setBossHP(newBossHP);
    
    // Add played cards to discard pile
    setDiscardPile(prev => [...prev, ...playedCards]);
    
    // Check if boss is defeated - if so, skip counter-attack and go to shop
    if (newBossHP === 0) {
      setIsAttacking(false);
      setTimeout(() => {
        setGameState('shop');
        setDiscardPile([]);
      }, 1500);
      return;
    }
    
    // PHASE 2: Boss counter-attacks (delayed)
    setTimeout(() => {
      // Boss counter-attacks with ability
      const abilityResult = boss!.ability.effect(turn, boss!.baseDamage);
      let bossDamage = abilityResult.damage;
      
      // Apply defense ignore
      const effectiveDefense = Math.round(result.defense * (1 - boss!.defenseIgnore));
      const damageTaken = Math.max(0, bossDamage - effectiveDefense);
      
      let newPlayerHP = Math.round(Math.min(3000, Math.max(0, playerHP - damageTaken)));
      
      setPlayerHP(newPlayerHP);
      
      // Check if player died - if so, skip hand refill and show loss screen
      if (newPlayerHP <= 0) {
        setTimeout(() => {
          setIsAttacking(false);
          setGameState('lost');
        }, 1000);
        return;
      }
      
      // Short delay before refilling hand
      setTimeout(() => {
        // Remove played cards and refill hand to 7 cards
        const remainingHand = hand.filter(card => !selectedCards.includes(card.id));
        const cardsNeeded = 7 - remainingHand.length;
        
        let updatedHand = [...remainingHand];
        let updatedPlayDeck = [...playDeck];
        let updatedDiscardPile = [...discardPile, ...playedCards]; // Include the cards we just played
        
        // Draw cards one by one, reshuffling discard pile only when play deck is empty
        for (let i = 0; i < cardsNeeded; i++) {
          if (updatedPlayDeck.length > 0) {
            // Draw from play deck
            updatedHand.push(updatedPlayDeck[0]);
            updatedPlayDeck = updatedPlayDeck.slice(1);
          } else if (updatedDiscardPile.length > 0) {
            // Play deck empty, reshuffle discard pile
            const shuffledDiscard = [...updatedDiscardPile].sort(() => Math.random() - 0.5);
            updatedPlayDeck = shuffledDiscard;
            updatedDiscardPile = [];
            setBattleLog(prev => [...prev, '♻️ Reshuffled discard pile back into play deck!']);
            
            // Draw from newly shuffled deck
            if (updatedPlayDeck.length > 0) {
              updatedHand.push(updatedPlayDeck[0]);
              updatedPlayDeck = updatedPlayDeck.slice(1);
            }
          } else {
            // Both empty - shouldn't happen but break to avoid infinite loop
            break;
          }
        }
        
        setDiscardPile(updatedDiscardPile);

        setHand(updatedHand);
        setPlayDeck(updatedPlayDeck);
        setSelectedCards([]);
        setHasDiscarded(false);
        setTurn(turn + 1);
        setIsAttacking(false);
      }, 1000); // 1000ms delay before refilling hand
    }, 1000); // 1 second delay between player attack and boss counter-attack
  };

  const handleShopPick = (card: MovieCard | null) => {
    if (card) {
      // Correct answer - add card to collection deck
      const updatedDeck = [...collectionDeck, card];
      setCollectionDeck(updatedDeck);
      resetRound(updatedDeck);
    } else {
      // Wrong answer - continue without adding card
      resetRound();
    }
  };

  // const resetGame = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
      
  //     // Fetch deck from random page (1-100) for variety
  //     const randomPage = Math.floor(Math.random() * 100) + 1;
  //     const deckMovies = await fetchPopularMovies(randomPage);
      
  //     // Fetch boss separately from popular movies
  //     const bossMovie = await fetchPopularBoss();
      
  //     if (deckMovies.length < 7) {
  //       throw new Error('Not enough movies fetched');
  //     }
      
  //     const enhancedDeck = deckMovies.slice(0, 19).map(enhanceMovie);
  //     setDeck(enhancedDeck);
  //     setHand(enhancedDeck.slice(0, 7));
  //     setDeckPosition(7); // Reset deck position
  //     const bossCard = createBossCard(bossMovie);
  //     setBoss(bossCard);
  //     setBossHP(bossCard.maxHP);
  //     setPlayerHP(3000);
  //     setTurn(1);
  //     setSelectedCards([]);
  //     setHasDiscarded(false);
  //     setBattleLog([]);
  //     setGameState('playing');
  //     setIsLoading(false);
  //   } catch (err) {
  //     console.error('Failed to reset game:', err);
  //     setError(err instanceof Error ? err.message : 'Failed to load movies');
  //     setIsLoading(false);
  //   }
  // };

  // Modify resetRound to set state back to playing
  
  // Modify resetRound to accept the updated deck
  
  const resetRound = async (newDeck?: MovieCard[]) => {
    setIsLoading(true);
    setError(null);
    try {
      // Set boss from prebuilt list with TMDB data
      const rawBoss = getRandomBoss();
      const bossCard = await createPrebuiltBossCard(rawBoss, fetchMovieDetails);
      
      // Use the passed deck or current collection deck
      const deckToUse = newDeck || collectionDeck;
      
      // Shuffle for play deck and draw new hand
      const shuffledPlayDeck = [...deckToUse].sort(() => Math.random() - 0.5);
      const initialHand = shuffledPlayDeck.slice(0, 7);
      const remainingPlayDeck = shuffledPlayDeck.slice(7);
      
      // Set all boss/game state first
      setBoss(bossCard);
      setBossHP(bossCard.maxHP);
      setPlayerHP(3000);
      setTurn(1);
      setSelectedCards([]);
      setHasDiscarded(false);
      setBattleLog([]);
      setRound(prev => prev + 1);
      setCollectionDeck(deckToUse);
      setPlayDeck(remainingPlayDeck);
      setHand(initialHand);
      setDiscardPile([]);
      setIsLoading(false);
      
      // Wait for all state updates to flush, then change game state
      setTimeout(() => {
        setGameState('playing');
      }, 0);
    } catch (err) {
      setError('Failed to load new boss.');
      setIsLoading(false);
    }
  };

  if (!pickedMovies) {
    return <PickTopFilms onComplete={setPickedMovies} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#14181C] text-white flex items-center justify-center">
        <div className="text-center">
          <img 
            src={spinnerImg} 
            alt="Loading" 
            className="w-20 h-20 animate-spin mx-auto mb-4" 
          />
          <h2 className="text-2xl font-bold">Loading Movies...</h2>
          <p className="text-gray-400 mt-2">Fetching from TMDB</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#14181C] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Game</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-6 py-3 rounded-lg font-bold cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!boss) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen bg-[#14181C] text-white overflow-hidden">
      <div className="max-w-full mx-auto flex h-full">
        {/* Left Sidebar - Player Stats */}
        <GameSidebar
          turn={turn}
          round={round}
          playerHP={playerHP}
          selectedCards={selectedCards}
          hand={hand}
          boss={boss}
          battleLog={battleLog}
          calculateBattle={calculateBattle}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mx-3 py-3 h-full flex flex-col">
        
        {/* Shop Screen - shows after victory */}
        {gameState === 'shop' && (
          <ShopScreen onPick={handleShopPick} deck={collectionDeck} discardPile={discardPile} round={round} />
        )}

        {/* Loss Screen */}
        {gameState === 'lost' && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-[#2C3440] p-8 rounded-lg text-center border-4 border-red-500">
              <h2 className="text-4xl font-bold mb-4">💀 DEFEATED</h2>
              <p className="text-xl mb-6">{boss.title} was too powerful...</p>
              <button
                onClick={() => window.location.href = '/'}
                className="cursor-pointer hover:scale-105 transition-all bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 px-8 py-3 rounded-lg font-bold text-xl"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Boss Section */}
        <BossCardDisplay key={`${boss.id}-${round}`} boss={boss} bossHP={bossHP} />

        {/* Spacer to push content to bottom - click to deselect */}
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => {
            if (selectedCards.length > 0) {
              setSelectedCards([]);
            }
          }}
        ></div>

          {/* Action Buttons and Hand - Fixed to Bottom */}
          <div className="mt-auto space-y-4 mx-auto max-w-[95%]">
          
          <div className="flex justify-end">
            <DeckPopup deck={collectionDeck} discardPile={discardPile} />
          </div>
          

          {/* Hand */}
          <div className="mb-4">
            <div className="grid grid-cols-7 gap-2">
              {hand.map(card => (
                <PlayerCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCards.includes(card.id)}
                  onSelect={toggleCardSelection}
                  isDisabled={isAttacking}
                />
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAttack}
              disabled={selectedCards.length === 0 || isAttacking}
              className={`flex-1 cursor-pointer px-6 py-4 rounded-full font-bold text-xl flex items-center justify-center gap-2 shadow-lg transition-all
                bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700
                ${(selectedCards.length === 0 || isAttacking)
                  ? 'disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed'
                  : 'transform'
                }`
              }
            >
              ATTACK
            </button>
            <button
              onClick={handleDiscard}
              disabled={hasDiscarded || selectedCards.length === 0}
              className={`cursor-pointer px-8 py-4 rounded-lg font-bold text-xl flex items-center justify-center gap-2 shadow-lg transition-all
                bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700
                ${(hasDiscarded || selectedCards.length === 0)
                  ? 'disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed'
                  : 'transform'
                }`
              }
            >
              DISCARD {hasDiscarded ? '(Used)' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default GameScreen;