const path = require('path');
const convert = require('./build-helpers/generate-elm-ts-ipc.js');

const elmModuleName = 'TsElmInterfaces';

module.exports = class ElmTypesPlugin {
  constructor(options) {
    this.elmInput = options.elmInput;
    this.elmOutput = options.elmOutput;
    this.tsInput = options.tsInput;
    this.tsOutput = options.tsOutput;
  }

  build(compiler, callback) {
    console.log('Generate Elm type from typescript interfaces...');
    convert({
      elmInput: this.elmInput,
      elmOutput: path.join(this.elmOutput, `${elmModuleName}.elm`),
      tsInput: this.tsInput,
      tsOutput: path.join(this.tsOutput, 'Broxy.d.ts'),
    }, (err) => {
      if (err) {
        console.error('Error while generating Elm types', err);
      } else {
        console.log('Generation successful!');
        callback();
      }
    });
  }

  apply(compiler) {
    compiler.plugin('run', this.build.bind(this));
    compiler.plugin('emit', this.build.bind(this));
  }
};
