const createGoogleMapsLink = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const buildWhatsappMessage = (tripInput, itinerary) => {
  const destinationText = tripInput.destinations?.join(", ") || "";
  const dayPreview = itinerary.days
    .slice(0, 3)
    .map((day) => `Day ${day.day}: ${day.theme}`)
    .join("\n");

  const message = `Smart Travel Itinerary
Destination(s): ${destinationText}
Days: ${tripInput.numberOfDays}
Budget: ${tripInput.budget}

${dayPreview}

Hotels:
${itinerary.hotels.map((hotel) => `- ${hotel.name} (${hotel.starRating})`).join("\n")}`;

  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

export default function ItineraryResult({ tripInput, itinerary }) {
  const handleDownloadPdf = () => {
    // Browser print dialog allows user to save as PDF on all modern browsers.
    window.print();
  };

  const whatsappLink = buildWhatsappMessage(tripInput, itinerary);

  return (
    <section className="card">
      <div className="result-header">
        <div>
          <h2>{itinerary.tripTitle || "Your Smart Itinerary"}</h2>
          <p className="muted">{itinerary.destinationSummary}</p>
        </div>
        <div className="action-row no-print">
          <button type="button" onClick={handleDownloadPdf}>
            Download as PDF
          </button>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-link">
            Send via WhatsApp
          </a>
        </div>
      </div>

      <h3>Hotel Suggestions</h3>
      <div className="hotel-grid">
        {itinerary.hotels?.map((hotel) => (
          <article key={`${hotel.name}-${hotel.area}`} className="hotel-card">
            <h4>{hotel.name}</h4>
            <p>{hotel.starRating}</p>
            <p>{hotel.area}</p>
            <p>{hotel.priceRangeINR}</p>
          </article>
        ))}
      </div>

      <h3>Day-Wise Plan</h3>
      <div className="days-wrap">
        {itinerary.days?.map((day) => (
          <article key={day.day} className="day-card">
            <div className="day-top">
              <h4>
                Day {day.day}: {day.theme}
              </h4>
              <span>Estimated: INR {day.estimatedCostINR}</span>
            </div>
            <ul>
              {day.activities?.map((activity, index) => (
                <li key={`${day.day}-${index}`}>
                  <strong>{activity.time}</strong> - {activity.activity} ({activity.place}){" "}
                  <a
                    href={createGoogleMapsLink(activity.mapQuery || activity.place)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Map
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {itinerary.travelTips?.length > 0 && (
        <>
          <h3>Travel Tips</h3>
          <ul>
            {itinerary.travelTips.map((tip, index) => (
              <li key={`${tip}-${index}`}>{tip}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
