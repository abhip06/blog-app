// All Environment variables

// Checking for development or production
const development: boolean = !import.meta.env.MODE || import.meta.env.MODE === 'development';

export const SERVER_ORIGIN = development ? "http://localhost:8000" : import.meta.env.VITE_SERVER_ORIGIN;