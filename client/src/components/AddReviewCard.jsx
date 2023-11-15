import React, { useContext, useState } from 'react'
import { MyContext } from '../App';
import axios from 'axios';

const AddReviewCard = ({setDisplayAddReview, setReviews, setSuccessMsg, setRestaurant, restaurantId}) => {
    const [rating, setRating] = useState(3)
    const [text, setText] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const {user} = useContext(MyContext)

    const handleAddReview = (e) => {
        e.preventDefault();
        if (text === '') {
            setErrMsg('Please enter a review description.')
            return
        }

        // Add a new review to database
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/reviews`, 
            JSON.stringify({ restaurantId, rating, text, authorId: user._id }), 
            { headers: {'Content-Type': 'application/json'} }
        )
        .then(response => {
            setDisplayAddReview(false)
            setReviews(reviews => [...reviews, response.data])
            setSuccessMsg("Review Added Successfully")
            setRestaurant(restaurant => {
                return {
                    ...restaurant,
                    numReviews: restaurant.numReviews + 1,
                    rating: ((restaurant.numReviews * restaurant.rating) + rating) / (restaurant.numReviews + 1)
                }
            })
            console.log('Review:', response.data);
        })
        .catch(error => {
            if (error.response) {
                setErrMsg(`${error.response.data.error}`)
            } else {
                setErrMsg(`${error}`)
            }
        });
    }

    const handleAddReviewDisplay = () => {
        setDisplayAddReview(false)
    }

    return (
        <>
            <form className="border border-info border-3 rounded p-4" onSubmit={handleAddReview}>
                {errMsg && <div class="alert alert-danger" role="alert">{errMsg}</div>}
                <h3 class="mb-3">Add Review</h3>
                {/* Choose Rating Section */}
                <div className="row mb-3">
                    <div className="col-4 d-flex align-items-center">
                        <label htmlFor="rating">Choose a Rating (1 to 5)</label>
                    </div>
                    <div className="col-2">
                        <select className='form-select' id="rating" value={rating} onChange={e => setRating(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="col-2 d-flex align-items-center" style={{fontSize: '17px'}}>
                        {generateStar(rating)}
                    </div>
                </div>

                {/* Add description section */}
                <div class="mb-4">
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={text} onChange={e => setText(e.target.value)} placeholder='Add some reviews'></textarea>
                </div>
            
                <div className="row">
                    <div>
                        <button type="submit" class="btn btn-success float-start me-3">Add Review</button>
                        <span onClick={handleAddReviewDisplay} class="btn btn-secondary float-start">Cancel</span>
                    </div>
                    
                </div>
            </form>
        </>
    )
}

const generateStar = (rating) => {
    return <span>
        {
        Array(5).fill(0).map(() => {
            if (rating >= 1) {
                rating -= 1
                return <i class="bi bi-star-fill text-warning"></i>
            }
            if (rating >= 0.5) {
                rating -= 0.5
                return <i class="bi bi-star-half text-warning"></i>
            }
            return <i class="bi bi-star text-warning"></i>
        })
        }
    </span>
}
export default AddReviewCard