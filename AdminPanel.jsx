import { useEffect, useState } from "react";
import { exportLeadsCsv, fetchLeads } from "../api/client";

export default function AdminPanel() {
  const [leads, setLeads] = useState([]);
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem("admin_api_key") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLeads = async (key) => {
    if (!key) {
      setLoading(false);
      setLeads([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await fetchLeads(key);
      setLeads(data);
      localStorage.setItem("admin_api_key", key);
    } catch (err) {
      setError(err.message);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads(adminKey);
  }, []);

  const handleExportCsv = async () => {
    setError("");
    try {
      await exportLeadsCsv(adminKey);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoad = () => {
    loadLeads(adminKey.trim());
  };

  return (
    <section className="card">
      <div className="result-header">
        <h2>Admin Panel - Leads</h2>
        <button
          type="button"
          className="btn-link"
          onClick={handleExportCsv}
          disabled={!adminKey || loading}
        >
          Export CSV
        </button>
      </div>
      <div className="admin-key-row">
        <label htmlFor="admin-key">Admin API Key</label>
        <input
          id="admin-key"
          type="password"
          value={adminKey}
          placeholder="Enter ADMIN_API_KEY"
          onChange={(event) => setAdminKey(event.target.value)}
        />
        <button type="button" onClick={handleLoad}>
          Load Leads
        </button>
      </div>
      {loading && <p>Loading leads...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Destination(s)</th>
                <th>Days</th>
                <th>Budget</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.email}</td>
                  <td>{lead.tripInput?.destinations?.join(", ")}</td>
                  <td>{lead.tripInput?.numberOfDays}</td>
                  <td>{lead.tripInput?.budget}</td>
                  <td>{new Date(lead.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
