import SearchBar from '../components/SearchBar';
import { useState } from "react"
import ManageReservationCard from '../components/ManageReservationCard';

const ManageRestaurantPage = () => {
    const [isSeatedClicked, setIsSeatedClicked] = useState(false);
    const [isUpcomingClicked, setIsUpcomingClicked] = useState(false);
    const [isWaitlistedClicked, setIsWaitlistedClicked] = useState(false);

    const handleButtonClick = (buttonType) => {
        switch (buttonType) {
            case 'seated':
                setIsSeatedClicked(!isSeatedClicked);
                break;
            case 'upcoming':
                setIsUpcomingClicked(!isUpcomingClicked);
                break;
            case 'reservationTime':
                setIsWaitlistedClicked(!isWaitlistedClicked);
                break;
            default:
                break;
        }
    };

    return(
        <>
            <div class="container mt-3 mb-5" style={{alignItems: 'center'}}>
                    <SearchBar placeholder="Search"/>
                    <div class="row g-0 mt-3" style={{justifyContent: 'center'}}>
                    <div class="col-2" style={{paddingLeft: '3px'}}>
                        <button type="button" class={`btn ${isSeatedClicked ? 'btn-active' : ''}`} data-bs-toggle="button" 
                        style={{width: '95%', padding: '10px', borderColor: isSeatedClicked ? 'grey' : '#DEE2E6', borderRadius: '10px'}} 
                        onClick={() => handleButtonClick('seated')}>Seated</button>
                    </div>
                    <div class="col-2">
                        <button type="button" class={`btn ${isUpcomingClicked ? 'btn-active' : ''}`} data-bs-toggle="button" 
                        style={{width: '95%', padding: '10px', borderColor: isUpcomingClicked ? 'grey' : '#DEE2E6', borderRadius: '10px'}} 
                        onClick={() => handleButtonClick('upcoming')}>Upcoming</button>
                    </div>
                    <div class="col-2">
                        <button type="button" class={`btn ${isWaitlistedClicked ? 'btn-active' : ''}`} data-bs-toggle="button" 
                        style={{width: '95%', padding: '10px', borderColor: isWaitlistedClicked ? 'grey' : '#DEE2E6', borderRadius: '10px'}} 
                        onClick={() => handleButtonClick('waitlisted')}>Waitlist</button>
                    </div>
                </div>
            </div>
            <div class="container mt-3 mb-4" style={{alignItems: 'center'}}>
                <ManageReservationCard status="Seated" user="Gary Jordan"/>
                <br/>
                <ManageReservationCard status="Upcoming" user="Gary Gay"/>
                <br/>
                <ManageReservationCard status="Waitlist" user="Iam Bored"/>
            </div>
            
            
        </>
    )
}

export default ManageRestaurantPage;