import { BASE_URL } from "../constants/api";

/**
 * Returns a full image URL given a path.
 * If the path is a full URL (starts with http), it is returned as is.
 * If the path is relative, it is appended to the BASE_URL.
 * If the path is empty or null, a placeholder or empty string is returned (optional).
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return "";
    // Handle data URIs (base64 images from backend)
    if (path.startsWith("data:")) return path;
    // Handle full URLs and file paths
    if (path.startsWith("http") || path.startsWith("file://")) return path;

    // Remove leading slash if present to avoid double slashes with BASE_URL
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;

    // Ensure BASE_URL doesn't have a trailing slash
    return `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
};
