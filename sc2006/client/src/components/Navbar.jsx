import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoutForm from "./LogOut";

const Navbar = ({ role, setIsAuthenticated, setUser }) => {
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
                <a href="/#" className="navbar-brand">GAYSTRO</a>
                <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav">
                        <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                        {role === "restaurateur" ? (
                            <NavLink
                                to="/register/restaurants"
                                className="nav-link nav-link"
                            >
                                Register Restaurant
                            </NavLink>
                            ) : (
                            <NavLink
                                to="/restaurant/search"
                                className="nav-link nav-link"
                            >
                                Restaurant
                            </NavLink>
                            )}
                    </div>
                    <div className="navbar-nav ms-auto">
                        { role !== "guest" ? ( 
                            <>
                                <NavLink to="/profile" exact="true" className="btn btn-dark me-3">Profile   </NavLink>
                                <LogoutForm setIsAuthenticated={setIsAuthenticated} logout={logout} />
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" exact="true" className="btn btn-outline-primary">Login</NavLink>
                                <div style={{ margin: '7px' }}></div>
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