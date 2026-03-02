import { API_BASE_URL } from "./httpClient";

export async function uploadVideo({ file, title, description, isPublic, userId }) {
    if (!file) {
        throw new Error("Cal seleccionar un fitxer de vídeo");
    }

    if (!userId) {
        throw new Error("No s'ha pogut identificar l'usuari");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || "");
    formData.append("description", description || "");
    formData.append("is_public", isPublic ? "true" : "false");

    const token = localStorage.getItem("authToken");
    const headers = {
        "X-User-ID": String(userId),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/videos/upload`, {
        method: "POST",
        headers,
        body: formData,
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message = data?.error || `HTTP ${response.status}`;
        const error = new Error(message);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}
