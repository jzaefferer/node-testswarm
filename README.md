# testswarm

Nodejs module for interacting with TestSwarm

## Getting Started
Install the module with: `npm install testswarm`.

See [https://github.com/jquery/testswarm/tree/master/scripts/addjob#fields addjob README] in the TestSwarm repository for what parameters the addjob API takes.

```javascript
var testswarm = require('testswarm');
var myCode = "http://localhost/jquery-ui-checkout";
testswarm( {
	// base url for testswarm server (no trailing slash)
	url: "http://localhost/testswarm",
	// how often to job status (in milliseconds)
	pollInterval: 1000,
	// time out (in milliseconds)
	timeout: 1000 * 60 * 10,
	done: function( passed ) {
		process.exit( passed ? 0 : 1 );
	}
}, {
	authUsername: "jqueryui",
	authToken: "89e495e7941cf9e40e6980d14a16bf023ccd4c91",
	jobName: "jQuery UI commit #c3499c27",
	runMax: 1,
	"runNames[]": ["Accordion", "Autocomplete"],
	"runUrls[]": [ myCode + "/tests/unit/accordion/accordion.html", myCode + "/tests/unit/autocomplete/autocomplete.html" ],
	"browserSets[]": ["popular"]
});
```

## Release History
* 0.2.0 Global timeout, check all uaRuns, proper URLs back to TestSwarm, some additional error handling
* 0.1.1 fix engine property in package.json
* 0.1.0 first release

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
