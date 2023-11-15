import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MyContext } from '../App';
import axios from 'axios';
import defaultImage from '../images/defaultRestaurantPhoto.jpg'
import '../index.css';

const ViewReservationCard = ({restaurantId, reservationId, restaurantName, customerName, status, partySize, reservationDate, reservationTime, imageData, setSuccessMsg}) => {
    const { user } = useContext(MyContext)
    const [reservationStatus, setReservationStatus] = useState(status && status.charAt(0).toUpperCase() + status.slice(1))

    const handleAccept = async () => {
        try {
            // /restaurants/:restaurantId/reservations/:reservationId
            const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${restaurantId}/reservations/${reservationId}`, { isAccepted: true })
            setSuccessMsg(response.data.message)
            setReservationStatus('Accepted')
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }

    const handleReject = async () => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${restaurantId}/reservations/${reservationId}`, { isAccepted: false })
            setSuccessMsg(response.data.message)
            setReservationStatus('Declined')
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    }


    // For restaurant owner
    if (user.role === "restaurateur") return(
            <>
                <div class="card">
                    <h5 class={`card-header ${reservationStatus.toLowerCase()}`}>{reservationStatus}</h5>
                        <div class="card-body">
                                <div class="row">
                                    <div className="col-lg-3">
                                        <img src={imageData || defaultImage} class="card-img-top" alt="..."/>
                                    </div>
                                    <div className="col-lg-9 d-flex justify-content-between">
                                        <div>
                                            <h5 class="card-title mb-3"><strong>{customerName}</strong></h5>
                                            <p class="card-text"> Reservation Details:
                                                <ul>
                                                    <li><strong>Date:</strong> {reservationDate && reservationDate.split("T")[0]} </li>
                                                    <li><strong>Time:</strong> {reservationTime} </li>
                                                    <li><strong>Number of Pax:</strong> {partySize} </li>
                                                </ul>
                                            </p>
                                        </div>
                                        { reservationStatus === "pending" && (
                                            <div className='d-flex flex-column justify-content-center me-3'>
                                                <div className="btn btn-success mb-3" onClick={handleAccept}>Accept</div>
                                                <div className="btn btn-danger" onClick={handleReject}>Declined</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                </div>
            </>
    )

    // For customer
    return(
        <>
            <div class="card">
                <h5 class={`card-header ${reservationStatus.toLowerCase()}`}>{reservationStatus}</h5>
                <NavLink to={`/restaurant/${restaurantId}`} style={{ color: 'rgb(33, 37, 41)', textDecoration: 'none' }}> 
                    <div class="card-body card-hover">
                            <div class="row">
                                <div className="col-lg-3">
                                    <img src={imageData || defaultImage} class="card-img-top" alt="..."/>
                                </div>
                                <div className="col-lg-6">
                                    <h5 class="card-title mb-3"><strong>{restaurantName}</strong></h5>
                                    <p class="card-text"> Reservation Details:
                                        <ul>
                                            <li><strong>Date:</strong> {reservationDate.split("T")[0]} </li>
                                            <li><strong>Time:</strong> {reservationTime} </li>
                                            <li><strong>Number of Pax:</strong> {partySize} </li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                </NavLink>
            </div>
        </>
)
}

ViewReservationCard.defaultProps = {
    reservationDate: '',
    status: 'Null'
}

export default ViewReservationCard;