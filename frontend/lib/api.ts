export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const buildApiUrl = (path: string) => `${API_BASE_URL}${path}`;
