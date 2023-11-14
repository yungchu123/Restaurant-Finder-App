const Sortbar = ({sortValue, setSortValue}) => {
    const sortValueArray = [
        "distance",
        "rating"
    ]

    const handleOnClick = (val) => {
        setSortValue(val)
    }

    return (
        <>
            <div class="btn-group me-3">
                <button class="btn btn-secondary dropdown-toggle"  type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="me-2">Sort by</span>
                    <strong className="me-2">{sortValue.charAt(0).toUpperCase() + sortValue.slice(1)}</strong>
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {sortValueArray.map(value => (
                        <li onClick={() => handleOnClick(value)} className="dropdown-item">
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Sortbar