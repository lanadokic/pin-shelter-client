import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Navbar({ user, onLogout, onLoginClick }) {

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    if (!user?.token) return;

    if (user.role === "Worker") {
      api.get("/adoptionrequests/pending-count")
        .then(res => setPendingRequestsCount(res.data.count))
        .catch(err => console.error(err));
    }

    api.get("/messages/unread-count")
      .then(res => setUnreadMessagesCount(res.data.count))
      .catch(err => console.error(err));

  }, [user]);

  return (
    
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
      <div className="container-fluid px-4">

       <Link className="navbar-brand fw-bold" to="/">
        <i className="fa-solid fa-paw me-2"></i>
        PIN Shelter
       </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

          {user?.role !== "Worker" && (
            <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
            </li>
           )}

            {user?.role !== "Worker" && (
              <li className="nav-item">
                <Link className="nav-link" to="/animals">
                  Animals
                </Link>
              </li>
            )}

            {user?.role === "Worker" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/animals">
                  Manage Animals
                </Link>
              </li>
            )}

           {user?.role === "Worker" && (
              <li className="nav-item">
                <Link className="nav-link" to="/adopters">
                  Adopters
                </Link>
              </li>
            )}

           {user?.role === "Worker" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/adoption-requests">
                  Requests

                  {pendingRequestsCount > 0 && (
                    <span className="badge bg-danger ms-2">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
              {user?.role === "Adopter" && (
              <li className="nav-item">
                <Link className="nav-link" to="/adopter/dashboard">
                  My Requests
                </Link>
              </li>
            )}

            {user?.token && (
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">
                    Messages

                    {unreadMessagesCount > 0 && (
                      <span className="badge bg-danger ms-2">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </Link>
                </li>
              )}

            {user?.role !== "Worker" && (
            <li className="nav-item">
             <Link className="nav-link" to="/statistics">
              Statistics
            </Link>
            </li>
            )}

          </ul>

          {user?.token ? (
            <div className="d-flex align-items-center ms-lg-3">

              <span className="text-white me-3">
                {user.fullName} ({user.role})
              </span>

              <button
                className="btn btn-light"
                onClick={onLogout}
              >
                Logout
              </button>

            </div>
          ) : (

            <button
              className="btn btn-light ms-lg-3"
              onClick={onLoginClick}
            >
              Login
            </button>

          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;