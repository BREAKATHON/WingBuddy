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

var Parse = require('../controller/Parse')

const userController = require('../controller/userController');
const matchController = require('../controller/matchController');

/*
 
  d888b  d88888b d888888b 
 88' Y8b 88'     `~~88~~' 
 88      88ooooo    88    
 88  ooo 88~~~~~    88    
 88. ~8~ 88.        88    
  Y888P  Y88888P    YP    
                          
                          
 
*/

router.get('/', function (req, res) {
  const isVolunteerString = req.query.isVolunteer;
  const isVolunteer = (isVolunteerString == 'true')

  res.render('landingPage', {
    isLoginPage: false,
    isSeeker: !isVolunteer
  });
});

router.get('/matching', function (req, res) {
  res.render('matchingCards');
});

router.get('/matchingCards', function (req, res) {
  res.render('matchingCards');
});

router.get('/events', function (req, res) {
  res.render('eventForm');
});

router.get('/dashboard', function (req, res) {

  const user = Parse.User.current();
  if (user == undefined) {
    // User not logged, in, redirect to login
    res.redirect('/login');
    return;
  }

  res.render('dashboard', {
    user: user
  });
});

router.get('/login', function (req, res) {
  res.render('landingPage', {
    isLoginPage: true
  });
});

router.get('/matchTest', async function (req, res) {
  
  // Dummy Seeker
  const Seeker = Parse.Object.extend("Seeker");
  const seeker = new Seeker();

  const location = new Parse.GeoPoint({latitude: 52.5356612, longitude: 13.4334547});
  seeker.set("location", location);

  // optional: special needs
  seeker.set("special_needs", ["special"]);

  // Dummy Event
  const Event = Parse.Object.extend("Event");
  const event = new Event();

  event.set("event_type", "concert");
  
  // Query
  try {
    const matchedUsers = await matchController.findMatches(event, seeker);

    var responseString = "Found " + matchedUsers.length + " matches.\n";
    var i;
    for (i = 0; i < matchedUsers.length; i++) {
      const user = matchedUsers[i];
      const volunteerData = user.get("volunteer");
      responseString += "Match #" + (i + 1) + ":\n";
      responseString += "\tName: " + user.get("name");
      responseString += "\tCity: " + user.get("city");
      responseString += "\tTelephone: " + volunteerData.get("telephone");
    } 

    res.status(200).send(responseString);
  } catch(error) {
    console.error(error);
    res.status(error.code).send(error.message);
  }
});

/*
 
 d8888b.  .d88b.  .d8888. d888888b 
 88  `8D .8P  Y8. 88'  YP `~~88~~' 
 88oodD' 88    88 `8bo.      88    
 88~~~   88    88   `Y8b.    88    
 88      `8b  d8' db   8D    88    
 88       `Y88P'  `8888Y'    YP    
                                   
                                   
 
*/

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

router.post('/eventBuddyRequest', async function (req, res) {

  const { event_type } = req.body;
  if (event_type == undefined) {
    res.status(500).send("No event_type set");
    return;
  }

  const user = Parse.User.current();
  if (user == undefined) {
    res.status(500).send("No user found");
    return;
  }

  // Dummy Event
  const Event = Parse.Object.extend("Event");
  const event = new Event();

  event.set("event_type", event_type);
  
  // Query
  try {
    // Fetch current user data
    await user.fetch();

    // Find matched users using current user (seeker) and event data
    const matchedUsers = await matchController.findMatches(event, user);

    // var responseString = "Found " + matchedUsers.length + " matches.\n";
    var i;
    // for (i = 0; i < matchedUsers.length; i++) {
    //   const user = matchedUsers[i];
    //   const volunteerData = user.get("volunteer");
    //   responseString += "Match #" + (i + 1) + ":\n";
    //   responseString += "\tName: " + user.get("name");
    //   responseString += "\tCity: " + user.get("city");
    //   responseString += "\tTelephone: " + volunteerData.get("telephone");
    // } 
    // console.log(responseString);

    var imageUrls = [
      "public/images/match1.jpg",
      "public/images/match2.jpg",
      "public/images/match3.jpg",
      "public/images/match4.jpg",
    ]
    var matchData = [];
    for (i = 0; i < matchedUsers.length; i++) {
      const user = matchedUsers[i];
      const volunteer = user.get("volunteer");
      if (user == undefined) {
        continue;
      }
      if (volunteer == undefined) {
        continue;
      }
      const imageUrl = imageUrls[i % (imageUrls.length - 1)];

      const data = {
        name: user.get("name") || "No name",
        telephone: volunteer.get("telephone") || "No telephone number",
        description: volunteer.get("description") || "No description",
        special_needs_skills: volunteer.get("special_needs_skills") || "No special needs skills",
        city: user.get("city") || "No city",
        imageUrl: imageUrl
      }
      matchData.push(data);
    }

    res.render('matchingCards', {
      matchData: matchData
    });
  } catch(error) {
    console.error(error);
    res.status(error.code).send(error.message);
  }
});


module.exports = router;