#!/usr/bin/env node

import yargs from 'yargs/yargs'

import { calcPiles } from '../index'


const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --indent [num]')
  .help('h').alias('h', 'help')
  .option('indent', {
    //alias: 'i',
    describe: 'JSON indentation',
    type: 'number',
    demandOption: false
  })
  .check((argv) => {
    // if (argv.foo !== undefined && argv.foo < 18) {
    //   throw new Error("Error message");
    // }
    return true; // Validates the arguments
  })
  .argv;

//console.log("argv: ", argv);

const r = calcPiles()

process.stdout.write(JSON.stringify({loadings: r}, null, argv.indent) + '\n')
