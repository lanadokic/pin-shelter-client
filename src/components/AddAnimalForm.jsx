import { useEffect, useState } from "react";
import api from "../api/axios";

function AddAnimalForm({ onAnimalAdded }) {
  const [animalTypes, setAnimalTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    animalTypeId: "",
    breedId: "",
    age: "",
    arrivalDate: "",
    photoPath: "",
    description: ""
  });

  useEffect(() => {
    api.get("/animals/animal-types")
      .then(response => setAnimalTypes(response.data));
  }, []);

  const handleTypeChange = (e) => {
    const animalTypeId = e.target.value;

    setFormData({
      ...formData,
      animalTypeId,
      breedId: ""
    });

    api.get(`/breeds/type/${animalTypeId}`)
      .then(response => setBreeds(response.data));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    api.post("/animals", {
      ...formData,
      animalTypeId: Number(formData.animalTypeId),
      breedId: Number(formData.breedId),
      age: Number(formData.age)
    })
      .then(() => {
        onAnimalAdded();

        setFormData({
          name: "",
          animalTypeId: "",
          breedId: "",
          age: "",
          arrivalDate: "",
          photoPath: "",
          description: ""
        });

        setBreeds([]);
      });
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-header bg-white">
        <h5 className="mb-0">Add Animal</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Animal Type</label>
              <select
                className="form-select"
                name="animalTypeId"
                value={formData.animalTypeId}
                onChange={handleTypeChange}
                required
              >
                <option value="">Choose type</option>

                {animalTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Breed</label>
              <select
                className="form-select"
                name="breedId"
                value={formData.breedId}
                onChange={handleChange}
                required
                disabled={!formData.animalTypeId}
              >
                <option value="">Choose breed</option>

                {breeds.map(breed => (
                  <option key={breed.id} value={breed.id}>
                    {breed.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Arrival Date</label>
              <input
                type="date"
                className="form-control"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Photo Path</label>
              <input
                type="text"
                className="form-control"
                name="photoPath"
                value={formData.photoPath}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

          </div>

          <button className="btn btn-success mt-3">
            Save Animal
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAnimalForm;