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

  const { isVolunteer } = req.query;

  res.render('landingPage', {
    isLoginPage: false,
    isSeeker: (isVolunteer == undefined || isVolunteer == false)
  });
});

router.post('/signup', async function(req, res) {

  // Who is signing up?
  const { signup_type } = req.body;

  try {
    const user = await userController.signUp(req, res);
    // Hooray! Let them use the app now.
    res.render('dashboard', {
      user: user
    });
  } catch (error) {
    // Show the error message somewhere and let the user try again.

    console.log("Signup Error: " + error.code + " " + error.message);
    res.render('landingPage', {
      isLoginPage: false,
      isSeeker: (signup_type == "seeker"),
      error: error
    });
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