# Release History

## 1.1.2 / 2020-06-10

* Fix invalid addjob() requests that regressed in v1.1.1. (Michał Gołębiowski-Owczarek)

## 1.1.1 / 2020-06-06

* Change 'request' dependency from 2.12.0 to 2.88.0. (Michał Gołębiowski-Owczarek)
* Write API docs in the README. (Jörn Zaefferer)

## 1.1.0 / 2013-05-14

* Change authentication request to use `authID` instead of `authUsername`
  to accomodate changes in upstream TestSwarm 1.0.0-alpha. (Timo Tijhof)

## 1.0.3 / 2013-04-30

* Fix the timeout error to display the timeout instead of undefined. (Daniel Herman)

## 1.0.1 / 2013-03-17

* (issue #9) Always invoke the addjob callback with a boolean "passed" value. (Timo Tijhof)

## 1.0.0 / 2012-12-16

* Complete rewrite providing a new API, not backwards compatible. (Timo Tijhof)

## 0.3.0 / 2012-11-29

* Refactor logic, backwards compatible. (Jörn Zaefferer)
* Clean up output.

## 0.2.3 / 2012-06-16

* Add try-catch around JSON.parse call, in case server returns invalid JSON.

## 0.2.2 / 2012-05-02

* Simplify results output (again).
* Don't care about trailing slash in URL.

## 0.2.1 / 2012-05-01

* browserSets parameter is now an array.
* Made timed out runs result in failure.
* Support for all failure types othan than "failed" ("error", "timedout", ..).
* Simplify results output.

## 0.2.0 / 2012-04-30

* Global timeout.
* Check all uaRuns.
* Proper URLs back to TestSwarm.
* Some additional error handling.

## 0.1.1 / 2012-xx-xx

* Fix engine property in package.json.

## 0.1.0 / 2012-xx-xx

* Initial release.
