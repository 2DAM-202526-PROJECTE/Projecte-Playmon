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

export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB · límit Cloudinary free tier

async function getCloudinaryUploadSignature(userId) {
  const token = localStorage.getItem("authToken");
  const headers = { "X-User-ID": String(userId), "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const r = await fetch(`${API_BASE_URL}/videos/upload-signature`, {
    method: "POST", headers,
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    const err = new Error(data?.error || `HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return data;
}

function uploadFileToCloudinary({ file, signature, onProgress }) {
  return new Promise((resolve, reject) => {
    const url = `https://api.cloudinary.com/v1_1/${signature.cloud_name}/video/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("api_key", signature.api_key);
    fd.append("timestamp", String(signature.timestamp));
    fd.append("signature", signature.signature);
    fd.append("folder", signature.folder);
    fd.append("public_id", signature.public_id);
    fd.append("overwrite", "true");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data?.error?.message || `Cloudinary HTTP ${xhr.status}`));
      } catch {
        reject(new Error(`Cloudinary resposta no vàlida (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Error de xarxa pujant a Cloudinary"));
    xhr.onabort = () => reject(new Error("Pujada cancel·lada"));
    xhr.send(fd);
  });
}

async function registerUploadedVideo({ videoUrl, fileSize, thumbnail, title, description, categoria, isPublic, userId, subtitle, subtitleLang }) {
  const token = localStorage.getItem("authToken");
  const headers = { "X-User-ID": String(userId) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const fd = new FormData();
  fd.append("video_url", videoUrl);
  fd.append("file_size", String(fileSize));
  fd.append("title", title || "");
  fd.append("description", description || "");
  fd.append("is_public", isPublic ? "true" : "false");
  if (categoria) fd.append("categoria", categoria);
  if (thumbnail) fd.append("thumbnail", thumbnail);
  if (subtitle) {
    fd.append("subtitle", subtitle);
    fd.append("subtitle_lang", subtitleLang || "ca");
  }

  const r = await fetch(`${API_BASE_URL}/videos/register`, {
    method: "POST", headers, body: fd,
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    const err = new Error(data?.error || `HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return data;
}

export async function uploadVideoDirect({ file, thumbnail, subtitle, subtitleLang, title, description, categoria, isPublic = true, userId, onProgress }) {
  if (!file) throw new Error("Cal seleccionar un fitxer de vídeo");
  if (!userId) throw new Error("No s'ha pogut identificar l'usuari");
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error(`Vídeo massa gran (${(file.size / 1024 / 1024).toFixed(1)} MB). Màxim 100 MB.`);
  }

  const signature = await getCloudinaryUploadSignature(userId);
  if (signature.max_size && file.size > signature.max_size) {
    throw new Error(`Vídeo massa gran. Màxim ${(signature.max_size / 1024 / 1024).toFixed(0)} MB.`);
  }

  const cloudinaryResult = await uploadFileToCloudinary({ file, signature, onProgress });
  const videoUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
  if (!videoUrl) throw new Error("Cloudinary no ha retornat URL del vídeo");

  return registerUploadedVideo({
    videoUrl,
    fileSize: file.size,
    thumbnail,
    subtitle,
    subtitleLang,
    title,
    description,
    categoria,
    isPublic,
    userId,
  });
}

export async function getVideoSubtitles(videoId) {
  if (!videoId) return [];
  const token = localStorage.getItem("authToken");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(`${API_BASE_URL}/videos/${videoId}/subtitles`, { headers });
  if (!r.ok) return [];
  const data = await r.json().catch(() => null);
  return data?.subtitles || [];
}

export async function uploadVideoSubtitle(videoId, file, lang = "ca") {
  if (!videoId || !file) throw new Error("Falten paràmetres");
  const token = localStorage.getItem("authToken");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("lang", lang);

  const r = await fetch(`${API_BASE_URL}/videos/${videoId}/subtitles`, {
    method: "POST", headers, body: fd,
  });
  const data = await r.json().catch(() => null);
  if (!r.ok) {
    const err = new Error(data?.error || `HTTP ${r.status}`);
    err.status = r.status;
    throw err;
  }
  return data;
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
