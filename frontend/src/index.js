import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from '~/Components/GlobalStyles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'tippy.js/dist/tippy.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '~/contexts/AuthContext'; // Nhập AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = process.env.REACT_APP_GG_CLIENT_ID; // Lấy clientId từ biến môi trường

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}> {/* Bao bọc bằng GoogleOAuthProvider */}
      <AuthProvider> {/* Bao bọc App bằng AuthProvider */}
        <GlobalStyles>
          <App />
        </GlobalStyles>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// Nếu bạn muốn bắt đầu đo hiệu suất trong ứng dụng của mình, hãy truyền một hàm
// để ghi lại kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi đến một điểm cuối phân tích. Tìm hiểu thêm: https://bit.ly/CRA-vitals
reportWebVitals();
