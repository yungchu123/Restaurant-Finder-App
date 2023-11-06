import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const RegisterForm = ({setIsAuthenticated, setUser}) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!firstName || !lastName || !username || !password || !email) {
            setErrorMsg("All fields are required");
            return;
        }
    
        // Create new user in DB
        axios.post('http://localhost:30005/api/users/', {
            firstName,
            lastName,
            username,
            password,
            role,
            email,
          }, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          })          
        .then(response => {
            console.log("New User Created Successfully");
            // Check if 'data' exists in the response before accessing it
            if (response.data) {
                console.log('Response data:', response.data);
                setIsAuthenticated(true);
                setUser(response.data);
                localStorage.setItem('loginToken', response.data._id);
                if (role === "customer") {
                    navigate('/restaurant/search');
                } else if (role === "restaurateur") {
                    navigate('/registered-restaurants');
                }
            } else {
                console.error('Response does not contain data');
                setErrorMsg("User creation unsuccessful");
            }
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.error) {
                console.error(`Register Error: ${error.response.data.error} | Status: ${error.response.status}`);
                setErrorMsg(error.response.data.error);
            } else {
                console.error(`Register Error: ${error}`);
                setErrorMsg("User creation unsuccessful");
            }
        });
    
        setErrorMsg("");
    }
  
    return (
        <>
        <form className="bg-light p-5" onSubmit={handleSubmit}>
            <h2 className="mb-4">Register</h2>
            { errorMsg && <div className="alert alert-danger" role="alert"> {errorMsg} </div> }
            <div className="row mb-3">
                <label htmlFor="firstName" className="col-sm-2 col-form-label">First Name</label>
                <div className="col-sm-10">
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} 
                        className="form-control" id="firstName" placeholder="First Name"/>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="lastname" className="col-sm-2 col-form-label">Last Name</label>
                <div className="col-sm-10">
                    <input value={lastName} onChange={e => setLastName(e.target.value)} 
                        className="form-control" id="lastname" placeholder="Last Name"/>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                    <input value={username} onChange={e => setUsername(e.target.value)} 
                        className="form-control" id="username" placeholder="Username"/>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                    <input value={email}  onChange={e => setEmail(e.target.value)}
                        type="email" className="form-control" id="email" placeholder="Email"/>
                </div>
            </div>
            <div className="row mb-4">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input value={password} onChange={e => setPassword(e.target.value)} 
                        type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-2">
                    Role
                </div>
                <div className="col-10">
                    <div className="form-check form-check-inline">
                        <input type="radio" className="form-check-input" name="role"
                                value="customer"
                                checked={role === "customer"}
                                onChange={e => setRole(e.target.value)}
                                id="customer"/>
                        <label className="form-check-label" htmlFor="customer">Customer</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input type="radio" className="form-check-input" name="role"
                                value="restaurateur"
                                checked={role === "restaurateur"}
                                onChange={e => setRole(e.target.value)}
                                id="restaurateur"/>
                        <label className="form-check-label" htmlFor="restaurateur">Restaurant Manager</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-10 offset-sm-2">
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
            </div>
        </form>
        </>
  )
}

export default RegisterForm