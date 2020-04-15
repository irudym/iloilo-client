import Vue from 'vue';
import Vuex from 'vuex';
import * as Cookies from 'js-cookie';
import * as types from './types';

// configure cookies
const COOKIE_EMAIL = 'iloilo-user-email';
const COOKIE_AUTH_TOKEN = 'iolio-user-auth_token';
const COOKIE_USER_ID = 'iloilo-user-user-id';

Vue.use(Vuex);


const initialState = {
  user: {
    email: Cookies.get(COOKIE_EMAIL),
    auth_token: Cookies.get(COOKIE_AUTH_TOKEN),
    id: Cookies.get(COOKIE_USER_ID),
  },
  quiz: localStorage.getItem('quiz') ? JSON.parse(localStorage.getItem('quiz')) : { questions: [] },
  currentQuestionIndex: 0,
  timeIntervalId: null,
};


export default new Vuex.Store({
  state: {
    ...initialState,
  },
  mutations: {
    [types.LOGIN_USER](state, payload) {
      state.user = { ...payload.user };

      // put data to cookies
      Cookies.set(COOKIE_AUTH_TOKEN, state.user.auth_token);
      Cookies.set(COOKIE_EMAIL, state.user.email);
      Cookies.set(COOKIE_USER_ID, state.user.id);
    },
    [types.LOGOUT_USER](state) {
      state.user = {
        email: null,
        auth_token: null,
        id: null,
      };
    },
    [types.SET_TIME_INTERVAL](state, payload) {
      state.timeIntervalId = payload.id;
    },
    [types.LOAD_QUIZ](state, payload) {
      state.quiz = { ...payload.quiz };
      localStorage.setItem('quiz', JSON.stringify(payload.quiz));
    },
    [types.CLEAR_QUIZ](state) {
      state.quiz = { questions: [] };
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
      console.log('LocalStorage: ', localStorage.getItem('quiz'));
      state.currentQuestionIndex = 0;
    },
    [types.SET_CURRENT_QUESTION_INDEX](state, payload) {
      state.currentQuestionIndex = payload.index;
    },
    [types.SET_ANSWER_VALUE](state, payload) {
      state.quiz.questions[state.currentQuestionIndex].answers = state.quiz.questions[
        state.currentQuestionIndex].answers.map((answer) => {
        if (answer.id === payload.answerId) {
          return {
            ...answer,
            correct: payload.value,
          };
        }
        return answer;
      });
      // update quiz on the local storage (to keep answers in case of reload or site crash)
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    [types.ADD_QUESTION](state, payload) {
      state.quiz.questions = [...state.quiz.questions, payload.question];
    },
    [types.SUBMIT_QUESTION](state, payload) {
      state.quiz.questions = state.quiz.questions.map((question) => {
        if (question.id === payload.question.id) {
          return {
            ...question,
            submitted: true,
          };
        }
        return question;
      });
    },
  },
  actions: {
    loginUser(context, user) {
      context.commit(types.LOGIN_USER, { user });
    },
    logoutUser(context) {
      context.commit(types.LOGOUT_USER);
    },
    setTimeInterval(context, id) {
      context.commit(types.SET_TIME_INTERVAL, { id });
    },
    loadQuiz(context, quiz) {
      context.commit(types.LOAD_QUIZ, { quiz });
    },
    setAnswerValue(context, { answerId, value }) {
      context.commit(types.SET_ANSWER_VALUE, { answerId, value });
    },
    clearQuiz(context) {
      context.commit(types.CLEAR_QUIZ);
    },
    setCurrentQuestionIndex(context, index) {
      context.commit(types.SET_CURRENT_QUESTION_INDEX, { index });
    },
    addQuestion(context, question) {
      context.commit(types.ADD_QUESTION, { question });
    },
    submitQuestion(context, question) {
      context.commit(types.SUBMIT_QUESTION, { question });
    },
  },
  getters: {
    isLogged: (state) => state.user.email && state.user.auth_token,
    getToken: (state) => state.user.auth_token,
    getUserId: (state) => state.user.id,
    getTimeInterval: (state) => state.timeIntervalId,
    getQuiz: (state) => state.quiz,
    currentQuestionIndex: (state) => state.currentQuestionIndex,
  },
  modules: {
  },
});
