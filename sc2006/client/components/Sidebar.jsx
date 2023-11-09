import React, { useState } from 'react'
import SidebarCategory from './SidebarCategory'

const Sidebar = () => {
    const [priceFilter, setPriceFilter] = useState({
        cheap: false,
        affordable: false,
        expensive: false,
        luxury: false
    })

    const [cuisineFilter, setCuisineFilter] = useState({
        chinese: false,
        malay: false,
        indian: false,
        western: false,
        thai: false,
        japanese: false,
        korean: false,
        vietnamese: false
    })

    const [dietaryFilter, setDietaryFilter] = useState({
        halal: false,
        vegetarian: false,
        "dairy-free": false,
        "gluten-free": false
    })

    const resetFilter = () => {
        setPriceFilter(setAllKeysToFalse(priceFilter))
        setCuisineFilter(setAllKeysToFalse(cuisineFilter))
        setDietaryFilter(setAllKeysToFalse(dietaryFilter))
    }

    const setAllKeysToFalse = (obj) => {
        const newObj = {...obj}
        for (const key in newObj) {
            if (newObj.hasOwnProperty(key)) newObj[key] = false;
        }
        return newObj
    } 

    return (
        <>
        <div className="container mb-3 px-4 border-end">
            <div className="d-flex justify-content-between">
                <p><strong>Filter</strong></p>
                <span onClick={resetFilter}>
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Clear
                </span>
            </div>
            <SidebarCategory title="Price" filter={priceFilter} setFilter={setPriceFilter}/> 
            <SidebarCategory title="Cuisine" filter={cuisineFilter} setFilter={setCuisineFilter}/> 
            <SidebarCategory title="Dietary Requirement" filter={dietaryFilter} setFilter={setDietaryFilter}/>
            <button className="btn btn-primary">Apply</button>
        </div>
        </>
    )
}

export default Sidebar