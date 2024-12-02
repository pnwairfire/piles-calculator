#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

//import { calcPiles } from '../index'


const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --port [num]')
  .help('h').alias('h', 'help')
  .option('port', {
    alias: 'p',
    describe: 'Port',
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

const app = new Hono()

app.get('/', (c) => {
  return c.json({msg: 'not yet implemented!'})
})

serve(app)
