'use strict';
{
	var prop = require('./propertyToVector')
		, testOperations = require('./testOperations')
		, _ = require('lodash')
		, async = require('async')
		, debug = require('debug')('jsonToFeatureVector:constructFeatureVector')

	/*
	 * on completion, returns an array of numbers
	 * @callback ResultsCallback
	 * @param {Number[]} results - list of dimension values
	 */

	/*
	 * @param {Object}                           source - the source data as a JSON object
	 * @param {OperationCallback[]|String[]} operations - an array of property paths or functions to apply to the source object.
	 * @param {ResultsCallback}                    done - on completion callback
	 * @throws {TypeError}
	 */
	module.exports = function constructFeatureVector (source, operations, done) {
		let thisSource = {};
		Object.assign(thisSource, source)
		if (typeof thisSource !== 'object') {
			throw new TypeError('propertyToVector: "source" parameter should be an object, but found a/an ' + typeof source)
		}
		if (typeof operations !== 'object') {
			throw new TypeError('propertyToVector: "operations" parameter should be a map')
		}
		testOperations(operations) // throws error
		if (_.isEmpty(operations)) {
			debug('operations found to be empty. calling callback with 0.')
		  done(0)
		} else {
			async.map(operations, (op, callback) => {
				if (typeof op === 'string') {
					debug('operation found to be a string. searching a string path: ' + op)
					// a string is a path to a string property to enumerate
					let value = _.get(thisSource, op);
					prop.toVector(value, op, null, (result) => {
						debug('result value/enumeration to add to results array: ' + result)
						callback(null, result)
					})
				} else {
					// if user provides a function, it will be passed thisSource - 
					// a local copy of source to prevent side effects - in the
					// first parameter, and it should have a callback in the second
					// parameter which returns a single numerical result value
					debug('operation found to be a function. calling function.')
					op(thisSource, (result) => {
						if (typeof result !== 'number') {
							throw new TypeError('result from user-provided function was not a number. result: ' + result)
						}
						debug('result value produced by function: ' + result)
						callback(null, result)
					})
				}
			}, (err, results) => {
				debug('done collecting results values: ' + results)
				done(results)
			})
		}
	}
}