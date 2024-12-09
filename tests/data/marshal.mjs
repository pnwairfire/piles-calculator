#!/usr/bin/env node


import { fileURLToPath } from 'url';
import fs from 'fs'
import path from 'path'
import { parse } from '@fast-csv/parse';

import {
  UnitSystems, PileType, ShapeTypes, PileCompositionOptions
} from '../../src/lib/enums.mjs'


const thisDir = path.dirname(fileURLToPath(import.meta.url))

function loadData(fileName, marshalFunc, onEndFunc) {
  const filePath = path.join(thisDir, fileName)
  const rows = []
  fs.createReadStream(filePath)
    .pipe(parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => {
      const e = marshalFunc(row)
      if (e)
        rows.push(e)
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`)
      onEndFunc(rows)
    })
}

function marshalInputData(row) {

  // 'spOrDen' == 1 means that sp1 and sp2 are species to look up, which
  // this package dosn't support.
  if (row['spOrDen'] === 1)
    return null

  return {
    id: row['pileGroupID'],
    unit: UnitSystems.values[parseInt(row['unitsys']) - 1],
    numberOfPiles: parseInt(row['numPiles']),
    pileType: PileType.values[parseInt(row['pileType']) - 1],
    shape: ShapeTypes.values[parseInt(row['pileShape']) - 1],
    w1: row['W1'] ? parseFloat(row['W1']) : null,
    l1: row['L1'] ? parseFloat(row['L1']) : null,
    h1: row['H1'] ? parseFloat(row['H1']) : null,
    w2: row['W2'] ? parseFloat(row['W2']) : null,
    l2: row['L2'] ? parseFloat(row['L2']) : null,
    h3: row['H2'] ? parseFloat(row['H2']) : null,
    percentConsumed: row['percentConsumed'] ? parseFloat(row['percentConsumed']) : null,
    // hand pile params
    pileComposition: row['handPileSpecies'] ? PileCompositionOptions.values[parseInt(row['handPileSpecies']) - 1] : null,
    // maching pile params
    soilPercent: row['soilPercent'] ? parseFloat(row['soilPercent']) : null,
    packingRatioPercent: row['packingRatio'] ? parseFloat(row['packingRatio']) : null,
    primarySpeciesDensity: row['sp1'] ? parseFloat(row['sp1']) : null,
    primarySpeciesPct: row['sp1%'] ? parseFloat(row['sp1%']) : null,
    secondarySpeciesDensity: row['sp2'] ? parseFloat(row['sp2']) : null,
    secondarySpeciesPct: row['sp2%'] ? parseFloat(row['sp2%']) : null,
    pileQuality: row['pileQuality'] ? parseFloat(row['pileQuality']) : null,
  }

  return row
}



function marshalOutputData(row) {
  return {
    "id": row['PileGroupID'],
    "volume": row['Geometric Volume'],
    "correctedVolume": row['True/Wood Volume'],
    "pileMass": row['Pile Biomass'],
    "consumedMass": row['Consumed Fuel'],
    "emissions": {
      "PM": row['PM'],
      "PM10": row['PM10'],
      "PM2.5": row['PM2.5'],
      "CO": row['CO'],
      "CO2": row['CO2'],
      "CH4": row['CH4'],
      "NMHC": row['NMHC']
    }
  }
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
  writeData(loadedData, 'input-data.json')
})

const outputData = loadData('output-data.csv', marshalOutputData, (loadedData) => {
  writeData(loadedData, 'output-data.json')
})
