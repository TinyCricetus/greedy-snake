"use strict";
exports.__esModule = true;
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, 'index.ts'),
    // devtool: "inline-source-map",
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        clean: true
    },
    plugins: [new HtmlWebpackPlugin({
            template: 'index.html'
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
    }
};
