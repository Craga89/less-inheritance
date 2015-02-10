var lessImports = require('../lib/index');
var assert = require('assert');
var path = require('path');
var colors = require('colors');

const LESS = path.resolve(__dirname, 'less');
const OPTIONS = { baseDir: LESS };

describe('getImports('+'filename'.cyan+')', function() {

	describe('importsA.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getImports('importsA.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return two imports', function() {
			assert.equal(result.length, 2);
		});

		it('Should @import imports/a.less', function() {
			assert(result.indexOf('imports/a.less') > -1);
		});

		it('Should @import imports/c.less', function() {
			assert(result.indexOf('imports/c.less') > -1);
		});
	});

	describe('importsB.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getImports('importsB.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return two imports', function() {
			assert.equal(result.length, 2);
		});

		it('Should @import imports/b.less', function() {
			assert(result.indexOf('imports/b.less') > -1);
		});

		it('Should @import imports/c.less', function() {
			assert(result.indexOf('imports/c.less') > -1);
		});
	});

	describe('importsAB.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getImports('importsAB.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return three imports', function() {
			assert.equal(result.length, 3);
		});

		it('Should @import imports/a.less', function() {
			assert(result.indexOf('imports/a.less') > -1);
		});

		it('Should @import imports/b.less', function() {
			assert(result.indexOf('imports/b.less') > -1);
		});
		
		it('Should @import imports/c.less', function() {
			assert(result.indexOf('imports/c.less') > -1);
		});
	});
});


describe('getDependants('+'filename'.cyan+')', function() {

	describe('imports/a.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getDependants('imports/a.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return two dependants', function() {
			assert.equal(result.length, 2);
		});

		it('Should list importsA.less as a dependent', function() {
			assert(result.indexOf('importsA.less') > -1);
		});

		it('Should list importsAB.less as a dependent', function() {
			assert(result.indexOf('importsAB.less') > -1);
		});
	});

	describe('imports/b.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getDependants('imports/b.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return two dependants', function() {
			assert.equal(result.length, 2);
		});

		it('Should list importsB.less as a dependent', function() {
			assert(result.indexOf('importsB.less') > -1);
		});

		it('Should list importsAB.less as a dependent', function() {
			assert(result.indexOf('importsAB.less') > -1);
		});
	});

	describe('imports/c.less'.cyan, function() {
		var result;

		before(function(done) {
			lessImports.getDependants('imports/c.less', OPTIONS)
				.then(function(r) { result = r; done(); }, done);
		});

		it('Should return five dependants', function() {
			assert.equal(result.length, 5);
		});

		it('Should list importsA.less as a dependent', function() {
			assert(result.indexOf('importsA.less') > -1);
		});

		it('Should list importsB.less as a dependent', function() {
			assert(result.indexOf('importsB.less') > -1);
		});

		it('Should list importsAB.less as a dependent', function() {
			assert(result.indexOf('importsAB.less') > -1);
		});

		it('Should list imports/a.less as a dependent', function() {
			assert(result.indexOf('imports/a.less') > -1);
		});

		it('Should list imports/b.less as a dependent', function() {
			assert(result.indexOf('imports/b.less') > -1);
		});
	});

})