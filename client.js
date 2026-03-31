const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    const message = data?.errors?.join(", ") || data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
};

export const generateItinerary = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/itinerary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const saveLead = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/itinerary/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const fetchLeads = async (adminKey) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads`, {
    headers: {
      "x-admin-key": adminKey
    }
  });
  return handleResponse(response);
};

export const exportLeadsCsv = async (adminKey) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/export/csv`, {
    headers: {
      "x-admin-key": adminKey
    }
  });

  if (!response.ok) {
    let message = "CSV export failed";
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_error) {
      // Ignore JSON parse errors for non-JSON responses.
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "leads.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};
