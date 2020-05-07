'use strict';

/**
 * @returns {boolean} whether the string has no characters or contains only whitespace
 */
const isEmpty = (str) => str.length === 0 || !str.trim();
/**
 * @returns {boolean} whether the string is null, empty, or undefined
 */
const isBlank = (str) => !str || isEmpty(str);

module.exports = {
  isEmpty,
  isBlank
};
