const path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: {
        alpha_astronauts: './client/src/AlphaAstronauts.tsx'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
        fallback: {
            "http": require.resolve("stream-http"),
            "os": require.resolve("os-browserify/browser"),
            "https": require.resolve("https-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader','ts-loader'],
                exclude: [/node_modules/,nodeModulesPath]
            },
            // babel-loader for pure javascript (es6) => javascript (es5)
            {
                test: /\.(jsx?)$/,
                use: ['babel-loader'],
                exclude: [/node_modules/,nodeModulesPath]
            },
            {
                test: /\.(json?)$/,
                use: ['json-loader'],
                exclude: [/node_modules/,nodeModulesPath]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "@teamsupercell/typings-for-css-modules-loader",
                    {
                      loader: "css-loader",
                      options: { 
                        modules: {
                            localIdentName: '[local]--[hash:base64:5]'
                        }
                    }
                    }
                ],
            }              
        ]
    }
};