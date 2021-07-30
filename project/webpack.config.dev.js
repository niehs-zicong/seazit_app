var config = require('./webpack.base.js'),
    path = require('path'),
    webpack = require('webpack'),
    port = 3000,
    HappyPack = require('happypack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

config.devtool = 'cheap-module-eval-source-map';
config.output.publicPath = 'http://localhost:' + port + '/dist/';

config.plugins.unshift(
    new HappyPack({
        id: 'js',
        loaders: ['babel-loader'],
        verbose: false,
        threads: 4,
    })
);
config.plugins.unshift(
    new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true,
    })
);

config.module = {
    noParse: [/xlsx\/jszip.js/],
    rules: [
        {
            test: /\.js$/,
            use: 'happypack/loader?id=js',
            include: [
                path.join(__dirname, 'assets'),                
                path.join(__dirname, 'seazit', 'assets'),
                

            ],
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use:
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            }),
        },
    ],
};

module.exports = config;
