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
            path.join(__dirname, 'neurotox', 'assets'),

            path.join(__dirname, 'seazit', 'assets'),

            'node_modules',
        ],
        extensions: ['.js', '.css'],
    },

    output: {
        //        path: path.join(__dirname, 'dist'),
        path: path.join(__dirname, 'static_seazit', 'bundles'),

        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js',
    },

    externals: {
        $: '$',
        Plotly: 'Plotly',
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[hash].js',
            minChunks: (module, count) => {
                return module.context && module.context.indexOf('node_modules') !== -1;
            },
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: 'manifest.[hash].js',
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new BundleTracker({
            filename: './webpack-stats.json',
        }),
    ],
};
