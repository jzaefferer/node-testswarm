[![Build Status](https://travis-ci.org/jzaefferer/node-testswarm.svg?branch=master)](https://travis-ci.org/jzaefferer/node-testswarm) [![NPM version](https://badge.fury.io/js/testswarm.svg)](http://badge.fury.io/js/testswarm)

# node-testswarm

Nodejs module for interacting with TestSwarm

## Getting Started
Install the module with:

	npm install --save-dev testswarm

```javascript
var testswarm = require( "./lib/testswarm" ),
	testUrl = "http://localhost/jquery-core/test/",
	runs = {};

["attributes", "callbacks"].forEach(function (suite) {
	runs[suite] = testUrl + "?module=" + suite;
});

testswarm.createClient({
	url: "http://localhost/testswarm/"
})
.addReporter( testswarm.reporters.cli )
.auth({
	id: "example",
	token: "yourauthtoken"
})
.addjob(
	{
		name: "node-testswarm test job",
		runs: runs,
		browserSets: [ "example" ],
	}, function( err, passed ) {
		if ( err ) {
			throw err;
		}
		process.exit( passed ? 0 : 1 );
	}
);
```

For local testing, copy `sample-test.js` to `test.js` and modify to match your local TestSwarm setup.

## API

### createClient({ url })

* `Object config`
 - `String url` - Url to root of TestSwarm install.

### Client#addReporter( reporter )

* `Object reporter` - usually `testswarm.reporters.cli`, unless you want to use a custom reporter

### Client#auth({ id, token })

* `Object auth`
 - `String id` - Username of TestSwarm account.
 - `String token` - Authentication token of account.

### Client#addjob( options, callback )

* `Object options`
 - `String name` - name of this job
 - `Number runMax` - [optional] how often failed tests should rerun
 - `Object runs` -  Run urls by run name.
 - `Array|String browserSets` - which sets to test against
 - `Number pollInterval` -  [optional] In milliseconds, default 5 seconds.
 - `Number timeout` -  [optional] In milliseconds, default 15 minutes.
* `Function( Object err, Boolean passed, Object results ) callback`

## License
Copyright (c) 2014 Jörn Zaefferer
Licensed under the MIT license.
