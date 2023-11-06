import logo from '../images/foodImage.png';
import React from 'react';
import ReservationCard from '../components/ReservationCard';
import SearchBar from '../components/SearchBar';
import '../index.css';

const RestaurantPage = ({restaurant}) => {
  return (
    <>
      <div className="col-sm-7 mt-2 mb-5">
        <SearchBar/>
      </div>
      <div class="row g-0">
        <div class="col-4">
          <img src={logo} class="card-icon" alt="Number of People"/>
          <div className="text-overlay">Dian Xiao Er</div>
        </div>
        <div class="col-4">
          <img src={logo} class="card-icon" alt="Number of People"/>
        </div>
        <div class="col-4">
          <img src={logo} class="card-icon" alt="Number of People"/>
        </div>
      </div>
      <div class="row mt-4 mb-5">
        <div class="col-sm-7" style={{marginLeft: '40px'}}>
          <div class="row">
            <div class="col-sm-7">
              <button type="button" class="btn btn-outline-danger me-3">Write a review</button>
              <button type="button" class="btn btn-outline-primary me-3">Add to Favourites</button>
              <button type="button" class="btn btn-outline-primary me-3">Share</button>
            </div>
            <hr style={{marginTop: '20px'}}/>
            <h3>Locations & Hours</h3>
            <div class="col-sm-7">
              <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d29038.707431301053!2d103.69705958315535!3d1.3440332249986962!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ssg!4v1699270816843!5m2!1sen!2ssg"
              width="75%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
              </iframe>
              <p>
                <b>Address:</b> 
                <br/> 
                63 Jurong West Central 3, <br/>
                Singapore 648331
              </p>
            </div>
          </div>
        </div>
        <div class="col-sm-3 mb-5" style={{marginLeft: '20px'}}>
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