'use strict';
{
	var expect = require('chai').expect
		, fs = require('fs-extra')
		, constructFeatureVector = require('../lib/constructFeatureVector')

	describe('constructFeatureVector', () => {
		var config;
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
		it('should accept an empty JSON object and an empty array of strings and return undefined',  (done) => {
			var source = {}
				, mapping = []
			constructFeatureVector(source,mapping,(result)=>{
				expect(result).to.equal(0)
				done()
			})
		})
		it('should create a 3 dimensional vector for 3 properties by path', (done) => {
			let val1 = 'baz'
				, val2 = 16
				, val3 = 'battlestar galactica'
			, source = {
				propertyToVectorTesting: {
					foo: {
						bar: val1
					},
					bears: val2,
					bees: val3					
				}
			}
			, mapping = [
				'propertyToVectorTesting.foo.bar',
				'propertyToVectorTesting.bears',
				'propertyToVectorTesting.bees'
			]
			, expectedResult = [1,16,1]
			constructFeatureVector(source,mapping, (result) => {
				result.forEach((val, i) => {
					expect(result[i]).to.equal(expectedResult[i])
				})
				done()
			})
		})
		it('should create a 3 dimensional vector for 3 functions passed via the operations parameter', (done) => {
			let source = {propertyToVectorTesting: 'bar'}
				, one = 1, pi = 3.14159, abcd = 1234
				, mapping = [
					function always1(src, cb) {cb(one)},
					function alwaysPi(src, cb) {cb(pi)},
					function findBar(src, cb) {if (src.propertyToVectorTesting === 'bar') {cb(abcd)}}
				]
				, expectedResult = [one, pi, abcd]
				constructFeatureVector(source, mapping, (results) => {
					expect(results.indexOf(one)).to.not.equal(-1)
					expect(results.indexOf(pi)).to.not.equal(-1)
					expect(results.indexOf(abcd)).to.not.equal(-1)
					done()
				})
		})
		it('should handle a mix of paths and functions', (done) => {
			let source = {propertyToVectorTesting: {foo: 'bar', beetle: 'bailey'}}
				, one = 1, pi = 3.14159, abcd = 1234, qwerty = 123456
				, mapping = [
					'propertyToVectorTesting.foo',
					function findBar(src, cb) {if (src.propertyToVectorTesting.foo === 'bar') {cb(abcd)}},
					function alwaysQwerty(src, cb) {cb(qwerty)},
					function opsOnSrc(src, cb) {
						let bingo = src.propertyToVectorTesting.foo + src.propertyToVectorTesting.beetle
						if (bingo === 'barbailey') {
							cb(pi)
						} else {
							cb('no way buddy')
						}
					}
				],
				expectedResult = [one,abcd,abcd,pi]
				constructFeatureVector(source, mapping, (results) => {
					expect(results.indexOf(one)).to.not.equal(-1)
					expect(results.indexOf(pi)).to.not.equal(-1)
					expect(results.indexOf(abcd)).to.not.equal(-1)
					expect(results.indexOf(qwerty)).to.not.equal(-1)
					done()
				})				
		})
		it('enumerations should be stateful between calls to constructFeatureVector', (done) => {
			let gunslinger = 'daaaaaamn daniel, back at it again with the white vans.'
				, source = {propertyToVectorTesting:{gunslinger:gunslinger}}
				, mapping = ['propertyToVectorTesting.gunslinger']
			constructFeatureVector(source, mapping, (results) => {
				constructFeatureVector(source, mapping, (innerResults) => {
					expect(results[0]).to.equal(innerResults[0])
						.and.to.equal(1)
					done()
				})
			})
		})		
	})
}