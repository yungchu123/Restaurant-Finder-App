import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = ({ role, name, setIsAuthenticated, setUser }) => {
    const navigate = useNavigate();
    
    const logout = () => {
        localStorage.setItem('loginToken', "")
        setIsAuthenticated(false)
        setUser({})
        navigate('/')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">  
                <a href="/" className="navbar-brand">GAYSTRO</a>
                <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="navbarCollapse">
                    <span className="navbar-toggler-icon" ></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    {/* Left Side of Nav bar */}
                    <div className="navbar-nav">
                        <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                        { role.toLowerCase() === "guest" && (
                            <>
                                <NavLink to="/restaurant/search" className="nav-item nav-link">Restaurant Search</NavLink>
                            </>
                        )}

                        { role.toLowerCase() === "customer" && (
                            <>
                                <NavLink to="/restaurant/search" className="nav-item nav-link">Restaurant Search</NavLink>
                                <NavLink to="/reservations" className="nav-item nav-link">Reservations</NavLink>
                                <NavLink to="/favourite" className="nav-item nav-link">Favourite List</NavLink>
                            </>
                        )}

                        { role.toLowerCase() === "restaurateur" && (
                            <>
                                <NavLink to="/restaurant/manage" className="nav-item nav-link">Manage Restaurant</NavLink>
                                <NavLink to="/reservations" className="nav-item nav-link">Manage Reservations</NavLink>
                            </>
                        )}
                        
                    </div>

                    {/* Right Side of Nav bar */}
                    <div className="navbar-nav ms-auto">
                        { role !== "guest" ? ( 
                            <>
                                <span className="navbar-text me-3">Welcome {name}</span>
                                <NavLink to="/profile" exact={true} className="btn btn-dark me-3">Profile</NavLink>
                                <a href="/" onClick={logout} className="btn btn-primary">Log out</a>
                            </>
                        ) : (
                            <>
                                {/* <a href="/login" exact={true} className="btn btn-outline-primary" aria-current="page">Login</a> */}
                                <NavLink to="/login" exact={true} className="btn btn-outline-primary me-3" aria-current="page"> Login </NavLink>
                                <NavLink to="/register" className="btn btn-outline-primary">Register</NavLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

Navbar.defaultProps = {
    role: "guest"
}


export default Navbar