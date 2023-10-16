import { useState } from "react"

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <>
        <form class="bg-light p-5" onSubmit={handleSubmit}>
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
                    <button type="submit" class="btn btn-secondary btn-sm float-end ">Register</button>
                    <button type="submit" class="btn btn-secondary btn-sm float-end me-3">Forget Password</button>
                </div>
            </div>
        </form>
        </>
    )
}

export default LoginForm    