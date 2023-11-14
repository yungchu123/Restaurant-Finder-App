import RestaurantCard from "../components/RestaurantCard";
import { useContext, useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { MyContext } from '../App';
import axios from 'axios';

const FavouriteRestaurantPage = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const {user} = useContext(MyContext)

    useEffect(() => {
        // Pull a list of favourite restaurants from the backend
        const fetchData = async () => {
            try {
                // Fetch a list of restaurant Ids in favourite list
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/favorites`);
                const restaurantsId = response.data;
                
                // Fetch all the restaurants from a list of restaurant Ids
                const listOfRestaurantsPromises = restaurantsId.map(async (restaurantId) => {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${restaurantId}`);
                    return response.data; 
                });
                
                Promise.all(listOfRestaurantsPromises)
                  .then(listOfRestaurants => {
                    // Now listOfRestaurants contains the resolved values of all promises
                    console.log('List of Restaurants:', listOfRestaurants)
                    setRestaurants(listOfRestaurants)
                    setLoading(false)
                  })
                  .catch(error => {
                    console.error('Error fetching restaurants:', error);
                    setLoading(false)
                  });
            } catch (error) {
                console.log(`Error: ${error}`);
            }
        };
    
        // Call the async function
        setLoading(true)
        setRestaurants([])
        fetchData();
    }, [user._id]);

    return (
        <div class="container">
            <h2 style={{marginTop: "30px"}}> Favourite Restaurants</h2>
            <br/>
            <div class="row">
            {loading && <h3>Loading...</h3>}
            <div className="row row-cols-4 row-gap-4 mb-4">
                        {restaurants.map(restaurant => (
                            <div className="col">
                                <NavLink to={`../restaurant/${restaurant.restaurantId}`}> 
                                <RestaurantCard 
                                    name={restaurant.restaurantName}
                                    cuisine={restaurant.cuisine}
                                    rating={restaurant.rating} 
                                    numReviews={restaurant.numReviews} 
                                    imgUrl={restaurant.imageData}
                                    />
                                </NavLink>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    )
}

export default FavouriteRestaurantPage