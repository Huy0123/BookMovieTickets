// services/apiClient.js
import axios from "axios";

// Tạo axios instance
const apiClient = axios.create({
    baseURL: "http://localhost:8080/v1",
    withCredentials: true, // Nếu refresh token sử dụng cookie
});

// Interceptor để tự động refresh token khi gặp lỗi 401
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu có callback navigate, thì khi không thể refresh token, sẽ gọi navigate
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu để tránh lặp vô hạn

            try {
                // Gọi API làm mới token
                const response = await axios.post(
                    "/Users/refresh_token",
                    {},
                    { baseURL: "http://localhost:8080/v1", withCredentials: true }
                );

                if (response.data.newToken) {
                    const newAccessToken = response.data.newToken;
                    localStorage.setItem("userToken", newAccessToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

                    // Gửi lại request với token mới
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Không thể làm mới token:", refreshError);

                // Nếu không làm mới được, nên đăng xuất
                localStorage.removeItem("userToken");
                localStorage.removeItem('userRole');
                window.location.href = "/signin"; 
                
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
