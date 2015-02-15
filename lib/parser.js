"use strict";

var _to5Helpers = require("6to5-runtime/helpers")["default"];
var _core = require("6to5-runtime/core-js")["default"];
var _regeneratorRuntime = require("6to5-runtime/regenerator")["default"];
var path = _to5Helpers.interopRequire(require("path"));

var less = _to5Helpers.interopRequire(require("less"));

var glob = _to5Helpers.interopRequire(require("glob"));

var fs = _to5Helpers.interopRequire(require("fs"));

var Parser = (function () {
	function Parser(_ref) {
		var baseDir = _ref.baseDir;
		var lessOptions = _ref.less;
		_to5Helpers.classCallCheck(this, Parser);

		if (!baseDir) {
			throw new Error("Must provide a valid `baseDir` property.");
		}

		this.baseDir = baseDir || process.cwd();
		this.lessOptions = lessOptions;
	}

	_to5Helpers.prototypeProperties(Parser, null, {
		getImports: {
			value: function getImports(fileName) {
				var _this = this;
				var imports;
				return _regeneratorRuntime.async(function getImports$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							imports = new _core.Set();
							context$2$0.next = 3;
							return _this._traversePathImports(path.resolve(_this.baseDir, fileName), function (parentFileName, importFileName) {
								parentFileName && imports.add(importFileName);
							});
						case 3:
							return context$2$0.abrupt("return", _core.Array.from(imports));
						case 4:
						case "end":
							return context$2$0.stop();
					}
				}, null, this);
			},
			writable: true,
			configurable: true
		},
		getDependants: {
			value: function getDependants(fileName) {
				var _this = this;
				var files, dependencies, _iterator, _step, filePath;
				return _regeneratorRuntime.async(function getDependants$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							context$2$0.next = 2;
							return _this._globBaseDir();
						case 2:
							files = context$2$0.sent;
							dependencies = new _core.Set();
							_iterator = _core.$for.getIterator(files);
						case 5:
							if ((_step = _iterator.next()).done) {
								context$2$0.next = 11;
								break;
							}
							filePath = _step.value;
							context$2$0.next = 9;
							return _this._traversePathImports(filePath, function (parentFileName, importFileName) {
								if (parentFileName && importFileName === fileName) {
									dependencies.add(parentFileName);
								}
							});
						case 9:
							context$2$0.next = 5;
							break;
						case 11:
							return context$2$0.abrupt("return", _core.Array.from(dependencies));
						case 12:
						case "end":
							return context$2$0.stop();
					}
				}, null, this);
			},
			writable: true,
			configurable: true
		},
		_traversePathImports: {
			value: function _traversePathImports(filePath) {
				var _this = this;
				var iterator = arguments[1] === undefined ? function () {} : arguments[1];
				var _ref, fileName, contents;
				return _regeneratorRuntime.async(function _traversePathImports$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							context$2$0.next = 2;
							return _this._readFile(filePath);
						case 2:
							_ref = context$2$0.sent;
							fileName = _ref.fileName;
							contents = _ref.contents;
							context$2$0.next = 7;
							return _this._traverseFileImports(fileName, contents, iterator);
						case 7:
						case "end":
							return context$2$0.stop();
					}
				}, null, this);
			},
			writable: true,
			configurable: true
		},
		_traverseFileImports: {
			value: function _traverseFileImports(fileName, contents, iterator, parentFileName) {
				var _this = this;
				var fileImports, result, _iterator, _step, _step$value, importPath, importContents, importFileName;
				return _regeneratorRuntime.async(function _traverseFileImports$(context$2$0) {
					while (1) switch (context$2$0.prev = context$2$0.next) {
						case 0:
							context$2$0.next = 2;
							return _this._parseFileImports(fileName, contents);
						case 2:
							fileImports = context$2$0.sent;
							result = iterator(parentFileName, fileName, fileImports);
							if (!(result === false)) {
								context$2$0.next = 6;
								break;
							}
							return context$2$0.abrupt("return");
						case 6:
							_iterator = _core.$for.getIterator(_core.Object.entries(fileImports));
						case 7:
							if ((_step = _iterator.next()).done) {
								context$2$0.next = 18;
								break;
							}
							_step$value = _to5Helpers.slicedToArray(_step.value, 2);
							importPath = _step$value[0];
							importContents = _step$value[1];
							importFileName = _this._makeRelativePath(importPath);
							if (!(importFileName === fileName)) {
								context$2$0.next = 14;
								break;
							}
							return context$2$0.abrupt("continue", 16);
						case 14:
							context$2$0.next = 16;
							return _this._traverseFileImports(importFileName, importContents, iterator, fileName);
						case 16:
							context$2$0.next = 7;
							break;
						case 18:
						case "end":
							return context$2$0.stop();
					}
				}, null, this);
			},
			writable: true,
			configurable: true
		},
		_makeRelativePath: {
			value: function _makeRelativePath(absPath) {
				return path.relative(this.baseDir, absPath);
			},
			writable: true,
			configurable: true
		},
		_readFile: {
			value: function _readFile(filePath) {
				var _this = this;
				return new _core.Promise(function (resolve, reject) {
					fs.readFile(filePath, function (err, contents) {
						if (err) {
							reject(err);
						}

						resolve({
							filePath: filePath,
							fileName: _this._makeRelativePath(filePath),
							contents: contents.toString("utf8")
						});
					});
				});
			},
			writable: true,
			configurable: true
		},
		_globBaseDir: {

			// Locates
			value: function _globBaseDir() {
				var _this = this;
				return new _core.Promise(function (resolve, reject) {
					glob(_this.baseDir + "/**/*.less", function (err, matches) {
						if (err) {
							reject(err);
						}
						resolve(matches);
					});
				});
			},
			writable: true,
			configurable: true
		},
		_parseFileImports: {

			// Generates list of @import paths for a given filePath
			value: function _parseFileImports(fileName, contents) {
				var _this = this;
				return new _core.Promise(function (resolve, reject) {
					// Create new parser instance, using file path as `fileName` option
					less.parse(contents, _core.Object.assign({}, _this.lessOptions, {
						filename: path.resolve(_this.baseDir, fileName)
					}), function (err, root, imports, options) {
						// Add a better error message / properties
						if (err) {
							err.lineNumber = err.line;
							err.fileName = err.fileName;
							err.message = err.message + " in file " + err.fileName + " line no. " + err.lineNumber;

							reject(err);
						}

						resolve(imports.contents);
					});
				});
			},
			writable: true,
			configurable: true
		}
	});

	return Parser;
})();

module.exports = Parser;
// Parse imports for this file


// Call iterator and return early, if it explicitly returns false


// Loop over all the timports
// Don't re-parse the same file as we scanned!


// Recursively parse the import for more imports