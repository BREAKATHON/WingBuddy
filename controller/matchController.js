var Parse = require('parse/node').Parse;
var parseAppId = process.env.PARSE_APP_ID;
Parse.initialize(parseAppId);
Parse.serverURL = process.env.SERVER_URL;

const matchController = {
  findMatches: async function (event, seeker, limit = 3, radius_km) {

    if (event == undefined) {
      throw ({ code: 400, message: "No event provided" });
    }

    if (seeker == undefined) {
      throw ({ code: 400, message: "No seeker provided" });
    }

    const event_type = event.get("event_type");
    if (event_type == undefined) {
      throw ({ code: 400, message: "No event type provided" });
    }

    const seeker_location = seeker.get("location");
    if (event_type == undefined) {
      throw ({ code: 400, message: "No event type provided" });
    }

    // Optional
    const special_needs = seeker.get("special_needs");

    // Construct query
    const query = new Parse.Query(Parse.User);
    query.include("volunteer");

    // Find volunteers where the array in event_types contains the event type.
    // query.equalTo("volunteer.event_types", event_type);

    if (special_needs != undefined) {
      // Find volunteers where the array in special_needs_skills contains all of the elements in the seeker array special_needs.
      // query.containsAll("volunteer.special_needs", special_needs);
    }

    // Only consider screened / vetted volunteers
    query.equalTo("volunteer.is_screened", true);

    // Find volunteers who are in close proximity to the seeker
    if (radius_km == undefined) {
      query.near("location", seeker_location);
    } else {
      const sorted = true;
      query.withinKilometers("location", seeker_location, radius_km, sorted);
    }

    query.limit(limit)

    return await query.find();
  }
}

module.exports = matchController;