import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginForm = ({setIsAuthenticated, setUser}) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('garygay');
    const [password, setPassword] = useState('password');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setErrorMsg("All fields are required")
            return
        }

        // Authenticate Login
        axios.post('http://localhost:5000/api/users/login', JSON.stringify({ username, password }), { headers: {'Content-Type': 'application/json'} })
            .then(response => {
                console.log("Login Success")
                console.log('Response data:', response.data);

                setIsAuthenticated(true)
                setUser(response.data)     
                localStorage.setItem('loginToken', response.data._id) // Store userid as login token in local storage
                navigate('/')
            })
            .catch(error => {
                if (error.response) console.error(`Login Error: ${error.response.data.error} | Status: ${error.response.status}`);
                else console.log(`Login Error: ${error}`)
                setErrorMsg("Invalid Username or Password")
            });
        
        setErrorMsg("")
    }

    return (
        <>
        <form class="bg-light p-5" onSubmit={handleLogin}>
            <h2 class="mb-4">Login</h2>
            { errorMsg && <div class="alert alert-danger" role="alert"> {errorMsg} </div> }
            <div class="row mb-3">
                <label for="username" class="col-sm-2 col-form-label">Username</label>
                <div class="col-sm-10">
                    <input value={username} onChange={e => setUsername(e.target.value)} class="form-control" id="username" placeholder="Username"/>
                </div>
            </div>
            <div class="row mb-3">
                <label for="password" class="col-sm-2 col-form-label">Password</label>
                <div class="col-sm-10">
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" class="form-control" id="password" placeholder="Password"/>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-sm-10 offset-sm-2">
                    <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="checkRemember"/>
                            <label class="form-check-label" for="checkRemember">Remember me</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="submit" class="btn btn-primary float-start">Login</button>
                    <a href="/register" class="btn btn-secondary btn-sm float-end">Register</a>
                    <a href="/forgetpassword" class="btn btn-secondary btn-sm float-end me-3">Forget Password</a>
                </div>
            </div>
        </form>
        </>
    )
}

export default LoginForm    