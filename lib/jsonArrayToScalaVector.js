'use strict';
{
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
    } else {
      start = '['
      end = ']'
    }
    return `${start}${middle}${end}`
  }
}