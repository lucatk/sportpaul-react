var webpack = require('webpack');
var path = require('path');
var CompressionPlugin = require('compression-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: {
    app: APP_DIR + '/index',
    vendor: [
      'react',
      'react-bootstrap',
      'react-router',
      'react-helmet',
    ]
  },
  output: {
    path: BUILD_DIR,
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  module: {
    loaders: [
      {
        test : /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    unsafeCache: true
  },
  node: {
    fs: "empty"
  },
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
};

module.exports = config;
