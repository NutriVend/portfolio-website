import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Contact from './components/Contact';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="bg-gray-100">
          <Navigation />
          <Hero />
          <Projects />
          <Contact />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
