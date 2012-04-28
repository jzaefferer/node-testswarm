# testswarm

Nodejs module for interacting with TestSwarm

## Getting Started
Install the module with: `npm install testswarm`

```javascript
var testswarm = require('testswarm');
var testBase = "http://localhost/testswarm-ui-checkout/";
testswarm( {
	url: "http://localhost:82/testswarm/api.php?",
	pollInterval: 1000,
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
* 0.1.0 first release

## License
Copyright (c) 2012 Jörn Zaefferer
Licensed under the MIT license.
