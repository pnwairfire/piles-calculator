## Development

First run the following in a terminal to start automatic rebuilds (using `esbuild`)
and to make the piles calc executables globally available:

    npm link
    npm run build:watch

In another terminal, run the piles calc server in dev mode (which uses nodemon
to auto-reload):

    npm run serve:dev

When you're ready to run in production mode, you'd use `npm run serve`

To call the script:

    piles-calc -h
    piles-calc Hand -h
    piles-calc Machine -h
    piles-calc Hand -i 2 -n 10 -s HalfSphere --h1 5 -c 90 --comp Conifer
    piles-calc Machine -i 2 -n 10 -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-percent 90 \
        --secondary-species-density 3 --secondary-species-percent 10 \
        --pile-quality Clean

Use `node inspect` to step into the code. e.g.:

    node inspect ./dist/bin/piles-calc Machine -i 2 -n 10 \
        -s HalfSphere --h1 5 -c 90 \
        --soil-percent 10 --packing-ratio-percent 90 \
        --primary-species-density 20 --primary-species-percent 90 \
        --secondary-species-density 3 --secondary-species-percent 10 \
        --pile-quality Clean

To make a request to the web server:

     curl "http://localhost:3040/hand/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&percentConsumed=10&pileComposition=Conifer"

     curl "http://localhost:3040/machine/?numberOfPiles=5&shape=HalfSphere&percentConsumed=12&h1=5&percentConsumed=10&&soilPercent=10&packingRatioPercent=90&primarySpeciesDensity=20&primarySpeciesPercent=90&secondarySpeciesDensity=3&secondarySpeciesPercent=10&pileQuality=Clean"

### Docker

To build a docker image and run the web server in a container:

    docker compose -f ./docker-compose.yml -p piles-calculator up --build

You can also run the piles calculator script with the docker image that's built:

    docker run --rm piles-calculator piles-calc -h

### Tests

    npm test
