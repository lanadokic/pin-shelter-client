import { useEffect, useState } from "react";
import api from "../api/axios";

function AdoptionRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    api.get("/adoptionrequests/pending")
      .then(response => setRequests(response.data))
      .catch(error => console.error(error));
  };

  const approveRequest = (id) => {
    api.put(`/adoptionrequests/${id}/approve`)
      .then(() => loadRequests())
      .catch(error => console.error(error));
  };

  const rejectRequest = (id) => {
    api.put(`/adoptionrequests/${id}/reject`)
      .then(() => loadRequests())
      .catch(error => console.error(error));
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white">
        <h4 className="mb-0">Adoption Requests</h4>
        <small className="text-muted">
          Pending adoption requests from adopters
        </small>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Animal</th>
                <th>Adopter</th>
                <th>Email</th>
                <th>Request Date</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td><strong>{request.animalName}</strong></td>
                  <td>{request.adopterName}</td>
                  <td>{request.adopterEmail}</td>
                  <td>{request.requestDate?.split("T")[0]}</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      {request.status}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approveRequest(request.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => rejectRequest(request.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No pending adoption requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdoptionRequestsPage;