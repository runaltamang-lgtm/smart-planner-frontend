import { useState } from "react";

const interestOptions = ["temples", "beaches", "nightlife", "nature", "shopping"];

const initialState = {
  destination: "",
  numberOfDays: 3,
  budget: "medium",
  travelType: "family",
  foodPreference: "both",
  specialInterests: []
};

export default function TripForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState);

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const hasInterest = prev.specialInterests.includes(interest);
      const specialInterests = hasInterest
        ? prev.specialInterests.filter((item) => item !== interest)
        : [...prev.specialInterests, interest];

      return { ...prev, specialInterests };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="card">
      <h2>Plan Your Trip</h2>
      <p className="muted">
        Enter one destination or multiple destinations separated by commas.
      </p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Destination
          <input
            type="text"
            placeholder="e.g. Jaipur, Udaipur"
            value={formData.destination}
            onChange={(event) => setFormData({ ...formData, destination: event.target.value })}
            required
          />
        </label>

        <label>
          Number of Days
          <input
            type="number"
            min="1"
            max="30"
            value={formData.numberOfDays}
            onChange={(event) =>
              setFormData({
                ...formData,
                numberOfDays: Number(event.target.value)
              })
            }
            required
          />
        </label>

        <label>
          Budget
          <select
            value={formData.budget}
            onChange={(event) => setFormData({ ...formData, budget: event.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>

        <label>
          Travel Type
          <select
            value={formData.travelType}
            onChange={(event) => setFormData({ ...formData, travelType: event.target.value })}
          >
            <option value="family">Family</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="adventure">Adventure</option>
            <option value="pilgrimage">Pilgrimage</option>
          </select>
        </label>

        <label>
          Food Preference
          <select
            value={formData.foodPreference}
            onChange={(event) => setFormData({ ...formData, foodPreference: event.target.value })}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="both">Both</option>
          </select>
        </label>

        <fieldset>
          <legend>Special Interests</legend>
          <div className="chip-wrap">
            {interestOptions.map((interest) => (
              <label key={interest} className="chip">
                <input
                  type="checkbox"
                  checked={formData.specialInterests.includes(interest)}
                  onChange={() => handleInterestToggle(interest)}
                />
                {interest}
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Smart Itinerary"}
        </button>
      </form>
    </section>
  );
}
