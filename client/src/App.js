import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App"> 
          <Navbar />
          <Routes>
              <Route path="/" element={<h1 className="mt-3 vh-100">Restaurant Finder</h1>} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
          </Routes>
          <Footer />
    </div>
  );
}

export default App;
