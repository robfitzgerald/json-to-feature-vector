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
        fs.outputFile()
        done()
      } else {
        // callback as destination
        done(transformed)        
      }
    })
  }
}