const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
var webpack = require('webpack');

module.exports = merge(baseConfig, {
    mode:'development',
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "client", "out", "scripts")
    },
    // devtool:'source-map',
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    devtool: "eval-cheap-source-map",
    watch: true,
    optimization: {
        minimize: false
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
});