#!/usr/bin/env node

import yargs from 'yargs/yargs'

import { InvalidInputError } from '../lib/exceptions'
import {
  ShapeTypes, PileCompositionOptions, PileQualityOptions, UnitSystems
} from '../lib/enums'
import { compute } from '../index'


function addGeneralOptions(_yargs) {
  return _yargs
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
    .option('unit-system', {
      alias: 'u',
      describe: "Unit system",
      type: 'string',
      choices: UnitSystems.values,
      demandOption: false,
      default: UnitSystems.English
    })
    .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
    .option('h1', { describe: "Height 1 (feet)", type: 'number', demandOption: false })
    .option('w1', { describe: "Width 1 (feet)", type: 'number', demandOption: false })
    .option('w2', { describe: "Width 2 (feet)", type: 'number', demandOption: false })
    .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
    .option('l1', { describe: "Length 1 (feet)", type: 'number', demandOption: false })
    .option('percent-consumed', {
       alias: 'c',
       describe: "% of piled material consumed",
       type: 'number',
       demandOption: true
     })

}

const argv = yargs(process.argv.slice(2))
  .wrap(null) // to not line wrap output
  .strict()  // to raise error for undefined optoins
  .usage('Usage: $0 [options] [hand|machine] [options]')
  .help('h').alias('h', 'help')
  .demandCommand(1, 'You must specify a command - hands or machine')

  /* Hand piles */
  .command({
    command: 'Hand',
    describe: 'Compute loadings for hand piles',
    builder: (_yargs) => {
      return addGeneralOptions(_yargs)
        .option('pile-composition', {
          alias: 'comp',
          describe: "Pile composition ",
          type: 'string',
          choices: PileCompositionOptions.values,
          demandOption: true
        })
        .usage('Usage: $0 [options] hand [options]')
        .example('$0 Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer')
        .example(`$0 Hand -i 2 -n 40 -s HalfCylinder --h1 5 --w1 7 --l1 10 -c 80 --comp ShrubHardwood`)
    }
  })

  /* Machine piles*/
  .command({
    command: 'Machine',
    describe: 'Compute loadings for machine piles',
    builder: (_yargs) => {
      return addGeneralOptions(_yargs)
        .option('soil-percentt', {
          describe: "Estimated % of pile volume that is soil.",
          type: 'number',
          demandOption: true
        })
        .option('packing-ratio-percent', {
          alias: 'packing-pct',
          describe: "Packing ratio",
          type: 'number',
          demandOption: true
        })
        .option('primary-species-density', {
          describe: "Primary species wood density (lb/ft3)",
          type: 'number',
          demandOption: true
        })
        .option('primary-species-pct', {
          describe: "Primary species %",
          type: 'number',
          demandOption: true
        })
        .option('secondary-species-density', {
          describe: "Secondary species wood density (lb/ft3)",
          type: 'number',
          demandOption: false
        })
        .option('secondary-species-pct', {
          describe: "Secondary species %",
          type: 'number',
          demandOption: false
        })
        .option('pile-quality', {
          alias: 'quality',
          describe: "Pile quality ",
          type: 'string',
          choices: PileQualityOptions.values,
          demandOption: true
        })
        .usage('Usage: $0 [options] machine [options]')
        .example(`$0 Machine -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --est-soil-pct 10 \\
          --packing-ratio-pct 60 --primary-density 22 --primary-pct 80 --secondary-density 13 \\
          --secondary-pct 20`)
        .example(`$0 Machine -i 2 -n 40 -s HalfCylinder --h1 5 --w1 7 --l1 10 -c 80 \\
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

//console.log("argv: ", argv);
let r = null
try {
  r = compute(argv._[0], argv)
} catch (e) {
  r = {
    error: (e instanceof InvalidInputError)
      ? (e.message) : (`Unexpected Error: ${e.message}`)
  }
}

process.stdout.write(
  JSON.stringify(r, null, argv.indent) + '\n'
)
