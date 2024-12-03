import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
	baseURL: `axios_base_url`,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true, // Enable sending cookies with requests
});

// Add request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// You can modify request config here (e.g., add auth tokens)
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		// Interceptors allow you to intercept and transform HTTP requests/responses
		// This is the success handler - it runs when a response is received successfully
		// Here you can modify the response data before it reaches your application code
		return response;
	},
	(error) => {
		// This is the error handler - it runs when the request fails
		// Here you can handle errors globally, like showing error messages or redirecting
		// You can also modify the error before rejecting it
		return Promise.reject(error);
	}
);

// usage example
// axiosInstance.get("/api/v1/users").then((res) => console.log(res)).catch((err) => console.log(err));

export default axiosInstance;
