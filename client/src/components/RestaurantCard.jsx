import React from 'react'
import logo from './../foodImage.png'

const RestaurantCard = ({restaurant}) => {

    return (
        <>
            <div class="card" style={{width: "18rem"}}>
            <img src={logo} class="card-img-top" alt="..."/>
            <div class="card-body">
                <h5 class="card-title mb-3">{restaurant.name}</h5>
                <p class="card-text mb-2">
                    {restaurant.categories.join(" | ")} 
                </p>
                <p className="card-text">
                    <span className="me-3"><i class="bi bi-star-fill me-1"></i> {restaurant.rating}</span>
                    <span className="text-secondary"> ({restaurant.reviews} reviews)</span>
                </p>
            </div>
            </div>
        </>
    )
}

export default RestaurantCard