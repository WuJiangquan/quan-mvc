var path = require("path");
var fs = require('fs');
var webpack = require('webpack');

var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;


module.exports = {
	entry : './index.js',
	output : {
		path : "./dist/",
		filename : "quanMVC.min.js"
	},
	 devtool:'source-map',

}