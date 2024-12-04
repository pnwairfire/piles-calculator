#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

import { InvalidInputError } from '../lib/exceptions'
import { compute } from '../index'


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

  let r = null
  let status = 200

  try {
    // Leave status == 200
    // TODO: convert all query parms; is there a way to specify a schema
    //   with allowed query params and their types
    r = compute(c.req.query('pileType'), c.req.query)
  } catch (e) {
    status = (e instanceof InvalidInputError) ? (400) : (500)
    r = {
      error: (e instanceof InvalidInputError) ? (e.message) : ('Unexpected Error')
    }
  }

  // TODO: figure out why chaining `status` and `json` isn't working
  //return c.status(status).json(r)
  c.status(status)
  return c.json(r)
})

serve(app)
