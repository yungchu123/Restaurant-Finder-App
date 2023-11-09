import { useState } from "react"

const ContactUs = () => {
    // The form does not ask for email, contact number and name if the user is logged in 
    const [fullName, setFullName] = useState('');
    const[contactNumber, setContactNumber] = useState('');
    const[email, setEmail] = useState('');
    const[subject,setSubject]=useState('');
    const[message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(fullName, contactNumber, email, subject, message)
    }

    //need to input the particulars even if you are logged in 
    return (
        <>
            <form class="bg-light p-5" onSubmit={handleSubmit}>
                <h2  class="mb-4"> Contact Us</h2>
                <div class="row mb-3">
                    <label for="fullName" class="col-sm-2 col-form-label">Full Name</label>
                    <div class="col-sm-10">
                        <input value={fullName} onChange={e => setFullName(e.target.value)} 
                            class="form-control" id="fullName" placeholder="Full Name"/>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="contactNumber" class="col-sm-2 col-form-label">Contact Number</label>
                    <div class="col-sm-10">
                        <div className="input-group">
                            <span class="input-group-text" id="basic-addon1">+65</span>
                            <input value={contactNumber} onChange={e => setContactNumber(e.target.value)} 
                                class="form-control" id="contactNumber" placeholder="Contact Number"/>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="email" class="col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-10">
                        <input value={email} onChange={e => setEmail(e.target.value)} 
                            class="form-control" id="email" placeholder="example123@example.com"/>
                    </div>
                </div>
                <div class="row mb-3">
                    <label for="subject" class="col-sm-2 col-form-label">Subject</label>
                    <div class="col-sm-10">
                        <select class="form-select" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                        <option selected>Choose</option>
                        <option value="1">Techincal Issue </option>
                        <option value="2">Query related to reservation</option>
                        <option value="3">New Restaurant Request</option>
                        <option value="4">Sales Inquiry for restaurant owner</option>
                        <option value="5">Other</option>
                        </select>
                    </div>
                </div>
                {/* Cannot get them in a column */}
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Message</label>
                    <div className="col-sm-10">
                        <textarea
                            className="form-control"
                            id="message"
                            placeholder="Type here..."
                            rows="3"
                            defaultValue={message}
                            onChange={(e) => setMessage(e.target.value)}
                        >
                        </textarea>
                    </div>
                </div>
                <div class="row">
                <div class="col-sm-10 offset-sm-2">
                    <button type="submit" class="btn btn-primary float-start">Submit</button>
                </div>
            </div>
                

            </form>
        </>
    )
}

export default ContactUs