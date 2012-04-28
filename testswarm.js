var request = require( "request" ),
	querystring = require( "querystring" ).stringify;

function extend( a, b ) {
	for (var key in b) {
		a[key] = b[key];
	}
	return a;
}

function continueRunning( job ) {
	return job.runs.filter(function( run ) {
		// TODO test all UAs
		return (/new|progress/).test( run.uaRuns.Chrome.runStatus );
	}).length;
}

function runStats( run ) {
	if ( run.runStatus === "new" ) {
		return "";
	}
	return ", total: " + run.totalTests + ", failed: " + run.failedTests + ", errors: " + run.errors + ", results: http://localhost:82/" + run.runResultsUrl;
}

function logResults( config, job ) {
	// console.log( JSON.stringify( job, null, "  " ) );
	var passed = true;
	console.log("Finished job " + job.jobInfo.name + " (" + job.jobInfo.id + ")" );
	console.log("Results: ");
	job.runs.filter(function( run ) {
		var ua, uaRun;
		console.log( "  " + run.info.name + ": ");
		for (ua in run.uaRuns) {
			uaRun = run.uaRuns[ ua ];
			console.log( "    " + ua + ": " + uaRun.runStatus + runStats( uaRun ) );
			if (uaRun.runStatus === "failed") {
				passed = false;
			}
		}
	});
	config.done( passed );
}

function pollResults( config, job ) {
	console.log( "Polling job " + job.id );
	request.get( config.url + querystring({
		action: "job",
		item: job.id
	}), function( error, response, body ) {
		if ( error ) {
			throw error;
		}
		var result = JSON.parse( body );
		if (continueRunning( result.job ) ) {
			setTimeout(function() {
				pollResults( config, job );
			}, config.pollInterval );
		} else {
			logResults( config, result.job );
		}
	});
}

module.exports = function( config, jobs ) {
	config = extend({
		pollInterval: 5000
	}, config);
	jobs = extend({
		action: "addjob"
	}, jobs);
	request.post( config.url + querystring( jobs ), function( error, response, body ) {
		if ( error ) {
			throw error;
		}
		pollResults( config, JSON.parse( body ).addjob );
	});

};