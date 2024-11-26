#!/usr/bin/env node

import yargs from 'yargs/yargs'

import { calcPiles } from '../index'

var argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --indent [num]')
  .help('h').alias('h', 'help')
  .parse();

console.log("argv: ", argv);

const r = calcPiles()

process.stdout.write(JSON.stringify({loadings: r}, null, argv.indent))
