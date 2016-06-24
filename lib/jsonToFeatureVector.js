'use strict';
{
  var cfv = require('./constructFeatureVector')
    , jstsv = require('./jsonArrayToScalaVector')
    , fs = require('fs-extra')

  module.exports = function sparkify(json, operations, options, done) {
    let jstsvConfig = null;
    if (!done && typeof options === 'function') {
      done = options;
    } else if (typeof options !== 'object') {
      throw new TypeError('sparkify: options parameter should be an object')
    } else {
      jstsvConfig = {start: options.start,delimiter: options.delimiter,end: options.end}
    }
    cfv(json, operations, (results) => {
      let transformed = jstsv(results, jstsvConfig)
      if (options && options.directory) {
        // file as destination
        let filePath = options.directory + '/' + options.fileName
        fs.outputFile(filePath, transformed, (err) => {
          done(err)
        })
      } else {
        // callback as destination
        done(transformed)        
      }
    })
  }
}