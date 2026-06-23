import { useState } from "react";
import api from "../api/axios";

function EditAdopterForm({ adopter, onAdopterUpdated }) {
  const [formData, setFormData] = useState({
    firstName: adopter.firstName || "",
    lastName: adopter.lastName || "",
    adopterCode: adopter.adopterCode || "",
    email: adopter.email || "",
    phone: adopter.phone || ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.put(`/adopters/${adopter.id}`, formData)
      .then(() => onAdopterUpdated())
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

      <button className="btn btn-primary w-100">
        Save Changes
      </button>
    </form>
  );
}

export default EditAdopterForm;