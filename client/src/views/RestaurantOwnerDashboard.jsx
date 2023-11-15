import { useEffect, useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { MyContext } from '../App'
import RestaurantCard from '../components/RestaurantCard'
import axios from 'axios'
import CreateRestaurantForm from '../components/CreateRestaurantForm'
import logo from '../images/congratulation.png'

const RestaurantOwnerDashboard = () => {
    const { user } = useContext(MyContext)
    const [hasRestaurant, setHasRestaurant] = useState(user.restaurantOwned !== null)
    const [restaurants, setRestaurants] = useState([])

    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        // Pull a list of favourite restaurants from the backend
        const fetchData = async () => {
          try {
              // Fetch a list of restaurant ids with no owner
              const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/manager`);
              const restaurantsId = response.data;
              console.log('List of restaurant ids: ', response.data)
              
              // Fetch some of the restaurants from a list of restaurant ids
              const limit = 10
              const listOfRestaurantsPromises = restaurantsId.slice(0, limit).map(async (restaurantId) => {
                  const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/restaurants/${restaurantId}`);
                  return response.data; 
              });
              
              Promise.all(listOfRestaurantsPromises)
                .then(listOfRestaurants => {
                  // Now listOfRestaurants contains the resolved values of all promises
                  console.log('List of Restaurants:', listOfRestaurants)
                  setRestaurants(listOfRestaurants)
                })
                .catch(error => {
                  console.error('Error fetching restaurants:', error);
                });
          } catch (error) {
              console.log(`Error: ${error}`);
          }
        };

        if (!hasRestaurant) fetchData()
    }, [user._id, hasRestaurant])
    
    const handleClaimOwner = async (restaurantId) => {
      try {
          const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/users/${user._id}/manager`, 
            JSON.stringify({ restaurantId }), 
            { headers: {'Content-Type': 'application/json'} })
          setHasRestaurant(true)
          alert(response.data.message)
      } catch (error) {
          alert(error.response.data.message)
      }
    }

    if (!hasRestaurant) return (
      <>
          <h2 className='text-center mt-3 mb-5'>Restaurant Set Up</h2>
          <div className="row mx-0">
                {/* LEFT SIDE  */}
                <div className="col-8">
                    <h3 className='text-center mb-3'>Find your restaurants</h3>
                    {/* Search Bar */}
                    <div className="d-flex justify-content-center mb-5">
                        <div className="col-9 p-0">
                            <input value={searchValue} onChange={e => setSearchValue(e.target.value)} 
                            class="form-control" placeholder="Restaurant Name" />
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>

                    {/* List of Restaurant Cards */}
                    <div className="row row-cols-3 row-gap-3 mb-5 mx-0">
                    {restaurants.map(restaurant => (
                            <div className="col">
                              <div style={{height: '250px'}}>
                                <NavLink to={`../restaurant/${restaurant.restaurantId}`}> 
                                <RestaurantCard 
                                    name={restaurant.restaurantName} 
                                    cuisine={restaurant.cuisine} 
                                    rating={restaurant.rating}
                                    numReviews={restaurant.numReviews}
                                    imgUrl={restaurant.imageData}
                                    forClaimingOwner={true}
                                />     
                                </NavLink>
                              </div>
                              <div className="text-center" style={{width: '18rem'}}>
                                  <button className="btn btn-primary mt-3" onClick={() => {handleClaimOwner(restaurant.restaurantId)}}>Claim</button>
                              </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-4">
                    <h3 className='text-center mb-3'>Don't have one?</h3>
                    <CreateRestaurantForm setHasRestaurant={setHasRestaurant}/>
                </div>
          </div>
      </>
    )

    return (
      <>
        <div style={{height: '92.1vh'}} className="d-flex justify-content-center align-items-center">
            <img style={{width: '100%', height: '100%', objectFit: 'cover'}} src={logo} alt="" />
            {/* <h2>Congratulation on your opening! &#127881; &#127881;</h2> */}
        </div>
      </>
    )
}

export default RestaurantOwnerDashboard