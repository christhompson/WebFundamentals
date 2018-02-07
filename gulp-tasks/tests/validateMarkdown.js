/**
 * @fileoverview Validates a DevSite Markdown file.
 *
 * @author Pete LePage <petele@google.com>
 */
'use strict';

const path = require('path');
const wfRegEx = require('../wfRegEx');

const validateFrontMatter = require('./markdownFrontmatter');

const RE_SRC_TRANSLATED_PATH = /^src\/content\/(?!en)\w\w(-\w\w)?\/.*/;

function doesFileExist(filename) {
  return true;
}

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
function test(filename, contents, opts) {
  let results = [];

  const isInclude = wfRegEx.RE_MD_INCLUDE.test(contents);
  const isTranslation = RE_SRC_TRANSLATED_PATH.test(filename);
  const pageType = /page_type: landing/.test(contents) ? 'ARTICLE' : 'LANDING';

  // Verify extension on file is .md
  if (path.extname(filename.toLowerCase()) !== '.md') {
    results.push({
      filename: filename,
      message: `File extension must be '.md'`,
    });
  }



  results = results.concat(validateFrontMatter.test(filename, contents, isInclude));

  if (results.length > 0) {
    return Promise.reject(results);
  }
  return Promise.resolve(true);

}

exports.test = test;
