'use strict';
{
  var expect = require('chai').expect
    , fs = require("fs-extra")
    , sparkify = require('../lib/jsonToFeatureVector')
  describe('jsonToFeatureVector', () => {
    before((done) => {
      fs.remove('mappings/toVectorTest', (e) => {
        if (e) throw e
        done()
      })
    })
    after((done) => {
      fs.remove('mappings/toVectorTest', (e) => {
        if (e) throw e
        fs.remove('/tmp/toVectorTest', (e2) => {
                if (e2) throw e2
                done()
              })
      })
    })
    it('should convert a json file to a feature vector and return it when not provided a file location', (done) => {
        let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'toVectorTest.foo',
            'toVectorTest.baz',
            function always1(src, cb) {cb(one)},
            function alwaysPi(src, cb) {cb(pi)},
            function findBar(src, cb) {if (src.toVectorTest.foo === 'bar') {cb(abcd)}}
          ]
          , expectedResult = '[1,1,1,3.14159,1234]'
        sparkify(source, mapping, null, null, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it('invalid paths should result in zero-valued results', (done) => {
        let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
          , mapping = [
            'toVectorTest.poo',
            'toVectorTest.bad'
          ]
          , expectedResult = '[0,0]'
        sparkify(source, mapping, null, null, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it('if provided file config, results should be in a file', (done) => {
        let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'toVectorTest.foo',
            'toVectorTest.baz',
            function always1(src, cb) {cb(one)},
            function alwaysPi(src, cb) {cb(pi)},
            function findBar(src, cb) {if (src.toVectorTest.foo === 'bar') {cb(abcd)}}
          ]
          , expectedResult = '[1,1,1,3.14159,1234]'
          , config = {
            directory: '/tmp/toVectorTest',
            fileName: 'test1.txt'
          }
        sparkify(source, mapping, null, null, config, (result) => {
          expect(result).to.not.exist;
          fs.readFile('/tmp/toVectorTest/test1.txt', 'utf8', (err, data) => {
            expect(data).to.equal(expectedResult)
            done(err)          
          })
        })
    })
    it('if provided string formatting options, should output with provided formatting', (done) => {
        let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'toVectorTest.foo',
            'toVectorTest.baz',
            function always1(src, cb) {cb(one)},
            function alwaysPi(src, cb) {cb(pi)},
            function findBar(src, cb) {if (src.toVectorTest.foo === 'bar') {cb(abcd)}}
          ]
          , config = {
            start: ':-)',
            end: '(-:',
            delimiter: '~~~'
          }
          , expectedResult = ':-)1~~~1~~~1~~~3.14159~~~1234(-:'
        sparkify(source, mapping, null, null, config, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it('if provided a label, should output with provided label', (done) => {
        let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
          , one = 1, pi = 3.14159, abcd = 1234
          , mapping = [
            'toVectorTest.foo'
         ]
          , expectedResult = '(myLabel [1])'
        sparkify(source, mapping, 'myLabel', null, (result) => {
          let resultNoSpaces = result.replace(' ', '')
          expect(resultNoSpaces).to.equal(expectedResult)
          done()
        })
    })
    it.skip('functions that do not successfully call back should produce zero-valued results', (done) => {
      let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
        , mapping = [
          function badFn (src, cb) {return "doesn't call the callback"}
        ]
        , expectedResult = '[0]'
      sparkify(source, mapping, null, null, (result) => {
        let resultNoSpaces = result.replace(' ', '')
        expect(resultNoSpaces).to.equal(expectedResult)
        done()
      })
    })
    it('if keepByPaths exists, copy in by path values listed in keepByPaths', (done) => {
      let source = {toVectorTest: {foo: 'bar', baz: 'bees'}}
        , one = 1, pi = 3.14159, abcd = 1234
        , mapping = [
          'toVectorTest.foo'
       ]
        , keepByPaths = [
          'toVectorTest.foo',
          'toVectorTest.baz'
        ]
        , expectedResult = '[bar,bees,1]'
      sparkify(source, mapping, null, keepByPaths, (result) => {
        expect(result).to.equal(expectedResult)
        done()
      })
    })
  })
}