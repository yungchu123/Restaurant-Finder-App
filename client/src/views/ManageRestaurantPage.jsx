import { NavLink } from "react-router-dom";

const ManageRestaurantPage = ({restaurant}) => {

    return (
        <>
    <div className="container w-50 my-3">
        <h2 className="mb-4">Restaurant Details</h2>
        <div className="card bg-light py-4 px-5 mb-3">
            <div className="profile-row d-flex">
                <div className="col-4">
                    Restaurant Name
                </div>
                <div className="col-6 ps-3">
                    {restaurant.restaurantName}
                </div>
            </div>
            <div className="profile-row d-flex">
                <div className="col-4">
                    Description
                </div>
                <div className="col-6 ps-3">
                    {restaurant.description}
                </div>
            </div>
            <div className="profile-row d-flex">
                <div className="col-4">
                    Address
                </div>
                <div className="col-6 ps-3">
                    637125
                </div>
            </div>
            <div className="profile-row d-flex">
                <div className="col-4">
                    Cuisine Type
                </div>
                <div className="col-6 ps-3">
                    {restaurant.cuisine}
                </div>
            </div>
        </div>
        <NavLink className="btn btn-primary" to="../restaurant/manage/update">Update</NavLink>
    </div>
        </>
    )
    
}

export default ManageRestaurantPage