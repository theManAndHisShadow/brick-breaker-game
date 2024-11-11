const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/ts/app.ts',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'build'),
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/css'), 
                    to: path.resolve(__dirname, 'build/css'), 
                    noErrorOnMissing: true, 
                },
                {
                    from: path.resolve(__dirname, './src/assets'), 
                    to: path.resolve(__dirname, 'build/assets'), 
                },
            ],
        }),
    ],
};
