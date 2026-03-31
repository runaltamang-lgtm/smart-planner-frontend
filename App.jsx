import { Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import { generateItinerary, saveLead } from "./api/client";
import TripForm from "./components/TripForm";
import LeadForm from "./components/LeadForm";
import ItineraryResult from "./components/ItineraryResult";
import AdminPanel from "./components/AdminPanel";

function PlannerPage() {
  const [step, setStep] = useState("trip");
  const [tripInput, setTripInput] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTripSubmit = async (formData) => {
    setError("");
    setLoading(true);
    try {
      const response = await generateItinerary(formData);
      setTripInput(response.tripInput);
      setItinerary(response.itinerary);
      // Lead capture is required before revealing final generated output.
      setStep("lead");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (leadData) => {
    if (!tripInput || !itinerary) return;

    setError("");
    setLoading(true);
    try {
      await saveLead({
        ...leadData,
        tripInput,
        itinerary
      });
      // Show results only after lead is stored.
      setStep("result");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <h1>Smart Travel Itinerary Generator</h1>
          <p>
            Build day-wise plans with AI, hotel suggestions, budgets, maps, PDF download, and
            WhatsApp sharing.
          </p>
        </div>
        <nav className="no-print">
          <Link to="/">Planner</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      {error && <p className="error">{error}</p>}
      {step === "trip" && <TripForm onSubmit={handleTripSubmit} loading={loading} />}
      {step === "lead" && <LeadForm onSubmit={handleLeadSubmit} loading={loading} />}
      {step === "result" && itinerary && tripInput && (
        <ItineraryResult itinerary={itinerary} tripInput={tripInput} />
      )}
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PlannerPage />} />
      <Route
        path="/admin"
        element={
          <main className="page-shell">
            <header className="hero">
              <div>
                <h1>Smart Travel Admin</h1>
                <p>Track and export captured leads using your secure admin key.</p>
              </div>
              <nav>
                <Link to="/">Planner</Link>
                <Link to="/admin">Admin</Link>
              </nav>
            </header>
            <AdminPanel />
          </main>
        }
      />
    </Routes>
  );
}
