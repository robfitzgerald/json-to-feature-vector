# json-to-feature-vector

json-to-feature-vector is a node utility function for converting json objects into feature vectors to be consumed by machine learning tools. i wrote it to act as the helper between my node web service and a spark streaming k-means clustering service. the utility builds a tree of enumeration mappings on the file system to guarantee a 1-to-1 mapping from property string values to integers. it can return its result from a callback or additionally store the result to a file.

# getting started

```
npm i json-to-feature-vector --save
```

# example

``` js
let toVector = require('json-to-feature-vector')
  , expect = require('chai').expect
  , source1 = {
    foo: 'bar',
    num: 3.14159,
    bar: {
      baz: true
  }
  }
  , source2 = {
    foo: 'bees',
    num: 2,
    bar: {
      baz: false
  }
  }
  , mappings: [
    'foo',
    'bar.baz',
    function gt3 (src, cb) {cb(src.num > 3 ? 1 : 0)}
  ]
toVector(source, mappings, null, (res1) => {
  expect(res1).to.equal('[1,1,1')
})
toVector(source, mappings, null, (res2) => {
  expect(res2).to.equal('[2,0,0]')
})
```

mappings is an array of paths and methods used to generate dimensions for the vector. if it is a path (for example, 'bar.baz' would be the path to _true_ in source1), it will return an enumerable value. 0 is used for anything false. 1 is used for anything true. string value enums are stored and updated as a side effect while using json-to-feature-vector. numbers retain their value.

by default, the result will be a string of the form `[x1,x2,..,xn]`. there is an optional 3rd parameter which is a configuration object, where you can set output formatting and file storing details.

