import React, { useState, useEffect } from 'react';
import { Film, Swords, Trash2 } from 'lucide-react';
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
  const [deck, setDeck] = useState<MovieCard[]>([]);
  const [hand, setHand] = useState<MovieCard[]>([]);
  const [deckPosition, setDeckPosition] = useState(0);
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
  const [usedCardIds, setUsedCardIds] = useState<number[]>([]);
  const [round, setRound] = useState(1);


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

        if (deckMovies.length < 15) {
          throw new Error('Not enough movies fetched');
        }

        // Enhance picked movies and add them to the deck first
        const enhancedPicked = pickedMovies.map(enhanceMovie);

        // Fetch details for the 15 random movies
        const randomDetails = await Promise.all(
          deckMovies.slice(0, 15).map(m => fetchMovieDetails(m.id))
        );
        const enhancedRandom = randomDetails.map(enhanceMovie);

        // Combine: picked movies first, then random
        const enhancedDeck = [...enhancedPicked, ...enhancedRandom];

        // Shuffle the deck so picked movies aren't always at the start
        const shuffledDeck = enhancedDeck.sort(() => Math.random() - 0.5);

        setDeck(shuffledDeck);

        // Draw initial hand
        const initialHand = shuffledDeck.slice(0, 7);
        setHand(initialHand);
        setDeckPosition(7);

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

    // Remove selected cards and draw new ones from deck
    const remainingHand = hand.filter(card => !selectedCards.includes(card.id));
    const cardsToDiscard = selectedCards.length;
    const newCards = deck.slice(deckPosition, deckPosition + cardsToDiscard);

    // Mark discarded cards as used
    setUsedCardIds(prev => [...prev, ...selectedCards]);

    let updatedHand = [...remainingHand, ...newCards];
    let updatedDeckPosition = deckPosition + cardsToDiscard;

    // If we can't fill the hand to 7, reshuffle used cards back in
    if (updatedHand.length < 7) {
      // Find cards that have been used but are not in hand
      const usedButNotInHand = deck.filter(card =>
        usedCardIds.includes(card.id) && !updatedHand.some(h => h.id === card.id)
      );
      // Enable them (remove from usedCardIds)
      setUsedCardIds(prev =>
        prev.filter(id => !usedButNotInHand.some(card => card.id === id))
      );
      // Shuffle and fill hand to 7
      const reshuffled = usedButNotInHand.sort(() => Math.random() - 0.5);
      const fillCount = 7 - updatedHand.length;
      updatedHand = [...updatedHand, ...reshuffled.slice(0, fillCount)];
      updatedDeckPosition += fillCount;
    }

    setHand(updatedHand);
    setDeckPosition(updatedDeckPosition);
    setSelectedCards([]);
    setHasDiscarded(true);
    setBattleLog(prev => [...prev, `🗑️ Discarded ${cardsToDiscard} cards`, '---']);
  };

  const handleAttack = () => {
    const playedCards = hand.filter(card => selectedCards.includes(card.id));
    if (playedCards.length === 0) return;

    setUsedCardIds(prev => [...prev, ...playedCards.map(c => c.id)]);

    const result = calculateBattle(playedCards);
    let playerDamage = result.damage;
    
    // Apply boss ability modifiers to player damage
    if (boss!.ability.name === '😢 EMOTIONAL WEIGHT') {
      playerDamage = Math.round(playerDamage * 0.7); // 30% reduction
    }
    
    if (boss!.ability.name === '🛡️ TECH SHIELD') {
      const shieldBlock = Math.min(1500, playerDamage);
      playerDamage = Math.max(0, playerDamage - shieldBlock);
      if (shieldBlock > 0) {
        setBattleLog(prev => [...prev, `🛡️ Tech Shield absorbed ${shieldBlock} damage!`]);
      }
    }
    
    // Player attacks boss
    const newBossHP = Math.max(0, bossHP - playerDamage);
    setBossHP(newBossHP);
    
    // Boss counter-attacks with ability
    const abilityResult = boss!.ability.effect(turn, boss!.baseDamage);
    let bossDamage = abilityResult.damage;
    
    // Apply defense ignore
    const effectiveDefense = Math.round(result.defense * (1 - boss!.defenseIgnore));
    const damageTaken = Math.max(0, bossDamage - effectiveDefense);
    
    // Handle lifesteal/healing
    const genres = playedCards.flatMap(c => c.genres.map(g => g.name));
    let lifestealAmount = 0;
    let newPlayerHP = playerHP - damageTaken;

    if (genres.includes('Horror')) {
      lifestealAmount = Math.round(playerDamage * 0.1);
      setBattleLog(prev => [...prev, `🩸 You lifesteal ${lifestealAmount} HP!`]);
      newPlayerHP = Math.round(Math.min(3000, Math.max(0, newPlayerHP + lifestealAmount)));
    } else {
      newPlayerHP = Math.round(Math.min(3000, Math.max(0, newPlayerHP)));
    }

    const netHPChange = -damageTaken + lifestealAmount;
    setBattleLog(prev => [
      ...prev,
      `❤️ Net HP change: ${netHPChange > 0 ? '+' : ''}${netHPChange}`
    ]);

    setPlayerHP(newPlayerHP);
    
    // Boss healing ability (only if boss is still alive)
    if (abilityResult.heal > 0 && newBossHP > 0) {
      const healAmount = Math.round(boss!.maxHP * abilityResult.heal);
      const afterHeal = Math.min(boss!.maxHP, newBossHP + healAmount);
      setBossHP(afterHeal);
      setBattleLog(prev => [...prev, `🩸 ${boss!.title} heals ${healAmount} HP!`]);
    }
    
    setPlayerHP(newPlayerHP);
    
    // Log battle
    const log = [
      `⚔️ TURN ${turn} ⚔️`,
      `YOU: Played ${playedCards.map(c => c.title).join(', ')}`,
      ...result.synergies,
      `💥 Dealt ${playerDamage} damage to ${boss?.title}`,
      '',
      `${boss?.title} counter-attacks!`,
      abilityResult.message || '',
      `${boss?.title} deals ${bossDamage} base damage`,
      `🛡️ Your defense blocks ${effectiveDefense} damage (${Math.round(boss!.defenseIgnore * 100)}% ignored by boss)`,
      `❤️ You take ${damageTaken} damage`,
      '---'
    ];
    setBattleLog(prev => [...prev, ...log]);
    
    // Remove played cards and draw enough to refill hand to 7 cards
    const remainingHand = hand.filter(card => !selectedCards.includes(card.id));
    const cardsNeeded = 7 - remainingHand.length;
    const newCards = deck.slice(deckPosition, deckPosition + cardsNeeded);
    
    let updatedHand = [...remainingHand, ...newCards];
    let updatedDeckPosition = deckPosition + cardsNeeded;

    // If we can't fill the hand to 7, reshuffle used cards back in
    if (updatedHand.length < 7) {
      // Find cards that have been used but are not in hand
      const usedButNotInHand = deck.filter(card =>
        usedCardIds.includes(card.id) && !updatedHand.some(h => h.id === card.id)
      );
      // Enable them (remove from usedCardIds)
      setUsedCardIds(prev =>
        prev.filter(id => !usedButNotInHand.some(card => card.id === id))
      );
      // Shuffle and fill hand to 7
      const reshuffled = usedButNotInHand.sort(() => Math.random() - 0.5);
      const fillCount = 7 - updatedHand.length;
      updatedHand = [...updatedHand, ...reshuffled.slice(0, fillCount)];
      updatedDeckPosition += fillCount;
      
      setBattleLog(prev => [...prev, '♻️ Reshuffled used cards back into deck!']);
    }

    setHand(updatedHand);
    setDeckPosition(updatedDeckPosition);
    setSelectedCards([]);
    setHasDiscarded(false);
    setTurn(turn + 1);
    
    // Check win/loss
    if (newBossHP === 0) {
      // Delay shop opening for 1.5 seconds to show victory
      setTimeout(() => {
        setGameState('shop');
        setUsedCardIds([]);
      }, 1500);
    } else if (newPlayerHP <= 0) {
      setGameState('lost');
    }
  };

  const handleShopPick = (card: MovieCard | null) => {
    if (card) {
      // Correct answer - add card to deck
      const updatedDeck = [...deck, card];
      setDeck(updatedDeck);
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
      
      // Use the passed deck or current deck
      const deckToUse = newDeck || deck;
      
      // Shuffle deck and draw new hand
      const shuffledDeck = [...deckToUse].sort(() => Math.random() - 0.5);
      
      // Set all boss/game state first
      setBoss(bossCard);
      setBossHP(bossCard.maxHP);
      setPlayerHP(3000);
      setTurn(1);
      setSelectedCards([]);
      setHasDiscarded(false);
      setBattleLog([]);
      setUsedCardIds([]);
      setRound(prev => prev + 1);
      setDeck(shuffledDeck);
      setHand(shuffledDeck.slice(0, 7));
      setDeckPosition(7);
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
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Loading Movies...</h2>
          <p className="text-gray-400 mt-2">Fetching from TMDB</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Game</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!boss) return <div className="p-8">Loading...</div>;

  return (
    <div className="h-screen bg-linear-to-r from-purple-900 via-blue-900 to-black text-white p-4 overflow-hidden">
      <div className="max-w-full mx-auto flex gap-4 h-full">
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
        <div className="flex-1 overflow-y-auto h-full flex flex-col">
        
        {/* Shop Screen - shows after victory */}
        {gameState === 'shop' && (
          <ShopScreen onPick={handleShopPick} deck={deck} usedCardIds={usedCardIds} />
        )}

        {/* Loss Screen */}
        {gameState === 'lost' && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg text-center border-4 border-red-500">
              <h2 className="text-4xl font-bold mb-4">💀 DEFEATED</h2>
              <p className="text-xl mb-6">{boss.title} was too powerful...</p>
              <button
                onClick={() => window.location.href = '/'}
                className="cursor-pointer hover:scale-105 transition-all bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-bold text-xl"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Boss Section */}
        <BossCardDisplay key={`${boss.id}-${round}`} boss={boss} bossHP={bossHP} />

        {/* Spacer to push content to bottom */}
        <div className="flex-1"></div>

          {/* Action Buttons and Hand - Fixed to Bottom */}
          <div className="mt-auto space-y-4 mx-auto max-w-[95%]">
          
          <div className="flex justify-end">
            <DeckPopup deck={deck} usedCardIds={usedCardIds} />
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
                />
              ))}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAttack}
              disabled={selectedCards.length === 0}
              className={`flex-1 cursor-pointer px-6 py-4 rounded-lg font-bold text-xl flex items-center justify-center gap-2 shadow-lg transition-all
                bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700
                ${selectedCards.length === 0
                  ? 'disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed'
                  : 'transform'
                }`
              }
            >
              <Swords className="w-6 h-6" />
              ATTACK
              {/* ({selectedCards.length}/4) */}
            </button>
            <button
              onClick={handleDiscard}
              disabled={hasDiscarded || selectedCards.length === 0}
              className={`cursor-pointer px-6 py-4 rounded-lg font-bold text-xl flex items-center justify-center gap-2 shadow-lg transition-all
                bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700
                ${(hasDiscarded || selectedCards.length === 0)
                  ? 'disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed'
                  : 'transform'
                }`
              }
            >
              <Trash2 className="w-5 h-5" />
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