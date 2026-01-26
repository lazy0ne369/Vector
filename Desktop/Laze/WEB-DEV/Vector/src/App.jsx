import { Routes, Route } from 'react-router-dom';

// Layout
import Layout from './components/Layout/Layout';

// Public Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import Privacy from './pages/Privacy/Privacy';
import Contact from './pages/Contact/Contact';
import Blog from './pages/Blog/Blog';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Protected Pages
import Dashboard from './pages/Dashboard/Dashboard';
import Atlas from './pages/Atlas/Atlas';
import Flow from './pages/Flow/Flow';
import Kit from './pages/Kit/Kit';
import Insights from './pages/Insights/Insights';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        
        {/* Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        
        {/* Protected Routes (would normally have auth guard) */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="atlas" element={<Atlas />} />
        <Route path="flow" element={<Flow />} />
        <Route path="kit" element={<Kit />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
