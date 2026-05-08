var config = require('./webpack.base.js'),
    path = require('path'),
    webpack = require('webpack'),
    port = 3000,
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

config.devtool = 'eval-cheap-module-source-map';
config.output.publicPath = 'http://localhost:' + port + '/dist/';
config.mode = 'development';

config.plugins.push(
    new MiniCssExtractPlugin({
        filename: 'style.css',
    })
);

config.module = {
    noParse: [/xlsx\/jszip.js/],
    rules: [
        {
            test: /\.js$/,
            use: [{ loader: 'thread-loader', options: { workers: 4 } }, { loader: 'babel-loader' }],
            include: [path.join(__dirname, 'assets'), path.join(__dirname, 'seazit', 'assets')],
        },
        {
            test: /\.css$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                        },
                        importLoaders: 1,
                    },
                },
            ],
        },
    ],
};

module.exports = config;
