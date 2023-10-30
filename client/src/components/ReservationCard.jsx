import people from './../people.png'
import calender from './../calender.png'
import clock from './../clock.png'
// Need to add the function..will do soon 
const ReservationCard = () => {
    return (
        <form className="card" style={{width: "25rem", padding: '25px', backgroundColor: 'var(--bs-body-color)'}}>
            <h3 class="" style={{color: 'white'}}>Find a table</h3>
            <br/>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                    <img src={people} class="card-icon" alt="Number of People" style={{width: '1.5rem'}} />
                </span>
                <div class="col-sm-10">
                        <select class="form-select" id="numberofpeople" >
                        <option value="1">1 Adults</option>
                        <option value="2" selected>2 Adults</option>
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
                <input type="text" class="form-control" placeholder="Date" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                    <img src={clock} class="card-icon" alt="Number of People" style={{width: '1.5rem'}} />
                </span>
                <div class="col-sm-10">
                       
                        <select class="form-select" id="time" >
                        <option value="1">11:00 am </option>
                        <option value="2">11:30 am</option>
                        <option value="3">12:00 pm</option>
                        <option value="4">12:30 pm</option>
                        <option value="5">1:00 pm </option>
                        <option value="6">1:30 pm</option>
                        <option value="7">2:00 pm </option>
                        <option value="8">2:30 pm</option>
                        <option value="9">3:00 pm</option>
                        <option value="10">3:30 pm</option>
                        <option value="11">4:00 pm </option>
                        <option value="12">4:30 pm</option>
                        <option value="13">5:00 am </option>
                        <option value="14">5:30 am</option>
                        <option value="15">6:00 pm</option>
                        <option value="16">6:30 pm</option>
                        <option value="17">7:00 pm </option>
                        <option value="18">7:30 pm</option>
                        <option value="19">8:00 pm </option>
                        <option value="20">8:30 pm</option>
                        <option value="21">9:00 pm </option>
                        <option value="22">9:30 pm</option>
                        <option value="23">10:00 pm</option>
                        <option value="24">10:30 pm</option>
                        <option value="25">11:00 pm </option>
                        <option value="26">11:30 pm</option>
                        </select>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-4">
                    <button type="submit" class="btn btn-primary">Reserve</button>
                </div>
            </div>
        </form>
    )
}

export default ReservationCard