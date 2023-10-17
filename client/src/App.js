import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import GuestPage from "./views/GuestPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App"> 
          <Navbar />
          <Routes>
              <Route path="/" element={<GuestPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
          </Routes>
          <Footer />
    </div>
  );
}

export default App;
