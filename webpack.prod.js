const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const minimize = process.argv.indexOf('minimize') >= 0;

module.exports = merge(base, {
    mode: 'production',
    entry: {
        "popbox": ['./src/popbox.js','./src/assets/sass/popbox.scss'],
        "popbox-animations": ['./src/popbox-animations.js'],
        "popbox-gallery": ['./src/popbox-gallery.js','./src/assets/sass/popbox-gallery.scss'],
        "popbox-selector": ['./src/popbox-selector.js'],
        "popbox-full": ['./src/popbox-full.js'],
        "themes/popbox-basic-theme/popbox-basic-theme":['./src/assets/sass/themes/popbox-basic-theme/popbox-basic-theme.scss']
    },
    externals:{
        jquery: "jQuery"
    },
    output: {
        filename: '[name]'+(minimize ? '.min' : '')+'.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        minimize: minimize,
        minimizer: [
            new TerserPlugin({
                extractComments:{
                    condition:false,
                    filename:() => {
                        return '';
                    },
                    banner:(licenseFile) => {
                        return '';
                    }
                },
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    }
});
