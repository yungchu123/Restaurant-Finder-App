import React from 'react'
import SearchBar from "../components/SearchBar"
import ViewReservationCard from '../components/ViewReservationCard'

const CustomerDashboard = () => {
  return (
    <>
        <div style={{height: '30vh'}} className="container d-flex flex-column justify-content-center align-items-center">
                <h1 className="mb-4">Restaurant Finder</h1>
                <SearchBar/>
        </div>
        <div className="container mt-4 mb-5">
            <div className="row justify-content-between">
                <div className="col-5 mb-4">
                    <h4 className='mb-4'>Upcoming Reservation</h4>
                    <ViewReservationCard/>
                </div>
                <div className="col-3">
                    <h4>Highlights</h4>
                    <div style={{width:'300px', height:'250px', backgroundColor:'rgba(0,0,0,0.1)'}}></div>
                </div>
                <div className="col-3">
                    <h4>Advertisement</h4>
                    <div style={{width:'300px', height:'250px', backgroundColor:'rgba(0,0,0,0.1)'}}></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default CustomerDashboard