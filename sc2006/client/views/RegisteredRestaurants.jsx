import React, { useState, useEffect } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";

const RegisteredRestaurants = ({ username, role }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Check if the user is authenticated and has the role of "restaurateur"
    if (role === "restaurateur") {
      // Fetch the restaurants registered by the manager
      axios
        .get(`http://localhost:30005/api/restaurants/registered/${username}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            const updatedRestaurants = response.data.map((restaurant) => ({
              ...restaurant,
              categories: [restaurant.cuisine, ...restaurant.dietaryOptions]
            }));
            setRestaurants(updatedRestaurants);
          } else {
            setRestaurants([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching restaurants:", error);
        });
    }
  }, [role, username]);

  return (
    <div className="container">
      <h1 className="my-4">Your Registered Restaurants</h1>
      {role === "restaurateur" ? (
        restaurants.length === 0 ? (
          <p>No restaurants registered yet.</p>
        ) : (
          <div className="row row-cols-4 row-gap-4 mb-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )
      ) : (
        <p>You are not authorized to view this page.</p>
      )}
    </div>
  );
};

export default RegisteredRestaurants;
