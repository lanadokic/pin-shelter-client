import { useState } from "react";
import api from "../api/axios";

function AddAdopterForm({ onAdopterAdded }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    adopterCode: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/adopters", formData)
      .then(() => onAdopterAdded())
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      {["firstName", "lastName", "adopterCode", "email", "phone"].map(field => (
        <div className="mb-3" key={field}>
          <label className="form-label">{field}</label>
          <input
            className="form-control"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            required={field !== "phone"}
          />
        </div>
      ))}

      <button className="btn btn-success w-100">
        Save Adopter
      </button>
    </form>
  );
}

export default AddAdopterForm;