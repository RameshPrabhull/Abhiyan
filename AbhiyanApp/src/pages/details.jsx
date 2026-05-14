import React, { useState, useEffect} from "react";
import { useLocation } from "react-router-dom"; 
import "../css/Det_style.css";
import { useNavigate } from "react-router-dom";

const UserDetails = ({toParent,email}) => {
  const nav=useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    nationality: "",
    age: "",
    state: "central",
    beneficiaries: "healthcare",
    income: "",
    caste: "General",
    email:""
  });

  const [isSkipEnabled, setIsSkipEnabled] = useState(false);

  // Get query parameters from the location
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters to determine the origin
    const queryParams = new URLSearchParams(location.search);
    const from = queryParams.get("from");

    // Enable the skip button if the page is navigated from Sign-In
    if (from === "signin") {
      setIsSkipEnabled(true);
    } else {
      setIsSkipEnabled(false);
    }
  }, [location]);

  // Handle form field change
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "radio" ? e.target.id : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Assuming the logged-in user's email is stored in localStorage
    // const userEmail = localStorage.getItem("userEmail");


    const payload = {
      ...formData,
      age: parseInt(formData.age, 10),
      income: parseInt(formData.income, 10),
      email:email
      // email: userEmail, // Include logged-in user's email for mapping
    };
    try {
      const response = await fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Show success message
        toParent(payload);
        nav("/pages/Recommend.js"); // Redirect on success
        
      } else {
        alert(result.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
  };

  /* const handleSkip = () => {
    // Logic for skip button action
    window.location.href = "Recommend.js";
  }; */

  return (
    <body>
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="formbold-form-title">
            <h2>Abhiyan wants to know you!</h2>
            <p>
              Please enter your valid details below for Government Scheme
              Recommendations.
            </p>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="firstname" className="formbold-form-label">
                First name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                className="formbold-form-input"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="formbold-form-label">
                Last name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                className="formbold-form-input"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="nationality" className="formbold-form-label">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                className="formbold-form-input"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="age" className="formbold-form-label">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                className="formbold-form-input"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
            <label htmlFor="state" className="formbold-form-label">
              State
            </label>
            <select
                name="state"
                id="state"
                className="formbold-form-input"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="central">Central</option>
                <option value="karnataka">Karnataka</option>
              </select>
          
          </div>
          <div>
              <label htmlFor="beneficiaries" className="formbold-form-label">
              Beneficiaries
              </label>
              <select
                name="beneficiaries"
                id="beneficiaries"
                className="formbold-form-input"
                value={formData.beneficiaries}
                onChange={handleChange}
              >
                <option value="healthcare">Healthcare</option>
                <option value="farmers">Farmers</option>
                <option value="disabilities">Disabilities</option>
                <option value="women_welfare">Women Welfare</option>
                <option value="senior_citizen">Senior Citizen</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <label htmlFor="income" className="formbold-form-label">
                Income
              </label>
              <input
                type="number"
                name="income"
                id="income"
                className="formbold-form-input"
                value={formData.income}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="caste" className="formbold-form-label">
                Caste
              </label>
              <select
                name="caste"
                id="caste"
                className="formbold-form-input"
                value={formData.caste}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
          </div>
          <button className="formbold-btn" type="submit">
            Submit
          </button>
          {/* <button className="formbold-btn" type="button" onClick={handleSkip} disabled={!isSkipEnabled}>
            Skip
          </button> */}
        </form>
      </div>
    </div>
    </body>
  );
};

export default UserDetails;
