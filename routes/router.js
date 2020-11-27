/*jshint esversion: 6 */

/*
██████   ██████  ██    ██ ████████ ███████ ██████
██   ██ ██    ██ ██    ██    ██    ██      ██   ██
██████  ██    ██ ██    ██    ██    █████   ██████
██   ██ ██    ██ ██    ██    ██    ██      ██   ██
██   ██  ██████   ██████     ██    ███████ ██   ██
*/

var express = require('express');
var router = express.Router();
const path = require('path');

// Parse Server plays nicely with the rest of your web routes
router.get('/', function(req, res) {
  res.status(200).send('WingBuddy');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
router.get('/test-static', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

router.get('/test-pug', function(req, res) {
  res.render('test', {
    value: "Hello World!"
  });
});

module.exports = router;