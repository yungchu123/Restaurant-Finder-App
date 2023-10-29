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
            setErrorMsg("All fields are required")
            return
        }

        // Create new user in DB
        axios.post(
            'http://localhost:5000/api/users/', 
            JSON.stringify({ firstName, lastName, username, password, role, email }), 
            { headers: {'Content-Type': 'application/json'} }
            )
            .then(response => {
                console.log("New User Created Successfully")
                console.log('Response data:', response.data);
                setIsAuthenticated(true)
                setUser(response.data)
                navigate('/')
            })
            .catch(error => {
                if (error.response.data.error) {
                    console.error(`Register Error: ${error.response.data.error} | Status: ${error.response.status}`);
                    setErrorMsg(error.response.data.error)
                } else {
                    console.error(`Register Error: ${error}`)
                    setErrorMsg("User creation unsuccessful")
                }
            });

        setErrorMsg("")
    }

  
    return (
        <>
        <form class="bg-light p-5" onSubmit={handleSubmit}>
            <h2 class="mb-4">Register</h2>
            { errorMsg && <div class="alert alert-danger" role="alert"> {errorMsg} </div> }
            <div class="row mb-3">
                <label for="firstName" class="col-sm-2 col-form-label">First Name</label>
                <div class="col-sm-10">
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} 
                        class="form-control" id="firstName" placeholder="First Name"/>
                </div>
            </div>
            <div class="row mb-3">
                <label for="lastname" class="col-sm-2 col-form-label">Last Name</label>
                <div class="col-sm-10">
                    <input value={lastName} onChange={e => setLastName(e.target.value)} 
                        class="form-control" id="lastname" placeholder="Last Name"/>
                </div>
            </div>
            <div class="row mb-3">
                <label for="username" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                    <input value={username} onChange={e => setUsername(e.target.value)} 
                        class="form-control" id="username" placeholder="Username"/>
                </div>
            </div>
            <div class="row mb-3">
                <label for="email" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                    <input value={email}  onChange={e => setEmail(e.target.value)}
                        type="email" class="form-control" id="username" placeholder="Email"/>
                </div>
            </div>
            <div class="row mb-4">
                <label for="password" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input value={password} onChange={e => setPassword(e.target.value)} 
                        type="password" class="form-control" id="password" placeholder="Password"/>
                </div>
            </div>
            <div className="row mb-3">
                <div class="col-2">
                    Role
                </div>
                <div className="col-10">
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="role"
                                value="customer"
                                checked={role === "customer"}
                                onChange={e => setRole(e.target.value)}
                                id="customer"/>
                        <label class="form-check-label" for="customer">Customer</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" name="role"
                                value="restaurateur"
                                checked={role === "restaurateur"}
                                onChange={e => setRole(e.target.value)}
                                id="restaurateur"/>
                        <label class="form-check-label" for="restaurateur">Restaurant Manager</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="submit" class="btn btn-primary">Register</button>
                </div>
            </div>
        </form>
        </>
  )
}

export default RegisterForm