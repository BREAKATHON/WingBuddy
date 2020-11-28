/*jshint esversion: 6 */

/*
██████   ██████  ██    ██ ████████ ███████ ██████
██   ██ ██    ██ ██    ██    ██    ██      ██   ██
██████  ██    ██ ██    ██    ██    █████   ██████
██   ██ ██    ██ ██    ██    ██    ██      ██   ██
██   ██  ██████   ██████     ██    ███████ ██   ██
*/

const express = require('express');
const router = express.Router();
const path = require('path');

const userController = require('../controller/userController');

// Parse Server plays nicely with the rest of your web routes
router.get('/', function(req, res) {
  res.render('landingPage');
});

router.get('/login', function(req, res) {
  res.render('landingPage', {
    isLoginPage: true
  });
});

router.get('/signup', function(req, res) {
  res.render('landingPage', {
    isLoginPage: false
  });
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
router.get('/test-static', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

router.post('/signup', async function(req, res) {
  try {
    const user = await userController.signUp(req, res);
    // Hooray! Let them use the app now.
    res.render('dashboard', {
      user: user
    });
    return;
  } catch (error) {
    // Show the error message somewhere and let the user try again.
    console.log("Signup Error: " + error.code + " " + error.message);
    res.render('landingPage', {
      error: error
    });
    return;
  }
});

router.post('/login', async function(req, res) {
  try {
    const user = await userController.logIn(req, res);
    // Hooray! Let them use the app now.
    res.render('dashboard', {
      user: user
    });
    return;
  } catch (error) {
    // Show the error message somewhere and let the user try again.
    console.log("Login Error: " + error.code + " " + error.message);
    res.render('landingPage', {
      error: error
    });
    return;
  }
});


module.exports = router;