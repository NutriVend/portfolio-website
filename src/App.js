import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './components/AdminDashboard';
import ManageCategories from './components/ManageCategories';
import AddProject from './components/AddProject';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import CreatePost from './components/CreatePost';

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/create-post" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            <Route 
              path="/admin/categories" 
              element={
                <ProtectedRoute>
                  <ManageCategories />
                </ProtectedRoute>
              } 
            />
            <Route path="/admin/add-project" element={
              <ProtectedRoute>
                <AddProject />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
