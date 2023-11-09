const SidebarCategory = ({title, filter, setFilter}) => {

    const handleSetFilter = (key) => {
        setFilter({
            ...filter,
            [key]: !filter[key]
        })
    }

    return (
        <>
        <div className="mb-4">
            <header className="mb-2">{title}</header>
            {Object.keys(filter).map(key => (
                <>
                <div class="form-check">
                    <input 
                        class="form-check-input" 
                        type="checkbox" 
                        checked={filter[key]}
                        onChange={() => handleSetFilter(key)}
                        id={key}/>
                    <label class="form-check-label" for={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                </div>
                </>
            ))}
        </div>
        </>
    )
}

export default SidebarCategory