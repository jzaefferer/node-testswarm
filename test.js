var testBase = "http://localhost/testswarm-ui-checkout/";
require( "./testswarm" )( {
	url: "http://localhost:82/testswarm/",
	pollInterval: 1000,
	timeout: 1000 * 10,
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
	// "runNames[]": ["Autocomplete"],
	// "runUrls[]": [ testBase + "tests/unit/autocomplete/autocomplete.html" ],
	browserSets: "popular"
});