/**
 * @fileoverview Tests the glossary file.
 *
 * @author Pete LePage <petele@google.com>
 */
'use strict';

const JSONValidator = require('jsonschema').Validator;

/**
 * Tests and validates a glossary.yaml file.
 *   Note: The returned promise always resolves, it will never reject.
 *
 * @param {string} filename The name of the file to be tested.
 * @param {Object} glossary The parsed contents of the glossary file.
 * @return {Promise} A promise with the result of the test.
 */
function test(filename, glossary) {
  return new Promise(function(resolve, reject) {
    const schemaGlossary = {
      id: '/Glossary',
      type: 'array',
      items: {$ref: '/GlossaryItem'},
    };
    const schemaGlossaryItem = {
      id: '/GlossaryItem',
      type: 'object',
      properties: {
        term: {type: 'string', required: true},
        description: {type: 'string', required: true},
        acronym: {type: 'string'},
        see: {$ref: '/GlossaryLink'},
        blink_component: {type: 'string'},
        tags: {type: 'array'},
        links: {type: 'array', items: {$ref: '/GlossaryLink'}},
      },
      additionalProperties: false,
    };
    const schemaGlossaryLink = {
      id: '/GlossaryLink',
      properties: {
        title: {type: 'string', required: true},
        link: {type: 'string', required: true},
      },
      additionalProperties: false,
    };
    const results = [];
    let validator = new JSONValidator();
    validator.addSchema(schemaGlossaryItem, schemaGlossaryItem.id);
    validator.addSchema(schemaGlossaryLink, schemaGlossaryLink.id);
    validator.validate(glossary, schemaGlossary).errors.forEach((err) => {
      let msg = `${err.stack || err.message}`;
      msg = msg.replace('{}', '(' + err.instance + ')');
      const result = {
        level: 'ERROR',
        filename: filename,
        message: msg,
      };
      results.push(result);
    });
    let prevTermName = '';
    glossary.forEach((term) => {
      const termName = term.term.toLowerCase();
      if (prevTermName > termName) {
        const result = {
          level: 'ERROR',
          filename: filename,
          message: `'${prevTermName}' came before '${termName}'`,
        };
        results.push(result);
      }
      prevTermName = termName;
    });
    resolve(results);
  });
}

exports.test = test;
