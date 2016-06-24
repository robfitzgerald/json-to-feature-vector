'use strict';
{
  var expect = require('chai').expect
    , jatsv = require('../lib/jsonArrayToScalaVector')
  describe('jsonArrayToScalaVector', () => {
    it('should property stringify with standard comma as delimiter', ()=>{
      let config = {
        start: '[',
        delimiter: ',',
        end: ']' 
      }
        , source = [
          1,
          121,
          1331,
          14641
        ]
        , result = jatsv(source, config)
       expect(result).to.equal('[1,121,1331,14641]')     
    })
    it('should property stringify with a different delimiter', ()=>{
      let config = {
        start: '[',
        delimiter: '$',
        end: ']' 
      }
        , source = [
          1,
          121,
          1331,
          14641
        ]
        , result = jatsv(source, config)
       expect(result).to.equal('[1$121$1331$14641]')     
    })
  })
}