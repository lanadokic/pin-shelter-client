import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function AnimalDetailsPage({ user }) {
  const { id } = useParams();

  const [animal, setAnimal] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    api.get(`/animals/${id}`)
      .then(res => setAnimal(res.data))
      .catch(err => console.error(err));

    api.get(`/animalphotos/animal/${id}`)
      .then(res => setPhotos(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!animal) {
    return <div className="alert alert-light border">Loading...</div>;
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h2 className="fw-bold">{animal.name}</h2>
        <p className="text-muted">
          {animal.animalTypeName} • {animal.breedName}
        </p>

        <div className="mb-3">
          <span className="badge bg-success me-2">
            {animal.adoptionStatusName}
          </span>
          <span className="badge bg-secondary">
            {animal.age} years old
          </span>
        </div>

        <p>
          <strong>Arrival date:</strong>{" "}
          {animal.arrivalDate?.split("T")[0]}
        </p>

        <p>{animal.description}</p>

        <h5 className="mt-4">Photos</h5>

        <div className="row g-3">
          {photos.map(photo => (
            <div className="col-12 col-md-4" key={photo.id}>
              <img
                src={`https://localhost:5001${photo.photoPath}`}
                alt={animal.name}
                className="img-fluid rounded shadow-sm"
              />
            </div>
          ))}

          {photos.length === 0 && (
            <p className="text-muted">No photos available.</p>
          )}
        </div>

        {user?.role === "Adopter" &&
          animal.adoptionStatusName === "Available" && (
            <button className="btn btn-success mt-4">
              Adopt Animal
            </button>
          )}
      </div>
    </div>
  );
}

export default AnimalDetailsPage;