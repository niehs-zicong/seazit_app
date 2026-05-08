var path = require('path'),
    webpack = require('webpack'),
    BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,

    entry: {
        main: ['./assets/index', './seazit/assets/index'],
    },

    resolve: {
        modules: [
            path.join(__dirname, 'assets'),
            path.join(__dirname, 'seazit', 'assets'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.css'],
    },

    output: {
        path: path.join(__dirname, 'static_seazit', 'bundles'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].js',
    },

    externals: {
        $: '$',
        Plotly: 'Plotly',
    },

    optimization: {
        emitOnErrors: false,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },
            },
        },
        runtimeChunk: 'single',
    },

    plugins: [
        new BundleTracker({
            path: __dirname,
            filename: 'webpack-stats.json',
        }),
    ],
};
