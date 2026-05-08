var config = require('./webpack.base.js'),
    path = require('path'),
    webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');

config.devtool = 'source-map';
config.mode = 'production';

config.output.path = path.resolve('./static_seazit/bundles');
config.output.publicPath = '/static_seazit/bundles/';

config.plugins.push(
    new MiniCssExtractPlugin({
        filename: 'style.css',
    })
);

config.optimization = Object.assign({}, config.optimization, {
    minimize: true,
});

config.module = {
    noParse: [/xlsx\/jszip.js/],
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
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
