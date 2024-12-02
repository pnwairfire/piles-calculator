#!/usr/bin/env node

import yargs from 'yargs/yargs'

//import { calcPiles } from '../index'
import { ShapeTypes, PileCompositionOptions } from '../lib/enums'


const args = yargs(process.argv.slice(2))
  .wrap(null)
  /* General options */
  .usage('Usage: $0 [options] [hand|machine] [options]')
  .help('h').alias('h', 'help')
  .option('indent', {
    alias: 'i',
    describe: 'JSON indentation',
    type: 'number',
    demandOption: false
  })
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
    choices: ShapeTypes.values,
    demandOption: true
  })
  .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
  .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
  .option('w1', { describe: "Width 1 (feet)", type: 'number', demandOption: false })
  .option('w2', { describe: "Width 2 (feet)", type: 'number', demandOption: false })
  .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
  .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
  .option('consumption-pct', {
     alias: 'c',
     describe: "% of piled material consumed",
     type: 'number',
     demandOption: true
   })

  /* Hand piles */
  .command({
    command: 'hand',
    describe: 'Compute loadings for hand piles',
    builder: (_yargs) => {
      return _yargs
        .option('comp', {
          describe: "Pile composition ",
          type: 'string',
          choices: PileCompositionOptions.values,
          demandOption: true
        })
        .example('$0 -i 2 -n 10 -s HalfSphere -h1 5 hand -c 90 --comp conifer')
        .example(`$0 -i 2 -n 40 -s HalfCylinder -h1 5 -w1 7 -l1 10 hand -c 80 --comp ShrubHardwood`)
    }
  })

  /* Machine piles*/
  .command({
    command: 'machine',
    describe: 'Compute loadings for machine piles',
    builder: (_yargs) => {
      return _yargs
        .option('est-soil-pct', {
          //alias: 'soil',
          describe: "Estimated % of pile volume that is soil.",
          type: 'number',
          demandOption: true
        })
        .option('packing-ratio-pct', {
          describe: "Packing ratio",
          type: 'number',
          demandOption: true
        })
        .option('primary-density', {
          describe: "Primary species wood density (lb/ft3)",
          type: 'number',
          demandOption: true
        })
        .option('primary-pct', {
          describe: "Primary species %",
          type: 'number',
          demandOption: true
        })
        .option('secondary-density', {
          describe: "Secondary species wood density (lb/ft3)",
          type: 'number',
          demandOption: true
        })
        .option('secondary-pct', {
          describe: "Secondary species %",
          type: 'number',
          demandOption: true
        })
        // 'quality' {
        // }
        .example(`$0 -i 2 -n 10 -s HalfSphere -h1 5 machine -c 90 --est-soil-pct 10 \\
          --packing-ratio-pct 60 --primary-density 22 --primary-pct 80 --secondary-density 13 \\
          --secondary-pct 20`)
        .example(`$0 -i 2 -n 40 -s HalfCylinder -h1 5 -w1 7 -l1 10 machine -c 80 \\
          --est-soil-pct 20 --packing-ratio-pct 80 --primary-density 3 --primary-pct 60 \\
          --secondary-density 5 --secondary-pct 40`)
    }
  })


  /* Validation */
  .check((argv) => {
    // if (argv.foo !== undefined && argv.foo < 18) {
    //   throw new Error("Error message");
    // }
    return true; // Validates the arguments
  })

  /* Get Args */
  .argv;

console.log("argv: ", argv);

const loadings = {} //calcPiles(argv)

process.stdout.write(
  JSON.stringify({loadings: loadings}, null, argv.indent) + '\n'
)
