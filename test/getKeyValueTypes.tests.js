const assert = require('assert');
const {getKeyValueTypes} = require('../utils.js');

describe('getKeyValueTypes()', () => {
  it('should return an object with the correct key-value types for a given object', () => {
    const obj = {
      key1: 'value1',
      key2: 2,
      key3: true,
      key4: [1, 2, 3]
    };
    const expected = {
      key1: 'string',
      key2: 'number',
      key3: 'boolean',
      key4: 'object'
    };
    assert.deepEqual(getKeyValueTypes(obj), expected);
  });

  it('should return an empty object if the input object is empty', () => {
    const obj = {};
    const expected = {};
    assert.deepEqual(getKeyValueTypes(obj), expected);
  });
});
