import logo from './../foodImage.png';
import React from 'react';
import ReservationCard from '../components/ReservationCard';

const RestaurantPage = ({restaurant}) => {
  return (
    <div className="container">
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
    </div>
  )
}

export default RestaurantPage;
