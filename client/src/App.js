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
import { Routes, Route} from "react-router-dom";
import { useState } from "react";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        role: "customer"
    })


    if (!isAuthenticated) return (
      <div className="App"> 
            <Navbar/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
                <Route path="/register" element={<RegisterForm setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>} />
                <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                <Route path="/aboutus" element={<AboutUs/>}/>
                <Route path="/contactus" element={<ContactUs/>}/>
                <Route path="/tandc" element={<TAndC/>}/>
            </Routes>
            <Footer />
      </div>
    ) 
    return (
      <div className="App"> 
            <Navbar role={user.role} setIsAuthenticated={setIsAuthenticated}/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/profile" element={<ProfilePage user={user}/>} />
                <Route path="/restaurant/search" element={<RestaurantSearchPage />} />
                <Route path="/profile/update" element={<UpdateProfilePage user={user} setUser={setUser}/>} />
            </Routes>
            <Footer />
      </div>
    )

}

export default App;
