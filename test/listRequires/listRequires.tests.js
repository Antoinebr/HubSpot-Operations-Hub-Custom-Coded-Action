const assert = require('assert');
const fs = require('fs');
const { listRequires } = require('../../utils.js');

describe('listRequires()', () => {
  it('should return an array of required modules for a given file path', () => {
    const filePath = './test/listRequires/example.js';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const expected = ["module1", "module2", "module3"];

    console.log(listRequires(filePath));

    assert.deepEqual(listRequires(filePath), expected);
  });

  it('should return an empty array if the file has no require statements', () => {
    const filePath = './test/listRequires/empty.js';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const expected = [];
    assert.deepEqual(listRequires(filePath), expected);
  });
});
