import React, { useState } from "react";
import { useForm } from "react-hook-form";
import phone from "../../images/phone-call.png";
import "./Reservation.css";

const Reservation = () => {
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const onSubmit = (data) => {
      data.status = "Pending";

      fetch(`http://localhost:3000/reservations`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(data),
      })
//          .then((res) => res.json())
//          .then((result) => {
//             if (result.insertedId) {
//                setError("Table booked successfully");
//                reset();
//             } else {
//                setError("Something went wrong! Try again");
//             }
//          });
//       console.log(data);
//    };

        .then((res) => res.json())
        .then((result) => {
        if (result.insertedId) {
            setSuccess("Table booked successfully");
            setError(""); // Reset any existing error message
            reset(); // Clear form fields
        } else {
            setError("Something went wrong! Try again");
            setSuccess(""); // Reset any existing success message
        }
        })
        .catch((error) => {
        setError("An error occurred. Please try again later.");
        setSuccess(""); // Reset any existing success message
        });
        };

        // Clear success/error messages after 5 seconds
        useEffect(() => {
        const timer = setTimeout(() => {
        setError("");
        setSuccess("");
        }, 5000);
        return () => clearTimeout(timer);
        }, [error, success]);

   return (
      <div className="reservation-section">
         <div className="container">
            <div className="row align-items-center">
               <div className="col-md-6 pe-md-5">
                  <div className="header-text">
                     <span>Reserve your table</span>
                     <h1>BOOK ONLINE</h1>
                     <p>
                        Gaystro serves as an online platform where you can conveniently order your preferred food from the restaurant.
                        Gaystro serves as an online platform where you can conveniently order your preferred food from the restaurant.
                        Gaystro serves as an online platform where you can conveniently order your preferred food from the restaurant.
                     </p>
                     <h3>
                        <img className="img-fluid" src={phone} alt="" />
                        +65 123 456 789 0
                     </h3>
                  </div>
               </div>
               <div className="col-md-6 ps-md-5">
                  <div className="form-box">
                     <h3>Book a table</h3>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mb-0 text-start"
                     >
                        <div className="row">
                           <div className="form-group col-12">
                           {error && <p className="error-alert">{error}</p>}
                           {success && <p className="success-alert">{success}</p>}
                              <input
                                 className="form-control"
                                 defaultValue=""
                                 {...register("name", { required: true })}
                                 placeholder="Name"
                                 type="text"
                              />
                              {errors.name && (
                                 <span className="error">name is required</span>
                              )}
                           </div>
                           <div className="form-group col-12">
                              <input
                                 className="form-control"
                                 defaultValue=""
                                 {...register("email", { required: true })}
                                 placeholder="Email"
                                 type="email"
                              />
                              {errors.email && (
                                 <span className="error">
                                    email is required
                                 </span>
                              )}
                           </div>
                           <div className="form-group col-12">
                              <input
                                 className="form-control"
                                 defaultValue=""
                                 {...register("phone", { required: true })}
                                 placeholder="Phone"
                                 type="number"
                              />
                              {errors.phone && (
                                 <span className="error">
                                    phone is required
                                 </span>
                              )}
                           </div>
                           <div className="form-group col-12">
                              <input
                                 className="form-control"
                                 defaultValue=""
                                 {...register("person", { required: true })}
                                 placeholder="How many person?"
                                 type="number"
                              />
                              {errors.person && (
                                 <span className="error">
                                    person is required
                                 </span>
                              )}
                           </div>
                           <div className="form-group col-12">
                              <input
                                 className="form-control date"
                                 defaultValue=""
                                 {...register("date", { required: true })}
                                 placeholder="Date"
                                 type="date"
                              />
                              {errors.date && (
                                 <span className="error">date is required</span>
                              )}
                           </div>
                           <div className="col-12">
                              {error && (
                                 <p className="success-alert">{error}</p>
                              )}
                           </div>
                        </div>
                        <button type="submit" className="btn-black">
                           Book Now
                        </button>
                     </form>
                  </div>
               </div>
            </div>
         </div>
         <RestaurantTables restaurantId={restaurantId} />
      </div>
      
   );
};

export default Reservation;