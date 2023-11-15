import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({location, setLocation}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [value, setValue] = useState(location);

    console.log(pathname)

    const handleSubmit = (e) => {
        e.preventDefault()
 
        // Redirect to search page if not there
        if (pathname !== '/restaurant/search') {
            navigate('/restaurant/search', { replace: true, state: {
                location: value
            }})
        } else {
            setLocation(value)
        }
    }

    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center">
                <div className="col-9 p-0">
                    <input value={value} onChange={e => setValue(e.target.value)} 
                    class="form-control" placeholder="Enter a location" />
                </div>
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        </form>
    )
}

export default SearchBar