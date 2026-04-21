import { httpClient, API_BASE_URL } from "./httpClient";

// Utilitzem els endpoints del backend per l'arxiu i les imatges. Vercel blob
// bloqueja amb un HTTP 405 PUT requests directes des del navegador per temes de CORS.
export async function getVideos(userId = null, limit = 50, offset = 0) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (userId) params.append("user_id", String(userId));
  return httpClient(`/videos?${params.toString()}`);
}

export async function getVideoById(id) {
  if (!id) throw new Error("ID de vídeo no vàlid");
  return httpClient(`/videos/${id}`);
}

export async function uploadVideo({ file, thumbnail, title, description, categoria, isPublic = true, userId, username }) {
  if (!file) throw new Error("Cal seleccionar un fitxer de vídeo");
  if (!userId) throw new Error("No s'ha pogut identificar l'usuari");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title || "");
  formData.append("description", description || "");
  formData.append("is_public", isPublic ? "true" : "false");
  if (categoria) formData.append("categoria", categoria);
  if (thumbnail) formData.append("thumbnail", thumbnail);

  const token = localStorage.getItem("authToken");
  const headers = { "X-User-ID": String(userId) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  let data = null;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    const error = new Error(data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return data;
}

export async function updateVideo(id, { title, description, categoria, thumbnail }) {
  const formData = new FormData();
  if (title) formData.append("title", title);
  if (description) formData.append("description", description);
  if (categoria) formData.append("categoria", categoria);
  if (thumbnail) formData.append("thumbnail", thumbnail);

  const token = localStorage.getItem("authToken");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/videos/${id}/update`, {
    method: "POST",
    headers,
    body: formData,
  });

  let data = null;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    const error = new Error(data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

export async function deleteVideo(id) {
  return httpClient(`/videos/${id}`, { method: "DELETE" });
}
