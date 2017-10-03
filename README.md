# Broxy

## Quickstart

1. Package [cliqz/navigation-extension](https://github.com/cliqz/navigation-extension) built with `node` config:
	+ Clone navigation-extension and run `npm install`
	+ Build navigation-extension output files:
		+ `./fern.js install && ./fern.js build configs/node.json --environment=production`
    + Package:
        + `npm pack`
    + Copy the package into `broxy` directory:
        + `cp browser-core* ../broxy`
2. Install dependencies using `yarn`:
    + `yarn install`
3. Run the app:
    + `yarn start`
