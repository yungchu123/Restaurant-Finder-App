const fetch = require('node-fetch');

module.exports = async function getCoordinates(address) {
  
const formattedAddress = address.toString().replace(/\s/g, '%20').replace(/\+/g, '%2B');
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${process.env.GOOGLE_API_KEY}`;

try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return [location.lng, location.lat];
    } else {
      throw new Error(`Geocoding failed: ${data.status}`);
    }
  } catch (error) {
    console.error('Error in getCoordinates:', error);
    throw error;
  }
};