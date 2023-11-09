const Footer = () => {
  return (
    <div className="bg-dark py-5">
        <div className="container mt-5 text-white bg-dark">
            <div className="row">
                <div className="col-lg-3">
                    <h6 className="text-uppercase fs-5 mb-3">Discover</h6>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Rewards</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Deals</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Reservations</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Restaurant near me</a>
                </div>
                <div style={{ margin: '7px' }}></div>
                <div className="col-lg-3">
                    <h6 className="text-uppercase fs-5 mb-3">Gaystro</h6>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/aboutus">About us</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Blog</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Careers</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/tandc">Terms & Conditions</a>
                </div>
                <div style={{ margin: '7px' }}></div>
                <div className="col-lg-3">
                    <h6 className="text-uppercase fs-5 mb-3">More</h6>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Affiliate Program</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/contactus">Contact Us</a>
                </div>
                <div style={{ margin: '7px' }}></div>
                <div className="col-lg-3">
                    <h6 className="text-uppercase fs-5 mb-3">Businesses</h6>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Delight more diners</a>
                        <a className="d-block link-underline link-underline-opacity-0 text-white-50 ps-0" href="/#">Open for Business Blog</a>
                </div>
            </div>
        </div>  
    </div>

  )
}

export default Footer