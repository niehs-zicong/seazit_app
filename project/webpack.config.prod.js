var config = require('./webpack.base.js'),
    path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

config.devtool = 'source-map';

config.output.path = path.resolve('./static/bundles');
config.output.publicPath = '/static/bundles/';

config.plugins.unshift.apply(config.plugins, [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false,
        },
        sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
    }),
    new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true,
    }),
]);

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
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use:
                    'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            }),
        },
    ],
};

module.exports = config;
