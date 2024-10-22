import axios from 'axios';

// Hàm để refresh access token
export const refreshAccessToken = async () => {
    try {
        const response = await axios.post('http://localhost:8080/v1/Users/refresh-token', {}, {
            withCredentials: true, // Đảm bảo gửi cookie với yêu cầu
        });
        return response.data.accesstoken; // Trả về access token mới
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null; // Trả về null nếu không lấy được token
    }
};

// Hàm để thực hiện API request
export const apiRequest = async (url, options) => {
    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) { // 401: Unauthorized
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                localStorage.setItem('userToken', newAccessToken);
                
                // Cập nhật lại token vào headers và thử lại yêu cầu ban đầu
                options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                const retryResponse = await axios(url, options);
                return retryResponse.data;
            } else {
                console.error('Unable to refresh access token');
                // Xử lý lỗi khi không thể refresh token
            }
        } else {
            console.error('API request error:', error);
        }
        throw error; // Ném lại lỗi nếu không phải 401
    }
};
