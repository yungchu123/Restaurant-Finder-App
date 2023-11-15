import { useEffect, useContext, useState } from "react";
import ViewReservationCard from "../components/ViewReservationCard";
import { MyContext } from '../App';
import axios from 'axios';

const ReservationPage = () => {
    const { user } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]); 
    const [statusFilter, setStatusFilter] = useState('none');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (user.role === "restaurateur" && user.restaurantOwned === null) {
            return;
        }

        try {
            setLoading(true);
            (async () => {
                // Fetch all reservations from user
                const url = user.role === "restaurateur" ?
                    `${process.env.REACT_APP_SERVER_URL}/api/restaurants/${user.restaurantOwned}/reservations`: 
                    `${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/reservations`
                const response = await axios.get(url);
                const reservations = response.data;
                console.log("List of Reservations: ", response.data);

                // Fetch the customer name, restaurant name, and image data using the restaurant id
                const listOfPromises = reservations.map(async (reservation) => {
                    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${reservation.restaurantId}`);
                    reservation.restaurantName = response.data.restaurantName;
                    reservation.imageData = response.data.imageData;

                    const response2 = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${reservation.customerId}`);
                    reservation.customerName = response2.data.firstName + " " + response2.data.lastName;

                    return reservation; 
                });

                Promise.all(listOfPromises)
                .then(listOfReservations => {
                    console.log('List of Reservations:', listOfReservations);
                    setReservations(listOfReservations);
                    setFilteredReservations(listOfReservations);
                    setLoading(false);
                })
                .catch(error => {
                  console.error('Error fetching restaurants:', error);
                  setLoading(false); // Make sure to set loading to false in case of an error
                });

            })();
        } catch (error) {
            console.log(error);
            setLoading(false); // Set loading to false in case of an error outside the async context
        }
    }, [user._id, user.role, user.restaurantOwned]);

    useEffect(() => {
        switch (statusFilter) {
            case 'accepted':
                setFilteredReservations(reservations.filter(reservation => reservation.status === "accepted"));
                break;
            case 'declined':
                setFilteredReservations(reservations.filter(reservation => reservation.status === "declined"));
                break;
            case 'pending':
                setFilteredReservations(reservations.filter(reservation => reservation.status === "pending"));
                break;
            default:
                setFilteredReservations([...reservations]);
        }
    }, [statusFilter, reservations]);

    const handleAccept = async (reservationId) => {
        try {
          const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${user.restaurantOwned}/reservations/${reservationId}`, { isAccepted: true });
          setSuccessMsg(response.data.message);
    
          // Update local state to mark the reservation as accepted
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation._id === reservationId ? { ...reservation, status: 'accepted' } : reservation
            )
          );
        } catch (err) {
          console.log(`Error: ${err}`);
        }
      };
    
      const handleReject = async (reservationId) => {
        try {
          const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${user.restaurantOwned}/reservations/${reservationId}`, { isAccepted: false });
          setSuccessMsg(response.data.message);
    
          // Update local state to mark the reservation as declined
          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              reservation._id === reservationId ? { ...reservation, status: 'declined' } : reservation
            )
          );
        } catch (err) {
          console.log(`Error: ${err}`);
        }
      };

    return (
        <div className="container">
          <h2 className="mb-3" style={{marginTop: "30px"}}>Reservation</h2>
          <div className="d-flex justify-content-center mb-3">
                <div style={{width: "90px"}} className={`btn me-5 ${statusFilter === 'none' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setStatusFilter('none')}>All</div>
                <div style={{width: "90px"}} className={`btn me-5 ${statusFilter === 'accepted' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setStatusFilter('accepted')}>Accepted</div>
                <div style={{width: "90px"}} className={`btn me-5 ${statusFilter === 'declined' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setStatusFilter('declined')}>Declined</div>
                <div style={{width: "90px"}} className={`btn ${statusFilter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setStatusFilter('pending')}>Pending</div>
          </div>
          <hr></hr>
          { successMsg && <div class="alert alert-success" role="alert">{successMsg}</div>}
          <div className="row row-cols-2 mx-0" >
            {loading && <h4>Loading ...</h4>}
            {!loading && filteredReservations.length === 0 && <h4>No reservations</h4>}
            {!loading && filteredReservations.map((reservation, index) => (
                <div className="col mb-3">
                <ViewReservationCard
                    key={index}
                    restaurantId={reservation.restaurantId} 
                    reservationId={reservation._id}
                    restaurantName={reservation.restaurantName}
                    customerName={reservation.customerName}
                    status={reservation.status}
                    partySize={reservation.partySize}
                    reservationDate={reservation.reservationDate}
                    reservationTime={reservation.reservationTime}
                    imageData={reservation.imageData}
                    setSuccessMsg={setSuccessMsg}
                    onAccept={() => handleAccept(reservation._id)}
                    onReject={() => handleReject(reservation._id)}/>
                </div>
            ))}
            <br/>
          </div>
        </div>
    )
}

export default ReservationPage;
