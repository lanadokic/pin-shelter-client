import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function StatisticsPage() {
  const [animalsByType, setAnimalsByType] = useState([]);
  const [adoptionStatus, setAdoptionStatus] = useState([]);
  const [activeAdopters, setActiveAdopters] = useState(0);

  useEffect(() => {
    api.get("/statistics/animals-by-type")
      .then(res => setAnimalsByType(res.data));

    api.get("/statistics/adoption-status")
      .then(res => setAdoptionStatus(res.data));

    api.get("/statistics/active-adopters")
      .then(res => setActiveAdopters(res.data.activeAdopters));
  }, []);

  const COLORS = ["#198754", "#ffc107", "#dc3545", "#0d6efd"];

  return (
    <div>
      <h3 className="mb-4">Statistics Dashboard</h3>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Animal Types</h6>
              <h2>{animalsByType.reduce((sum, item) => sum + item.count, 0)}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Active Adopters</h6>
              <h2>{activeAdopters}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Animals by Type</h5>
            </div>

            <div className="card-body" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={animalsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="animalType" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#198754" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Adoption Status</h5>
            </div>

            <div className="card-body" style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adoptionStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {adoptionStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;