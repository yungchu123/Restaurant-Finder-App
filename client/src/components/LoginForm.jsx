import { useState } from "react"

const LoginForm = ({authenticate}) => {
    const [username, setUsername] = useState('10001');
    const [password, setPassword] = useState('password');

    const handleLogin = (e) => {
        e.preventDefault();
        authenticate(username, password)
    }

    return (
        <>
        <form class="bg-light p-5" onSubmit={handleLogin}>
            <h2 class="mb-4">Login</h2>
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
                    <a href="/#" class="btn btn-secondary btn-sm float-end me-3">Forget Password</a>
                </div>
            </div>
        </form>
        </>
    )
}

export default LoginForm    