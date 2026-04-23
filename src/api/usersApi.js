import { httpClient, API_BASE_URL } from "./httpClient";

/**
 * Upload avatar image to server (which uploads to imgur)
 * @param {number} userId - The user ID
 * @param {File} file - Image file from input
 * @returns {Promise<{avatar_url: string}>} Imgur URL of uploaded image
 */
export async function uploadAvatar(userId, file) {
    const formData = new FormData();
    formData.append("file", file);

    // Manual fetch since httpClient expects JSON but we're sending FormData
    const token = localStorage.getItem("authToken");
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}/users/${userId}/avatar`,
        {
            method: "POST",
            headers,
            body: formData,
        }
    );

    let data = null;
    try {
        data = await response.json();
    } catch {
        // No JSON body
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

export async function deleteAvatar(userId) {
    return httpClient(`/users/${userId}/avatar`, {
        method: "DELETE",
    });
}

/**
 * Update user subscription plan.
 * @param {number} userId
 * @param {string} planKey - "basic" | "super" | "ultra"
 */
export async function updateUserSubscription(userId, planKey) {
    return httpClient(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ pla_pagament: planKey }),
    });
}
