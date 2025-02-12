import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Login from './components/pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/pages/AdminDashboard';
import ManageCategories from './components/ManageCategories';
import PrivateRoute from './components/PrivateRoute';
import Admin from './components/Admin';
import AddProject from './components/AddProject';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-100">
          <Navigation />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Projects />
                <Contact />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } />
            <Route 
              path="/admin/categories" 
              element={
                <PrivateRoute>
                  <ManageCategories />
                </PrivateRoute>
              } 
            />
            <Route path="/admin/add-project" element={<AddProject />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
