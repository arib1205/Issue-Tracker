const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/App.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-router', 'react-router-dom', 'prop-types', 'react-router-bootstrap'],
  },

  output: {
    path: __dirname + '/public',
    filename: 'app.bundle.js'
  },

  devtool: 'source-map',

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js'})
  ],

  devServer: {
    port: 8000,
    contentBase: 'public',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    },
    historyApiFallback: true,
  },

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react','es2015']
        }
      },
    ]
  }
};
