#!/usr/bin/env node


import { fileURLToPath } from 'url';
import fs from 'fs'
import path from 'path'
import { parse } from '@fast-csv/parse';

import { PileType } from '../../src/lib/enums.mjs'


const thisDir = path.dirname(fileURLToPath(import.meta.url))

function loadData(fileName, marshalFunc, onEndFunc) {
  const filePath = path.join(thisDir, fileName)
  const rows = []
  fs.createReadStream(filePath)
    .pipe(parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      rows.push(marshalFunc(row))
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`)
      onEndFunc(rows)
    })
}

function marshalInputData(row) {

  // TODO: implement

  // return {
  //   'pileGroupID': inputData['pileGroupID']',
  //   'unitSystem' 'unitsys': '2', 'numPiles': '1', 'pileType': '1', 'pileShape': '0', 'W1': '', 'L1': '', 'H1': '2', 'W2': '', 'L2': '', 'H2': '', 'soilPer
  // }
  return row
}



function marshalOutputData(row) {

  // TODO: implement

  return row
}

function writeData(data, fileName) {
  const filePath = path.join(thisDir, fileName)
  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log(`Data written to ${filePath}`);
    }
  })
}

loadData('input-data.csv', marshalInputData, (loadedData) => {
  writeData(loadedData, 'input-data.js')
})

const outputData = loadData('output-data.csv', marshalOutputData, (loadedData) => {
  writeData(loadedData, 'output-data.js')
})
