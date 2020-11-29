var Parse = require('./Parse')

const geoCodingController = require('./geoCodingController');

const userController = {
  signUp: async function (req) {

    const { email, password_1, password_2, signup_type, name, street, postal_code, city } = req.body;

    if (email == undefined) {
      throw ({ code: 400, message: "No email set" });
    }

    if (password_1 == undefined || password_2 == undefined) {
      throw ({ code: 400, message: "No password set" });
    }

    if (password_1 != password_2) {
      throw ({ code: 400, message: "Passwords don't match" });
    }

    if (name == undefined) {
      throw ({ code: 400, message: "No name found" });
    }

    if (street == undefined) {
      throw ({ code: 400, message: "No street found" });
    }

    if (postal_code == undefined) {
      throw ({ code: 400, message: "No postal code found" });
    }

    if (city == undefined) {
      throw ({ code: 400, message: "No city found" });
    }

    if (signup_type == undefined) {
      throw ({ code: 400, message: "No sign up type detected" });
    }

    const user = new Parse.User();
    user.set("username", email);
    user.set("password", password_1);
    user.set("email", email);
    user.set("name", name);

    const coordinates = await geoCodingController.decode(street, postal_code, city);
    const location = new Parse.GeoPoint({ latitude: parseFloat(coordinates.lat), longitude: parseFloat(coordinates.lon) });
    user.set("location", location);
    user.set("street", street);
    user.set("postal_code", postal_code);
    user.set("city", city);

    // Add additional fields based on sign up persona
    if (signup_type == "seeker") {
      // Seeker sign up

      const Seeker = Parse.Object.extend("Seeker")
      const seeker = new Seeker();

      // Seeker fields
      var special_needs = [];
      const { guide_vision_impaired } = req.body;
      if (guide_vision_impaired != undefined && guide_vision_impaired == 'on') {
        special_needs.push("guide_vision_impaired");
      }
      const { guide_blind } = req.body;
      if (guide_blind != undefined && guide_blind == 'on') {
        special_needs.push("guide_blind");
      }
      const { psychological_support } = req.body;
      if (psychological_support != undefined && psychological_support == 'on') {
        special_needs.push("psychological_support");
      }
      const { nursing } = req.body;
      if (nursing != undefined && nursing == 'on') {
        special_needs.push("nursing");
      }
      const { handle_wheelchair } = req.body;
      if (handle_wheelchair != undefined && handle_wheelchair == 'on') {
        special_needs.push("handle_wheelchair");
      }
      const { sign_language } = req.body;
      if (sign_language != undefined && sign_language == 'on') {
        special_needs.push("sign_language");
      }
      const { trauma_awareness } = req.body;
      if (trauma_awareness != undefined && trauma_awareness == 'on') {
        special_needs.push("trauma_awareness");
      }
      const { neurodiversity_awareness } = req.body;
      if (neurodiversity_awareness != undefined && neurodiversity_awareness == 'on') {
        special_needs.push("neurodiversity_awareness");
      }
      const { intellectual_disability_awereness } = req.body;
      if (intellectual_disability_awereness != undefined && intellectual_disability_awereness == 'on') {
        special_needs.push("intellectual_disability_awereness");
      }
      const { speech_with_gestures } = req.body;
      if (speech_with_gestures != undefined && speech_with_gestures == 'on') {
        special_needs.push("speech_with_gestures");
      }
      const { LGBTQIAplus_awareness } = req.body;
      if (LGBTQIAplus_awareness != undefined && LGBTQIAplus_awareness == 'on') {
        special_needs.push("LGBTQIAplus_awareness");
      }

      seeker.set("special_needs", special_needs);

      await seeker.save();

      user.set("seeker", seeker);
    } else {
      // Volunteer sign up
      const Volunteer = Parse.Object.extend("Volunteer")
      const volunteer = new Volunteer();

      // Volunteer fields
      const { telephone, description } = req.body;

      var special_needs_skills = [];
      const { guide_vision_impaired } = req.body;
      if (guide_vision_impaired != undefined && guide_vision_impaired == 'on') {
        special_needs_skills.push("guide_vision_impaired");
      }
      const { guide_blind } = req.body;
      if (guide_blind != undefined && guide_blind == 'on') {
        special_needs_skills.push("guide_blind");
      }
      const { psychological_support } = req.body;
      if (psychological_support != undefined && psychological_support == 'on') {
        special_needs_skills.push("psychological_support");
      }
      const { nursing } = req.body;
      if (nursing != undefined && nursing == 'on') {
        special_needs_skills.push("nursing");
      }
      const { handle_wheelchair } = req.body;
      if (handle_wheelchair != undefined && handle_wheelchair == 'on') {
        special_needs_skills.push("handle_wheelchair");
      }
      const { sign_language } = req.body;
      if (sign_language != undefined && sign_language == 'on') {
        special_needs_skills.push("sign_language");
      }
      const { trauma_awareness } = req.body;
      if (trauma_awareness != undefined && trauma_awareness == 'on') {
        special_needs_skills.push("trauma_awareness");
      }
      const { neurodiversity_awareness } = req.body;
      if (neurodiversity_awareness != undefined && neurodiversity_awareness == 'on') {
        special_needs_skills.push("neurodiversity_awareness");
      }
      const { intellectual_disability_awereness } = req.body;
      if (intellectual_disability_awereness != undefined && intellectual_disability_awereness == 'on') {
        special_needs_skills.push("intellectual_disability_awereness");
      }
      const { speech_with_gestures } = req.body;
      if (speech_with_gestures != undefined && speech_with_gestures == 'on') {
        special_needs_skills.push("speech_with_gestures");
      }
      const { LGBTQIAplus_awareness } = req.body;
      if (LGBTQIAplus_awareness != undefined && LGBTQIAplus_awareness == 'on') {
        special_needs_skills.push("LGBTQIAplus_awareness");
      }

      var event_types = [];
      const { Theater_Kunst } = req.body;
      if (Theater_Kunst != undefined && Theater_Kunst == 'on') {
        event_types.push("Theater_Kunst");
      }
      const { Ausflüge_Cafe } = req.body;
      if (Ausflüge_Cafe != undefined && Ausflüge_Cafe == 'on') {
        event_types.push("Ausflüge_Cafe");
      }
      const { Sport_Action } = req.body;
      if (Sport_Action != undefined && Sport_Action == 'on') {
        event_types.push("Sport_Action");
      }
      const { Konzerte_Festivals } = req.body;
      if (Konzerte_Festivals != undefined && Konzerte_Festivals == 'on') {
        event_types.push("Konzerte_Festivals");
      }
      const { Natur_Sightseeing } = req.body;
      if (Natur_Sightseeing != undefined && Natur_Sightseeing == 'on') {
        event_types.push("Natur_Sightseeing");
      }
      const { Andere } = req.body;
      if (Andere != undefined && Andere == 'on') {
        event_types.push("Andere");
      }

      volunteer.set("special_needs_skills", special_needs_skills);
      volunteer.set("event_types", event_types);
      volunteer.set("telephone", telephone);
      volunteer.set("description", description);

      await volunteer.save();

      user.set("volunteer", volunteer);
    }

    return await user.signUp();
  },
  logIn: async function (req, res) {

    const { username, password } = req.body;

    if (username == undefined) {
      throw ({ code: 400, message: "No username set" });
    }

    if (password == undefined) {
      throw ({ code: 400, message: "No password set" });
    }

    return await Parse.User.logIn(username, password);
  },
  logOut: async function (req, res) {
    await Parse.User.logOut();
  }
}

module.exports = userController;