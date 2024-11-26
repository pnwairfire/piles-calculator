#!/usr/bin/env node

import yargs from 'yargs/yargs'

var argv = yargs(process.argv.slice(2))
    .parse();

console.log("argv: ", argv);
