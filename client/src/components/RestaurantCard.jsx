import React from 'react'
import '../index.css';
// import Star from './Star'

const RestaurantCard = ({name, cuisine, rating, reviews, imgUrl}) => {

    return (
        <>
            <div class="icon-link icon-link-hover">
                <div class="card card-hover" style={{ width: '18rem', position: 'relative' }}>
                    {/* Image */}
                    <img style={{height: '150px', objectFit: 'cover'}}
                    src={imgUrl} class="card-img-top" alt="..."/>

                    {/* Restaurant Details */}
                    <div class="card-body">
                        <h5 class="card-title mb-3">{name}</h5>
                        <p class="card-text mb-2">
                            {cuisine} 
                        </p>
                        <p className="card-text">
                        <span className="me-3"><i class="bi bi-star-fill me-1"></i> {rating}</span>
                        <span className="text-secondary"> ({reviews} reviews)</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RestaurantCard

