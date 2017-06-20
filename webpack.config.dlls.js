var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "src", "vendor.js")]
    },
    output: {
        path: path.join(__dirname, "dst"),
        filename: "[name].js",
        library: "[name]"
    },
    //  Define externals (things we don't pack).
    externals: {
        angular: 'angular',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "dst", "[name]-manifest.json"),
            name: "[name]",
            context: path.resolve(__dirname, "src")
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        root: path.resolve(__dirname, "src"),
        modulesDirectories: ["node_modules"]
    }
};