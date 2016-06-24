'use strict';
{
  var debug = require('debug')('jsonToFeatureVector:stringifyArray')
  /*
   * safely modifies the src string to provide customizable formats
   * @param {String} src - source string of the form "x1,x2,..,xn"
   * @param {Object} config - configurable options
   * @param {String} config.start - start value, defaults to '['
   * @param {String} config.end - end value, defaults to ']'
   * @param {String} config.delimiter - delimiter, defaults to ','
   * @returns {String} formatted string, of the form [x1,x2,..,xn] by default 
   */
  module.exports = function stringifyArray(src, config) {
    if (!src || !Array.isArray(src)) throw new ReferenceError('stringifyArray: src param is invalid: ' + src)
    let start, middle = src.toString(), end;
    if (config && typeof config === 'object') {
      start = config.start || '['
      end = config.end || ']'
      if (config.delimiter && config.delimiter !== ',') {
        let matchDelim = new RegExp(',', 'g')
        middle = middle.replace(matchDelim, config.delimiter)
      }
      debug('some format provided by user')
    } else {
      start = '['
      end = ']'
    }
    return `${start}${middle}${end}`
  }
}