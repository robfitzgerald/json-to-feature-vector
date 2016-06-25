'use strict';
{
	var expect = require('chai').expect
		, path = require('path')
		, prop = require('../lib/propertyToVector')
		, fs = require('fs-extra')

	describe('propertyToVector', () => {
		before((done) => {
			fs.remove('mappings/propertyToVectorTesting', (e) => {
				if (e) throw e
				done()
			})
		})
		after((done) => {
			fs.remove('mappings/propertyToVectorTesting', (e) => {
				if (e) throw e
				done()
			})
		})
		it('when property is a number, return that number', () => {
			prop.toVector(3, (result) => expect(result).to.equal(3))
			prop.toVector(3.14, (result) => expect(result).to.equal(3.14))	
		})
		it('when property is a boolean, return 0 or 1', () => {
			prop.toVector(true, (r) => expect(r).to.equal(1))
			prop.toVector(false, (r) => expect(r).to.equal(0))
		})
		it('when propery is string and exists in featureMapping, return correct index of enum in featureMapping', () => {
			let mapping = [null,'foo','bar','baz']
			prop.toVector('baz','outerProperty.innerProperty', mapping, (r) => expect(r).to.equal(3))
		})
		it('when property is string and it does not exist, store it in file system and return 1', (done) => {
			let propertyPath = 'propertyToVectorTesting.bar'
				, property = 'baz'
				, filePath = prop.constructMappingFilePath(propertyPath)
			prop.toVector(property, propertyPath, null, (result) => {
				let fileSystemResult = require(filePath)
				expect(fileSystemResult[result]).to.equal(property)
				done()
			})
		})
		it('when property is string and it exists in a feature mapping file, find it', (done) => {
			let data = [null, 'bongo', 'fury']
				, furyIndex = data.indexOf('fury')
				, property = 'fury'
				, propertyPath = 'propertyToVectorTesting.zappa'
				, filePath = prop.constructMappingFilePath(propertyPath)
				, dirPath = prop.constructMappingDirPath(propertyPath)
			fs.writeJson(filePath, data, () => {
				prop.toVector(property, propertyPath, null, (result) => {
					expect(result).to.equal(furyIndex)
					done()
				})
			})
		})
		it('when property is string and it exists in a feature mapping file, we can append to it', (done) => {
			let data = [null, 'bongo', 'fury']
				, furyIndex = data.indexOf('fury')
				, property = 'fury'
				, property2 = 'slurry'
				, propertyPath = 'propertyToVectorTesting.zippy'
				, filePath = prop.constructMappingFilePath(propertyPath)
				, dirPath = prop.constructMappingDirPath(propertyPath)
			fs.writeJson(filePath, data, () => {
				prop.toVector(property, propertyPath, null, (result) => {
					prop.toVector(property2, propertyPath, null, (result2) => {
						fs.readJson(filePath, (err, file) => {
							expect(file[3]).to.equal(property2)
							done()
						})
					})
				})
			})
		})
	})
}