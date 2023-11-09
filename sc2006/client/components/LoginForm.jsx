import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = ({setIsAuthenticated, setUser}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMsg("All fields are required")
            return
        }

        // Authenticate Login
        axios.post('http://localhost:30005/api/users/login', JSON.stringify({ username, password }), { headers: {'Content-Type': 'application/json'} })
            .then(response => {
                console.log("Login Success")
                console.log('Response data:', response.data);

                setIsAuthenticated(true)
                setUser(response.data)     
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('loginToken', response.data._id); // Store userid as login token in local storage
                if (response.data.role === "customer") {
                    navigate('/restaurant/search');
                } else if (response.data.role === "restaurateur") {
                    navigate('/registered-restaurants');
                }
            })
            .catch(error => {
                if (error?.response?.status === 401) {
                    setErrorMsg("Invalid Username or Password");
                } else if (error?.response?.status === 500) {
                    setErrorMsg("Server Error: Please try again later");
                } else {
                    setErrorMsg("An unexpected error occurred");
                }
                console.error(`Login Error: ${error?.response?.data?.error} | Status: ${error?.response?.status}`);
            });
        
        setErrorMsg("")
    }

    return (
        <>
        <form className="bg-light p-5" onSubmit={handleLogin}>
            <h2 className="mb-4">Login</h2>
            { errorMsg && <div className="alert alert-danger" role="alert"> {errorMsg} </div> }
            <div className="row mb-3">
                <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                    <input value={username} onChange={e => setUsername(e.target.value)} className="form-control" id="username" placeholder="Username"/>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-10 offset-sm-2">
                    <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="checkRemember"/>
                            <label className="form-check-label" htmlFor="checkRemember">Remember me</label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-10 offset-sm-2">
                    <button type="submit" className="btn btn-primary float-start">Login</button>
                    <a href="/register" className="btn btn-secondary btn-sm float-end">Register</a>
                    <a href="/#" className="btn btn-secondary btn-sm float-end me-3">Forget Password</a>
                </div>
            </div>
        </form>
        </>
    )
}

export default LoginForm    