const path = require('path');
const convert = require('./build-helpers/generate-elm-ts-ipc.js');

const elmModuleName = 'TsElmInterfaces';

function main() {
  const argv = process.argv;
  if (argv.length > 2) {
    const inputFile = argv[2];
    const outputFile = path.join(argv[3], `${elmModuleName}.elm`);

    if (!inputFile.endsWith('.ts')) {
      console.error('First argument should be a Typescript source file');
      console.error('> Given:', inputFile);
    } else {
      console.log('Generate Elm type from typescript interfaces...');
      console.log('> Input file:', inputFile);
      console.log('> Output file:', outputFile);

      convert(inputFile, outputFile, (err) => {
        if (err) {
          console.error('Error while generating Elm types', err);
        } else {
          console.log('Generation successful!');
        }
      });
    }
  }
}


main();
