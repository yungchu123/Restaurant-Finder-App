import React from 'react'

const ReviewCard = ({authorName, rating, description}) => {
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
  
    return (
    <>
        <div className="card shadow-sm">
            <div class="card-body">
                <h6 class="card-title mb-2">{authorName}</h6>
                <p>{generateStar(rating)}</p>
                <p className="card-text">{description}</p>
            </div>
        </div>


    </>

  )
}

export default ReviewCard