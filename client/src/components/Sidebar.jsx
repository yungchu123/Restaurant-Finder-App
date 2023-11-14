import React, { useState } from 'react'
import SidebarCategory from './SidebarCategory'

const Sidebar = ({setDistanceFilter, setFilter}) => {
    const [cuisineFilter, setCuisineFilter] = useState({
        chinese: false,
        muslim: false,
        indian: false,
        western: false,
        japanese: false,
        korean: false,
        vietnamese: false,
        thai: false,
        italian: false,
        american: false,
        french: false,
        mexican: false
    })

    const [distanceOption, setDistanceOption] = useState('1000')

    const resetFilter = () => {
        setCuisineFilter(setAllKeysToFalse(cuisineFilter))
        setDistanceOption('1000')
    }

    const setAllKeysToFalse = (obj) => {
        const newObj = {...obj}
        for (const key in newObj) {
            if (newObj.hasOwnProperty(key)) newObj[key] = false;
        }
        return newObj
    } 

    const handleFilter = () => {
        setFilter({...cuisineFilter})
        setDistanceFilter(distanceOption)
    }

    return (
        <>
        <div className="container mb-3 px-4 border-end">
            <div className="d-flex justify-content-between">
                <p><strong>Filter</strong></p>
                <span onClick={resetFilter}>
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    Reset
                </span>
            </div>
            <SidebarCategory title="Cuisine" filter={cuisineFilter} setFilter={setCuisineFilter}/>
            
            {/* Select Distance Filter */}
            <header className="mb-2">Distance</header>
            <div className='form-check'>
                <label className='form-check-label'>
                <input
                    className='form-check-input'
                    type="radio"
                    value="1000"
                    checked={distanceOption === '1000'}
                    onChange={e => setDistanceOption(e.target.value)}
                />
                Brisk Walk (1 km)
                </label>
            </div>
            <div className='form-check'>
                <label className='form-check-label'>
                <input
                    className='form-check-input'
                    type="radio"
                    value="2000"
                    checked={distanceOption === '2000'}
                    onChange={e => setDistanceOption(e.target.value)}
                />
                On Foot (2 km)
                </label>
            </div>
            <div className='form-check'>
                <label className='form-check-label'>
                <input
                    className='form-check-input'
                    type="radio"
                    value="4000"
                    checked={distanceOption === '4000'}
                    onChange={e => setDistanceOption(e.target.value)}
                />
                Bike (4 km)
                </label>
            </div>
            <div className='form-check'>
                <label className='form-check-label'>
                <input
                    className='form-check-input'
                    type="radio"
                    value="8000"
                    checked={distanceOption === '8000'}
                    onChange={e => setDistanceOption(e.target.value)}
                />
                Drive (8 km)
                </label>
            </div>
            <button className="btn btn-primary mt-4" onClick={handleFilter}>Apply</button>
        </div>
        </>
    )
}

export default Sidebar