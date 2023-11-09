import { useState } from "react"
// import { useNavigate } from "react-router-dom";

const ForgetPassword = ({user, setUser}) => 
{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const checkEmail = (inputEmail) => {
        // Regular expression for email validation
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = emailPattern.test(inputEmail);
        setIsEmailValid(isValid);
        setEmail(inputEmail);
    };
    const checkPassword = (inputPassword) => {
        setPassword(inputPassword);
      };
    
      const checkConfirmPassword = (inputConfirmPassword) => {
        setConfirmPassword(inputConfirmPassword);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (password === confirmPassword) {
          // Passwords match, you can implement the logic to update the password here
          console.log("Password updated:", password);
        } else {
          // Passwords do not match, handle this case (e.g., show an error message)
          console.log("Passwords do not match");
          setIsPasswordValid(false);
        }
      };
    
    return(
        <form class="bg-light p-5" onSubmit={handleSubmit}>
            <h2 class="mb-4">Forget Password</h2>
            <div class="row mb-3">
            <label for="username" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
                <input type="email" className={`form-control ${isEmailValid ? "" : "is-invalid"}`} id="email" value={email} onChange={(e) => checkEmail(e.target.value)} placeholder="Email"/>
                {!isEmailValid && (
                  <div className="invalid-feedback">Invalid email format</div>
                )}
              </div>
            </div>
            <div class="row mb-3">
                <label for="password" class="col-sm-2 col-form-label"> New Password</label>
                <div class="col-sm-10">
                <input type="password" className={`form-control ${isPasswordValid ? "" : "is-invalid"}`} id="password" value={password} onChange={(e) => checkPassword(e.target.value)} placeholder="New Password"/>
                </div>
            </div>
            <div class="row mb-3">
                <label for="password" class="col-sm-2 col-form-label"> New Password</label>
                <div class="col-sm-10">
                    <input type="password" className={`form-control ${ isPasswordValid ? "" : "is-invalid"}`} id="confirmPassword" value={confirmPassword} onChange={(e) => checkConfirmPassword(e.target.value)} placeholder="Re-enter the new password"/>
                    {!isPasswordValid && (<div className="invalid-feedback">Passwords do not match</div>)}
                </div>
            </div>
            <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="submit" class="btn btn-primary float-start">Change the password</button>
                </div>
            </div>
        </form>
    )
}

export default ForgetPassword