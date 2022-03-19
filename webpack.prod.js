const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
var webpack = require('webpack');


module.exports = merge(baseConfig, {
    mode:"production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "client", "out", "scripts")
    },
    // devtool:'source-map',
    plugins: [
        // new UglifyJsPlugin({
        //     sourceMap:true
        // }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
            DEBUG: false
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        })
    ],
    watch: false,
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
});