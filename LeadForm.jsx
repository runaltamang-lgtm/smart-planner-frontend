import { useState } from "react";

const initialLead = {
  name: "",
  phone: "",
  email: ""
};

export default function LeadForm({ onSubmit, loading }) {
  const [lead, setLead] = useState(initialLead);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(lead);
  };

  return (
    <section className="card">
      <h2>Almost Done</h2>
      <p className="muted">
        Share your contact details to unlock and receive your personalized itinerary.
      </p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={lead.name}
            onChange={(event) => setLead({ ...lead, name: event.target.value })}
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            value={lead.phone}
            onChange={(event) => setLead({ ...lead, phone: event.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={lead.email}
            onChange={(event) => setLead({ ...lead, email: event.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "View My Itinerary"}
        </button>
      </form>
    </section>
  );
}
