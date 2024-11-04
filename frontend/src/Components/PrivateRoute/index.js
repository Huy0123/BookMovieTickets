import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '~/contexts/AuthContext'; // Đảm bảo đường dẫn này đúng

function PrivateRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    console.log("isAuthenticated:", isAuthenticated); // Thêm log ở đây

    return isAuthenticated ? children : <Navigate to="/signIn" />;
}


export default PrivateRoute;
