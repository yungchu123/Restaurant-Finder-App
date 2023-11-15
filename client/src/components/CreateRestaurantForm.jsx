import { useState, useContext } from 'react'
import { MyContext } from '../App';
import axios from 'axios';

const CreateRestaurantForm = ({setHasRestaurant}) => {
    const { user } = useContext(MyContext)

    const [restaurantName, setRestaurantName] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [description, setDescription] = useState('')
    const [cuisine, setCuisine] = useState('')
    const [errorMsg, setErrorMessage] = useState('')

    const cuisineList = ['Chinese', 'Thai', 'Indian', 'Mexican', 'Western', 'Japanese', 'Korean', 'Italian', 'Vietnamese', 'Muslim', 'French', 'Spanish', 'American']

    const handleCreateRestaurant = async () => {
        if (!restaurantName || !postalCode || !cuisine || !description) {
            setErrorMessage('All fields are required.')
            return
        }

        try {
            // Create new restaurant
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/register`, 
                                        JSON.stringify({ restaurantName, postalCode, cuisine, description, managerId: user._id }), 
                                        { headers: {'Content-Type': 'application/json'} });
            alert(response.data.message)
            setHasRestaurant(true)
            console.log(response.data.restaurant)
        } catch (error) {
            setErrorMessage(`Error: ${error}`)
        }
    }

    return (
        <>
            <div className="card bg-light py-4 px-5 mb-3">
                <h4 className='mb-4 text-center'>Create a new restaurant</h4>
                {errorMsg && <div class="alert alert-danger" role="alert">{errorMsg}</div>}
                <div className='mb-3'>
                    <input 
                        value={restaurantName} onChange={e => setRestaurantName(e.target.value)} 
                        className="form-control" 
                        placeholder='Restaurant Name'/>
                </div>
                <div className='mb-3'>
                    <input 
                        value={postalCode} onChange={e => setPostalCode(e.target.value)} 
                        className="form-control" 
                        placeholder='Postal Code'/>
                </div>
                <div className='mb-3'>
                    <select class="form-select" value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                        <option value="" selected>Select a cuisine</option>
                        {cuisineList.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                        ))}
                    </select>
                </div>
                <div className='mb-3'>
                    <textarea 
                        value={description} onChange={e => setDescription(e.target.value)}
                        class="form-control" rows="3"
                        placeholder='Restaurant Description'></textarea>
                </div>
                <button className="btn btn-primary" onClick={handleCreateRestaurant}>Create Restaurant</button>
            </div>
        </>
    )
}

export default CreateRestaurantForm