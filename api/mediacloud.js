var secretKey = require ('../authentication/mediacloud').SECRETKEY;
var querystringUtils = require('querystring');
var request = require('superagent');
var superagentJsonapify = require('superagent');
// superagentJsonapify(request);
//https://api.mediacloud.org/api/v2/stories_public/list?last_processed_stories_id=8625915


/*
start = 0
rows  = 100
while True:
      params = { 'last_processed_stories_id': start,
      'rows': rows, 'q': 'media_set_id:1', 'fq': 'publish_date:[2010-10-01T00:00:00Z TO 2010-11-01T00:00:00Z]', 'key': MY_KEY  }

      print "Fetching {} stories starting from {}".format( rows, start)
      r = requests.get( 'https://api.mediacloud.org/api/v2/stories_public/list/', params = params, headers = { 'Accept': 'application/json'} )
      stories = r.json()

      if len(stories) == 0:
         break

      start = stories[ -1 ][ 'processed_stories_id' ]

      process_stories( stories )
*/

var count = 0;


function loopThroughApiCall (start, rows, q, fq, results, callback) {

  var params = {'last_processed_stories_id': start, rows: rows, q: q, fq: fq, key: secretKey };

  var queryString = querystringUtils.stringify(params);

  var url = 'https://api.mediacloud.org/api/v2/stories_public/list/?' + queryString;
  
  request
    .get(url)
    .set('Content-Type', 'application/json')
    .end(function(err, res){
      // Calling the end function will send the request
      // console.log(res);
      if (err) {
        console.log(err);
      }
      count++;
      if (res.body.length > 0 && count < 3) {
        var last_id = res.body[res.body.length - 1].processed_stories_id;
        const newResults = results.concat(res.body);
        loopThroughApiCall(last_id, rows, q, fq, newResults, callback);
      } else {
        callback(results);
      }
      // console.log(res.body);
      // console.log(err);
    });



}

module.exports.testStory = function() {
  var q = 'media_sets_id:1 AND title:obama';
  var fq = '';
  var callbackFunc = function(results) {
    console.log(results);
  }
  loopThroughApiCall(0,5,q,fq,[],callbackFunc);
};


module.exports.getStories = function(q, fq, callback) {
  loopThroughApiCall(0,10,q,fq,[],callback);
};
