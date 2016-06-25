'use strict';
{
	var fs = require('fs-extra')
		, path = require('path')
		, debug = require('debug')('jsonToFeatureVector:propertyToVector')
	/*
	 * converts a property into a real number by algorithm or by file system string mapping collection
	 * @param {any} propertyValue - the value to convert to a real number
	 * @param {String} propertyPath - the unique path to the property
	 * @param {Array[String]} featureMapping - optional set of feature mapping string enums
	 * @returns {Number|undefined} vector value, or undefined if unsucessful
	 */
	module.exports = {
		toVector,
		requireOrFailGracefully,
		constructMappingFilePath,
		constructMappingDirPath
	}

	function toVector(propertyValue, propertyPath, featureMappingParam, done) {
		if (typeof propertyPath === 'function') {
			done = propertyPath;
		}
		var featureMapping = featureMappingParam;
		if (typeof propertyValue === 'object') {
			done(undefined);
		} else if (typeof propertyValue === 'boolean') {
			done(propertyValue ? 1 : 0);
		} else if (typeof propertyValue === 'number') {
			done(Number.isNaN(propertyValue) ? undefined : propertyValue);
		} else if (!propertyValue) {  // null, undefined, "", but NOT 0! ;-)
			done(0);
		} else if (typeof propertyValue === "string") {
			if (featureMapping) {
				debug('we were provided a feature mapping param (atypical - usually loaded from file)')
				let result = featureMapping.indexOf(propertyValue)
					, returnedValue = result == -1 ? undefined : result
				debug('result of check against featureMapping provided: ' + returnedValue)
				done(returnedValue);
			} else {
				debug('checking if this enum exists in our file system library')
				let filePath = constructMappingFilePath(propertyPath)
					, dirPath = constructMappingDirPath(propertyPath)
					, storedJson;
				if (storedJson = requireOrFailGracefully(filePath)) {	
					debug('JSON enumeration mapping file found @ ' + filePath)
					var found = storedJson.indexOf(propertyValue)
					if (found != -1) {
						debug('enum found in file: ' + found)
					  done(found);
					} else {
						debug('enum not found in file. adding ' + propertyValue + ' to JSON enumeration mapping file')
						storedJson.push(propertyValue)
						fs.writeJson(filePath, storedJson, (writeErr) => {
							if (writeErr) throw writeErr;
							debug('file appended')
							done(storedJson.length - 1);
						});	
					}		
				} else {
					debug('no file found for ' + propertyPath + ' - writing a new file at ' + filePath)
					debug('making directory path to file: ' + dirPath)
					fs.mkdirs(dirPath, (mkdirErr) => {
						if (mkdirErr) throw mkdirErr;
						let data = [null, propertyValue];
						fs.writeJson(filePath, data, (writeErr) => {
							debug('new file written for ' + propertyPath)
							if (writeErr) throw writeErr;
							done(1);
						})					
					})
				}
			}
		}
	}

	/*
	 * safely loads enumeration files stored in the file system
	 * @param {String} path - fully formed file path
	 * @returns {Object|Boolean} - the requested file, or false if not found.
	 */
	function requireOrFailGracefully(path) {
		try {
			return require(path)
		} catch (e) {
			return false
		}
	}

	/*
	 * creates a file path for whatever file system to the mappings directory (currently hard-coded)
	 * @param {String} propertyPath - the dot-delimited object path which is used to create the file path
	 * @returns {String} a full file path
	 */
	function constructMappingFilePath (propertyPath) {
		let fileType = '.json'
			, d = path.sep
			, featurePath = propertyPath.replace(/\./g, d)
			, rootPath = path.dirname(__dirname) + '/mappings' + d
		return rootPath + featurePath + fileType;
	}

	/*
	 * creates a directory path
	 * @param {String} propertyPath - the dot-delimited object path which is used to create the file path
	 * @returns {String} directory path
	 */
	function constructMappingDirPath (propertyPath) {
		let d = path.sep
			, featurePath = propertyPath.replace(/\./g, d)
		return path.dirname(__dirname) + '/mappings/' + path.dirname(featurePath)
	}
}