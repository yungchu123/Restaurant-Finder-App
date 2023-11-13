import React from 'react'
import SearchBar from "../components/SearchBar"
import ViewReservationCard from '../components/ViewReservationCard'

const CustomerDashboard = () => {

  return (
    <>
        <div style={{padding: '20px'}} className="pt-3">
        <div style={{minHeight: '80vh'}} className="row mx-0">
            <div className="col-7 text-center d-flex flex-column justify-content-center">
                <h1 className="mb-4">Restaurant Finder</h1>
                <SearchBar/>
            </div>
            <div className="col-5 mt-4">
                    <h4 className='mb-4'>Upcoming Reservation</h4>
                    <div className="mb-3"><ViewReservationCard/></div>
                    <div className="mb-3"><ViewReservationCard/></div>
            </div>
        </div>
        </div>
    </>
  )
}

export default CustomerDashboard