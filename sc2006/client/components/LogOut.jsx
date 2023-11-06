import { useNavigate } from "react-router-dom";

const LogoutForm = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions, such as clearing the user data and token
    // For example, you can remove the user data from localStorage
    localStorage.removeItem('loginToken');

    // Set isAuthenticated to false to indicate that the user is logged out
    setIsAuthenticated(false);

    // Navigate to the login page or any other appropriate page
    navigate('/');
  };

  return (
    <button onClick={handleLogout} className="btn btn-primary">
      Logout
    </button>
  );
};

export default LogoutForm;
