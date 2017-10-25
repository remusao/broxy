const path = require('path');
const convert = require('./build-helpers/generate-elm-ts-ipc.js');

const elmModuleName = 'TsElmInterfaces';

module.exports = class ElmTypesPlugin {
  constructor(options) {
    this.inputFile = options.inputFile;
    this.outputPath = options.outputPath;
  }

  get outputFile() {
    return path.join(this.outputPath, `${elmModuleName}.elm`);
  }

  build(compiler, callback) {
    console.log('Generate Elm type from typescript interfaces...');
    convert(this.inputFile, this.outputFile, (err) => {
      if (err) {
        console.error('Error while generating Elm types', err);
      } else {
        console.log('Generation successful!');
        callback();
      }
    });
  }

  apply(compiler) {
    compiler.plugin('before-compile', (_, cb) => this.build(compiler, cb));
  }
};
