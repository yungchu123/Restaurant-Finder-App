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
                <SearchBar />
            </div>
            <div className="row">
                {/* Filter Side Bar */}
                <div className="col-sm-2">
                    <Sidebar />
                </div>
                <div className="col-10 px-4">
                    {/* Search Result and Sort Bar */}
                    <div className="d-flex justify-content-between mb-4">
                        <h5>Search Results: {restaurants.length} </h5>
                        <Sortbar />
                    </div>
                    {/* List of Restaurants */}
                    <div className="row row-cols-4 row-gap-4 mb-4">
                        {restaurants.map(restaurant => (
                            <div className="col">
                                <RestaurantCard restaurant={restaurant}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default RestaurantSearchPage