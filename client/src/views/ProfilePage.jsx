import { NavLink } from "react-router-dom"

const ProfilePage = ({user}) => {
  return (
    <>
    <div className="container w-50 my-3">
        <h2 className="mb-4">Profile Page</h2>
        <div className="card bg-light py-4 px-5 mb-3">
            <div className="profile-row d-flex">
                <div className="col-4">
                    First Name
                </div>
                <div className="col-6 ps-3">
                    {user.firstName}
                </div>
            </div>
            <div className="profile-row d-flex">
                <div className="col-4">
                    Last Name
                </div>
                <div className="col-6 ps-3">
                    {user.lastName}
                </div>
            </div>
            <div className="profile-row d-flex">
                <div className="col-4">
                    Email
                </div>
                <div className="col-6 ps-3">
                    {user.email}
                </div>
            </div>
        </div>
        <NavLink className="btn btn-primary" to="./update">Update</NavLink>
    </div>
    </>
  )
}

export default ProfilePage