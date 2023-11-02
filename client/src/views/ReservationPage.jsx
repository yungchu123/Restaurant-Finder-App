import ViewReservationCard from "../components/ViewReservationCard";

const ReservationPage = () => {
    return(
        <div className="container">
          <h2 style={{marginTop: "30px"}}> Reservation</h2>
          <div style={{padding: "25px", margin: "0 auto"}}>
            <ViewReservationCard />
            <br/>
            <ViewReservationCard />
          </div>

        </div>
    )
}

export default ReservationPage;