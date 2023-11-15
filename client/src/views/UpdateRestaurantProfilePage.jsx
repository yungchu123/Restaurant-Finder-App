// import { useState } from "react"
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

// const  UpdateRestaurantProfilePage = ({user, setUser}) => {
//     const navigate = useNavigate();

//     const [restaurantname, setRestaurantName] = useState(user.restaurantnameName);
//     const [description, setDescription] = useState(user.description);
//     const [address, setAddress] = useState(user.address);
//     const [email, setEmail] = useState(user.email);
//     const [contactnumber, setContactNumber] = useState(user.contactNumber);
//     const [timings, setTimings] = useState(user.timings);


//     const updateRestaurantProfile = async () => {
//         axios.patch(`http://localhost:5001/api/users/${user._id}`, JSON.stringify({ firstName, lastName, email }), { headers: {'Content-Type': 'application/json'} })
//         .then(response => {
//             console.log("User updated. New user: ", response.data)
//             setUser(response.data)
//             navigate('/restaurant/manage')
//         })
//         .catch(error => {
//             console.error(`Update User Error: ${error.response.data.error} | Status: ${error.response.status}`);
//         });
//     }

//     const cancel = () => {
//         navigate('/restaurant/manage')
//     }

//     return (
//         <>
//         <div className="container w-50 my-3">
//             <h2 className="mb-4">Profile Page</h2>
//             <div className="card bg-light py-4 px-5 mb-3">
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         First Name
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={restaurantname} onChange={e => setRestaurantName(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         Last Name
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={description} onChange={e => setDescription(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         Address
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={address} onChange={e => setAddress(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         Email
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         Contact Number
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={contactnumber} onChange={e => setContactNumber(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//                 <div className="profile-row d-flex">
//                     <div className="col-4">
//                         Timinigs
//                     </div>
//                     <div className="col-8 d-flex align-items-center">
//                         <input value={timings} onChange={e => setTimings(e.target.value)} className="form-control" />
//                     </div>
//                 </div>
//             </div>
//             <button className="btn btn-primary me-3" onClick={updateRestaurantProfile}>Confirm Update</button>
//             <button className="btn btn-primary" onClick={cancel}>Cancel</button>
//         </div>
//         </>
//     )
// }

// export default UpdateRestaurantProfilePage;