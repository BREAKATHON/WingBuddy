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
const geoCodingController = require('../controller/geoCodingController');

// Parse Server plays nicely with the rest of your web routes
router.get('/', function (req, res) {
  res.render('landingPage');
});

router.get('/login', function (req, res) {
  res.render('landingPage', {
    isLoginPage: true
  });
});

router.get('/geo', async function (req, res) {

  const street = "Danziger Str. 122";
  const postalCode = "10407";
  const city = "Berlin";

  try {
    const coordinates = await geoCodingController.decode(street, postalCode, city);
    res.status(200).send("Lat: " + coordinates.lat + " lon: " + coordinates.lon);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

router.get('/signup', function (req, res) {

  const { isVolunteer } = req.query;

  res.render('landingPage', {
    isLoginPage: false,
    isSeeker: (isVolunteer == undefined || isVolunteer == false)
  });
});

router.post('/signup', async function (req, res) {

  // Who is signing up?
  const { signup_type } = req.body;

  try {
    const user = await userController.signUp(req);
    // Hooray! Let them use the app now.
    res.render('dashboard', {
      user: user
    });
  } catch (error) {
    // Show the error message somewhere and let the user try again.
    console.log("Signup Error (" + error.code + "): " + error.message);
    res.render('landingPage', {
      isLoginPage: false,
      isSeeker: (signup_type == "seeker"),
      error: error
    });
  }
});

router.post('/login', async function (req, res) {
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