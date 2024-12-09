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

const outputDataFile = path.join(thisDir, 'data', 'input-data.json')
const outputDataById = JSON.parse(fs.readFileSync(outputDataFile, 'utf8'))
  .reduce((r,e) => {
    r[e.id] = e
    return r
  }, {})


const numCases = 1
test('multiple cases', () => {
  // for (let inputData of inputData.slice(0, numCases)) {
  //   const expectedOuput = outputDataById[inputData.id]
  //   const output = compute(inputData.pileType, inputData);
  //   expect(output).toBe(expectedOuput)
  // }
});
