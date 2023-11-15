import React from 'react'
import '../index.css';
import defaultImage from '../images/defaultRestaurantPhoto.jpg'
// import Star from './Star'

const RestaurantCard = ({name, cuisine, rating, numReviews, imgUrl, forClaimingOwner}) => {
    console.log(imgUrl)
    return (
        <>
            <div class="icon-link icon-link-hover" style={{height:'100%'}}>
                <div class="card card-hover" style={{ width: '18rem', height: '100%', position: 'relative' }}>
                    {/* Image */}
                    <img style={{height: '150px', objectFit: 'cover'}}
                    src={imgUrl || defaultImage} class="card-img-top" alt="..."/>

                    {/* Restaurant Details */}
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title">{capitalize(name)}</h5>
                        { !forClaimingOwner && (
                            <div className='mt-auto mb-0'>
                                <p class="card-text mb-2">
                                    {cuisine} 
                                </p>
                                <p className="card-text">
                                <span className="me-3"><i class="bi bi-star-fill me-1"></i> {rating}</span>
                                <span className="text-secondary"> ({numReviews} reviews)</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function capitalize(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
}

RestaurantCard.defaultProps = {
    forClaimingOwner: false,
}

export default RestaurantCard

