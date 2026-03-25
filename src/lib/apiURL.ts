// Use the hardcoded local URL to ensure connectivity during development if environment variables fail to load
const LOCAL_BACKEND = "http://localhost:5000/api";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || LOCAL_BACKEND;
console.log("[API_URL] Active Backend Endpoint:", API_URL);
