import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import AnimalsPage from "./pages/AnimalsPage";
import LoginPage from "./pages/LoginPage";
import AdoptersPage from "./pages/AdoptersPage";
import StatisticsPage from "./pages/StatisticsPage";
import HomePage from "./pages/HomePage";
import ManageAnimalsPage from "./pages/ManageAnimalsPage";
import AnimalDetailsPage from "./pages/AnimalDetailsPage";
import AdoptionRequestsPage from "./pages/AdoptionRequestsPage";
import AdopterDashboardPage from "./pages/AdopterDashboardPage";
import MessagesPage from "./pages/MessagesPage";

function App() {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    email: localStorage.getItem("email"),
    fullName: localStorage.getItem("fullName"),
    role: localStorage.getItem("role")
  });

  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();

    setUser({
      token: null,
      email: null,
      fullName: null,
      role: null
    });
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
      />

      <div className="container mt-4">
        <Routes>
         <Route path="/" 
         element={<HomePage />} 
         />

          <Route
            path="/animals"
            element={<AnimalsPage user={user} />}
          />

          <Route
            path="/admin/animals"
            element={<ManageAnimalsPage user={user} />}
          />

          <Route
            path="/animals/:id"
            element={<AnimalDetailsPage user={user} />}
          />

          <Route
            path="/adopters"
            element={<AdoptersPage user={user} />}
          />

          <Route
            path="/admin/adoption-requests"
            element={<AdoptionRequestsPage user={user} />}
          />

          <Route
            path="/adopter/dashboard"
            element={<AdopterDashboardPage user={user} />}
          />

          <Route
            path="/messages"
            element={<MessagesPage user={user} />}
          />
                    
          <Route
            path="/statistics"
            element={<StatisticsPage user={user} />}
          />
        </Routes>
      </div>

      {showLogin && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Login</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogin(false)}
                ></button>
              </div>

              <div className="modal-body">
                <LoginPage
                  onLogin={(userData) => {
                    handleLogin(userData);
                    setShowLogin(false);
                  }}
                />
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;