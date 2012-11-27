var request = require( "request" ),
	querystring = require( "querystring" ).stringify,
	url = require( "url" );

function extend( a, b ) {
	for (var key in b) {
		a[key] = b[key];
	}
	return a;
}

function swarmUrl( config ) {
	// Normalise to no trailing slash
	return url.format( config.urlParts ).replace( /\/$/, "" );
}

function swarmServer( config ) {
	var obj = extend( {}, config.urlParts );
	obj.href = obj.pathname = obj.search = obj.path = obj.query = obj.hash = undefined;
	// Normalise to no trailing slash
	return url.format( obj ).replace( /\/$/, "" );
}

/** @return boolean */
function isJobDone( job ) {
	return !job.runs.filter(function( run ) {
		return Object.keys(run.uaRuns).filter(function( uaRun ) {
			return (/new|progress/).test( run.uaRuns[ uaRun ].runStatus );
		}).length;
	}).length;
}

function runStats( uaID, uaRun, config ) {
	var msg = uaID + ": " + uaRun.runStatus;
	if ( uaRun.runResultsUrl ) {
		msg +=  " (" + uaRun.runResultsLabel + "). " + swarmServer( config ) + uaRun.runResultsUrl;
	}
	return msg;
}

function logResults( config, job, state ) {
	var passed;

	// Line break to return from the dot-writes
	process.stdout.write( "\n" );

	console.log( "Job " + job.jobInfo.id + ":\n\t" + job.jobInfo.name + "\nState:\n\t" + state );
	console.log( "Results: " );

	passed = true;
	job.runs.filter(function( run ) {
		var uaID;
		console.log( "\t* " + run.info.name );
		for ( uaID in run.uaRuns ) {
			console.log( "\t  " + runStats( uaID, run.uaRuns[uaID], config ) );
			// "new", "failed", "error", "timedout", ..
			if ( run.uaRuns[uaID].runStatus !== "passed" ) {
				passed = false;
			}
		}
	});
	config.done( passed );
}

function logError( msg ) {
	// Line break to return from the dot-writes
	console.log( "\nError:\n\t" + msg );
}

function pollResults( config, job ) {
	process.stdout.write( "." );
	request.get( swarmUrl( config ) + "/api.php?" + querystring({
		action: "job",
		item: job.id
	}), function ( error, response, body ) {
		if ( error ) {
			throw error;
		}
		var result = JSON.parse( body );
		if ( !result.job ) {
			logError( "API returned error, can't continue. Response was: " + body );
			config.done( false );
			return;
		}
		if ( !isJobDone( result.job ) ) {
			if ( config.started + config.timeout < +new Date() ) {
				logResults( config, result.job, "Timed out after " + config.timeout + 'ms' );
			}
			setTimeout(function () {
				pollResults( config, job );
			}, config.pollInterval );
		} else {
			logResults( config, result.job, "Finished" );
		}
	});
}

module.exports = function ( config, addjobParams ) {
	config = extend({
		// default config
		// url: {String} required, no default
		// done: {Function} required, no default
		pollInterval: 5000,
		// 15 minutes
		timeout: 1000 * 60 * 15,
		started: +new Date(),
		urlParts: url.parse( config.url )
	}, config);
	addjobParams = extend(addjobParams, {
		action: "addjob"
	});
	request.post({
		url: swarmUrl( config ) + "/api.php",
		form: addjobParams
	}, function ( error, response, body ) {
		var result, jobInfo;
		if ( error ) {
			throw error;
		}
		try {
			result = JSON.parse( body );
		} catch( e ) {
			console.log( "Failed parsing body as json, was: " + body );
			config.done( false );
		}
		if ( !result.addjob ) {
			console.log( "API returned error, can't continue. Response was: " + body );
			config.done( false );
			return;
		}
		jobInfo = result.addjob;
		console.log( "Submitted job " + jobInfo.id + " " + swarmUrl( config ) + "/job/" + jobInfo.id );
		process.stdout.write( "Polling for results" );
		pollResults( config, jobInfo );
	});

};
