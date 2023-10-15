const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <a href="/#" className="navbar-brand">GAYSTRO</a>
            <button type="button" className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="/#navbarCollapse">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <div className="navbar-nav">
                    <a href="/#" className="nav-item nav-link active">Home</a>
                    <a href="/#" className="nav-link nav-link">Restaurant</a>
                </div>
                <div className="navbar-nav ms-auto">
                    <a href="/#" className="btn btn-outline-dark me-3">Login</a>
                    <a href="/#" className="btn btn-primary">Sign up</a>
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar