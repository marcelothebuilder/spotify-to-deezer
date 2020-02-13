const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            { from: 'icons', to: 'icons' },
            { from: 'manifest.json', to: 'manifest.json' },
        ]),
    ]
};