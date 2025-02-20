// DemographicAdd.js
import React, { useState } from "react";
import axios from "axios";

import HelmetComponent from "../SEO/HelmetComponent";

const DemographicAdd = () => {
  const [formData, setFormData] = useState({
    clinic_id: null, // Add clinic_id to the form data
    province: "",
    postal: "",
    city: "",
    address: "",
    phone: "",
    alternativePhone: "",
    email: "",
    hin: "",
    ver: "",
    dob: "",
    sex: "",
    firstName: "",
    lastName: "",
    agreed: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send the form data to the Django API
    axios
      .post("/api/demographic/", formData)
      .then((response) => {
        // Optionally, redirect to the list page or perform any other actions
      })
      .catch((error) => console.error("Error adding record:", error));
  };

  return (
    <div>
      <HelmetComponent />
      <h1>Add Demographic Record</h1>
      <form onSubmit={handleSubmit}>
        {/* Clinic selection, adjust as needed */}
        <label>
          Clinic:
          <select name="clinic_id" value={formData.clinic_id} onChange={handleChange} required>
            <option value="" disabled>
              Select Clinic
            </option>
            <option value="1">Clinic 1</option>
            <option value="2">Clinic 2</option>
            {/* Add more options based on your clinic data */}
          </select>
        </label>

        {/* Other form fields go here, adjust as needed */}
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DemographicAdd;
