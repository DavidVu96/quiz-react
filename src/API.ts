import {shuffleArray} from './utils';

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[]
    question: string;
    type: string;
}

export type QuestionState = Question & { answers : string [] };

export type TriviaCategory = {
    id: number;
    name: string;
}

// export type TriviaCategories = {
//     trivia_categories: TriviaCategory[]
// }


export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export const fetchQuizQuestions = async (amount: number, difficulty:Difficulty, category: string) => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${category}&type=multiple`;
    console.log(endpoint);
    const data = await (await fetch(endpoint)).json();
    return data.results.map((questions: Question) => (
        {
            ...questions,
            answers: shuffleArray([...questions.incorrect_answers, questions.correct_answer]),
        }
    ));
}

export const fetchTriviaCategory = async () => {
    const endpoint = "https://opentdb.com/api_category.php";

    const data = await (await fetch(endpoint)).json();
    return data.trivia_categories.map((category: TriviaCategory) => (
        {
            ...category
        }
    ));

}