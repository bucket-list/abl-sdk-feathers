var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var vendorLibs = require(path.resolve(__dirname, 'vendor.js'));
module.exports = {

    //  Defines the entrypoint of our application.
    // entry: [path.resolve(__dirname, 'src/abl-sdk.js')],
    entry: {
        'vendor.all': vendorLibs.all
    },
    output: {
        path: path.resolve(__dirname, 'dst'),
        filename: "[name].min.js"
    },

    //  Define externals (things we don't pack).
    externals: {},

    module: {},
    plugins: [
        new ngAnnotatePlugin({
            add: true
            // other ng-annotate options here 
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     mangle: {
        //         except: ['angular',
        //             '$super', '$', 'exports', 'require'
        //         ]
        //     },
        //     sourceMap: false,
        //     compress: {
        //         warnings: false,
        //         drop_debugger: true,
        //         drop_console: true,
        //     }
        // })
    ]
};