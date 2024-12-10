import { z } from 'zod';

import {
  ShapeTypes, PileCompositionOptions, PileQualityOptions, UnitSystems
} from './enums.mjs'

const gt0Msg = n => `'${n}' must be greater than 0`
const gte0Msg = n => `'${n}' must be greater than or equal to 0`
const lte100Msg =  n => `'${n}' must be less than or equal to 100`

const enumErrorMap = (issue, _ctx) =>  {
  if (issue.received == 'undefined')
    return { message: `'${issue.path[0]}' is required` }
  else // (['invalid_type', 'invalid_enum_value'].includes(issue.code))
    return { message: `'${issue.path[0]}' must be one of the following: ${issue.options.join(', ')}` }
}



// TODO: use superRefine to make sure the correct dimensions are defined for
//   each shape type?  (or just defer to existing logic in underlying module?)



const commonOptions = z.object({
  numberOfPiles: z.coerce.number({
    required_error: `'numberOfPiles' is required`,
    invalid_type_error: `'numberOfPiles' must be a positive intenger`,
  }).int().gt(0, gt0Msg('numberOfPiles')),
  shape: z.enum(ShapeTypes.values, { errorMap: enumErrorMap }),
  unitSystem: z.enum(UnitSystems.values, { errorMap: enumErrorMap }).default(UnitSystems.English),
  // The set of required dimension values depends on the shape. So, we mark them
  // as optional here and check for the shape specific required set later
  h1: z.coerce.number({
    invalid_type_error: `'h1' must be a positive number`,
  }).gt(0, gt0Msg('h1')).optional(),
  h2: z.coerce.number({
    invalid_type_error: `'h2' must be a positive number`,
  }).gt(0, gt0Msg('h2')).optional(),
  w1: z.coerce.number({
    invalid_type_error: `'w1' must be a positive number`,
  }).gt(0, gt0Msg('w1')).optional(),
  w2: z.coerce.number({
    invalid_type_error: `'w2' must be a positive number`,
  }).gt(0, gt0Msg('w2')).optional(),
  l1: z.coerce.number({
    invalid_type_error: `'l1' must be a positive number`,
  }).gt(0, gt0Msg('l1')).optional(),
  l2: z.coerce.number({
    invalid_type_error: `'l2' must be a positive number`,
  }).gt(0, gt0Msg('l2')).optional(),
  percentConsumed: z.coerce.number({
    required_error: `'percentConsumed' is required`,
    invalid_type_error: `'percentConsumed' must be a number between 0 and 100`,
  }).gte(0, gte0Msg('percentConsumed')).lte(100, lte100Msg('percentConsumed')),
})

export const handSchema = z.object({
  pileComposition: z.enum(PileCompositionOptions.values, { errorMap: enumErrorMap }),
}).merge(commonOptions)

export const machineSchema = z.object({
  soilPercent: z.coerce.number({
    required_error: `'soilPercent' is required`,
    invalid_type_error: `'soilPercent' must be a number between 0 and 100`,
  }).gte(0, gte0Msg('soilPercent')).lte(100, lte100Msg('soilPercent')),
  packingRatioPercent: z.coerce.number({
    required_error: `'packingRatioPercent' is required`,
    invalid_type_error: `'packingRatioPercent' must be a positive number between 0 and 100`,
  }).gt(0, gt0Msg('packingRatioPercent')).lte(100, lte100Msg('packingRatioPercent')),
  primarySpeciesDensity: z.coerce.number({
    required_error: `'primarySpeciesDensity' is required`,
    invalid_type_error: `'primarySpeciesDensity' must be a positive number`,
  }).gt(0, gt0Msg('primarySpeciesDensity')),
  primarySpeciesPercent: z.coerce.number({
    required_error: `'primarySpeciesPercent' is required`,
    invalid_type_error: `'primarySpeciesPercent' must be a number between 0 and 100`,
  }).gt(0, gt0Msg('primarySpeciesPercent')).lte(100, lte100Msg('primarySpeciesPercent')),

  // TODO: call `.optional()` on secondary density and pct, but use
  //   `superRefine` to make sure that, if one is defined, then the
  //   other is as well

  secondarySpeciesDensity: z.coerce.number({
    required_error: `'secondarySpeciesDensity' is required`,
    invalid_type_error: `'secondarySpeciesDensity' must be a non-negative number`,
  }).gte(0, gte0Msg('secondarySpeciesDensity')),
  secondarySpeciesPercent: z.coerce.number({
    required_error: `'secondarySpeciesPercent' is required`,
    invalid_type_error: `'secondarySpeciesPercent' must be a number between 0 and 100`,
  }).gte(0, gte0Msg('secondarySpeciesPercent')).lte(100, lte100Msg('secondarySpeciesPercent')),
  pileQuality: z.enum(PileQualityOptions.values, { errorMap: enumErrorMap }),
}).merge(commonOptions)
