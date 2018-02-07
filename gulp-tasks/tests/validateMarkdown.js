/**
 * @fileoverview Validates a DevSite Markdown file.
 *
 * @author Pete LePage <petele@google.com>
 */
'use strict';

// const fs = require('fs');
const path = require('path');
const wfRegEx = require('../wfRegEx');

const validateFrontMatter = require('./markdownFrontmatter');

// const RE_SRC_TRANSLATED_PATH = /^src\/content\/(?!en)\w\w(-\w\w)?\/.*/;

/**
 * Checks if a file exists.
 *
 * @todo Remove this
 *
 * @param {string} filename The WebFundamentals file path.
 * @return {Boolean} True if it exists, false if not.
 */
// function doesFileExist(filename) {
//   if (!filename) {
//     return false;
//   }
//   filename = filename.trim();
//   filename = filename.replace(/^\/?web\/(.*)/, 'src/content/en/$1');
//   try {
//     fs.accessSync(filename, fs.R_OK);
//     return true;
//   } catch (ex) {
//     return false;
//   }
// }

/**
 * Tests & validates a markdown file.
 *   Note: The returned promise always resolves, it will never reject.
 *
 * @param {string} filename The name of the file to be tested
 * @param {string} contents The contents of the file to be tested
 * @param {Object} options Options used to test the file
 * @return {Promise} A promise that resolves with TRUE if the file was tested
 *  or FALSE if the file was not tested.
 */
function test(filename, contents, options) {
  let results = [];

  const isInclude = wfRegEx.RE_MD_INCLUDE.test(contents);
  // const isTranslation = RE_SRC_TRANSLATED_PATH.test(filename);
  // const pageType = /page_type: landing/.test(contents) ? 'ARTICLE':'LANDING';

  // Verify extension on file is .md
  if (path.extname(filename.toLowerCase()) !== '.md') {
    results.push({
      filename: filename,
      message: `File extension must be '.md'`,
    });
  }

  const fmTestResults = validateFrontMatter.test(filename, contents, isInclude);
  results = results.concat(fmTestResults);

  if (results.length > 0) {
    return Promise.reject(results);
  }
  return Promise.resolve(true);
}

exports.test = test;
