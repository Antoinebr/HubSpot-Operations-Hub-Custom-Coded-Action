require('dotenv').config();
const fs = require('fs');


/**
 * @name getKeyValueTypes
 * @description This function takes an object as parameter and returns an object with the keys and their types.
 * @param {Object} obj The object for which we want to get the keys and their types.
 * @return {Object} An object with the keys and their types.
 */
 const getKeyValueTypes = (obj) => {
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
function listRequires(filePath) {
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




// takes the file name from the CLI args
process.argv.splice(0, 2);

let [fileName = false] = process.argv;


if (!fileName) throw new error('Missing fileName URL ! Provide the fileName as a first Command Line Interface argument');

const eventFile = fileName.replace('/cca.js', '/event.js');

let event = null;

try {
    event = require(eventFile).events;
} catch (error) {
    throw new Error(`Looks like the event file is missing, we failed to call ${eventFile}`);
}


if (!event.inputFields) throw new Error('event.inputFields Has to be defined');



// check if the librairies imported in the Custom Coded Action are allowed
const requires = listRequires(fileName);

const libs = ["axios", "@hubspot/api-client", "async", "aws-sdk","lodash", "mongoose", "mysql", "redis", "request", "bluebird", "random-number-csprng", "googleapis"];

const ccaContainsNotAllowedPackages = requires.find(require => !libs.includes(require));

if (ccaContainsNotAllowedPackages) throw new Error(`Your Custom Coded Action contains ${ccaContainsNotAllowedPackages} which is a library that is not allowed on the HubSpot Custom Coded Action. Your code will not work`);


const cca = require(fileName);

cca.main(event, output => {

    console.log('\n', 'The output of the Custom Coded Action is : ')
    console.table(output.outputFields);

    console.log('\n', 'The types are : ')
    console.table(getKeyValueTypes(output.outputFields));
});