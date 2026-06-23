import { useState } from "react";
import api from "../api/axios";

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/auth/login", formData)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("fullName", response.data.fullName);
        localStorage.setItem("role", response.data.role);

        onLogin(response.data);
      })
      .catch(() => {
        setError("Invalid email or password.");
      });
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">
            Email
          </label>

          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            Password
          </label>

          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
        >
          Login
        </button>

      </form>
    </>
  );
}

export default LoginPage;