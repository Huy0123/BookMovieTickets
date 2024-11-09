import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import { DefaultLayout } from '~/Components/Layout';
import PrivateRoute from '~/Components/PrivateRoute'; // Nhập đúng
import { useAuth } from '~/contexts/AuthContext';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Xử lý các route công khai */}
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            return (
              <Route 
                key={index} 
                path={route.path} 
                element={
                  <Layout>
                    <Page />
                  </Layout>
                } 
              />
            );
          })}

          {/* Xử lý các route riêng tư */}
          {privateRoutes.map((route, index) => {
    const Page = route.component;
    let Layout = DefaultLayout;

    if (route.layout) {
        Layout = route.layout;
    } else if (route.layout === null) {
        Layout = Fragment;
    }

    return (
        <Route
            key={index}
            path={route.path}
            element={
                <PrivateRoute adminOnly={route.adminOnly} cinemaOnly={route.cinemaOnly}>
                    <Layout>
                        <Page />
                    </Layout>
                </PrivateRoute>
            }
        />
    );
})}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
