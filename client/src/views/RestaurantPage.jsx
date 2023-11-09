import logo from '../images/foodImage.png';
import React from 'react';
import ReservationCard from '../components/ReservationCard';
import '../index.css';

const RestaurantPage = ({restaurant}) => {

  // CSS STYLES
  const imageBgStyle = {
    height: '300px',
    width: '100%',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
    backgroundImage: `url(${logo})`,
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

  // Restaurant Attributes
  const rating = 3.0
  const reviews = 150
  const status = true // Open or not
  const position = { lat: '1.3394', lon: '103.7054'}

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

  return (
    <>
      <div>
        <div style={imageBgStyle}>
          <div style={darkOverlay}>
              <div style={pageContainer}>
                  <div style={bottomContent}>
                      <h1>Dian Xiao Er</h1>
                      <p>{generateStar(rating)}<span className="ms-3">{rating} ({reviews} reviews)</span></p>
                      <h5>{status ? <span className="badge bg-success">Open</span> : <span className="badge bg-danger">Closed</span>}</h5>
                  </div>
              </div>
          </div>
        </div>
      </div>
      <div className="row mt-4 mb-5 justify-content-between" style={pageContainer}>
        <div className="col-lg-7 p-0">
              {/* Write review and add to favourite buttons */}
              <div>
                <button type="button" className="btn btn-danger me-3"><i className="bi bi-star me-2"/>Write a review</button>
                <button type="button" className="btn btn-primary me-3"><i className="bi bi-bookmarks me-2"></i>Add to Favourites</button>
              </div>
              <hr className="mt-4"/>

              {/* Description Section */}
              <h3>Description</h3>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod veniam optio libero rem amet! Possimus et rem quaerat repellendus harum provident impedit officiis eligendi placeat odio, fugiat voluptates, ipsam corporis?</p>

              <hr className="mt-4"/>

              {/* Reviews Section */}
              <h3>Reviews</h3>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quod veniam optio libero rem amet! Possimus et rem quaerat repellendus harum provident impedit officiis eligendi placeat odio, fugiat voluptates, ipsam corporis?</p>

              <hr className="mt-4"/>

              {/* Location & Hours Section */}
              <div>
              <h3 className="mb-4">Locations & Hours</h3>
                  <div className="col-sm-7">
                    <iframe 
                    title="google map"
                    src={`https://maps.google.com/maps?q=${position.lat},${position.lon}&z=15&output=embed`}
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
        </div>
        <div className="col-lg-4">
          <ReservationCard/>
        </div>
      </div>
    </>
  )
}

export default RestaurantPage;
 

/*<div className="container">
      <div className="row">
        <div className="col-md-8" style={{ width: "50rem", padding: "25px" }}>
          <div className="row mb-4">
            <div className="col-md-6">
              <h2>Dian Xiao Er</h2>
              <img src={logo} className="card-img-top" alt="..." style={{width: '30rem'}}/>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fringilla turpis vel metus gravida, 
              eu tristique eros tincidunt. Suspendisse non malesuada augue.</p>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <h4>Reviews</h4>
              <ul>
                <li>Great food and service!</li>
                <li>Wonderful ambiance.</li>
                <li>Highly recommended.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-4" style={{padding: "25px", margin: "0 auto"}}>
          <ReservationCard />
        </div>
      </div>
    </div>*/