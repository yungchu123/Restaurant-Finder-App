import RestaurantCard from "../components/RestaurantCard"
import SearchBar from "../components/SearchBar"
import Sidebar from "../components/Sidebar"
import Sortbar from "../components/Sortbar"
import { useState, useEffect } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";

const RestaurantSearchPage = () => {
    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        // Pull a list of restaurants from backend
        (async () => {
            const limit = 20;
            axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants?limit=${limit}`)
            .then(response => {
                console.log('Restaurants:', response.data);
                setRestaurants(response.data)
            })
            .catch(error => {
                console.log(`Error: ${error}`)
            });
        })();
      }, []);

    return (
        <>
            <div className="container mt-4 mb-5">
                <SearchBar/>
            </div>
            <div className="row mx-0">
                {/* Filter Side Bar */}
                <div className="col-sm-2">
                    <Sidebar />
                </div>
                <div className="col-sm-10">
                    {/* Search Result and Sort Bar */}
                    <div className="d-flex justify-content-between mb-4">
                        <h5>Search Results: {restaurants.length} </h5>
                        <Sortbar />
                    </div>
                    {/* List of Restaurants */}
                    <div className="row row-cols-4 row-gap-5 mb-5">
                        {restaurants.length === 0 && (
                            <div className="d-flex align-items-center">
                                <h2>Loading ...</h2>
                            </div>
                        )}
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
            
        </>
    )
}

export default RestaurantSearchPage