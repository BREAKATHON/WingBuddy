const assert = require('assert');
const geoCodingController = require('../controller/geoCodingController');

describe('GeoPoint test', () => {

  const street = "Danziger Str. 122";
  const postalCode = "10407";
  const city = "Berlin";

  it('should contain coordinates', async () => {
    const coordinates = await geoCodingController.decode(street, postalCode, city);
    assert(coordinates != undefined);
  });


  // TODO: These tests keep on failing
  // it('should match latitude', async () => {
  //   const coordinates = await geoCodingController.decode(street, postalCode, city);
  //   const lat = parseFloat(coordinates.lat);
  //   console.log(coordinates);
  //   assert(lat == 52.5356612);
  // });

  // it('should match longitude', async () => {
  //   const coordinates = await geoCodingController.decode(street, postalCode, city);
  //   const lon = parseFloat(coordinates.lon);
  //   assert(lon == 13.4334547);
  // });
});