import { diff } from 'jest-diff';
import { fileURLToPath } from 'url';
import fs from 'fs'
import path from 'path'

import {
  PileType, ShapeTypes, PileCompositionOptions,
  UnitSystems, PileQualityOptions
} from '../src/lib/enums.mjs'
import { compute } from '../src/index.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url))
const inputDataFile = path.join(thisDir, 'data', 'input-data.json')
const inputData = JSON.parse(fs.readFileSync(inputDataFile, 'utf8'))

const outputDataFile = path.join(thisDir, 'data', 'output-data.json')
const outputDataById = JSON.parse(fs.readFileSync(outputDataFile, 'utf8'))
  .reduce((r,e) => {
    r[e.id] = e
    delete(r[e.id].id)
    return r
  }, {})


const roundToPrecision = (value, precision=8) => {
  if (typeof value === 'number') {
    const f = Math.pow(10, precision)
    return Math.round(value * f) / f
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = roundToPrecision(value[key]);
      return acc;
    }, Array.isArray(value) ? [] : {});
  }
  return value; // Non-numeric, non-object values remain unchanged
};

const numCases = inputData.length
for (let e of inputData.slice(0, numCases)) {
  test(`Scenario id ${e.id}`, () => {
    console.log(`Running scenario ${e.id}`)
    const expectedOuput = roundToPrecision(outputDataById[e.id], 6)
    const output =  roundToPrecision(compute(e.pileType, e), 6)
    //console.log(output)
    expect(output).toStrictEqual(expectedOuput)
  })
};
