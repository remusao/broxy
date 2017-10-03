const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'static', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: 'elm-webpack-loader?verbose=true&warn=true',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.elm'],
  },
  devServer: { inline: true },
};
