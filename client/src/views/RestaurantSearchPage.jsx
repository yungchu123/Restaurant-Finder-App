import RestaurantCard from "../components/RestaurantCard"
import SearchBar from "../components/SearchBar"
import Sidebar from "../components/Sidebar"
import Sortbar from "../components/Sortbar"

const RestaurantSearchPage = () => {
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
        <>
            <div className="container mt-4 mb-5">
                <SearchBar/>
            </div>
            <div className="row">
                {/* Filter Side Bar */}
                <div className="col-sm-2">
                    <Sidebar />
                </div>
                <div className="col-sm-5">
                    {/* Search Result and Sort Bar */}
                    <div className="d-flex justify-content-between mb-4">
                        <h5>Search Results: {restaurants.length} </h5>
                        <Sortbar />
                    </div>
                    {/* List of Restaurants */}
                    <div className="row row-cols-2 row-gap-5 mb-5">
                        {restaurants.map(restaurant => (
                            <div className="col">
                                <RestaurantCard restaurant={restaurant}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div class="col-sm-5">
                    <iframe
                    src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d29038.707431301053!2d103.69705958315535!3d1.3440332249986962!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2ssg!4v1699270816843!5m2!1sen!2ssg"
                    width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>

            </div>
            
        </>
    )
}

export default RestaurantSearchPage