import React, { useEffect, useState } from 'react';
import type { MovieCard } from '../types';
import { fetchMovieDetails, fetchPopularMovies } from '../utils/tmdbApi';
import { enhanceMovie } from '../utils/enhanceMovie';
import PlayerCard from './MovieCard';
import DeckPopup from './DeckPopup';
import triviaData from '../data/triviaQuestions.json';
import spinnerImg from '../assets/imgs/top4-spinner.png';

interface ShopScreenProps {
  onPick: (card: MovieCard | null) => void; // null = skip to next round
  deck: MovieCard[];
  discardPile: MovieCard[];
  round: number;
  existingCardIds?: Set<number>;
}

interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onPick, deck, discardPile, round, existingCardIds }) => {
  const [shopCards, setShopCards] = useState<MovieCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerolled, setRerolled] = useState(false);
  const [triviaQuestion, setTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedCard, setSelectedCard] = useState<MovieCard | null>(null);
  const hasFetched = React.useRef(false);
  
  // Build set of existing card IDs from deck and provided set
  const excludeIds = React.useMemo(() => {
    const ids = new Set(deck.map(card => card.id));
    if (existingCardIds) {
      existingCardIds.forEach(id => ids.add(id));
    }
    return ids;
  }, [deck, existingCardIds]);

  const fetchTrivia = () => {
    // Filter questions by difficulty based on round (Easy 1-6, Medium 7-12, Hard 13+)
    let difficulty: 'easy' | 'medium' | 'hard';
    
    if (round >= 13) {
      difficulty = 'hard';
    } else if (round >= 7) {
      difficulty = 'medium';
    } else {
      difficulty = 'easy';
    }
    
    const filteredQuestions = triviaData.results.filter(q => q.difficulty === difficulty);
    
    // Get a random question from the filtered list
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const question = filteredQuestions[randomIndex];
    
    setTriviaQuestion(question);
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    const shuffled = allAnswers.sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
  };

  const rerollShopCards = async () => {
  setLoading(true);
  const randomPage = Math.floor(Math.random() * 100) + 1;
  const movies = await fetchPopularMovies(randomPage);
  // Filter out duplicates and fetch details for the 3 shop cards
  const uniqueMovies = movies.filter(m => !excludeIds.has(m.id));
  const cards = await Promise.all(
    uniqueMovies.slice(0, 3).map(async m => {
      const detail = await fetchMovieDetails(m.id);
      return enhanceMovie(detail);
    })
  );
  setShopCards(cards);
  setLoading(false);
  setRerolled(true);
};

useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;

  const getShopCards = async () => {
    setLoading(true);
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const movies = await fetchPopularMovies(randomPage);
    // Filter out duplicates and fetch details for the 3 shop cards
    const uniqueMovies = movies.filter(m => !excludeIds.has(m.id));
    const cards = await Promise.all(
      uniqueMovies.slice(0, 3).map(async m => {
        const detail = await fetchMovieDetails(m.id);
        return enhanceMovie(detail);
      })
    );
    setShopCards(cards);
    fetchTrivia();
    setLoading(false);
  };
  getShopCards();
}, [excludeIds]);

  const handleCardSelect = (card: MovieCard) => {
    setSelectedCard(card);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === triviaQuestion?.correct_answer;
    setIsCorrect(correct);
  };

  const handleConfirm = () => {
    if (isCorrect && selectedCard) {
      onPick(selectedCard);
    } else {
      // Wrong answer - skip to next round with nothing
      onPick(null);
    }
  };

  // Decode HTML entities (OpenTDB returns encoded strings)
  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#2C3033] rounded-lg max-w-3xl w-full border border-white/10 shadow-2xl p-8 text-center flex flex-col"
        style={{ minHeight: '530px' }}
      >
        <div className='flex justify-between mb-5'>
          <button
            onClick={rerollShopCards}
            disabled={rerolled || loading || selectedCard !== null}
            className={`bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all ${rerolled || loading || selectedCard ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Reroll Cards
          </button>
          <DeckPopup deck={deck} discardPile={discardPile} />
        </div>

        {!selectedCard ? (
          <>
            <h2 className="text-3xl py-5 font-bold text-white">Pick a New Card</h2>
            <div className="flex-1 flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <img 
                    src={spinnerImg} 
                    alt="Loading" 
                    className="w-20 h-20 animate-spin mx-auto mb-4" 
                  />
                  <h2 className="text-2xl font-bold">Loading Cards...</h2>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {shopCards.map(card => (
                    <div key={card.id} className="flex flex-col items-center">
                      <PlayerCard
                        card={card}
                        isSelected={false}
                        onSelect={() => handleCardSelect(card)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-4 border border-white/10">
              <p className="text-xl text-white text-center">{triviaQuestion ? decodeHTML(triviaQuestion.question) : 'Loading question...'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {shuffledAnswers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(answer)}
                  disabled={selectedAnswer !== null}
                  className={`p-4 rounded-lg font-bold text-lg transition-all ${
                    selectedAnswer === null
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : selectedAnswer === answer
                      ? answer === triviaQuestion?.correct_answer
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                      : answer === triviaQuestion?.correct_answer
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {decodeHTML(answer)}
                </button>
              ))}
            </div>

            <div className="flex-1 flex items-center justify-center my-6">
              {selectedAnswer && (
                <div>
                  {isCorrect ? (
                    <p className="text-green-400 text-xl font-bold">✅ Correct! You can add the card to your deck.</p>
                  ) : (
                    <p className="text-red-400 text-xl font-bold">❌ Wrong! You'll continue without a new card.</p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-xl mt-auto"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopScreen;