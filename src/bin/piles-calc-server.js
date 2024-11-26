#!/usr/bin/env node

import path from 'path'
import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

import { calcPiles } from '../index'

var argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --port [num]')
  .help('h').alias('h', 'help')
  .parse();

const app = new Hono()

app.get('/', (c) => {
  return c.json({msg: 'not yet implemented!'})
})

serve(app)
