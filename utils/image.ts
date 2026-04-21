import { BASE_URL } from "../constants/api";

/**
 * Returns a full image URL given a path.
 * If the path is a full URL (starts with http), it is returned as is.
 * If the path is relative, it is appended to the BASE_URL.
 * If the path is empty or null, a placeholder or empty string is returned (optional).
 */
export const getImageUrl = (path: string | null | undefined): string | undefined => {
    if (!path || typeof path !== 'string' || path === 'null' || path === 'undefined') return undefined;
    
    // If it's already a full URL (starts with http), a local file path, or a base64 data URI, return it as is
    if (path.startsWith("http") || path.startsWith("file://") || path.startsWith("data:")) {
        return path;
    }

    // Remove leading slash if present 
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    
    // Construct the full URL using BASE_URL
    const fullUrl = `${BASE_URL.replace(/\/$/, "")}/${cleanPath}`;
    
    return fullUrl;
};
