/* This was adapted from

https://github.com/pnwairfire/fera-apps-pilescalc_python/blob/main/piles/py/pile.py
(which was written by @pceagle)
*/

import { InvalidInputError } from './exceptions.mjs'
import {
  UnitSystems, PileCompositionOptions, PileQualityOptions
} from './enums.mjs'

function isNumeric(val) {
  return (typeof val == 'number')
}


/* Conversion Ratios */

// Metric -> English conversion factors
const m3_to_ft3 = 35.3146667214886
const kg_to_lb = 2.20462262184878
const Mg_to_tons = 1.10231131 // Mg is metric tons
const gpercm3_to_lbperft3 = 62.4279605762

// English -> metric conversion factors
const ft3_to_m3 = 1 / m3_to_ft3
const lb_to_kg = 1 / kg_to_lb
const tons_to_Mg = 1 / Mg_to_tons


/* Emissions Factors

  PM factors vary based on pile quality; others vary by phase
*/

const flamingFactors = {CO: 52.66, CO2: 3429.22, CH4: 3.28, NMHC: 3.56}
const smoldResidFactors = {CO: 130.37, CO2: 3089.86, CH4: 11.03, NMHC: 6.78}
const pmEmissionsEfs = {}
pmEmissionsEfs[PileQualityOptions.Clean] = {PM: 21.9, PM10: 15.5, 'PM2.5': 13.5}
pmEmissionsEfs[PileQualityOptions.Dirty] = {PM: 27.0, PM10: 20.0, 'PM2.5': 17.0}
pmEmissionsEfs[PileQualityOptions.VeryDirty] = {PM: 36.0, PM10: 28.0, 'PM2.5': 23.6}

Object.keys(pmEmissionsEfs).forEach(pq => {
  Object.keys(flamingFactors).forEach(species => {
    // TODO: where does the 70% / 30% come from
    pmEmissionsEfs[pq][species] = (0.7 * flamingFactors[species])
      + (0.3 * smoldResidFactors[species])
  })
})


/* Pile Classes */


/*
 * Pile base class
 */

class Pile {

  constructor(args, shape) {
    this.args = args
    this.shape = shape
    this.volume = shape.volume

    this.validateInputs()
  }

  /* Validation */

  validateInputs() {
    UnitSystems.validate(this.args.unitSystem)
    this.isValidPercent(this.args.percentConsumed, 'Consumed') //, true)

    if (!isNumeric(this.args.percentConsumed) && this.args.percentConsumed === null) {
      throw new InvalidInputError("Parameter percent consumed must be a positive number (or null).")
    }
  }

  isValidPercent(val, name, allowNull) {
    if ((val === null && !allowNull) || !isNumeric(val) || val < 0 || val > 100) {
      throw new InvalidInputError(`${name} (${val} - ${typeof val}) percent must be between 0 and 100.`)
    }
  }


  /* Compuations */

  computeConsumedMass() {
    this.consumedMass = this.pileMass * (this.args.percentConsumed / 100.0)
  }


  computeEmissions() {
    /* Emissions is determined from pile mass and quality */

    // Emissions calculation assumes mass in tons, so convert if necessary
    const consumedMassTons = (this.args.unitSystem === UnitSystems.English)
      ? (this.consumedMass) : (this.consumedMass * Mg_to_tons)

    const pmEFs = pmEmissionsEfs[this.args.pileQuality || PileQualityOptions.Clean]

    this.emissions = Object.keys(pmEFs).reduce((r, e) => {
      r[e] = (consumedMassTons * pmEFs[e]) / 2000.0
      // convert back to metric if necessary
      if (this.args.unitSystem === UnitSystems.Metric)
        r[e] *= tons_to_Mg
      return r
    }, {})
  }
}



/*
 * Hand Pile
 */

export class HandPile extends Pile {
  constructor(args, shape) {
    super(args, shape)

    // validateInputs is called in Pile constructor

    this.args.pileQuality = PileQualityOptions.Clean

    this.computeCorrectedVolume()
    this.computePileMass()
    this.computeConsumedMass()
    this.computeEmissions()
  }

  /* Validation */

  validateInputs() {
    super.validateInputs()

    PileCompositionOptions.validate(this.args.pileComposition)
  }

  /* Compuations */

  computeCorrectedVolume() {
    /* Uses Clint Wright's regression equations to estimate
     true pile volume (TV) from geometric volume (GV) in m^3 */

    // Volume correction assumes volume in m^3, so convert if necessary
    const volumeMetric = (this.args.unitSystem == UnitSystems.English)
      ? (this.shape.volume * ft3_to_m3) : (this.shape.volume)

    if (volumeMetric < 1)
      this.correctedVolume = Math.exp(0.2106) * volumeMetric
    else
      this.correctedVolume = Math.exp(0.2106 + 0.7691*Math.log(volumeMetric))

    // convert back to english if necessary
    if (this.args.unitSystem == UnitSystems.English)
      this.correctedVolume *= m3_to_ft3
  }

  computePileMass() {
    /* Calculates mass from corrected vol using Clint Wright's other
      regression equations + pile composition (shrub/conifer) */

    // Mass computation assumes volume in m^3, so convert if necessary
    const correctedVolumeMetric = (this.args.unitSystem == UnitSystems.English)
      ? (this.correctedVolume * ft3_to_m3) : (this.correctedVolume)

    const massMetric = (this.args.pileComposition == PileCompositionOptions.Conifer)
      ? (Math.exp(4.4281 + 0.8028*Math.log(correctedVolumeMetric)))
      : (Math.exp(3.0393 + 1.3129*Math.log(correctedVolumeMetric)))

    this.pileMass = (this.args.unitSystem == UnitSystems.English)
      ? ((massMetric * kg_to_lb) / 2000) : (massMetric / 1000)
  }
}



/*
 * Machine Pile
 */

export class MachinePile extends Pile {
  constructor(args, shape) {
    super(args, shape)

    // validateInputs is called in Pile constructor

    this.computeWoodDensity()
    this.computeCorrectedVolume()
    this.computePileMass()
    this.computeConsumedMass()
    this.computeEmissions()
  }

  /* Validation */

  validateInputs() {
    super.validateInputs()

    PileQualityOptions.validate(this.args.pileQuality)

    this.isValidPercent(this.args.primarySpeciesPct, 'Primary Species')
    this.isValidPercent(this.args.secondarySpeciesPct, 'Secondary Species', true)
    if (this.args.primarySpeciesPct + this.args.secondarySpeciesPct !==100)
      throw new InvalidInputError("Primary and secondary species percentages should add to 100%")

    this.isValidPercent(this.args.soilPercent, 'Soil')
    this.isValidPercent(this.args.packingRatioPercent, 'Packing')
  }


  /* Compuations */

  computeWoodDensity() {

    // TODO: verify that primary and secondary pcts add to 100, allowing
    //   for possibility of secondary pct not beind defined

    this.woodDensity = (this.args.primarySpeciesPct / 100) * this.args.primarySpeciesDensity
    if (this.args.secondarySpeciesPct)
      this.woodDensity += (this.args.secondarySpeciesPct / 100) * this.args.secondarySpeciesDensity
  }

  computeCorrectedVolume() {
    const gv = this.shape.volume
    const pr = this.args.packingRatioPercent/100.0
    const sp = (100.0 - this.args.soilPercent)/100.0
    this.correctedVolume = (gv*pr*sp)
  }

  computePileMass() {
    /* Calc mass w/ corrected vol and oven-dry density based on sp. comp */
    if (this.args.unitSystem == UnitSystems.English) {
      this.pileMass = (this.correctedVolume * this.woodDensity) / 2000.0
    } else {
      this.pileMass = ((this.correctedVolume * m3_to_ft3 * this.woodDensity * gpercm3_to_lbperft3) / 2000.0) * tons_to_Mg
    }
  }
}
