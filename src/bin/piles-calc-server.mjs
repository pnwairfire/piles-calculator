#!/usr/bin/env node

import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { html, raw } from 'hono/html'
import { zodToJsonSchema } from "zod-to-json-schema";

import { InvalidInputError } from '../lib/exceptions.mjs'
import { compute } from '../index.mjs'
import { handSchema, machineSchema } from '../lib/schemas.mjs'
import { PileTypes } from '../lib/enums.mjs'


const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --port [num]')
  .help('h').alias('h', 'help')
  .option('port', {
    alias: 'p',
    describe: 'Port',
    type: 'number',
    demandOption: false,
    default: 3040
  })
  .check((argv) => {
    // if (argv.foo !== undefined && argv.foo < 18) {
    //   throw new Error("Error message");
    // }
    return true; // Validates the arguments
  })
  .argv;

const app = new Hono()

/* Middleware */

// Add trailing slashes so that we don't need to define two endpoints
// for each API endpoint - one with and one without the trailing slash
function addTrailingSlash() {
  return async (c, next) => {
    const url = new URL(c.req.url);
    if (!url.pathname.endsWith('/')) {
      return c.redirect(url.pathname + '/' + url.search, 301);
    }
    await next();
  };
}

app.use('*', addTrailingSlash());


/* Endpoints */

app.get('/docs/', (c) => {
  const baseUrl = c.req.url.replace(/\/docs\/?/, '')

  const handPilesHtml = generateSchemaHtml(handSchema,
    `curl "${baseUrl}/hand/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&pileComposition=Conifer"`)
  const machinePilesHtml = generateSchemaHtml(machineSchema,
    `curl "${baseUrl}/machine/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&soilPercent=10&packingRatioPercent=90&primarySpeciesDensity=20&primarySpeciesPercent=90&secondarySpeciesDensity=3&secondarySpeciesPercent=10&pileQuality=Clean"`)

  return c.html(
    html`<!doctype html>
      <head>
        <style>
          th {text-align: left;}
          th, td {padding: 5px; border: 1px solid gray;}
        </style>
      </head>
      <h2>Hand Piles</h2>
      ${raw(handPilesHtml)}
      <h2>Machine Piles</h2>
      ${raw(machinePilesHtml)}`
  )

  return c.json(generateDoc(handSchema))
})

app.get('/hand/', (c) => {
  const { r, status } = callCompute(PileTypes.Hand, c, handSchema)

  // TODO: figure out why chaining `status` and `json` isn't working
  //return c.status(status).json(r)
  c.status(status)
  return c.json(r)
})

app.get('/machine/', (c) => {
  const { r, status } = callCompute(PileTypes.Machine, c, machineSchema)

  // TODO: figure out why chaining `status` and `json` isn't working
  //return c.status(status).json(r)
  c.status(status)
  return c.json(r)
})


/* Helpers */

function generateSchemaHtml(schema, example) {
  const jsonSchema = zodToJsonSchema(schema)
  //console.log('schema: ', jsonSchema)
  return '<h4>Query Arguments:</h4><table>'
    + '<thead><tr><th>name</th><th>type</th><th>limits</th><th>Description</th></thead>'
    +'<tbody>'
    + Object.keys(jsonSchema.properties).sort().map((key) => {
      const val = jsonSchema.properties[key]
      const description = val.description || 'No description provided'
      const type = val.type || 'Unknown type'
      let limits = [
        (val.exclusiveMinimum != null ? `> ${val.exclusiveMinimum}` : null),
        (val.minimum != null ? `>= ${val.minimum}` : null),
        (val.exclusiveMaximum != null ? `< ${val.exclusiveMaximum}` : null),
        (val.maximum != null ? `<= ${val.maximum}` : null),
      ].filter(e => e).join(', ')

      return `<tr><td><b><i>${key}</i></b></td><td>${type}</td><td>${limits}</td><td>${description}</td></tr>`
    }).join('')
    + `</tbody></table><h4>Example</h4><code style="margin-left: 10px;">${example}</code>`
}

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
  port: argv.port,
})