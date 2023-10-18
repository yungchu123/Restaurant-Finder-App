import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import GuestPage from "./views/GuestPage";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

function App() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const authenticate = (username, password) => {
        // Handle authentication
        console.log("Authenticating")
        if (username === "10001" && password === "password") {
            setIsLoggedIn(true)
            navigate('/')
        }
    }

    const logout = () => {
        setIsLoggedIn(false)
        navigate('/')
    }


    if (!isLoggedIn) return (
      <div className="App"> 
            <Navbar/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<LoginForm authenticate={authenticate} />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
            <Footer />
      </div>
    ) 
    return (
      <div className="App"> 
            <Navbar role="customer" logout={logout}/>
            <Routes>
                <Route path="/" element={<GuestPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
            <Footer />
      </div>
    )

}

export default App;
