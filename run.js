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
    throw new Error(`Looks like the event file is missing`);
}


if (!event.inputFields) throw new Error('event.inputFields Has to be defined');

const cca = require(fileName);

cca.main(event, output => {

    console.log(output);
});