import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import GuestPage from "./views/GuestPage";
import ProfilePage from "./views/ProfilePage";
import UpdateProfilePage from "./views/UpdateProfilePage";
import { Routes, Route} from "react-router-dom";
import { useState } from "react";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
    })


    if (!isAuthenticated) return (
      <div className="App"> 
            <Navbar/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
            <Footer />
      </div>
    ) 
    return (
      <div className="App"> 
            <Navbar role="customer" setIsAuthenticated={setIsAuthenticated}/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/profile" element={<ProfilePage user={user}/>} />
                <Route path="/profile/update" element={<UpdateProfilePage user={user} setUser={setUser}/>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
            <Footer />
      </div>
    )

}

export default App;
