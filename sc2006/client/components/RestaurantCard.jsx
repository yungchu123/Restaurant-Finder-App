import React, { useEffect } from 'react'; // and useState
import logo from '../foodImage.png';
import { Link } from "react-router-dom";
import RestaurantDetails from '../views/RestaurantDetails'

const RestaurantCard = ({ restaurant }) => {
  // const [reviews, setReviews] = useState([]);
  console.log(restaurant)
  useEffect(() => {
    // Make an HTTP request to fetch reviews from the Google API here
    // You can use the Fetch API, Axios, or any other HTTP library

    // Example using the Fetch API (you need to replace this with your actual API endpoint):
    fetch(`http://localhost:30005/api/restaurants/${restaurant._id}`)
      .then((response) => response.json())
      .then((data) => {
        // Assuming data.reviews contains an array of reviews
        // setReviews(data.reviews);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  }, [restaurant._id]);

  
  return (
    <Link to={{ pathname: `/restaurant-details/${restaurant._id}` }} className="no-underline">
      <RestaurantDetails restaurant={restaurant} />
      <div className="card" style={{ width: '18rem' }}>
        <img src={logo} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title mb-3">{restaurant.name}</h5>
          <p className="card-text mb-2">
            {restaurant.categories.join(' | ')}
          </p>
          <p className="card-text">
            <span className="me-3">
              <i className="bi bi-star-fill me-1"></i> {restaurant.rating}
            </span>
            <span className="text-secondary"> ({restaurant.reviews} reviews)</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;