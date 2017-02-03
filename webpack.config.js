var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/www');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: APP_DIR + '/index',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        include: APP_DIR,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};

module.exports = config;
