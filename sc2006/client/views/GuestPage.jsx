import SearchBar from "../components/SearchBar"

const GuestPage = () => {
  return (
    <div style={{height: '50vh'}} className="pt-3 container d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4">Restaurant Finder</h1>
        <SearchBar/>
    </div>
  )
}

export default GuestPage