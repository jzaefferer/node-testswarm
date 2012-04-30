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

function logResults( config, job, state ) {
	var passed = true;
	console.log( "Job " + job.jobInfo.id + ":\n\t" + job.jobInfo.name + "\nState: " + state );
	console.log( "\nResults: " );
	job.runs.filter(function( run ) {
		var uaID;
		console.log( "\n - " + run.info.name + ":\n", run.uaRuns );
		for ( uaID in run.uaRuns ) {
			// "new", "failed", "error", "timedout", ..
			if ( run.uaRuns[uaID].runStatus !== "passed" ) {
				passed = false;
			}
		}
	});
	config.done( passed );
}

function pollResults( config, job ) {
	process.stdout.write( "." );
	request.get( config.url + "/api.php?" + querystring({
		action: "job",
		item: job.id
	}), function ( error, response, body ) {
		if ( error ) {
			throw error;
		}
		var result = JSON.parse( body );
		if ( !result.job ) {
			console.log( "API returned error, can't continue. Response was: " + body );
			config.done( false );
			return;
		}
		if ( continueRunning( result.job ) ) {
			if ( config.started + config.timeout < +new Date() ) {
				process.stdout.write( "\n\n" );
				logResults( config, result.job, "Timed out after " + config.timeout + 'ms' );
			}
			setTimeout(function () {
				pollResults( config, job );
			}, config.pollInterval );
		} else {
			process.stdout.write( "\n\n" );
			logResults( config, result.job, "Finished" );
		}
	});
}

module.exports = function ( config, addjobParams ) {
	config = extend({
		// default config
		//url: {String} required, no default
		//done: {Function} required, no default
		pollInterval: 5000,
		timeout: 1000 * 60 * 15, // 15 minutes
		started: +new Date(),
		urlParts: urlparse( config.url )
	}, config);
	addjobParams = extend(addjobParams, {
		action: "addjob"
	});
	request.post( config.url + "/api.php?" + querystring( addjobParams ), function ( error, response, body ) {
		var result, jobInfo;
		if ( error ) {
			throw error;
		}
		result = JSON.parse( body );
		if ( !result.addjob ) {
			console.log( "API returned error, can't continue. Response was: " + body );
			config.done( false );
			return;
		}
		jobInfo = result.addjob;
		console.log( "Submited job " + jobInfo.id + " " + config.url + "/job/" + jobInfo.id );
		process.stdout.write( "Polling for results" );
		pollResults( config, jobInfo );
	});

};
