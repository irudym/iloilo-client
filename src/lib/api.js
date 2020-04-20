/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import { constructError } from './errors';

const axios = require('axios');


/**
 * User signup (admin by default)
 * @param {string} url API server url
 * @param {object} user User description object
 */
export const signup = async ({ url, user }) => {
  try {
    const response = await axios.post(`${url}/signup/`, {
      data: {
        attributes: {
          ...user,
        },
      },
    });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};


export const login = async ({ url, credentials }) => {
  try {
    const response = await axios.post(`${url}/login`, credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};

/**
 * Get information about Active Quiz by PIN
 * @param {string} url API server URL
 * @param {string} token Security token, which identifies an user
 * @param {string} pin Uniq Active Quiz PIN, should be provided by admin
 */
export const getQuizInfo = async ({ url, pin, token }) => {
  try {
    const response = await axios.get(`${url}/evaluations/${pin}`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};

/**
 * Load Quiz data: questions and answers
 * @param {string} url API server URL
 * @param {string} token Security token, which identifies an user
 * @param {string} pin Uniq Active Quiz PIN, should be provided by admin
 */
export const loadQuiz = async ({ url, pin, token }) => {
  try {
    const response = await axios.get(`${url}/evaluations/${pin}/quiz`, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};

export const evaluateQuiz = async ({
  url, pin, token, quiz,
}) => {
  try {
    const response = await axios.post(`${url}/evaluations/${pin}/quiz`, quiz, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};

export const evaluateQuestion = async ({
  url, pin, token, quiz,
}) => {
  try {
    const response = await axios.post(`${url}/evaluations/${pin}/quiz`, quiz, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw constructError(error);
  }
};
