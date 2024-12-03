/* This was adapted from

https://github.com/pnwairfire/fera-apps-pilescalc_python/blob/main/piles/py/pile.py
(which was written by @pceagle)
*/

import {
  UnitSystems, PileCompositionOptions, PileQualityOptions
} from './enums'

function isNumeric(val) {
  return (typeof val == 'number')
}


/* Converion Ratios */

// Metric -> English conversion factors
const m3_to_ft3 = 35.3146667214886
const kg_to_lb = 2.20462262184878
const Mg_to_tons = 1.10231131 // Mg is metric tons

// English -> metric conversion factors
const ft3_to_m3 = 1 / m3_to_ft3
const lb_to_kg = 1 / kg_to_lb
const tons_to_Mg = 1 / Mg_to_tons


/* Emissions Factors

  PM factors vary based on pile quality; others vary by phase
*/

const flamingFactors = {CO: 52.66, CO2: 3429.22, CH4: 3.28, NMHC: 3.56}
const smoldResidFactors = {CO: 130.37, CO2: 3089.86, CH4: 11.03, NMHC: 6.78}
const pmEmissionsEfs = {
  PileCompositionOptions.Clean: {PM: 21.9, PM10: 15.5, 'PM2.5': 13.5},
  PileCompositionOptions.Dirty: {PM: 27.0, PM10: 20.0, 'PM2.5': 17.0},
  PileCompositionOptions.VeryDirty: {PM: 36.0, PM10: 28.0, 'PM2.5': 23.6},
}
Object.keys(flamingFactors).forEach(species => {
  // TODO: where does the 70% / 30% come from
  pmEmissionsEfs[species] = 0.7 * flamingFactors[species]
    + (0.3 * smoldResidFactors[species]
})


/* Pile Classes */

class Pile {

  constructor(args, shape) {
    this.args = args
    this.shape = shape

    this.validate()
  }

  /* Validation */

  validateInputs() {
    UnitSystems.validate(this.args.unitSystem)
    this.isValidPercent(this.args.percentConsumed) //, true)

    if (!isNumeric(this.args.percentConsumed) && this.args.percentConsumed === null) {
      throw "Parameter percent consumed must be a positive number (or null)."
    }
  }

  isValidPercent(val, name, allowNull) {
    if ((val === null && !allowNull) || !isNumeric(val) || val < 0 || val > 100)
      throw `${name} percent must be between 0 and 100`
  }


  /* Compuations */

  computeConsumedMass() {
    return this.pileMass * (this.args.percentConsumed / 100.0)
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

export class HandPile extends Pile {
  # pShape is the object pileShape
  # pileComp is 0 (conifer) or 1 (shrub)

  constructor(args, shape) {
    super(args, pShape)

    PileCompositionOptions.validate(args.pileComposition)

    this.computeCorrectedVolume()
    this.computePileMass()
    this.computeConsumedMass()
    this.computeEmissions()
  }


  /* Compuations */

  computeCorrectedVolume() {
    /* Uses Clint Wright's regression equations to estimate
     true pile volume (TV) from geometric volume (GV) in m^3 */

    // Volume correction assumes volume in m^3, so convert if necessary
    const volumeMetric = (this.unitSystem == UnitSystems.English)
      ? (this.shape.volume * ft3_to_m3) : (this.shape.volume)

    if (volumeMetric < 1)
      this.correctedVolume = math.exp(0.2106) * volumeMetric
    else
      this.correctedVolume = math.exp(0.2106 + 0.7691*math.log(volumeMetric))

    // convert back to english if necessary
    if (this.unitSystem == UnitSystems.English)
      this.correctedVolume *= m3_to_ft3
  }

  computePileMass() {
    /* Calculates mass from corrected vol using Clint Wright's other
      regression equations + pile composition (shrub/conifer) */

    // Mass computation assumes volume in m^3, so convert if necessary
    const correctedVolumeMetric = (this.unitSystem == UnitSystems.English)
      ? (this.correctedVolume) : (this.correctedVolume * ft3_to_m3)

    const massMetric = (args.pileComposition == PileCompositionOptions.Conifer)
      ? (math.exp(4.4281 + 0.8028*math.log(correctedVolumeMetric)))
      : (math.exp(3.0393 + 1.3129*math.log(correctedVolumeMetric)))

    this.pileMass = (this.unitSystem == UnitSystems.English)
      ? ((mass_kg * kg_to_lb)/2000) : (mass_kg/1000)
  }
}


export class MachinePile extends Pile {
  constructor(args, shape) {
    super(args, pShape)

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
      throw "Primary and secondary species percentages should add to 100%"

    this.isValidPercent(this.args.soilPercent, 'Soil')
    this.isValidPercent(this.args.packingRatioPercent, 'Packing')
  }


  /* Compuations */

  computeWoodDensity() {
    this.woodDensity = (this.primarySpeciesPct / 100) * htis.primarySpeciesDensity
    if (this.secondarySpeciesPct)
      this.woodDensity += (this.secondarySpeciesPct / 100) * this.secondarySpeciesDensity
  }

  computeCorrectedVolume() {
    gv = this.shape.volume
    pr = this.packingRatioPercent/100.0
    sp = (100.0 - this.soilPercent)/100.0
    this.correctedVolume = (gv*pr*sp)
  }

  computePileMass() {
    /* Calc mass w/ corrected vol and oven-dry density based on sp. comp */
    if (this.unitSystem == UnitSystems.English) {
      this.pileMass = (this.correctedVolume * this.woodDensity) / 2000.0
    } else {
      this.pileMass = ((this.correctedVolume * m3_to_ft3 * this.woodDensity) / 2000.0) * tons_to_Mg
    }
  }
}
