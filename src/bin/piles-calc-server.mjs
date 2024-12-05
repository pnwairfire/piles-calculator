#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

import { InvalidInputError } from '../lib/exceptions.mjs'
import { compute } from '../index.mjs'
import { handSchema, machineSchema } from '../lib/schemas.mjs'
import { PileType } from '../lib/enums.mjs'


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


/* Endpoints */

app.get('/docs/', (c) => {

  // TODO: generate from schemas?

})

app.get('/hand/', (c) => {
  const { r, status } = callCompute(PileType.Hand, c, handSchema)

  // TODO: figure out why chaining `status` and `json` isn't working
  //return c.status(status).json(r)
  c.status(status)
  return c.json(r)
})

app.get('/machine/', (c) => {
  const { r, status } = callCompute(PileType.Machine, c, machineSchema)

  // TODO: figure out why chaining `status` and `json` isn't working
  //return c.status(status).json(r)
  c.status(status)
  return c.json(r)
})


/* Helpers */

function callCompute(pileType, c, schema) {
  let status = 200
  let r = null

  try {
    const args = schema.parse(c.req.query());
    //console.log('args: ', args)

    r = compute(pileType, args)

    // Leave status == 200
  } catch (e) {
    // TODO: figure out why `e instanceof InvalidInputError` isn't working here
    //console.log(typeof e)
    if (e instanceof InvalidInputError) {
      status = 400
      r = { error: e.message }
    } else if(e.errors) {
      // schema validation error
      status = 400
      r = {
        error: 'There were errors with the request parameters',
        errors: e.errors.map(e => e.message)
      }
    } else {
      console.error(e)
      console.error(e.stack) // TODO: figure out how to print stack
      status = 500
      r = { error: 'Unexpected Error' }
    }
  }

  return { r, status }
}

serve({
  fetch: app.fetch,
  port: 3040,
})