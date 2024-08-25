import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import RoleProtectedRoute from './components/RoleProtectedRoute';
import { Login } from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home/Home';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={< Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>

    </AuthProvider>

  );
};

export default App;
