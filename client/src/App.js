import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <div className="App"> 
          <Navbar />
          <LoginForm />
          <h1 className="mt-3 vh-100">My React App</h1>
          <RegisterForm />
          <Footer />
    </div>
  );
}

export default App;
