import React, {useState, useEffect} from 'react';
import QuestionCard from './QuestionCard';
import {fetchQuizQuestions, fetchTriviaCategory} from '../API';
//Types
import {TriviaCategory} from '../API';
import {Difficulty, QuestionState} from '../API';

import {Wrapper} from './QuestionCard.style';

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
  };

const TOTAL_QUESTION=10;

const Trivia = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [userSelectCategoryId, setUserSelectCategoryId] = useState("");

  const loadCategory = async () => {
    if(categories.length === 0 ) {
      const queried_category = await fetchTriviaCategory();
      setCategories(queried_category);
    }
  }

  const selectCategory = (e: React.MouseEvent<HTMLSelectElement>) => {
    console.log("Selected this id");
    console.log(e.currentTarget.value);
    const selection = e.currentTarget.value;
    setUserSelectCategoryId(selection);
  }

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);
    
    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTION, Difficulty.EASY, userSelectCategoryId);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {

    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION ) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion)
    }
  }

  useEffect( () => { 
    loadCategory();
    return () => {}}
  );

  return (
    <>
      <h1> REACT QUIZ </h1>

      {gameOver || userAnswers.length === TOTAL_QUESTION ?(
        <Wrapper>
          <select className="dropdown" onClick={selectCategory} onSelect={selectCategory}>
          {categories.map(category => (
              <option key={category.name} value={category.id}>
                  {category.name}
              </option>
          ))}
          </select>
        </Wrapper>
      ) : null}
        
      {gameOver || userAnswers.length === TOTAL_QUESTION ? (
        <button className="start" onClick={startTrivia}>Start</button>
      ) : null }

      {!gameOver ? <p className="score">Score: {score}</p> : null }
      
      {loading &&  <p>Loading Question ...</p> }

      {!loading && !gameOver && questions!==undefined && (
        <QuestionCard 
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTION}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
        />
      )}

      {!gameOver && !loading && userAnswers.length === number +1 && number !== TOTAL_QUESTION - 1 ? (
        <button className="next" onClick={nextQuestion}>
        Next Question
        </button>
      ) : null}
    </>
  );
}

export default Trivia;
