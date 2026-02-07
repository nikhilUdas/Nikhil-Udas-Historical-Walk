
const BASE_URL = "http://192.168.100.95:8000";

const getImageUrl = (path) => {
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

console.log("Empty path:", getImageUrl(null) === "");
console.log("Data URI:", getImageUrl("data:image/png;base64,abc") === "data:image/png;base64,abc");
console.log("Full HTTP URL:", getImageUrl("http://example.com/img.jpg") === "http://example.com/img.jpg");
console.log("File URL:", getImageUrl("file:///local/img.jpg") === "file:///local/img.jpg");
console.log("Relative path:", getImageUrl("images/test.jpg") === "http://192.168.100.95:8000/images/test.jpg");
console.log("Relative path with slash:", getImageUrl("/images/test.jpg") === "http://192.168.100.95:8000/images/test.jpg");
