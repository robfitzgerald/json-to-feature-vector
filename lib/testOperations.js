'use strict';
{
  var pathTest = /^(\w+(\[[0-9]+\]){0,1})+(\.\w+(\[[0-9]+\]){0,1})*$/;
  module.exports = function testOperations (operations) {
    operations.forEach((op, i, a)=>{
      let eType = typeof op;
      if (eType === 'string') {
        if (!pathTest.test(op)) {
          throw new TypeError ('testOperations: operation is string but not valid path: ' + op)
        }
      } else if (!eType === 'function') {
        throw new TypeError('testOperations: operation did not match string or function: ' + op)        
      }
    })
    return operations;
  }
}