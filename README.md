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

### Tests

    npm test
