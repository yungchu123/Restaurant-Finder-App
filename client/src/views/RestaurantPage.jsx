import React, { useState, useEffect } from 'react';
import ReservationCard from '../components/ReservationCard';
import '../index.css';
import ReviewCard from '../components/ReviewCard';
import AddReviewCard from '../components/AddReviewCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RestaurantPage = ({isAuthenticated}) => {
  const [displayAddReview, setDisplayAddReview] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [restaurant, setRestaurant] = useState({})
  const [reviews, setReviews] = useState([{}])
  const [position, setPosition] = useState({ latt: '1.3394', long: '103.7054'})

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
  }, [id]);

  // Only Login User can add review
  const handleAddReviewDisplay = () => {
      if (isAuthenticated) {
          setErrMsg('')
          setDisplayAddReview(!displayAddReview)
      } else {
          setErrMsg('Pleeaase Login First')
      }
  }

  // CSS STYLES
  const imageBgStyle = {
    height: '300px',
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
    backgroundImage: `url(${restaurant.imageData})`,
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
              {/* Write review and add to favourite buttons */}
              <div className="mb-3">
                <button className="btn btn-danger me-3" onClick={handleAddReviewDisplay}><i className="bi bi-star me-2"/>Write a review</button>
                <button className="btn btn-primary me-3"><i className="bi bi-bookmarks me-2"></i>Add to Favourites</button>
                <span className="text-danger">{errMsg}</span>
              </div>
              
              { displayAddReview && <AddReviewCard setDisplayAddReview={setDisplayAddReview} />}

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
          <ReservationCard/>
        </div>
      </div>
    </>
  )
}

export default RestaurantPage;
 

