const ManageReservationCard = ({status, user}) => {
    return(
        <div class="card">
                    <h5 class="card-header">{status}</h5>
                    <a class="icon-link icon-link-hover" href="/restaurant/page" style={{ color: 'rgb(33, 37, 41)', textDecoration: 'none', width: '20'}}>
                        <div class="card-body card-hover">
                            <div class="row">
                                <div className="col-3" style={{textAlign: 'center'}}>
                                    <h5><span className="light-text">16th November 2023</span></h5>
                                    <h4><strong>6:30</strong></h4> 
                                    <h5>PM</h5>
                                </div>
                                <div class="col-1">
                                    <div class="vertical-line"></div>
                                </div>
                                <div className="col-6">
                                    <h5 class="card-title"><strong>{user}</strong></h5>
                                    <p class="card-text"> Reservation Details:
                                        <ul>
                                            <li><strong>Number of Pax:</strong>2</li>
                                            <li><strong>Reserved on:</strong> 11/11/2023 <strong>at</strong> 6:45 PM</li>
                                            <li><strong>Occasion: </strong>None</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
    )
}

export default ManageReservationCard;