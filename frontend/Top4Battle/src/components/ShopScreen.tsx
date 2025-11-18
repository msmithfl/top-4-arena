import React, { useEffect, useState } from 'react';
import type { MovieCard } from '../types';
import { fetchMovieDetails, fetchPopularMovies } from '../utils/tmdbApi';
import { enhanceMovie } from '../utils/enhanceMovie';
import PlayerCard from './MovieCard';
import DeckPopup from './DeckPopup';

interface ShopScreenProps {
  onPick: (card: MovieCard | null) => void; // null = skip to next round
  deck: MovieCard[];
  usedCardIds: number[];
}

interface TriviaQuestion {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

const ShopScreen: React.FC<ShopScreenProps> = ({ onPick, deck, usedCardIds }) => {
  const [shopCards, setShopCards] = useState<MovieCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [rerolled, setRerolled] = useState(false);
  const [triviaQuestion, setTriviaQuestion] = useState<TriviaQuestion | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedCard, setSelectedCard] = useState<MovieCard | null>(null);
  const hasFetched = React.useRef(false);

  const fetchTrivia = async () => {
    try {
      // Get or use existing session token
      let token = sessionStorage.getItem('trivia_token');
      
      if (!token) {
        // Request a new token
        const tokenResponse = await fetch('https://opentdb.com/api_token.php?command=request');
        const tokenData = await tokenResponse.json();
        token = tokenData.token;
        sessionStorage.setItem('trivia_token', token ?? '');
      }
      
      const response = await fetch(`https://opentdb.com/api.php?amount=1&category=11&difficulty=easy&type=multiple&token=${token}`);
      const data = await response.json();
      
      // If token expired, reset it
      if (data.response_code === 4) {
        sessionStorage.removeItem('trivia_token');
        return fetchTrivia(); // Retry
      }
      
      if (data.results && data.results.length > 0) {
        const question = data.results[0];
        setTriviaQuestion(question);
        const allAnswers = [...question.incorrect_answers, question.correct_answer];
        const shuffled = allAnswers.sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
      }
    } catch (err) {
      console.error('Failed to fetch trivia:', err);
    }
  };

  const rerollShopCards = async () => {
  setLoading(true);
  const randomPage = Math.floor(Math.random() * 100) + 1;
  const movies = await fetchPopularMovies(randomPage);
  // Fetch details for the 3 shop cards
  const cards = await Promise.all(
    movies.slice(0, 3).map(async m => {
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
    // Fetch details for the 3 shop cards
    const cards = await Promise.all(
      movies.slice(0, 3).map(async m => {
        const detail = await fetchMovieDetails(m.id);
        return enhanceMovie(detail);
      })
    );
    setShopCards(cards);
    await fetchTrivia();
    setLoading(false);
  };
  getShopCards();
}, []);

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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-900 rounded-lg max-w-3xl w-full border-4 border-yellow-500 shadow-2xl p-8 text-center flex flex-col"
        style={{ minHeight: '650px' }}
      >
        <div className='flex justify-between mb-5'>
          <button
            onClick={rerollShopCards}
            disabled={rerolled || loading || selectedCard !== null}
            className={`bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all ${rerolled || loading || selectedCard ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Reroll Cards
          </button>
          <DeckPopup deck={deck} usedCardIds={usedCardIds} />
        </div>

        {!selectedCard ? (
          <>
            <h2 className="text-3xl pt-5 font-bold text-yellow-400">Pick a New Card</h2>
            <div className="flex-1 flex items-center justify-center">
              {loading ? (
                <div className="text-white text-xl w-full">Loading...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  {shopCards.map(card => (
                    <div key={card.id} className="flex flex-col items-center">
                      <PlayerCard
                        card={card}
                        isSelected={false}
                        onSelect={() => handleCardSelect(card)}
                      />
                      {/* <button
                        onClick={() => handleCardSelect(card)}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg"
                      >
                        Select
                      </button> */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* <h2 className="text-3xl font-bold text-yellow-400 mb-4">Answer the Trivia!</h2> */}
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-xl text-white mb-4">{triviaQuestion ? decodeHTML(triviaQuestion.question) : 'Loading question...'}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-6">
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

            {selectedAnswer && (
              <div className="mb-4">
                {isCorrect ? (
                  <p className="text-green-400 text-xl font-bold">✅ Correct! You can add the card to your deck.</p>
                ) : (
                  <p className="text-red-400 text-xl font-bold">❌ Wrong! You'll continue without a new card.</p>
                )}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-8 py-3 rounded-lg text-xl"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopScreen;