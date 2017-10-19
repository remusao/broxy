const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ElmTypesPlugin = require('./elm-types-webpack-plugin');

const excludeFolders = [
  /elm-stuff/,
  /node_modules/,
];

const configBase = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      //{
        //test: /\.ts$/,
        //enforce: 'pre',
        //loader: 'tslint-loader',
        //exclude: excludeFolders,
        //options: {
          //typeCheck: true,
          //emitErrors: true
        //}
      //},
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: excludeFolders,
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.elm$/,
        exclude: excludeFolders,
        loader: 'elm-webpack-loader?verbose=true&warn=true',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.elm'],
  },
  devtool: 'inline-source-map',
  node: {
    __dirname: false,
  },

};


module.exports = [
  Object.assign({
    entry: { main: path.join(__dirname, 'src', 'main.ts') },
    target: 'electron-main',
  }, configBase),
  Object.assign({
    entry: { renderer: path.join(__dirname, 'src', 'static', 'renderer.ts') },
    target: 'electron-renderer',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Broxy',
      }),
      new ElmTypesPlugin({
        inputFile: path.join(__dirname, 'src', 'static', 'renderer.ts'),
        outputPath: path.join(__dirname, 'src', 'elm'),
      }),
    ],
  }, configBase),
];
