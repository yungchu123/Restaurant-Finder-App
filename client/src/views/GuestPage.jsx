import SearchBar from "../components/SearchBar"
import banner from "../images/banner.png"

const GuestPage = () => {
  return (
    <div style={{height: '90vh'}} className="container d-flex flex-column align-items-center">
        <img src={banner} className="mt-5 mb-5" alt="banner"/>
        <SearchBar/>
    </div>
  )
}

export default GuestPage