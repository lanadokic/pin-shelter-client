import { useEffect, useState } from "react";
import api from "../api/axios";
import AddAnimalForm from "../components/AddAnimalForm";
import EditAnimalForm from "../components/EditAnimalForm";
import { Link } from "react-router-dom";

function ManageAnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [animalType, setAnimalType] = useState("All");
  const [status, setStatus] = useState("All");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);

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
      result = result.filter(a => a.arrivalDate?.split("T")[0] === arrivalDate);
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
    setMinAge("");
    setMaxAge("");
    setArrivalDate("");
    setFilteredAnimals(animals);
  };

  const deleteAnimal = (id) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) {
      return;
    }

    api.delete(`/animals/${id}`)
      .then(() => {
        loadAnimals();
      })
      .catch(error => console.error(error));
  };

  return (
    <>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">Animals</h4>
              <small className="text-muted">Manage shelter animals</small>
            </div>

            <button
              className="btn btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="fa-solid fa-plus me-2"></i>
              Add Animal
            </button>
          </div>

          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Name, breed or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2">
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

            <div className="col-12 col-md-2">
              <label className="form-label">Status</label>
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

            <div className="col-6 col-md-1">
              <label className="form-label">Min Age</label>
              <input
                type="number"
                className="form-control"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-1">
              <label className="form-label">Max Age</label>
              <input
                type="number"
                className="form-control"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label">Arrival</label>
              <input
                type="date"
                className="form-control"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-1">
              <button
                className="btn btn-success w-100"
                onClick={applyFilters}
              >
                Go
              </button>
            </div>

            <div className="col-6 col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Arrival</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAnimals.map(animal => (
                  <tr key={animal.id}>
                   <td>
                    <Link
                        to={`/animals/${animal.id}`}
                        className="fw-bold text-decoration-none text-success"
                    >
                        {animal.name}
                    </Link>
                    </td>
                    <td>{animal.animalTypeName}</td>
                    <td>{animal.breedName}</td>
                    <td>{animal.age}</td>
                    <td>{animal.arrivalDate?.split("T")[0]}</td>
                    <td>
                      {animal.adoptionStatusName === "Available" ? (
                        <span className="badge bg-success">Available</span>
                      ) : animal.adoptionStatusName === "Reserved" ? (
                        <span className="badge bg-warning text-dark">Reserved</span>
                      ) : (
                        <span className="badge bg-danger">Adopted</span>
                      )}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => setEditingAnimal(animal)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteAnimal(animal.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAnimals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No animals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Animal</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <AddAnimalForm
                  onAnimalAdded={() => {
                    loadAnimals();
                    setShowModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {editingAnimal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Edit Animal</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingAnimal(null)}
                ></button>
              </div>

              <div className="modal-body">
                <EditAnimalForm
                  animal={editingAnimal}
                  onAnimalUpdated={() => {
                    loadAnimals();
                    setEditingAnimal(null);
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

export default ManageAnimalsPage;