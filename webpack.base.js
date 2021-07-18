const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackRemoveEmptyScriptsPlugin = require('./node_scripts/webpack-remove-empty-scripts/index.js')

const production = process.argv.indexOf('production') >= 0;

module.exports = {
    plugins:[
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(process.env.npm_package_version)
        }),
        new MiniCssExtractPlugin({
            filename:'[name].css'
        }),
        new WebpackRemoveEmptyScriptsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|vendor)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /(node_modules|bower_components|vendor)/,
                use:
                    production ? [
                        // mini load css
                        MiniCssExtractPlugin.loader,
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ] : [
                        // Creates `style` nodes from JS strings
                        "style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                include:[
                    path.resolve(__dirname,'src/assets/sass/themes/popbox-basic-theme/assets')
                ],
                loader: 'file-loader',
                options: {
                    name: 'themes/popbox-basic-theme/assets/[name].[ext]',
                },
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                include:[
                    path.resolve(__dirname,'dev/assets/img')
                ],
                loader: 'file-loader',
                options: {
                    name: 'assets/img/[name].[ext]',
                },
            }
        ],
    },
};
