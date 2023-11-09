import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import LoginForm from "./views/LoginPage";
import ContactUs from "./components/ContactUs";
import RegisterForm from "./views/RegisterPage";
import ForgetPassword from "./components/ForgetPassword";
import ReservationCard from "./components/ReservationCard";
import ViewReservationCard from "./components/ViewReservationCard";
import RestaurantPage from "./views/RestaurantPage";
import ReservationPage from "./views/ReservationPage";
import FavouriteRestaurantPage from "./views/FavouriteRestaurantPage";
import TAndC from "./components/TAndC";
import GuestPage from "./views/GuestPage";
import CustomerDashboard from "./views/CustomerDashboard";
import RestaurantOwnerDashboard from "./views/RestaurantOwnerDashboard";
import ProfilePage from "./views/ProfilePage";
import UpdateProfilePage from "./views/UpdateProfilePage";
import RestaurantSearchPage from "./views/RestaurantSearchPage";
import { Routes, Route} from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({})

    useEffect(() => {
      // Check for the user's login status when the component mounts
      const loginToken = localStorage.getItem('loginToken');
  
      if (loginToken) {
          (async () => {
            axios.get(`http://localhost:5000/api/users/${loginToken}`)
            .then(response => {
                console.log('User data:', response.data);
                setIsAuthenticated(true)
                setUser(response.data)
            })
            .catch(error => {
                if (error.response) console.error(`User data not found: ${error.response} | Status: ${error.response.status}`);
                else console.log(`Error: ${error}`)
                setIsAuthenticated(false)
            });
          })();
      }
    }, []);


    if (!isAuthenticated) return (
      <div className="App"> 
            <Navbar setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
                <Route path="/register" element={<RegisterForm setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
                <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                <Route path="/aboutus" element={<AboutUs/>}/>
                <Route path="/contactus" element={<ContactUs/>}/>
                <Route path="/tandc" element={<TAndC/>}/>
                <Route path="/forgetpassword" element={<ForgetPassword/>}/> 
                <Route path="/restaurant/page" element={<RestaurantPage />}/> 
                <Route path="/reservationcard" element={<ReservationCard/>}/>
                <Route path="/reservations" element={<ReservationPage/>}/>
                <Route path="/viewreservationcard" element={<ViewReservationCard/>}/>
            </Routes>
            <Footer />
      </div>
    ) 
    return (
      <div className="App"> 
            <Navbar role={user.role} name={user.firstName + " " + user.lastName} setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>
            <Routes>
                {user.role.toLowerCase()==="customer" ? <Route path="/" element={<CustomerDashboard />} /> : <Route path="/" element={<RestaurantOwnerDashboard />} />}
                <Route path="/profile" element={<ProfilePage user={user}/>} />
                <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                <Route path="/profile/update" element={<UpdateProfilePage user={user} setUser={setUser}/>} />
                <Route path="/restaurant/page" element={<RestaurantPage />}/> 
                <Route path="/reservationcard" element={<ReservationCard/>}/>
                <Route path="/reservations" element={<ReservationPage/>}/>
                <Route path="/viewreservationcard" element={<ViewReservationCard/>}/>
                <Route path="/favourite" element={<FavouriteRestaurantPage/>}/>
            </Routes>
            <Footer />
      </div>
    )

}

export default App;
