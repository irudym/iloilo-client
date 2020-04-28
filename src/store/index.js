import Vue from 'vue';
import Vuex from 'vuex';
import * as Cookies from 'js-cookie';
import * as types from './types';
import { loggerPlugin } from './logger';

// configure cookies
const COOKIE_EMAIL = 'iloilo-user-email';
const COOKIE_AUTH_TOKEN = 'iolio-user-auth_token';
const COOKIE_USER_ID = 'iloilo-user-user-id';
const COOKIE_USER_NAME = 'iloilo-user-user-name';

Vue.use(Vuex);


const initialState = {
  user: {
    email: Cookies.get(COOKIE_EMAIL),
    auth_token: Cookies.get(COOKIE_AUTH_TOKEN),
    id: Cookies.get(COOKIE_USER_ID),
    user_name: Cookies.get(COOKIE_USER_NAME),
  },
  quiz: localStorage.getItem('quiz') ? JSON.parse(localStorage.getItem('quiz')) : { questions: [] },
  currentQuestionIndex: localStorage.getItem('current_question_index') ? JSON.parse(localStorage.getItem('current_question_index')) : 0,
  timeIntervalId: null,
  countdownId: null,
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
      Cookies.set(COOKIE_USER_NAME, state.user.user_name);
    },
    [types.LOGOUT_USER](state) {
      state.user = {
        email: null,
        auth_token: null,
        id: null,
        user_name: null,
      };
      localStorage.clear();
      Cookies.remove(COOKIE_AUTH_TOKEN);
      Cookies.remove(COOKIE_EMAIL);
      Cookies.remove(COOKIE_USER_ID);
      Cookies.remove(COOKIE_USER_NAME);
    },
    [types.SET_TIME_INTERVAL](state, payload) {
      state.timeIntervalId = payload.id;
    },
    [types.SET_COUNTDOWN_ID](state, payload) {
      state.countdownId = payload.id;
    },
    [types.LOAD_QUIZ](state, payload) {
      state.quiz = { ...payload.quiz };
      state.currentQuestionIndex = 0;
      localStorage.setItem('quiz', JSON.stringify(payload.quiz));
      localStorage.setItem('current_question_index', JSON.stringify(0));
    },
    [types.CLEAR_QUIZ](state) {
      state.quiz = { questions: [] };
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
      state.currentQuestionIndex = 0;
      localStorage.setItem('current_question_index', JSON.stringify(0));
    },
    [types.SET_CURRENT_QUESTION_INDEX](state, payload) {
      state.currentQuestionIndex = payload.index;
      localStorage.setItem('current_question_index', JSON.stringify(state.currentQuestionIndex));
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
      try {
        // update quiz on the local storage (to keep answers in case of reload or site crash)
        localStorage.setItem('quiz', JSON.stringify(state.quiz));
      } catch (error) {
        console.log('LocalStorage Error: ', error);
      }
    },
    [types.ADD_QUESTION](state, payload) {
      state.quiz.questions = [...state.quiz.questions, payload.question];
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    [types.SUBMIT_QUESTION](state, payload) {
      state.quiz.questions = state.quiz.questions.map((question) => {
        if (question.id === payload.question.id) {
          return {
            ...question,
            submitted: true,
            uploading: false,
          };
        }
        return question;
      });
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    [types.UNSUBMIT_QUESTION](state, payload) {
      state.quiz.questions = state.quiz.questions.map((question) => {
        if (question.id === payload.question.id) {
          return {
            ...question,
            submitted: false,
          };
        }
        return question;
      });
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    [types.INCREASE_QUESTION_INDEX](state) {
      state.currentQuestionIndex += 1;
    },
    [types.DECREASE_QUESTION_INDEX](state) {
      state.currentQuestionIndex -= 1;
      if (state.currentQuestionIndex < 0) {
        state.currentQuestionIndex = 0;
      }
    },
    [types.UPLOAD_QUESTION](state, payload) {
      state.quiz.questions = state.quiz.questions.map((question) => {
        if (question.id === payload.question.id && !question.submitted) {
          return {
            ...question,
            uploading: true,
          };
        }
        return question;
      });
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
    },
    [types.MOVETO_LAST_QUESTION_INDEX](state) {
      state.currentQuestionIndex = state.quiz.questions.length - 1;
    },
    [types.CLEAR_QUESTION_STATES](state, payload) {
      state.quiz.questions = state.quiz.questions.map((question) => {
        if (question.id === payload.question.id && !question.submitted) {
          return {
            ...question,
            uploading: false,
            submitted: false,
          };
        }
        return question;
      });
      localStorage.setItem('quiz', JSON.stringify(state.quiz));
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
    unsubmitQuestion(context, question) {
      context.commit(types.UNSUBMIT_QUESTION, { question });
    },
    setCountdownId(context, id) {
      context.commit(types.SET_COUNTDOWN_ID, { id });
    },
    increaseQuestionIndex(context) {
      context.commit(types.INCREASE_QUESTION_INDEX);
    },
    decreaseQuestionIndex(context) {
      context.commit(types.DECREASE_QUESTION_INDEX);
    },
    uploadQuestion(context, question) {
      context.commit(types.UPLOAD_QUESTION, { question });
    },
    moveToLastQuestionIndex(context) {
      context.commit(types.MOVETO_LAST_QUESTION_INDEX);
    },
    clearQuestionStates(context, question) {
      context.commit(types.CLEAR_QUESTION_STATES, { question });
    },
  },
  getters: {
    isLogged: (state) => {
      // state.user.email && state.user.auth_token
      if (!state.user.email || !state.user.auth_token) {
        return false;
      }
      return true;
    },
    getToken: (state) => state.user.auth_token,
    getUserId: (state) => state.user.id,
    getUserName: (state) => state.user.user_name,
    getUserEmail: (state) => state.user.email,
    getTimeInterval: (state) => state.timeIntervalId,
    getQuiz: (state) => state.quiz,
    currentQuestionIndex: (state) => state.currentQuestionIndex,
    countdownId: (state) => state.countdownId,
  },
  modules: {
  },
  plugins: [loggerPlugin],
});
