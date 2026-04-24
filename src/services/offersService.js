const BASE_URL = "http://localhost:5050/api/offers";

// Helper — reads the JWT token saved by LoginPage after a successful login
const getToken = () => localStorage.getItem("token");

// Helper — builds Authorization header for admin requests
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken() || ""}`,
});

// ─── PUBLIC ───────────────────────────────────────────────

// GET all offers
export const fetchOffers = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
};

// GET single offer
export const fetchOfferById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Offer not found");
  return res.json();
};

// ─── ADMIN (protected) ────────────────────────────────────

// POST — create new offer
export const createOffer = async (offerData) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Failed to create offer");
  return res.json();
};

// PUT — update offer
export const updateOffer = async (id, offerData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Failed to update offer");
  return res.json();
};

// PATCH — toggle active/inactive
export const toggleOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle offer");
  return res.json();
};

// DELETE — remove offer
export const deleteOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete offer");
  return res.json();
};
