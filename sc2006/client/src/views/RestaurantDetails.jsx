import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom'; // Import useLocation and useParams from react-router-dom
import RestaurantTables from "../components/Tables.jsx";

const RestaurantDetails = () => {
  const { restaurantId } = useParams(); // Get the restaurantId parameter from the URL
  const [fetchedRestaurant, setFetchedRestaurant] = useState(null);

  useEffect(() => {
    // Fetch restaurant data based on the restaurantId
    axios
      .get(`http://localhost:30005/api/restaurants/${restaurantId}`)
      .then((response) => {
        setFetchedRestaurant(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching restaurant details:", error);
      });
  }, [restaurantId, fetchedRestaurant]);
  
  return (
    <div className="container">
      {fetchedRestaurant ? (
        <>
          <h2 className="my-4">{fetchedRestaurant.name}</h2>
          <div>
            <p>Cuisine: {fetchedRestaurant.cuisine}</p>
            <p>
              Dietary Options: {fetchedRestaurant.dietaryOptions && fetchedRestaurant.dietaryOptions.length > 0
                ? fetchedRestaurant.dietaryOptions.join(", ")
                : "NIL"}
            </p>
            <p>Price Range: {fetchedRestaurant.priceRange}</p>
            <p>Address: {fetchedRestaurant.location}</p>
            <RestaurantTables restaurantId={fetchedRestaurant._id} />
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
};

export default RestaurantDetails; 