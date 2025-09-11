const axios = require('axios');
require('dotenv').config();

async function getDistance(origin, destination) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: origin,
        destinations: destination,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (
      response.data.rows[0] &&
      response.data.rows[0].elements[0] &&
      response.data.rows[0].elements[0].status === 'OK'
    ) {
      const distance = response.data.rows[0].elements[0].distance.text;
      return distance;
    } else {
      throw new Error('Invalid response from Google Maps API');
    }
  } catch (error) {
    console.error('Error fetching distance from Google Maps API:', error.message);
    return null;
  }
}

module.exports = getDistance;
