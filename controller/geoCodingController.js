
const got = require('got');
const urlencode = require('urlencode');

const geoCodingController = {
  decode: async function (street, postal_code, city) {

    if (street == undefined) {
      throw "Street must be defined";
    }

    if (postal_code == undefined) {
      throw "Postal code must be defined";
    }

    if (city == undefined) {
      throw "City must be defined";
    }

    const accessToken = process.env.LOCATION_IQ_ACCESS_TOKEN;
    const address = urlencode(street + " " + postal_code + " " + city);
    const url = "https://us1.locationiq.com/v1/search.php?key=" + accessToken + "&q=" + address + "&format=json"

    try {
      const response = await got(url);
      
      const geo = JSON.parse(response.body)
      console.log(geo);

      const first = geo[0];
      const { lat, lon } = first;

      return {
        lat: lat,
        lon: lon
      }
    } catch (error) {
      console.log(error.response.body);
      return error
    }
  }
}

module.exports = geoCodingController;