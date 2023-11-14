import { useState } from "react"

const SearchBar = ({setLocation}) => {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault()
        // VALIDATION

        setLocation(value)
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