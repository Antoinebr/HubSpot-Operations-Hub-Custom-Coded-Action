require('dotenv').config();

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



const cca = require(fileName);

cca.main(event, output => {

    console.log('\n', 'The output of the Custom Coded Action is : ')
    console.table(output.outputFields);

    console.log('\n', 'The types are : ')
    console.table(getKeyValueTypes(output.outputFields));
});