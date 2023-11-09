import RestaurantCard from "../components/RestaurantCard"

const FavouriteRestaurantPage = () => {
    const restaurants = [
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
        {
            name: 'Dian Xiao Er',
            categories: ['Chinese', 'Chicken'],
            rating: 4.3,
            reviews: 100
        },
    ]
    return (
        <div class="container">
            <h2 style={{marginTop: "30px"}}> Favourite Restaurants</h2>
            <br/>
            <div class="row">
            <div className="row row-cols-4 row-gap-4 mb-4">
                        {restaurants.map(restaurant => (
                            <div className="col">
                                <RestaurantCard restaurant={restaurant}/>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
    )
}

export default FavouriteRestaurantPage