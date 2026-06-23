import { useEffect, useState } from "react";
import api from "../api/axios";
import AddAdopterForm from "../components/AddAdopterForm";
import EditAdopterForm from "../components/EditAdopterForm";

function AdoptersPage() {
  const [adopters, setAdopters] = useState([]);
  const [filteredAdopters, setFilteredAdopters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdopter, setEditingAdopter] = useState(null);

  const [selectedAdopter, setSelectedAdopter] = useState(null);
  const [adopterAnimals, setAdopterAnimals] = useState([]);

  useEffect(() => {
    loadAdopters();
  }, []);

  const loadAdopters = () => {
    api.get("/adopters")
      .then(response => {
        setAdopters(response.data);
        setFilteredAdopters(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);

    if (!value) {
      setFilteredAdopters(adopters);
      return;
    }

    const filtered = adopters.filter(a =>
      a.firstName?.toLowerCase().includes(value.toLowerCase()) ||
      a.lastName?.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredAdopters(filtered);
  };

  const loadAnimalsByAdopter = (adopter) => {
    setSelectedAdopter(adopter);

    api.get(`/adopters/${adopter.id}/animals`)
      .then(response => setAdopterAnimals(response.data))
      .catch(error => console.error(error));
  };

  const deleteAdopter = (id) => {
    if (!window.confirm("Are you sure you want to delete this adopter?")) return;

    api.delete(`/adopters/${id}`)
      .then(() => loadAdopters())
      .catch(error => console.error(error));
  };

  return (
    <>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h4 className="mb-0">Adopters</h4>
              <small className="text-muted">Registered adopters</small>
            </div>

            <div className="d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by first or last name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ minWidth: "280px" }}
              />

              <button
                className="btn btn-success"
                onClick={() => setShowAddModal(true)}
              >
                <i className="fa-solid fa-plus me-2"></i>
                Add Adopter
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="text-center">Animals</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAdopters.map(adopter => (
                  <tr key={adopter.id}>
                    <td>{adopter.adopterCode}</td>
                    <td>{adopter.firstName}</td>
                    <td>{adopter.lastName}</td>
                    <td>{adopter.email}</td>
                    <td>{adopter.phone}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => loadAnimalsByAdopter(adopter)}
                      >
                        View Animals
                      </button>
                    </td>

                    <td className="text-center">
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => setEditingAdopter(adopter)}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => deleteAdopter(adopter.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredAdopters.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No adopters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedAdopter && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              Animals adopted by {selectedAdopter.firstName} {selectedAdopter.lastName}
            </h5>
          </div>

          <div className="card-body">
            {adopterAnimals.length === 0 ? (
              <p className="text-muted mb-0">
                This adopter currently has no animals.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Species</th>
                      <th>Breed</th>
                      <th>Age</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {adopterAnimals.map(animal => (
                      <tr key={animal.id}>
                        <td><strong>{animal.name}</strong></td>
                        <td>{animal.animalTypeName}</td>
                        <td>{animal.breedName}</td>
                        <td>{animal.age}</td>
                        <td>{animal.adoptionStatusName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Adopter</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <AddAdopterForm
                  onAdopterAdded={() => {
                    loadAdopters();
                    setShowAddModal(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {editingAdopter && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Adopter</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingAdopter(null)}
                ></button>
              </div>

              <div className="modal-body">
                <EditAdopterForm
                  adopter={editingAdopter}
                  onAdopterUpdated={() => {
                    loadAdopters();
                    setEditingAdopter(null);
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

export default AdoptersPage;