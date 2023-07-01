// const fs = require('fs');
// fs.writeFileSync('notes.txt', 'Welcome to Node JS!');
// fs.appendFileSync('notes.txt', '\n New Line Text Appended!');

// const getNotes = require('./notes');
// const add = require('./notes');
// console.log(getNotes());
// console.log(add(9, 2));

// import validator from 'validator';
// const validator = require('validator');
// console.log(validator.isEmail('abc@xyz.com'));
// console.log(validator.isURL('https:/xyz.com'));

// const chalk = require('chalk'); // Chalk Moved ESM, for ESM require will not work only import will work.
// import chalk from 'chalk';
// console.log(chalk.green.bold.inverse('Success!'));

const yargs = require('yargs');
const notes = require('./notes');
// console.log(process.argv);
// console.log(yargs.argv);
// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a Note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note Content',
            demandOption: true,
            type: 'string'
        },
    },
    handler: (argv) => notes.addNote(argv.title, argv.body),
    showInHelp: true
});
// Create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a Note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => notes.removeNote(argv.title),
    showInHelp: true
});
// Create read command
yargs.command({
    command: 'read',
    describe: 'Read a Note',
    builder: {
        title: {
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => notes.readNote(argv.title)
});
// Create list command
yargs.command({
    command: 'list',
    describe: 'List all the notes',
    handler: () => notes.listNotes()
});
// console.log(yargs.argv);
yargs.parse(); // Either we need to print console.log(yargs.argv) or yargs.parse() to run the yargs commands. 