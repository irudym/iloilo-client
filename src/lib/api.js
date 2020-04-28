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
 * Send reset password request to API server
 * @param {string} url - API server URL
 * @param {string} email - User's email
 */
export const passwordReset = async ({ url, email }) => {
  try {
    await axios.post(`${url}/password_resets`, { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
    throw constructError(error);
  }
};

/**
 * Reset user password
 * @param {string} url - API server URL
 * @param {string} token - Security password rest token
 * @param {string} password - User's new password
 */
export const updatePassword = async ({ url, token, password }) => {
  try {
    await axios.patch(`${url}/password_resets/${token}`, { password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
    throw constructError(error);
  }
};

/**
 * Check if password reset token is valid
 * @param {string} url - API server URL
 * @param {string} token - Security password resent token
 */
export const checkPasswordReset = async ({ url, token }) => {
  try {
    await axios.get(`${url}/password_resets/${token}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  } catch (error) {
    throw constructError(error);
  }
};

export const getUserInfo = async ({ url, token, id }) => {
  try {
    const response = await axios.get(`${url}/users/${id}`, {
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
 * Update user profile: name and password
 * @param {string} url API server URL
 * @param {string} token Security token, which identifies an user
 * @param {number} id User id, actually it's useless as user identified by token
 * @param {object} user User object with name and password
 */
export const updateUser = async ({
  url, token, id, user,
}) => {
  try {
    const response = await axios.put(`${url}/users/${id}`, user,
      {
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

/**
 * Upload user vuex history to API server, use this function only for debug/development purposes!
 * Should be deleted in production
 * @param {string} url API server URL
 * @param {string} log Vuex log object
 * @param {string} token Security token to identify the current user
 */
export const uploadVuexLogger = async ({ url, log, token }) => {
  try {
    await axios.post(`${url}/vuexloggers`, {
      data: {
        type: 'vuexlogger',
        attributes: {
          log: JSON.stringify(log),
        },
      },
    }, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log('VUEXlogger: Cannot upload vuex log!');
  }
};
