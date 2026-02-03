import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSite from './pages/CreateSite';
import SitePages from './pages/SitePages';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sites/new"
            element={
              <ProtectedRoute user={user}>
                <CreateSite />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sites/:siteId/pages"
            element={
              <ProtectedRoute user={user}>
                <SitePages user={user} />
              </ProtectedRoute>
            }
          />

            <Route
                path="/pages/new"
                element={
                    <ProtectedRoute user={user}>
                        <CreatePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pages/:id/edit"
                element={
                    <ProtectedRoute user={user}>
                        <EditPage />
                    </ProtectedRoute>
                }
            />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;