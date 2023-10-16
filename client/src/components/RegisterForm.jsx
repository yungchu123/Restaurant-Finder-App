import { useState } from "react"

const RegisterForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(firstName, lastName, username, password, role, email)
    }

  
    return (
        <>
        <form class="bg-light p-5" onSubmit={handleSubmit}>
            <h2 class="mb-4">Register</h2>
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
                        <label class="form-check-label" for="restaurateur">Restaurateur</label>
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