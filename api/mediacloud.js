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

module.exports.getGraphData = function(title, callback) {

  var q = 'sentence:' + title + ' AND tags_id_media:8875027';
  var split = 'true';
  var split_start_date = '2015-09-01';
  var split_end_date = '2016-03-01';

  var params = {
    q: q,
    fq: null,
    split: split,
    split_start_date: split_start_date,
    split_end_date: split_end_date,
    key: secretKey
  };

  var queryString = querystringUtils.stringify(params);

  var url = 'https://api.mediacloud.org/api/v2/sentences/count?' + queryString;

  request
    .get(url)
    .set('Content-Type', 'application/json')
    .end(function(err, res){

      if (err) {
        console.log(err);
      }
      callback(res.body);
    });
}


module.exports.getRelatedTerms = function(title, callback) {

  var q = 'sentence:' + title + ' AND tags_id_media:8875027';

  var params = {
    q: q,
    fq: null,
    key: secretKey,
  num_words: 5
  };

  // https://api.mediacloud.org/api/v2/wc/list?q=obama+AND+media_id:1

  var queryString = querystringUtils.stringify(params);

  var url = 'https://api.mediacloud.org/api/v2/wc/list?' + queryString;

  request
    .get(url)
    .set('Content-Type', 'application/json')
    .end(function(err, res){

      if (err) {
        console.log(err);
      }
      callback(res.body);
    });
}

function loopThroughApiCall (start, rows, count, q, fq, results, callback) {

  var params = {'last_processed_stories_id': start, rows: rows, q: q, fq: fq, key: secretKey };

  var queryString = querystringUtils.stringify(params);

  var url = 'https://api.mediacloud.org/api/v2/stories_public/list/?' + queryString;

  console.log(params);
  console.log(url);

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
      if (res.body.length > 0 && count < 2) {
        var last_id = res.body[res.body.length - 1].processed_stories_id;
        const newResults = results.concat(res.body);
        loopThroughApiCall(last_id, rows, count, q, fq, newResults, callback);
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
  loopThroughApiCall(0,5,0,q,fq,[],callbackFunc);
};


module.exports.getStories = function(q, fq, callback) {
  loopThroughApiCall(0,30,0,q,fq,[],callback);
};
