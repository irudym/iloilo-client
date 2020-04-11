/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */

/**
 * Remove all characters except letters and digits from provided string
 * @param {string} str String which should be sanitized
 */
export const sanitizeString = (str) => {
  const newString = str.replace(/[^a-zA-Z0-9]/g, '');
  return newString.trim();
};


/**
 * Create a plural form of a word
 * @param {string} few plural for few objects
 * @param {string} one singular word form for an object
 * @param {string} two plural for two objects
 */
export const createCountFormatter = ({
  few,
  one,
  two,
}) => {
  const titles = [one, two, few];

  return (number) => {
    const cases = [2, 0, 1, 1, 1, 2];

    return titles[
      number % 100 > 4 && number % 100 < 20
        ? 2
        : cases[number % 10 < 5 ? number % 10 : 5]
    ];
  };
};
