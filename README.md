# testswarm

Nodejs module for interacting with TestSwarm

## Getting Started
Install the module with: `npm install testswarm`

```javascript
var testswarm = require('testswarm');
var testBase = "http://localhost/testswarm-ui-checkout/";
testswarm( {
	// base url for swarm server
	url: "http://localhost/testswarm/",
	// poll once per second
	pollInterval: 1000,
	// time out after ten minutes
	timeout: timeout: 1000 * 60 * 10,
	done: function( passed ) {
		process.exit( passed ? 0 : 1 );
	}
}, {
	authUsername: "jqueryui",
	authToken: "71d46254c5c4dd883592ee3188593a340aaecb0f",
	jobName: 'jQuery UI commit',
	runMax: 1,
	"runNames[]": ["Accordion", "Autocomplete"],
	"runUrls[]": [ testBase + "tests/unit/accordion/accordion.html", testBase + "tests/unit/autocomplete/autocomplete.html" ],
	browserSets: "popular"
});
```

## Release History
* 0.2.0 Global timeout, check all uaRuns, proper URLs back to TestSwarm, some additional error handling
* 0.1.1 fix engine property in package.json
* 0.1.0 first release

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
