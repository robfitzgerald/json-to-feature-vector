'use strict';
{
  var expect = require('chai').expect
    , fs = require("fs-extra")
    , sparkify = require('../lib/sparkify')
  describe('sparkify', () => {
    // before((done) => {
    //   fs.remove('mappings/sparkifyTest', (e) => {
    //     if (e) throw e
    //     done()
    //   })
    // })
    // after((done) => {
    //   fs.remove('mappings/sparkifyTest', (e) => {
    //     if (e) throw e
    //     done()
    //   })
    // })
    it('should convert a json file to a feature vector and return it when not provided a file location', (done) => {
        let source = {sparkifyTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'sparkifyTest.foo',
            'sparkifyTest.baz',
            function always1(src, cb) {cb(one)},
            function alwaysPi(src, cb) {cb(pi)},
            function findBar(src, cb) {if (src.sparkifyTest.foo === 'bar') {cb(abcd)}}
          ]
          , expectedResult = '[1,1,1,3.14159,1234]'
        sparkify(source, mapping, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it('invalid paths should result in zero-valued results', (done) => {
        let source = {sparkifyTest: {foo: 'bar', baz: 'bees'}}
          , mapping = [
            'sparkifyTest.poo',
            'sparkifyTest.bad'
          ]
          , expectedResult = '[0,0]'
        sparkify(source, mapping, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it('if provided file config, results should be in a file', (done) => {
        let source = {sparkifyTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'sparkifyTest.foo',
            'sparkifyTest.baz',
            function always1(src, cb) {cb(one)},
            function alwaysPi(src, cb) {cb(pi)},
            function findBar(src, cb) {if (src.sparkifyTest.foo === 'bar') {cb(abcd)}}
          ]
          , expectedResult = '[1,1,1,3.14159,1234]'
          , config = {
            directory: '/tmp/sparkifyTest',
            fileName: 'test1.txt'
          }
        sparkify(source, mapping, config, (result) => {
          expect(result).to.not.exist;
          fs.readFile('/tmp/sparkifyTest/test1.txt', (err, data) => {
            console.log(data)
            done(err)          
          })
        })
    })
    it.skip('functions that do not successfully call back should produce zero-valued results', (done) => {
        let source = {sparkifyTest: {foo: 'bar', baz: 'bees'}}
          , mapping = [
            function badFn (src, cb) {return "doesn't call the callback"}
          ]
          , expectedResult = '[0]'
        sparkify(source, mapping, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
  })
}