import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";
import LoginForm from "./components/LoginForm";
import ContactUs from "./components/ContactUs";
import RegisterForm from "./components/RegisterForm";
import TAndC from "./components/TAndC";
import GuestPage from "./views/GuestPage";
import ProfilePage from "./views/ProfilePage";
import UpdateProfilePage from "./views/UpdateProfilePage";
import RestaurantSearchPage from "./views/RestaurantSearchPage";
import RegisteredRestaurants from "./views/RegisteredRestaurants";
import RegisterRestaurant from "./views/RegisterRestaurant";
import RestaurantDetails from './views/RestaurantDetails';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(localStorage.getItem('role') || { role: 'guest' });

  useEffect(() => {
    // Check for the user's login status when the component mounts
    const loginToken = localStorage.getItem('loginToken');
    
      if (loginToken) {
        (async () => {
          try {
            const response = await axios.get(`http://localhost:30005/api/users/${loginToken}`);
            console.log('User data:', response.data);
    
            if (response.status === 200) {
              setIsAuthenticated(true);
              setUser(response.data);
            } else {
              console.error(`Unexpected response status: ${response.status}`);
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error(`User data not found: ${error.message} | Status: ${error.response?.status}`);
            setIsAuthenticated(false);
          }
        })();
      }
    }, [setIsAuthenticated]);   

    if (!isAuthenticated) {
      return (
          <div className="App">
              <Navbar setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              <Routes>
                  <Route path="/" element={<GuestPage />} />
                  <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser} role={user.role} />} />
                  <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                  <Route path="/contactus" element={<ContactUs />} />
                  <Route path="/tandc" element={<TAndC />} />
                  <Route path="/register" element={<RegisterForm setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
              </Routes>
              <Footer />
          </div>
      );
  } else if (user.role === "customer") { // Check if the user is a customer
      return (
          <div className="App">
            <Navbar role={user.role} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              <Routes>
                  <Route path="/" element={<GuestPage />} />
                  <Route path="/profile" element={<ProfilePage user={user} />} />
                  <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                  <Route path="/profile/update" element={<UpdateProfilePage user={user} setUser={setUser} />} />
              </Routes>
              <Footer />
          </div>
      );
  } else if (user.role === "restaurateur") { // Check if the user is a restaurateur
      return (
          <div className="App">
              <Navbar role={user.role} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
              <Routes>
                  <Route path="/" element={<GuestPage />} />
                  <Route path="/profile" element={<ProfilePage user={user} />} />
                  <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                  <Route path="/profile/update" element={<UpdateProfilePage user={user} setUser={setUser} />} />
                  <Route path="/registered-restaurants" element={<RegisteredRestaurants username={user.username} role={user.role} />} /> {/* Manager-specific route */}
                  <Route path="/register/restaurants" element={<RegisterRestaurant username={user.username} role={user.role} />} /> {/* Manager-specific route */}
                  <Route path="/restaurant-details/:restaurantId" element={<RestaurantDetails />} />
              </Routes>
              <Footer />
          </div>
      );
  }
}

export default App;