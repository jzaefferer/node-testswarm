var myCode = "http://localhost/jquery-ui-checkout";
require( "./testswarm" )( {
	url: "http://localhost/testswarm",
	pollInterval: 1000,
	timeout: 1000 * 60 * 1, // 1 minute
	done: function( passed ) {
		process.exit( passed ? 0 : 1 );
	}
}, {
	authUsername: "swarmuser",
	authToken: "yourauthtoken",
	jobName: "node-testswarm test job",
	runMax: 4,
	"runNames[]": ["Accordion", "Autocomplete"],
	"runUrls[]": [ myCode + "/tests/unit/accordion/accordion.html", myCode + "/tests/unit/autocomplete/autocomplete.html" ],
	"browserSets[]": ["popular"]
});
