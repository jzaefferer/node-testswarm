var myCode = "http://localhost/testswarm-ui-checkout/";
require( "./testswarm" )( {
	url: "http://localhost/testswarm/",
	pollInterval: 1000,
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
