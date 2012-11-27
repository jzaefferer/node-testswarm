var myTestPage = "http://localhost/jquery-core-checkout/test/",
	mySuites = ["attributes", "callbacks"];
require( "./testswarm" )( {
	url: "http://localhost/testswarm/",
	pollInterval: 1000,
	// 1 minute
	timeout: 1000 * 60 * 1,
	done: function( passed ) {
		process.exit( passed ? 0 : 1 );
	}
}, {
	authUsername: "swarmuser",
	authToken: "yourauthtoken",
	jobName: "node-testswarm test job",
	runMax: 2,
	"runNames[]": mySuites,
	"runUrls[]": mySuites.map(function (suite) {
		return myTestPage + "?module=" + suite;
	}),
	"browserSets[]": ["example"]
});
