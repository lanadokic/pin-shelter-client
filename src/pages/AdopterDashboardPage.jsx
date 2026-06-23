import { useEffect, useState } from "react";
import api from "../api/axios";

function AdopterDashboardPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.get("/adoptionrequests/my")
      .then(response => setRequests(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white">
        <h4 className="mb-0">My Adoption Requests</h4>
        <small className="text-muted">
          Track the status of your adoption requests
        </small>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Animal</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td><strong>{request.animalName}</strong></td>
                  <td>{request.requestDate?.split("T")[0]}</td>
                  <td>
                    {request.status === "Pending" && (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}

                    {request.status === "Approved" && (
                      <span className="badge bg-success">Approved</span>
                    )}

                    {request.status === "Rejected" && (
                      <span className="badge bg-danger">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted py-4">
                    You have no adoption requests yet.
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

export default AdopterDashboardPage;