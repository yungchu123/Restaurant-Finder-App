import { useState } from "react"

const SearchBar = () => {
    const [value, setValue] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(value)
    }

    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center">
                <div className="col-9 p-0">
                    <input value={value} onChange={e => setValue(e.target.value)} 
                    className="form-control" placeholder="Enter Location" />
                </div>
                <button type="submit" className="btn btn-primary">
                    <i className="bi bi-search"></i>
                </button>
            </div>
        </form>
    )
}

export default SearchBar