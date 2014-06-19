module.exports = {
	cli: function( testswarm ) {
		testswarm.on( "log", console.log.bind( console ) );

		//testswarm.on( "verbose", console.log.bind( console ) );

		testswarm.on( "addjob-poll", function() {
			process.stdout.write( "." );
		} );

		testswarm.on( "addjob-ready", function( err, passed, results ) {
			var name, result, uaID;
			// Line break to return from the dot-writes
			process.stdout.write( "\n" );

			console.log( "State: " + ( err || "Finished" ));
			if ( results ) {
				console.log( "Results: " );
				for ( name in results ) {
					console.log( "\t* " + name );
					result = results[name];
					for ( uaID in result ) {
						console.log( "\t  " + uaID + ": " + result[uaID] );
					}
				}
			}
		} );
	},

  junit: function (testswarm) {
    // same as the CLI reporter, but also writes a file TEST-javascript.xml in the junit format

    testswarm.on("log", console.log.bind(console));

    //testswarm.on( "verbose", console.log.bind( console ) );

    testswarm.on("addjob-poll", function () {
      process.stdout.write(".");
    });

    testswarm.on("addjob-ready", function (err, passed, results) {
      var name, result, uaID;
      var count_all = 0, count_fail = 0;
      var body = '';

      // Line break to return from the dot-writes
      process.stdout.write("\n");

      console.log("State: " + ( err || "Finished" ));
      if (results) {
        console.log("Results: ");
        for (name in results) {
          console.log("\t* " + name);
          result = results[name];
          for (uaID in result) {
            console.log("\t  " + uaID + ": " + result[uaID]);

            // JUNIT!!
            count_all += 1;
            body += '<testcase classname="javascript.TestSwarm" name="' + name + ' - '
              + uaID + '" time="0">';
            if (result[uaID].indexOf('passed') != 0) {
              count_fail += 1;
              body += '<failure />';
            }
            body += '<system-out>' + result[uaID] + '</system-out>' + '</testcase>\n';
          }
        }
      }
      var report = '<?xml version="1.0" ?>\n';
      report += '<testsuite errors="0" failures="' + count_fail + '" name="javascript.TestSwarm" tests="'
        + count_all + '" time="0">\n';
      report += body;
      report += '</testsuite>';

      // write out the xml
      var fs = require("fs");
      fs.writeFileSync('TEST-javascript.xml', report, 'utf-8');
    });
  }
};
