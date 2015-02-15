"use strict";

var _to5Helpers = require("6to5-runtime/helpers")["default"];
var Parser = _to5Helpers.interopRequire(require("./parser"));

var path = _to5Helpers.interopRequire(require("path"));

/**
Retrieve a list of all @import'd files for a given file. Returns a flat
list structure.

@method getImports
@for exports
@param filepath {String} File (relative to baseDir)
@param options {Object} Configuration object
	@param options.baseDir {String} Base directory of given file paths
@return {Promise} Resolves with an array of @imports
**/
function getImports(filepath, options) {
	var parser = new Parser(options);
	return parser.getImports(filepath);
};

/**
Retrieve a list of all files which depend on this `.less` file i.e. `@import` it.

@method getDependants
@for exports
@param filepath {String} File (relative to baseDir)
@param options {Object} Configuration object
	@param options.baseDir {String} Base directory of given file paths
@return {Promise} Resolves with an array of files which @import this one
**/
function getDependants(filepath, options) {
	var parser = new Parser(options);
	return parser.getDependants(filepath);
};

/**
Export Parser class

@class Parser
@for exports
**/
exports.Parser = Parser;
exports.getImports = getImports;
exports.getDependants = getDependants;
Object.defineProperty(exports, "__esModule", {
	value: true
});