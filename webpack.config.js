const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');


module.exports = ({
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.(tsx?|jsx?)$/,
            loader: 'awesome-typescript-loader',
        }]
    },
    devtool: 'eval',
    entry: {
        'index': './src/index.ts',
        validators: './src/lib/validators.ts',
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
        path: path.resolve(__dirname,'./dist'),
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'react-smart-form',
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new CheckerPlugin(),
    ],
})
