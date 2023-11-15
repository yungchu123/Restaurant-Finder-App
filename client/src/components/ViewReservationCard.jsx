import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MyContext } from '../App';
import defaultImage from '../images/defaultRestaurantPhoto.jpg'
import '../index.css';

const ViewReservationCard = ({restaurantId, reservationId, restaurantName, customerName, status, partySize, reservationDate, reservationTime, imageData, setSuccessMsg, onAccept, onReject}) => {
    const { user } = useContext(MyContext)
    const reservationStatus = status && status.charAt(0).toUpperCase() + status.slice(1)

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
                                        { reservationStatus.toLowerCase() === "pending" && (
                                            <div className='d-flex flex-column justify-content-center me-3'>
                                                <div className="btn btn-success mb-3" onClick={onAccept}>Accept</div>
                                                <div className="btn btn-danger" onClick={onReject}>Decline</div>
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