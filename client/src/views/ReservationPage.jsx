import { useEffect, useContext, useState } from "react";
import ViewReservationCard from "../components/ViewReservationCard";
import { MyContext } from '../App';
import axios from 'axios';

const ReservationPage = () => {
    const { user } = useContext(MyContext)
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        try {
            (async () => {
                // Fetch all reservations from user
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/reservations`)
                const reservations = response.data
                console.log("List of Reservations: ", response.data)

                // Fetch the restaurant name and image data using the restaurant id
                const listOfPromises = reservations.map(async (reservation) => {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${reservation.restaurantId}`);
                    reservation.restaurantName = response.data.restaurantName
                    reservation.imageData = response.data.imageData
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
    }, [user._id])

    return(
        <div className="container">
          <h2 className="mb-4" style={{marginTop: "30px"}}>Reservation</h2>
          <div style={{margin: "0 auto"}}>
            {reservations.map(reservation => (
                <div className="mb-3">
                <ViewReservationCard
                    restaurantId={reservation.restaurantId} 
                    restaurantName={reservation.restaurantName}
                    status={reservation.status}
                    partySize={reservation.partySize}
                    reservationDate={reservation.reservationDate}
                    reservationTime={reservation.reservationTime}
                    imageData={reservation.imageData}/>
                </div>
            ))}
            <br/>
          </div>

        </div>
    )
}

export default ReservationPage;