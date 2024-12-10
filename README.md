# Piles Calculator

The Pile Calculator allows users to calculate the biomass in hand piles and machine piles for fuel consumption, emission calculation and smoke production purposes. Pile burning is a type of prescribed fire where land managers pile and burn forest debris to reduce an area's wildfire risk. The piles are made from the debris left after fuel reduction projects such as thinning and, when ignited, burn hotter and typically produce less smoke. The Pile Calculator was originally developed by the USDA Forest Service Fire and Environmental Research Applications (FERA) Team and also exists as a standalone web tool. More information is available at: https://research.fs.usda.gov/pnw/products/dataandtools/tools/piled-fuels-biomass-and-emissions-calculator.

## Installation

    npm i @pnwairfire/piles-calculator

## Usage

### Using the package directly

Example usage:

```
import {
  compute, UnitSystems, PileTypes, ShapeTypes, PileCompositionOptions
} from '@pnwairfire/piles-calculator'

const r = compute(PileTypes.Hand, {
  unitSystem: UnitSystems.English,
  numberOfPiles: 10,
  shape: ShapeTypes.HalfSphere,
  h1: 3,
  percentConsumed: 90,
  pileComposition: PileCompositionOptions.Conifer
})

console.log('r: ', r)
```

would output:

```
r:  {
  volume: 565.4866776461628,
  correctedVolume: 626.1426745792108,
  pileMass: 1.462428437973805,
  consumedMass: 1.3161855941764247,
  emissions: {
    PM: 0.01441223225623185,
    PM10: 0.010200438354867293,
    'PM2.5': 0.008884252760690867,
    CO: 0.04999728407318275,
    CO2: 2.1897458701448826,
    CH4: 0.0036886101276794297,
    NMHC: 0.002978527999621249
  }
}

```

#### API

***compute(pileType, args)***

Returns an object containing volume, mass, and emissions values.

##### `pileType`

`pileType` can be `'Hand'` or `'Machine'`. It can be set to the string value or
using the `PileTypes` enum object (e.g. `PileTypes.Hand`).

##### `args`

`args` is an object whose set of fields depends on the pile type and shape.

###### General args (for both hand and machine piles)

 - `numberOfPiles` - Number of piles to be burned. Integer value.
 - `shape` - Shape of the pile.  Options include: `'HalfSphere'`, `'Paraboloid'`, `'HalfCylinder'`, `'HalfFrustumOfCone'`,
  `'HalfFrustumOfConeWithRoundedEnds'`, `'HalfEllipsoidIrregularSolid'`,
  or `'Irregular'`.  As an alternative to entering a string value, the `ShapeTypes` enum object may be used (e.g. `ShapeTypes.HalfSphere`).
 - `unitSystem` - Options include: `'English'` or `'Metric'`. The `ShapeTypes` enum object may be used as well (e.g. `ShapeTypes.HalfSphere`)
 - `percentConsumed` - Percent of pile mass consumed

The following dimensions are in feet or meters, depeneding on `unitSystem`

 - `h1` - height 1
 - `h2` - height 2
 - `w1` - width 1
 - `w2` - width 2
 - `l1` - length 1
 - `l2` - length 2

###### Hand pile args

 - `pileComposition` - `'Conifer'`, `'ShrubHardwood'`. The `PileCompositionOptions` enum object may be used as well (e.g. `PileCompositionOptions.Conifer`).

###### Machine pile args

  - `soilPercent` - Estimated soild percentage
  - `packingRatioPercent` - Packing ratio, as a percent
  - `primarySpeciesDensity` - Primary species wood density (in lb/ft3 or g/cm^3, depending on `unitSystem`)
  - `primarySpeciesPercent` - Primary species percentage
  - `secondarySpeciesDensity` - Secondary species wood density (in lb/ft^3 or g/cm^3, depending on `unitSystem`)
  - `secondarySpeciesPercent` - Secondary species percentage
  - `pileQuality` - Pile quality. Options include: `'Clean'`, `'Dirty'`, or `'VeryDirty'`.  The `PileQualityOptions` enum object may be used as well (e.g. `PileQualityOptions.Clean`)


### Using the `piles-calc` script

    piles-calc -h
    piles-calc Hand -h
    piles-calc Machine -h
    piles-calc Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer
    piles-calc Machine -i 2 -n 10 -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-percent 90 \
        --secondary-species-density 3 --secondary-species-percent 10 \
        --pile-quality Clean


###  Using the `piles-calc-server` web service

Run the service:

    piles-calc-server

Then make requests like so:

     curl "http://localhost:3040/hand/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&pileComposition=Conifer"

     curl "http://localhost:3040/machine/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&soilPercent=10&packingRatioPercent=90&primarySpeciesDensity=20&primarySpeciesPercent=90&secondarySpeciesDensity=3&secondarySpeciesPercent=10&pileQuality=Clean"

You can specify an alternate port with the `-p`/`--port` option

    piles-calc-server



## Development

If you want to modify the package, first clone and `cd` into the repo:

    git clone git@github.com:pnwairfire/piles-calculator.git
    cd piles-calculator

Then install dependencies

    npm install

Then run the following in a terminal to start automatic rebuilds (using `esbuild`)
and to make the piles calc executables globally available:

    npm link
    npm run build:watch

In another terminal, run the piles calc server in dev mode (which uses nodemon
to auto-reload):

    npm run serve:dev

Call the script as described above. e.g.:

    piles-calc Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer

Use `node inspect` to step into the code. e.g.:

    node inspect ./dist/bin/piles-calc Machine -i 2 -n 10 \
        -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-percent 90 \
        --secondary-species-density 3 --secondary-species-percent 10 \
        --pile-quality Clean

Make requests to the web server as described above. e.g.:

     curl "http://localhost:3040/hand/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&pileComposition=Conifer"

### Docker

To build a docker image and run the web server in a container:

    docker compose -f ./docker-compose.yml -p piles-calculator up --build

You can also run the piles calculator script with the docker image that's built:

    docker run --rm piles-calculator piles-calc -h

### Tests

    npm test
