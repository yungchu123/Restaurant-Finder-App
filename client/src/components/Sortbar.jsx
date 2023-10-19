import { useState } from "react"

const Sortbar = () => {
    const [sortValue, setSortValue] = useState('Relevance');
    
    const sortValueArray = [
        "Relevance",
        "Distance",
        "Rating: High to Low",
        "Price: Low to High"
    ]

    const handleOnClick = (val) => {
        setSortValue(val)
    }

    return (
        <>
            <div class="btn-group me-3">
                <button class="btn btn-secondary dropdown-toggle"  type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="me-2">Sort by</span>
                    <strong className="me-2">{sortValue}</strong>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {sortValueArray.map(value => (
                        <li onClick={() => handleOnClick(value)} className="dropdown-item">{value}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Sortbar