/**
 * @fileoverview Validates required frontmatter in a file.
 *
 * @author Pete LePage <petele@google.com>
 */
'use strict';

const wfRegEx = require('../wfRegEx');

const MAX_DESCRIPTION_LENGTH = 485;

function doesFileExist(filename) {
  return true;
}

/**
 * Tests a JSON file
 *   Note: The returned promise always resolves, it will never reject.
 *
 * @param {string} filename The name of the file to be tested
 * @param {string} contents The contents of the file to be tested
 * @param {boolean} isInclude Is the file an include file
 * @return {Promise} A promise that resolves with TRUE if the file was tested
 *  or FALSE if the file was not tested.
 */
function test(filename, contents, isInclude) {
  const results = [];

  // Validate book_path is specified and file exists
  let match = wfRegEx.RE_BOOK_PATH.exec(contents);
  if (isInclude && match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `'book_path' should not be included in include files.`,
    });
  } else if (!isInclude && !match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Attribute 'book_path' missing from top of document`,
    });
  } else if (!isInclude && match[1] && !doesFileExist(match[1])) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Unable to find specified 'book_path': ${match[1]}`,
    });
  }

  // Validate project_path is specified and file exists
  match = wfRegEx.RE_PROJECT_PATH.exec(contents);
  if (isInclude && match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `'project_path' should not be included in include files.`,
    });
  } else if (!isInclude && !match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Attribute 'project_path' missing from top of document`,
    });
  } else if (!isInclude && match[1] && !doesFileExist(match[1])) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Unable to find specified 'project_path': ${match[1]}`,
    });
  }

  // Validate description
  match = wfRegEx.RE_DESCRIPTION.exec(contents);
  if (isInclude && match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Attribute 'description' should not be used in include files.`,
    });
  } else if (!isInclude && match) {
    const description = match[1].trim();
    if (description.length === 0) {
      results.push({
        level: 'ERROR',
        filename: filename,
        message: `Attribute 'description' cannot be empty.`,
      });
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      results.push({
        level: 'ERROR',
        filename: filename,
        message: `Attribute 'description' exceeds maximum length` +
          ` (${MAX_DESCRIPTION_LENGTH}), was ${description.length}`,
      });
    }
    if (description.indexOf('<') >= 0 || description.indexOf('`') >= 0) {
      results.push({
        level: 'ERROR',
        filename: filename,
        message: `Attribute 'description' cannot contain HTML or markdown.` +
          ` Found: ${description}`,
      });
    }
  }

  // Validate wf_updated
  match = wfRegEx.RE_UPDATED_ON.exec(contents);
  if (isInclude && match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Attribute 'wf_updated_on' should not be used in include files.`,
    });
  } else if (!isInclude && !match) {
    results.push({
      level: 'ERROR',
      filename: filename,
      message: `Attribute 'wf_updated_on' missing from top of document`,
    });
  } else

  if (!isInclude && !isTranslation) {
    if (!matched) {
      msg = 'WF Tag `wf_updated_on` is missing (YYYY-MM-DD)';
      logError(filename, null, msg);
    } else {
      position = {line: getLineNumber(contents, matched.index)};
      let d = moment(matched[1], VALID_DATE_FORMATS, true);
      if (d.isValid() === false) {
        msg = 'WF Tag `wf_updated_on` invalid format (YYYY-MM-DD)';
        msg += `, found: ${matched[1]}`;
        logError(filename, position, msg);
      } else if (options.lastUpdateMaxDays) {
        const nowMinus = moment().subtract(options.lastUpdateMaxDays, 'days');
        if (d.isBefore(nowMinus)) {
          msg = 'WF Tag `wf_updated_on` must be within the last ';
          msg += options.lastUpdateMaxDays + ' days.';
          logWarning(filename, position, msg);
        }
      }
    }
  }

  return results;
}

exports.test = test;
