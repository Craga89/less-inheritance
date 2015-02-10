import path from 'path';
import less from 'less';
import glob from 'glob';
import fs from 'fs';

export default class Parser {
	constructor({ baseDir: baseDir, less: lessOptions }) {
		if(!baseDir) { throw new Error('Must provide a valid `baseDir` property.'); }

		this.baseDir = baseDir || process.cwd();
		this.lessOptions = lessOptions;
	}

	async getImports(fileName) {
		let imports = new Set();

		await this._traversePathImports(
			path.resolve(this.baseDir, fileName), 
			(parentFileName, importFileName) => { 
				parentFileName && imports.add(importFileName);
			}
		);

		return Array.from(imports);
	}

	async getDependants(fileName) {
		let files = await this._globBaseDir();
		let dependencies = new Set();

		for(let filePath of files) {
			await this._traversePathImports(filePath, (parentFileName, importFileName) => {
				if(parentFileName && importFileName === fileName) {
					dependencies.add(parentFileName);
				}
			});
		}

		return Array.from(dependencies);
	}

	async _traversePathImports(filePath, iterator=function(){}) {
		let { fileName: fileName,  contents: contents } = await this._readFile(filePath);
		await this._traverseFileImports(fileName, contents, iterator);
	}

	async _traverseFileImports(fileName, contents, iterator, parentFileName) {
		// Parse imports for this file
		let fileImports = await this._parseFileImports(fileName, contents);

		// Call iterator and return early, if it explicitly returns false
		let result = iterator(parentFileName, fileName, fileImports);
		if(result === false) { return; }

		// Loop over all the timports
		for (let [importPath, importContents] of Object.entries(fileImports)) {
			// Don't re-parse the same file as we scanned!
			let importFileName = this._makeRelativePath(importPath);
			if(importFileName === fileName) { continue; }

			// Recursively parse the import for more imports
			await this._traverseFileImports(
				importFileName, 
				importContents,
				iterator,
				fileName
			);
		}
	}

	_makeRelativePath(absPath) {
		return path.relative(this.baseDir, absPath);
	}

	_readFile(filePath) {
		return new Promise( (resolve, reject) => {
			fs.readFile(filePath, (err, contents) => {
				if(err) { reject(err); }

				resolve({
					filePath: filePath,
					fileName: this._makeRelativePath(filePath),
					contents: contents.toString('utf8')
				});
			});
		});
	}

	// Locates 
	_globBaseDir() {
		return new Promise( (resolve, reject) => {
			glob(this.baseDir + '/**/*.less', (err, matches) => {
				if(err) { reject(err); }
				resolve(matches);
			});
		});
	}

	// Generates list of @import paths for a given filePath
	_parseFileImports(fileName, contents) {
		return new Promise( (resolve, reject) => {
			// Create new parser instance, using file path as `fileName` option
			less.parse(
				contents, 
				Object.assign({}, this.lessOptions, {
					filename: path.resolve(this.baseDir, fileName)
				}), 
				(err, root, imports, options) => {
					// Add a better error message / properties
					if (err) { 
						err.lineNumber = err.line;
						err.fileName = err.fileName;
						err.message = err.message + ' in file ' + err.fileName + ' line no. ' + err.lineNumber;
						
						reject(err);
					}

					resolve(imports.contents);
				}
			);
		});
	}
}