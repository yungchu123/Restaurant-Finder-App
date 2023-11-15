import { useEffect, useContext, useState } from "react";
import ViewReservationCard from "../components/ViewReservationCard";
import { MyContext } from '../App';
import axios from 'axios';

const ReservationPage = () => {
    const { user } = useContext(MyContext)
    const [reservations, setReservations] = useState([])
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        if (user.role === "restaurateur" && user.restaurantOwned === null) {
            return
        }

        try {
            (async () => {
                // Fetch all reservations from user
                const url = user.role === "restaurateur" ?
                    `${process.env.REACT_APP_SERVER_URL}/api/restaurants/${user.restaurantOwned}/reservations`: 
                    `${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/reservations`
                const response = await axios.get(url)
                const reservations = response.data
                console.log("List of Reservations: ", response.data)

                // Fetch the customer name, restaurant name and image data using the restaurant id
                const listOfPromises = reservations.map(async (reservation) => {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${reservation.restaurantId}`);
                    reservation.restaurantName = response.data.restaurantName
                    reservation.imageData = response.data.imageData

                    const response2 = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${reservation.customerId}`)
                    reservation.customerName = response2.data.firstName + " " + response2.data.lastName

                    return reservation; 
                });

                Promise.all(listOfPromises)
                .then(listOfReservations => {
                    console.log('List of Reservations:', listOfReservations)
                    setReservations(listOfReservations)
                })
                .catch(error => {
                  console.error('Error fetching restaurants:', error);
                });

            })();
        } catch (error) {
            console.log(error)
        }
    }, [user._id, user.role, user.restaurantOwned])

    return(
        <div className="container">
          <h2 className="mb-4" style={{marginTop: "30px"}}>Reservation</h2>
          { successMsg && <div class="alert alert-success" role="alert">{successMsg}</div>}
          <div className="row row-cols-2 mx-0" >
            {reservations.map(reservation => (
                <div className="col mb-3">
                <ViewReservationCard
                    restaurantId={reservation.restaurantId} 
                    reservationId={reservation._id}
                    restaurantName={reservation.restaurantName}
                    customerName={reservation.customerName}
                    status={reservation.status}
                    partySize={reservation.partySize}
                    reservationDate={reservation.reservationDate}
                    reservationTime={reservation.reservationTime}
                    imageData={reservation.imageData}
                    setSuccessMsg={setSuccessMsg}/>
                </div>
            ))}
            <br/>
          </div>

        </div>
    )
}

export default ReservationPage;