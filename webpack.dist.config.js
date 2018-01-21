const webpack = require('webpack');
const path = require('path');

const { UglifyJsPlugin } = webpack.optimize;

module.exports = {
    entry: {
        'react-smart-form': './src/index.js',
        'react-smart-form.min': './src/index.js',
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
        },
    },

    output: {
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'react-smart-form',
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false,
            },
        }),
    ],

    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
