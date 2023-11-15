import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const  UpdateRestaurantPage = ({restaurant, setRestaurant}) => {
    const navigate = useNavigate();

    const [restaurantname, setRestaurantName] = useState(restaurant.restaurantName);
    const [description, setDescription] = useState(restaurant.description);
    const [address, setAddress] = useState('637125');
    const [cuisine, setCuisine] = useState(restaurant.cuisine)

    const cuisineList = ['Chinese', 'Thai', 'Indian', 'Mexican', 'Western', 'Japanese', 'Korean', 'Italian', 'Vietnamese', 'Muslim', 'French', 'Spanish', 'American']

    const updateRestaurantProfile = async () => {
        axios.patch(`http://localhost:5000/api/restaurants/${restaurant.restaurantId}`, 
            JSON.stringify({ restaurantname, description, address, cuisine }), 
            { headers: {'Content-Type': 'application/json'} })
        .then(response => {
            console.log("User updated. New user: ", response.data)
            setRestaurant(response.data)
            navigate('/restaurant/manage')
        })
        .catch(error => {
            console.error(`Error ${error}`);
        });
    }

    const cancel = () => {
        navigate('/restaurant/manage')
    }

    return (
        <>
        <div className="container w-50 my-3">
            <h2 className="mb-4">Profile Page</h2>
            <div className="card bg-light py-4 px-5 mb-3">
                <div className="profile-row d-flex">
                    <div className="col-4">
                        First Name
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={restaurantname} onChange={e => setRestaurantName(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="profile-row d-flex">
                    <div className="col-4">
                        Description
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={description} onChange={e => setDescription(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="profile-row d-flex">
                    <div className="col-4">
                        Address
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={address} onChange={e => setAddress(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="profile-row d-flex">
                    <div className="col-4">
                        Cuisine
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <select class="form-select" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                            <option value="" selected>Select a cuisine</option>
                            {cuisineList.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary me-3" onClick={updateRestaurantProfile}>Confirm Update</button>
            <button className="btn btn-primary" onClick={cancel}>Cancel</button>
        </div>
        </>
    )
}

export default UpdateRestaurantPage;