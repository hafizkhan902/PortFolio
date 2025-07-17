import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/ui/Notification';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import PortfolioHighlights from './components/sections/PortfolioHighlights';
import Projects from './components/sections/Projects';
import GitHub from './components/sections/GitHub';
import Passion from './components/sections/Passion';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';
import AdminApp from './components/admin/AdminApp';

// Main Portfolio Component
const Portfolio = () => (
  <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Skills />
      <PortfolioHighlights />
      <Projects />
      <GitHub />
      <Passion />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
