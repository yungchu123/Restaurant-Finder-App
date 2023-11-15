import ReservationCard from '../components/ReservationCard';
import '../index.css';
import ReviewCard from '../components/ReviewCard';
import AddReviewCard from '../components/AddReviewCard';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { MyContext } from '../App';
import axios from 'axios';
import defaultImage from '../images/defaultRestaurantPhoto.jpg'

const RestaurantPage = ({isAuthenticated}) => {
  const [displayAddReview, setDisplayAddReview] = useState(false)
  const [restaurant, setRestaurant] = useState({})
  const [reviews, setReviews] = useState([{}])
  const [position, setPosition] = useState({ latt: '1.3394', long: '103.7054'})
  const [isFavorite, setIsFavorite] = useState(false)
  const {user} = useContext(MyContext)
  
  // Display Message
  const [errMsg, setErrMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const status = true // Open or not

  const { id } = useParams();

  useEffect(() => {
      // Get detail of one restaurant from backend
      (async () => {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${id}`)
        .then(response => {
            console.log('Restaurant Details:', response.data);
            setRestaurant(response.data);
            setPosition({
                latt: response.data.location.coordinates[1],
                long: response.data.location.coordinates[0]
            })
        })
        .catch(error => {
            console.log(`Error: ${error}`)
        });
      })();

      // Get a list of reviews from backend
      (async () => {
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${id}/reviews`)
          .then(response => {
              console.log('Reviews:', response.data);
              setReviews(response.data);
          })
          .catch(error => {
              console.log(`Error: ${error}`)
          });
      })();

      // Check if restaurant is in the favourite list
      (async () => {
          try {
              const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/favorites`);
              const restaurantsId = response.data;
              if (restaurantsId.includes(id)) setIsFavorite(true)
          } catch (error) {
              console.log(`Error: ${error}`);
          }
      })();
  }, [id, user._id]);

  // Only Login User can add review
  const handleAddReviewDisplay = () => {
      if (isAuthenticated) {
          setErrMsg('')
          setDisplayAddReview(!displayAddReview)
      } else {
          setErrMsg('Pleeaase Login First')
      }
  }

  // Only login user can add to favourite
  const handleAddFavourite = async () => {
      if (!isAuthenticated)  {
          setErrMsg('Pleeaase Login First')
          return
      }

      // Add to favourite
      axios.put(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/favorites`, 
          JSON.stringify({ restaurantId: id }), 
          { headers: {'Content-Type': 'application/json'} })
      .then(response => {
          console.log('Added to favourites successfully: ', response.data);
          setSuccessMsg('Added to favourites successfully')
          setIsFavorite(true)
      })
      .catch(error => {
          console.log(`Error: ${error}`)
      });
  }

  const handleRemoveFavourite = async () => {
      console.log(id)
      // Remove from favourite
      axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/favorites`, 
          { 
              data: { restaurantId: id },
              headers: {'Content-Type': 'application/json'} 
          })
      .then(response => {
          console.log('Removed from favourites successfully: ', response.data);
          setSuccessMsg('Removed from favourites successfully')
          setIsFavorite(false)
      })
      .catch(error => {
          console.log(`Error: ${error}`)
      });
  }

  // CSS STYLES
  const imageBgStyle = {
    height: '300px',
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
    backgroundImage: `url(${restaurant.imageData || defaultImage})`,
  }

  const darkOverlay = {
      backgroundColor: 'rgba(0,0,0,0.7)',
      height: '100%',
      position: 'relative'
  }

  const bottomContent = {
      position: 'absolute',
      bottom: '30px',
      color: 'white'
  }

  const pageContainer = {
      maxWidth: "80%",
      margin: "auto"
  }

  const generateStar = (rating) => {
      return <span>
          {
            Array(5).fill(0).map(() => {
                if (rating >= 1) {
                  rating -= 1
                  return <i class="bi bi-star-fill text-warning"></i>
                }
                if (rating >= 0.5) {
                  rating -= 0.5
                  return <i class="bi bi-star-half text-warning"></i>
                }
                return <i class="bi bi-star text-warning"></i>
            })
          }
      </span>
  }

  if (Object.keys(restaurant).length === 0) {
      return (
          <div style={{height:'80vh'}} className="d-flex align-items-center justify-content-center">
            <h1>Loading ...</h1>
          </div>
      )
  }
  return (
    <>
      <div>
        <div style={imageBgStyle}>
          <div style={darkOverlay}>
              <div style={pageContainer}>
                  <div style={bottomContent}>
                      <h1>{restaurant.restaurantName}</h1>
                      <p>{generateStar(restaurant.rating)}<span className="ms-3">{restaurant.rating} ({restaurant.numReviews} reviews)</span></p>
                      <h5>{status ? <span className="badge bg-success">Open</span> : <span className="badge bg-danger">Closed</span>}</h5>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div className="row mt-4 mb-5 justify-content-between" style={pageContainer}>
        <div className="col-lg-7 p-0">
              { successMsg && <div class="alert alert-success" role="alert">{successMsg}</div>}
              { errMsg && <div class="alert alert-danger" role="alert">{errMsg}</div>}
              {/* Write review and add to favourite buttons */}
              <div className="mb-3">
                <button className="btn btn-danger me-3" onClick={handleAddReviewDisplay}><i className="bi bi-star me-2"/>Write a review</button>
                { isFavorite ? (
                    <button className="btn btn-primary me-3" onClick={handleRemoveFavourite}><i className="bi bi-bookmarks me-2"></i>Saved</button>
                ) : (
                    <button className="btn btn-outline-primary me-3" onClick={handleAddFavourite}><i className="bi bi-bookmarks me-2"></i>Add to Favourites</button>
                )}
              </div>
              
              { displayAddReview && <AddReviewCard setDisplayAddReview={setDisplayAddReview} setReviews={setReviews} setSuccessMsg={setSuccessMsg} restaurantId={id}/>}

              <hr className="mt-4"/>
              {/* Description Section */}
              <h3>Description</h3>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod veniam optio libero rem amet! Possimus et rem quaerat repellendus harum provident impedit officiis eligendi placeat odio, fugiat voluptates, ipsam corporis?</p>

              <hr className="mt-4"/>

              {/* Location & Hours Section */}
              <div>
              <h3 className="mb-4">Locations & Hours</h3>
                  <div className="col-sm-7">
                    <iframe 
                    title="google map"
                    src={`https://maps.google.com/maps?q=${position.latt},${position.long}&z=15&output=embed`}
                    width="360" height="270" frameborder="0" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                      <p className="mt-3">
                        <b>Address:</b> 
                        <br/> 
                        63 Jurong West Central 3, <br/>
                        Singapore 648331
                      </p>
                  </div>
              </div>

              <hr className="mt-4"/>

              {/* Reviews Section */}
              <h3 className="mb-3">Reviews</h3>
              {reviews.map(review => (
                  <div className="mb-4" key={review._id}>
                      <ReviewCard authorName={review.authorName} rating={review.rating} description={review.text}/>
                  </div>
              ))}
        </div>
        <div className="col-lg-4">
          <ReservationCard restaurantId={id} isAuthenticated={isAuthenticated}/>
        </div>
      </div>
    </>
  )
}

export default RestaurantPage;
 

