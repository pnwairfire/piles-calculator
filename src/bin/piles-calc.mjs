#!/usr/bin/env node

import yargs from 'yargs/yargs'

import { InvalidInputError } from '../lib/exceptions.mjs'
import {
  ShapeTypes, PileCompositionOptions, PileQualityOptions, UnitSystems
} from '../lib/enums.mjs'
import { compute } from '../index.mjs'


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
    .option('h1', { describe: "Height 1 (ft or m)", type: 'number', demandOption: false })
    .option('h2', { describe: "Height 1 (ft or m)", type: 'number', demandOption: false })
    .option('w1', { describe: "Width 1 (ft or m)", type: 'number', demandOption: false })
    .option('w2', { describe: "Width 2 (ft or m)", type: 'number', demandOption: false })
    .option('l1', { describe: "Length 1 (ft or m)", type: 'number', demandOption: false })
    .option('l2', { describe: "Length 1 (ft or m)", type: 'number', demandOption: false })
    .option('percent-consumed', {
       alias: 'c',
       describe: "Percent of piled material consumed",
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
        .example('$0 Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer --unit-system Metric')
        .example(`$0 Hand -i 2 -n 40 -s HalfCylinder --h1 5 --w1 7 --l1 10 -c 80 --comp ShrubHardwood`)
    }
  })

  /* Machine piles*/
  .command({
    command: 'Machine',
    describe: 'Compute loadings for machine piles',
    builder: (_yargs) => {
      return addGeneralOptions(_yargs)
        .option('soil-percent', {
          describe: "Estimated percent of pile volume that is soil",
          type: 'number',
          demandOption: true
        })
        .option('packing-ratio-percent', {
          alias: 'packing-percent',
          describe: "Packing ratio, as a percent",
          type: 'number',
          demandOption: true
        })
        .option('primary-species-density', {
          describe: "Primary species wood density (lb/ft3 or g/cm^3)",
          type: 'number',
          demandOption: true
        })
        .option('primary-species-percent', {
          describe: "Percent of pile composed of primary species",
          type: 'number',
          demandOption: true
        })
        .option('secondary-species-density', {
          describe: "Secondary species wood density (lb/ft^3 or g/cm^3)",
          type: 'number',
          demandOption: false
        })
        .option('secondary-species-percent', {
          describe: "Percent of pile composed of secondary species",
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
        .example(`$0 Machine -i 2 -n 10 -s HalfSphere --h1 5 -c 90 \\
          --soil-percent 10 --packing-ratio-percent 60 \\
          --primary-species-density 22 --primary-species-percent 80 \\
          --secondary-species-density 13 --secondary-species-percent 20 \\
          --pile-quality Clean`)
        .example(`$0 Machine -i 2 -n 40 -s HalfCylinder --h1 5 --w1 7 --l1 10 -c 80 \\
          --soil-percent 20 --packing-ratio-percent 80 \\
          --primary-species-density 3 --primary-species-percent 60 \\
          --secondary-species-density 5 --secondary-species-percent 40 \\
          --pile-quality Clean`)
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
  if (e instanceof InvalidInputError)
    r = { error: e.message }
  else
    r = {
      error: e.message,
      stack: e.stack
    }
}

process.stdout.write(
  JSON.stringify(r, null, argv.indent) + '\n'
)
