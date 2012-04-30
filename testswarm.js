var request = require( "request" ),
	querystring = require( "querystring" ).stringify,
	urlparse = require( "url" ).parse;

function extend( a, b ) {
	for (var key in b) {
		a[key] = b[key];
	}
	return a;
}

function continueRunning( job ) {
	return job.runs.filter(function( run ) {
		return Object.keys(run.uaRuns).filter(function( uaRun ) {
			return (/new|progress/).test( run.uaRuns[ uaRun ].runStatus );
		}).length;
	}).length;
}

function runStats( config, run ) {
	if ( run.runStatus === "new" ) {
		return "";
	}
	var runUrl = config.urlParts.protocol + "//" + config.urlParts.host + run.runResultsUrl;
	return ", total: " + run.totalTests + ", failed: " + run.failedTests + ", errors: " + run.errors + ", results: " + runUrl;
}

function logResults( config, job, state ) {
	var passed = true;
	console.log( state + " job " + job.jobInfo.name + " (" + job.jobInfo.id + ")" );
	console.log( "\nResults: " );
	job.runs.filter(function( run ) {
		var ua, uaRun;
		console.log( "  " + run.info.name + ": ");
		for ( ua in run.uaRuns ) {
			uaRun = run.uaRuns[ ua ];
			console.log( "    " + ua + ": " + uaRun.runStatus + runStats( config, uaRun ) );
			if ( uaRun.runStatus === "failed" ) {
				passed = false;
			}
		}
	});
	config.done( passed );
}

function pollResults( config, job ) {
	process.stdout.write( "." );
	request.get( config.url + "api.php?" + querystring({
		action: "job",
		item: job.id
	}), function( error, response, body ) {
		if ( error ) {
			throw error;
		}
		var result = JSON.parse( body );
		if ( !result.job ) {
			console.log( "Response didn't include a job property, can't continue. Response was: " + body );
			config.done( false );
			return;
		}
		if (continueRunning( result.job ) ) {
			if ( config.started + config.timeout < +new Date() ) {
				process.stdout.write( "\n\n" );
				logResults( config, result.job, "Timed out" );
			}
			setTimeout(function() {
				pollResults( config, job );
			}, config.pollInterval );
		} else {
			process.stdout.write( "\n\n" );
			logResults( config, result.job, "Finished" );
		}
	});
}

module.exports = function( config, jobs ) {
	config = extend({
		pollInterval: 5000,
		// give up after 15 minutes
		timeout: 1000 * 60 * 15,
		started: +new Date(),
		urlParts: urlparse( config.url )
	}, config);
	jobs = extend({
		action: "addjob"
	}, jobs);
	request.post( config.url + "api.php?" + querystring( jobs ), function( error, response, body ) {
		if ( error ) {
			throw error;
		}
		var job = JSON.parse( body ).addjob;
		console.log( "Submited job " + job.id + " " + config.url + "job/" + job.id );
		process.stdout.write( "Polling for results" );
		pollResults( config, job );
	});

};