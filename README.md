# less-imports-dependants
This module interfaces with the LESS Parser to provide you with two utility methods:

* `Promise: getImports(file[, options])` - 
	* Retrieve a *deep* list of all `@import`'d files for a given `.less` file and it's descendants
* `Promise: getDependants(file[, options])` - 
	* Retrieve a list of all files within `options.baseDir` which depend on this `.less` file i.e. `@import` it.

## Usage
Assuming we have an LESS file structure with the following `@import` graph below...
```less
//- main.less 
@import 'import1.less';
@import 'import2.less';

//- import1.less
@import 'import1a.less';
@import 'import1b.less';

//- import2.less
@import 'import1a.less';
@import 'import2a.less';
```

### `Promise: getImports(file[, options])`
```javascript
var lessImports = require('less-imports-dependants');

lessImports.getImports('main.less').then(function(result) {
	console.log(result);
});

// Logs
[
	'import1.less',
	'import2.less',
	'import1a.less',
	'import1b.less',
	'import2a.less'
]
```

### `Promise: getDependants(file[, options])`
```javascript
var lessImports = require('less-imports-dependants');

lessImports.getDependants('import1a.less').then(function(result) {
	console.log(result);
});

// Logs
[
	'main.less', 
	'import1.less', 
	'import2.less'
]
```


## Tests
To run the tests, simply run:
```javascript
npm test
```
... in the repository directory.


## License
Copyright 2015 Craig Michael Thompson - MIT License (enclosed)
