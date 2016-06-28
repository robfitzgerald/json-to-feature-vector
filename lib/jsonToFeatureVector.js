/*
 * top level driver for the json to feature vector module
 * @function jsonToFeatureVector
 * @param {Object} json - JSON object we will be evaluating into a feature vector
 * @param {String[]|OperationCallback[]} - ordered list of extractions producing each dimension of the vector
 * @param {String} label - optional feature vector label
 * @param {Options} options - configuration object
 * @param {DoneCallback} done - when a file is not specified, the result is passed here
 * @throws {TypeError}
 */

/*
 * optional configurations object
 * @typedef {Object} Options
 * @property {String} directory - file directory to store result. will return value in callback if not set.
 * @property {String} fileName - name of file to store result in.
 * @property {String} start - starting value for output, defaults to '['.
 * @property {String} end - ending value for output, defaults to ']'.
 * @property {String} delimiter - delimiter between dimensions, defaults to ','.
 */

/*
 * user-defined operation callback to produce a dimension by algorithm
 * @callback OperationCallback
 * @param {Object} src               - a copy of the source object to apply this function to
 * @param {OperationDoneCallback} cb - on completion callback
 */

/*
 * operation on completion callback
 * @callback OperationDoneCallback
 * @param {Number} result - a resulting number to be stored at this vector dimension
 */

/*
 * jsonToFeatureVector on completion callback
 * @callback DoneCallback
 * @param {String} result - a string by default of the form "[x0,x1,..,xn]"
 */

'use strict';
{
  var cfv = require('./constructFeatureVector')
    , jstsv = require('./jsonArrayToScalaVector')
    , fs = require('fs-extra')
    , debug = require('debug')('jsonToFeatureVector')

  module.exports = function jsonToFeatureVector(json, operations, label, options, done) {
    let jstsvConfig = null
    if (!done && typeof options === 'function') {
      done = options;
    } else if (typeof options !== 'object') {
      throw new TypeError('toVector: options parameter should be an object')
    } else if (label && typeof label !== 'string') {
      throw new TypeError('toVector: label parameter should be a string, but found ' + typeof label)
    } else {
      debug('found user provided config values')
      jstsvConfig = {start: options.start,delimiter: options.delimiter,end: options.end}
    }
    cfv(json, operations, (results) => {
      debug('returned from constructFeatureVector by callback')
      let transformed = jstsv(results, jstsvConfig)
      if (label) {
        transformed = '( ' + label + ' ' + transformed + ')'; // add a label to the vector
      }
      debug('transformed into string feature vector: ' + transformed)
      if (options && options.directory) {
        debug('saving as file to ' + options.directory)
        // file as destination
        let filePath = options.directory + '/' + options.fileName
        fs.outputFile(filePath, transformed, (err) => {
          debug('done saving to location with ' + (err?err:'no error.'))
          done(err)
        })
      } else {
        debug('using default finish method of pass by callback with transformed vector: ' + transformed)
        // callback as destination
        done(transformed)        
      }
    })
  }
}