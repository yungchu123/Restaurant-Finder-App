import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UpdateProfilePage = ({user, setUser}) => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);

    const updateProfile = async () => {
        axios.patch(`http://localhost:5000/api/users/${user._id}`, JSON.stringify({ firstName, lastName, email }), { headers: {'Content-Type': 'application/json'} })
        .then(response => {
            console.log("User updated. New user: ", response.data)
            setUser(response.data)
            navigate('/profile')
        })
        .catch(error => {
            console.error(`Update User Error: ${error.response.data.error} | Status: ${error.response.status}`);
        });
    }

    const cancel = () => {
        navigate('/profile')
    }

    return (
        <>
        <div className="container w-50 my-3">
            <h2 className="mb-4">Profile Page</h2>
            <div className="card bg-light py-4 px-5 mb-3">
                <div className="profile-row d-flex">
                    <div className="col-4">
                        First Name
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="profile-row d-flex">
                    <div className="col-4">
                        Last Name
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" />
                    </div>
                </div>
                <div className="profile-row d-flex">
                    <div className="col-4">
                        Email
                    </div>
                    <div className="col-8 d-flex align-items-center">
                        <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
                    </div>
                </div>
            </div>
            <button className="btn btn-primary me-3" onClick={updateProfile}>Confirm Update</button>
            <button className="btn btn-primary" onClick={cancel}>Cancel</button>
        </div>
        </>
    )
}

export default UpdateProfilePage