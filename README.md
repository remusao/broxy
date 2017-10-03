# Broxy

## Quickstart

1. Symlink [cliqz/navigation-extension](https://github.com/cliqz/navigation-extension) `build` folder to `node_modules/browser-core`
	+ Clone navigation-extension and run `npm install`
	+ Build navigation-extension output files:
		+ `./fern.js install && ./fern.js build configs/node.json --environment=production`
	+ Create symlink in broxy:
        + `ln -s ../navigation-extension/build/ node_modules/browser-core`
2. Install dependencies using `yarn`:
    + `yarn install`
3. Run the app:
    + `yarn run build && yarn run start`
