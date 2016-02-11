var express = require('express');
var app = express();
var mediacloudAPI = require('./api/mediacloud');
var bodyParser = require('body-parser');

/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded());


// Serve application file depending on environment
app.get('/app.js', function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/app.js');
  } else {
    res.redirect('//localhost:9090/build/app.js');
  }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', function(req, res) {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/style.css');
  } else {
    res.redirect('//localhost:9090/build/style.css');
  }
});

app.post('/testStories', function(req, res) {

  console.log(req.body);
  var q = 'media_sets_id:1 AND title:obama';
  var fq = '';
  var results = mediacloudAPI.getStories(fq, q, function(results) {
    console.log(results);
    res.json(results);
  });

});

app.post('/stories', function(req, res) {

  console.log(req.body);
  var q = req.body.q;
  var fq = req.body.fq;

  var results = mediacloudAPI.getStories(fq, q, function(results) {
    console.log(results);
    res.json(results);
  });

});


// Serve index page
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/build/index.html');
});

/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('./webpack.local.config');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: true,
    historyApiFallback: true
  }).listen(9090, 'localhost', function (err, result) {
    if (err) {
      console.log(err);
    }
  });
}


/******************
 *
 * Express server
 *
 *****************/

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Essential React listening at http://%s:%s', host, port);
});
