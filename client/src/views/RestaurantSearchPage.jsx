import SearchBar from "../components/SearchBar"
import Sidebar from "../components/Sidebar"
import Sortbar from "../components/Sortbar"

const RestaurantSearchPage = () => {

    return (
        <>
            <div className="container my-4">
                <SearchBar />
            </div>
            <div className="row">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10">
                    <div className="d-flex justify-content-between">
                        <h5>Search Results</h5>
                        <Sortbar />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RestaurantSearchPage