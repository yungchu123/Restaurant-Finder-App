import { NavLink } from 'react-router-dom';
import defaultImage from '../images/defaultRestaurantPhoto.jpg'
import '../index.css';

const ViewReservationCard = ({restaurantId, restaurantName, status, partySize, reservationDate, reservationTime, imageData}) => {
    return(
            <>
                <div class="card">
                    <h5 class="card-header">{status.charAt(0).toUpperCase() + status.slice(1)}</h5>
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
    reservationDate: ''
}

export default ViewReservationCard;