#!/usr/bin/env node

import path from 'path'
import yargs from 'yargs/yargs'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import livereload from 'livereload'

import { calcPiles } from '../index'

var argv = yargs(process.argv.slice(2))
    .parse();

const app = new Hono()

app.get('/', (c) => c.json({msg: 'not yet implemented!'}))

if (argv.dev) {
    const liveReloadServer = livereload.createServer();
    const watchDir = path.dirname(path.dirname(__filename))
    console.log(`Watching ${watchDir} for updates to live reload`)
    liveReloadServer.watch(watchDir);
}

serve(app)
