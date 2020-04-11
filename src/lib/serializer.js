/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */

/**
 * Decode response from API server and extract questions with answers
 * @param {object} quiz response from API server which contains information about
 * Quiz
 */
export const deSerializeQuiz = (quiz) => {
  let quizAttributes = {};
  const answers = quiz.included.reduce((acc, data) => {
    if (data.type === 'answer') {
      return acc.concat({
        id: data.id,
        text: data.attributes.text,
      });
    }
    if (data.type === 'quiz') {
      quizAttributes = { ...data.attributes };
    }
    return acc;
  }, []);
  const questions = quiz.included.reduce((acc, data) => {
    if (data.type === 'question') {
      return acc.concat({
        id: data.id,
        text: data.attributes.text,
        answers: data.relationships.answers.data.map((answer) => (
          answers.find((value) => (value.id === answer.id))
        )),
      });
    }
    return acc;
  }, []);
  const response = {
    ...quiz.data.attributes,
    questions,
    quiz: quizAttributes,
  };
  return response;
};
