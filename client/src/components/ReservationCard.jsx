import people from '../images/people.png'
import calender from '../images/calender.png'
import clock from '../images/clock.png'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useContext } from "react"
import { MyContext } from '../App';
import axios from 'axios';

// Need to add the function..will do soon 
const ReservationCard = ({ isAuthenticated, restaurantId }) => {
    const { user } = useContext(MyContext)
    const [selectedPax, setSelectedPax] = useState(2);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('11:00 am');
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleMakeReservation = async () => {
        // Only for login customer user
        if (!isAuthenticated) {
            setErrorMsg('Please login first')
            return
        }
        if (user.role.toLowerCase() !== "customer") {
            setErrorMsg('Reservation only for customer')
            return
        }

        const inputDate = new Date(selectedDate);

        const year = inputDate.getFullYear();
        const month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
        const day = inputDate.getDate().toString().padStart(2, '0');
        
        const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`;

        try {
            // Make a reservation api call
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${restaurantId}/reservations`, 
                                    JSON.stringify({ 
                                        customerId: user._id, 
                                        partySize: selectedPax,
                                        reservationDate: formattedDate,
                                        reservationTime: selectedTime
                                    }), 
                                    { headers: {'Content-Type': 'application/json'} })
            console.log('Reservation: ', response.data)
            setSuccessMsg('Reservation made successfully')
            setErrorMsg('')
        } catch (error) {
            setErrorMsg(`Error: ${error}`)
        }
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    return (
        <form className="card" style={{width: "25rem", padding: '25px', backgroundColor: 'var(--bs-body-color)'}}>
            <h3 class="" className='mb-4' style={{color: 'white'}}>Find a table</h3>
            { successMsg && <div class="alert alert-success" role="alert">{successMsg}</div>}
            { errorMsg && <div class="alert alert-danger" role="alert">{errorMsg}</div>}
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                    <img src={people} class="card-icon" alt="Number of People" style={{width: '1.5rem'}} />
                </span>
                <div class="col-sm-10">
                        <select class="form-select" id="numberofpeople" 
                            value={selectedPax} onChange={e => setSelectedPax(e.target.value)}>
                            <option value="1">1 Adults</option>
                            <option value="2">2 Adults</option>
                            <option value="3">3 Adults</option>
                            <option value="4">4 Adults</option>
                            <option value="5">5 Adults</option>
                            <option value="6">6 Adults</option>
                        </select>
                </div>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                    <img src={calender} class="card-icon" alt="Number of People" style={{width: '1.5rem'}} />
                </span>
                <div class="col-sm-10">
                    <DatePicker selected={selectedDate} className="form-control" onChange={handleDateChange} placeholderText="Date"/>    
                </div>
            </div>
            <div class="input-group mb-3" >
                <span class="input-group-text" id="basic-addon1">
                    <img src={clock} class="card-icon" alt="Number of People" style={{width: '1.5rem'}} />
                </span>
                <div class="col-sm-10">
                        <select class="form-select" id="time" 
                            value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                            <option value="11:00 am">11:00 am</option>
                            <option value="11:30 am">11:30 am</option>
                            <option value="12:00 pm">12:00 pm</option>
                            <option value="12:30 pm">12:30 pm</option>
                            <option value="1:00 pm">1:00 pm </option>
                            <option value="1:30 pm">1:30 pm</option>
                            <option value="2:00 pm">2:00 pm </option>
                            <option value="2:30 pm">2:30 pm</option>
                            <option value="3:00 pm">3:00 pm</option>
                            <option value="3:30 pm">3:30 pm</option>
                            <option value="4:00 pm">4:00 pm </option>
                            <option value="4:30 pm">4:30 pm</option>
                            <option value="5:00 pm">5:00 pm </option>
                            <option value="5:30 pm">5:30 pm</option>
                            <option value="6:00 pm">6:00 pm</option>
                            <option value="6:30 pm">6:30 pm</option>
                            <option value="7:00 pm">7:00 pm </option>
                            <option value="7:30 pm">7:30 pm</option>
                            <option value="8:00 pm">8:00 pm </option>
                            <option value="8:30 pm">8:30 pm</option>
                            <option value="9:00 pm">9:00 pm </option>
                            <option value="9:30 pm">9:30 pm</option>
                            <option value="10:00 pm">10:00 pm</option>
                            <option value="10:30 pm">10:30 pm</option>
                        </select>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-4">
                    <div class="btn btn-primary mt-3" onClick={handleMakeReservation}>Reserve</div>
                </div>
            </div>
        </form>
    )
}

export default ReservationCard