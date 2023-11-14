const asyncHandler = require('express-async-handler')
const Restaurant = require('../models/restaurantModel')
const getCoordinates = require('../utils/getCoordinates')

// @desc Get nearby restaurants within radius of an address/postal code and sort by distance or ratings
// @route GET /restaurants2/nearby
// @access Public
const getNearbyRestaurants = asyncHandler(async (req, res) => {
    const address = req.query.address;
    const sort = req.query.sort;
    const [longitude, latitude] = await getCoordinates(address);
    
    let sortCriteria = {};
    if(sort === 'rating'){
      sortCriteria = {rating: -1};
    } else if(sort === 'distance'){} // mongoDB automatically sorts by distance when using nearSphere
    const nearbyRestaurants = await Restaurant.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance:1000
        }
      }
    }).sort(sortCriteria).limit(20);
  
    if (!nearbyRestaurants?.length) {
      return res.status(200).json({ message: 'No restaurants found' });
    }
  
    res.json(nearbyRestaurants);
});

module.exports = {
    getNearbyRestaurants
}