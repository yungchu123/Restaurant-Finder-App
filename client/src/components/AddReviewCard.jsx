import React, { useState } from 'react'

const AddReviewCard = ({setDisplayAddReview}) => {
    const [rating, setRating] = useState(2)
    const [text, setText] = useState('')

    // NEED TO IMPLEMENT ADD REVIEW TO BACKEND
    const handleAddReview = (e) => {
        e.preventDefault();
        alert('add review')
    }

    const handleAddReviewDisplay = () => {
        setDisplayAddReview(false)
    }

    return (
        <>
            <form className="border border-info border-3 rounded p-4" onSubmit={handleAddReview}>
                <h3 class="mb-3">Add Review</h3>
                {/* Choose Rating Section */}
                <div className="row mb-3">
                    <div className="col-4 d-flex align-items-center">
                        <label htmlFor="rating">Choose a Rating (1 to 5) </label>
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

export default AddReviewCard