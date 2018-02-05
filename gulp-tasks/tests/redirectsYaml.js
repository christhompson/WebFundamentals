/**
 * @fileoverview Tests a _redirects.yaml file.
 *
 * @author Pete LePage <petele@google.com>
 */
'use strict';

const path = require('path');
const JSONValidator = require('jsonschema').Validator;

/**
 * Tests and validates a _redirects.yaml file.
 *   Note: The returned promise always resolves, it will never reject.
 *
 * @param {string} filename The name of the file to be tested.
 * @param {Object} redirects The parsed contents of the redirects file.
 * @return {Promise} A promise with the result of the test.
 */
function test(filename, redirects) {
  return new Promise(function(resolve, reject) {
    let fromPattern = path.dirname(filename).split('/').splice(3).join('/');
    fromPattern = path.join('/', 'web', fromPattern, '/');
    const schemaRedirects = {
      id: '/Redirects',
      type: 'object',
      properties: {
        redirects: {type: 'array', items: {$ref: '/RedirectItem'}},
      },
      additionalProperties: false,
      required: ['redirects'],
    };
    const schemaRedirectItem = {
      id: '/RedirectItem',
      type: 'object',
      properties: {
        to: {type: 'string', required: true},
        from: {
          type: 'string',
          pattern: new RegExp('^' + fromPattern.replace(/\//g, '\\/')),
          required: true,
        },
        temporary: {type: 'boolean'},
      },
      additionalProperties: false,
    };
    const results = [];
    let validator = new JSONValidator();
    validator.addSchema(schemaRedirectItem, schemaRedirectItem.id);
    validator.validate(redirects, schemaRedirects).errors.forEach((err) => {
      let msg = err.stack || err.message;
      msg = msg.replace('{}', '(' + err.instance + ')');
      const result = {
        level: 'ERROR',
        filename: filename,
        message: msg,
      };
      results.push(result);
    });
    resolve(results);
  });
}

exports.test = test;
