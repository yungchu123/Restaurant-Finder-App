import React from 'react'
import logo from './../foodImage.png'
// import Star from './Star'

const RestaurantCard = ({restaurant}) => {

    return (
        <>
            <a href="/restaurant/page" style={{ textDecoration: 'none' }}>
            <div class="card" style={{ width: '18rem', position: 'relative' }}>
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
            {/* <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(255, 255, 255, 0.8)', padding: '5px', borderRadius: '50%'}}>
            <Star bgColor="white" />

            </div> */}
            </div>
            </a>
        </>
    )
}

export default RestaurantCard

