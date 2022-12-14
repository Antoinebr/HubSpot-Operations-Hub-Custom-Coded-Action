const fs = require('fs');

/**
 * @name getKeyValueTypes
 * @description This function takes an object as parameter and returns an object with the keys and their types.
 * @param {Object} obj The object for which we want to get the keys and their types.
 * @return {Object} An object with the keys and their types.
 */
exports.getKeyValueTypes = (obj) => {
    const keyValueTypes = {};
    Object.keys(obj).forEach(key => {
        keyValueTypes[key] = typeof obj[key];
    });
    return keyValueTypes;
}

/**
 * @name listRequires
 * @description Parses a JavaScript file and lists all the require() calls it contains.
 * @param {string} filePath - The path to the JavaScript file to parse.
 * @returns {string[]} An array of strings, each representing a required module.
 */
exports.listRequires = (filePath) => {
    // Read the contents of the file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Split the file into lines
    const lines = fileContent.split('\n');

    // Initialize an empty array to store the requires
    const requires = [];

    // Loop through each line and check for require statements
    for (const line of lines) {
        // Use a regular expression to match require statements
        // The regular expression has been adjusted to remove quotation marks from the matched require call
        const matches = line.match(/require\((['"])(.*?)\1\)/);

        // If a match is found, add the required module to the list
        if (matches && matches.length >= 3) {
            requires.push(matches[2]);
        }
    }

    // Return the list of required modules
    return requires;
}