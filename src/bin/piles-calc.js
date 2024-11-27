#!/usr/bin/env node

import yargs from 'yargs/yargs'

import { calcPiles } from '../index'
import { Shapes, PileCompositionOptions } from '../lib/enums'


const argv = yargs(process.argv.slice(2))
  /* General options */
  .usage('Usage: $0 [options] [hand-piles|machine-piles] [options]')
  .example('$0 -i 2 -n 10 -s half-sphere -h1 5 hand-piles -c 90 --comp conifer')
  .help('h').alias('h', 'help')
  .option('indent', {
    alias: 'i',
    describe: 'JSON indentation',
    type: 'number',
    demandOption: false
  })

  /* All Piles */
  // .option('type', {
  //   alias: 't',
  //   describe: "Pile type",
  //   type: 'string',
  //   choices: ['hand', 'machine'],
  //   demandOption: true
  // })
  .option('number-of-piles', {
    alias: 'n',
    describe: "Number of piles",
    type: 'number',
    demandOption: true
  })
  .option('shape', {
    alias: 's',
    describe: "Pile shape",
    type: 'string',
    choices: Shapes.values,
    demandOption: true
  })
  .option('w1', { describe: "Width 1 (feet)", type: 'number', demandOption: false })
  .option('w2', { describe: "Width 2 (feet)", type: 'number', demandOption: false })
  .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
  .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
  .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
  .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
  .option('consumption-pct', {
     alias: 'c',
     describe: "% of piled material consumed",
     type: 'number',
     demandOption: true
   })

  /* Hand piles */
  .command('hand-piles', 'Hand piles', {
    comp: {
      describe: "Pile composition ",
      type: 'string',
      choices: PileCompositionOptions.values,
      demandOption: true
    }
  })

  /* Machine piles*/
  .command('machine-piles', 'Machine piles', {
    'est-soil-pct': {
      //alias: 'soil',
      describe: "Estimated % of pile volume that is soil.",
      type: 'number',
      demandOption: true
    },
    'packing-ratio-pct': {
      describe: "Packing ratio",
      type: 'number',
      demandOption: true
    },
    'primary-density': {
      describe: "Primary species wood density (lb/ft3)",
      type: 'number',
      demandOption: true
    },
    'primary-pct': {
      describe: "Primary species %",
      type: 'number',
      demandOption: true
    },
    'secondary-density': {
      describe: "Secondary species wood density (lb/ft3)",
      type: 'number',
      demandOption: true
    },
    'secondary-pct': {
      describe: "Secondary species %",
      type: 'number',
      demandOption: true
    },
    // 'quality' {
    // }

  })


  /* Validation */
  .check((argv) => {
    // if (argv.foo !== undefined && argv.foo < 18) {
    //   throw new Error("Error message");
    // }
    return true; // Validates the arguments
  })
  .argv;

//console.log("argv: ", argv);

const loadings = calcPiles(argv)

process.stdout.write(
  JSON.stringify({loadings: loadings}, null, argv.indent) + '\n'
)
