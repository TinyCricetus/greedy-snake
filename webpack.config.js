const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',

  entry: path.resolve(__dirname, 'index.ts'),

  devtool: "inline-source-map",

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    clean: true
  },

  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './public/index.html'),
    favicon: path.resolve(__dirname, './public/favicon.ico')
  })],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  },

  performance: {
    hints: false,
  },
}