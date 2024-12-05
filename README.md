## Development

First run `npm link`.  Then, in a terminal, use `esbuild` to watch and rebuild
automatically:

    npm run build:watch

In another terminal, run the piles calc server in dev mode, using nodemon
to auto-reload:

    npm run serve:dev

To run in production mode

    npm run serve

To call the script:

    piles-calc -h
    piles-calc Hand -h
    piles-calc Machine -h
    piles-calc Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer
    piles-calc Machine -i 2 -n 10 -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-pct 90 \
        --secondary-species-density 3 --secondary-species-pct 10 \
        --pile-quality Clean

Use `node inspect` to step into the code. e.g.:

    node inspect ./dist/bin/piles-calc Machine -i 2 -n 10 \
        -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-pct 90 \
        --secondary-species-density 3 --secondary-species-pct 10 \
        --pile-quality Clean


To make a request to the web server:

     curl "http://localhost:3000/hand/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&percentConsumed=10&pileComposition=Conifer"

     curl "http://localhost:3000/machine/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&percentConsumed=10&&soilPercent=10&packingRatioPercent=90&primarySpeciesDensity=20&primarySpeciesPct=90&secondarySpeciesDensity=3&secondarySpeciesPct=10&pileQuality=Clean"

### Docker

To build docker image and run web server:

    docker build . -t piles-calculator
    docker run --rm -ti

### Tests

    npm test
