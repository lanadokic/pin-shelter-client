import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AnimalsPage({ user }) {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [animalType, setAnimalType] = useState("All");
  const [status, setStatus] = useState("All");
  const [arrivalDate, setArrivalDate] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = () => {
    api.get("/animals")
      .then(response => {
        setAnimals(response.data);
        setFilteredAnimals(response.data);
      })
      .catch(error => console.error(error));
  };

  const applyFilters = () => {
    let result = [...animals];

    if (searchTerm.trim() !== "") {
      result = result.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.breedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (animalType !== "All") {
      result = result.filter(a => a.animalTypeName === animalType);
    }

    if (status !== "All") {
      result = result.filter(a => a.adoptionStatusName === status);
    }

    if (arrivalDate !== "") {
      result = result.filter(a =>
        a.arrivalDate?.split("T")[0] === arrivalDate
      );
    }

    if (minAge !== "") {
      result = result.filter(a => a.age >= Number(minAge));
    }

    if (maxAge !== "") {
      result = result.filter(a => a.age <= Number(maxAge));
    }

    setFilteredAnimals(result);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setAnimalType("All");
    setStatus("All");
    setArrivalDate("");
    setMinAge("");
    setMaxAge("");
    setFilteredAnimals(animals);
  };

  const handleAdoptClick = (animal) => {
    if (!user?.token) {
      alert("Please login or register before adopting an animal.");
      return;
    }

    if (user.role !== "Adopter") {
      alert("Only registered adopters can adopt animals.");
      return;
    }

    alert(`Adoption request for ${animal.name} will be added next.`);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Animals</h2>
        <p className="text-muted">
          Browse animals waiting for a loving home.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <div className="card shadow-sm border-0 sticky-lg-top" style={{ top: "90px" }}>
            <div className="card-body">
              <h5 className="mb-4">Filters</h5>

              <div className="mb-3">
                <label className="form-label">Species</label>
                <select
                  className="form-select"
                  value={animalType}
                  onChange={(e) => setAnimalType(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Adoption Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Arrival Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Min age"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                />

                <input
                  type="number"
                  className="form-control"
                  placeholder="Max age"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success w-100 mb-2"
                onClick={applyFilters}
              >
                Apply Filters
              </button>

              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-9">
          <div className="mb-4">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search animals by name, breed or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={applyFilters}
            />
          </div>

          <div className="row g-4">
            {filteredAnimals.map(animal => (
              <div className="col-12 col-md-6 col-xl-4" key={animal.id}>
                <div className="card h-100 shadow-sm border-0 animal-card">
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "190px" }}
                  >
                    <i className="fa-solid fa-paw display-1 text-success opacity-50"></i>
                  </div>

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">
                        {animal.name}
                      </h5>

                      {animal.adoptionStatusName === "Available" ? (
                        <span className="badge bg-success">
                          Available
                        </span>
                      ) : animal.adoptionStatusName === "Reserved" ? (
                        <span className="badge bg-warning text-dark">
                          Reserved
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Adopted
                        </span>
                      )}
                    </div>

                    <p className="text-muted mb-2">
                      {animal.animalTypeName} • {animal.breedName}
                    </p>

                    <p className="small mb-2">
                      <i className="fa-solid fa-cake-candles me-2 text-success"></i>
                      {animal.age} years old
                    </p>

                    <p className="small mb-3">
                      <i className="fa-solid fa-calendar-days me-2 text-success"></i>
                      Arrived: {animal.arrivalDate?.split("T")[0]}
                    </p>

                    <p className="card-text text-muted small flex-grow-1">
                      {animal.description || "No description available."}
                    </p>

                    <div className="d-grid gap-2">
                     <Link
                      className="btn btn-outline-success"
                      to={`/animals/${animal.id}`}
                    >
                      View Details
                    </Link>

                      {animal.adoptionStatusName === "Available" && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleAdoptClick(animal)}
                        >
                          Adopt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredAnimals.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border text-center">
                  No animals found.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimalsPage;