import logo from '../images/foodImage.png'
import '../index.css';

const ViewReservationCard = () => {
    return(
            <>
                <div class="card">
                    <h5 class="card-header">Upcoming</h5>
                    <a class="icon-link icon-link-hover" href="/restaurant/page" style={{ color: 'rgb(33, 37, 41)', textDecoration: 'none' }}>
                        <div class="card-body card-hover">
                            <div class="row">
                                <div className="col-lg-3">
                                    <img src={logo} class="card-img-top" alt="..."/>
                                </div>
                                <div className="col-lg-6">
                                    <h5 class="card-title"><strong>Dian Xiao Er</strong></h5>
                                    <p class="card-text"> Reservation Details:
                                        <ul>
                                            <li><strong>Date and Time:</strong> 1/4/2023</li>
                                            <li><strong>Time:</strong> 5:30 PM</li>
                                            <li><strong>Number of Pax:</strong> 2 </li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </>
    )
}

export default ViewReservationCard;