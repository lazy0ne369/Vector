import { Link } from 'react-router-dom';
import { Compass, Heart, Github, Twitter, Mail, Linkedin, Instagram, ArrowRight, MapPin, Phone } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerRef, footerVisible] = useScrollAnimation();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/how-it-works' },
      { label: 'Atlas', path: '/atlas' },
      { label: 'Flow', path: '/flow' },
      { label: 'Kit', path: '/kit' },
      { label: 'Insights', path: '/insights' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Blog', path: '/blog' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
    ],
    resources: [
      { label: 'Help Center', path: '/help' },
      { label: 'Documentation', path: '/docs' },
      { label: 'Community', path: '/community' },
      { label: 'Status', path: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
    ],
  };

  return (
    <footer ref={footerRef} className={`footer ${footerVisible ? 'animate-in' : ''}`}>
      <div className="footer-container">
        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h3>Stay in the loop</h3>
            <p>Get tips, updates, and exclusive content delivered to your inbox.</p>
          </div>
          <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn btn-primary">
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Compass className="logo-icon" />
              <span>Vector</span>
            </Link>
            <p className="footer-tagline">
              Guiding students through life with direction and strength. Your personal companion for academic success and wellbeing.
            </p>
            
            <div className="footer-contact">
              <a href="mailto:hello@vector.app" className="contact-item">
                <Mail size={16} />
                <span>hello@vector.app</span>
              </a>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Bhubaneswar, India</span>
              </div>
            </div>

            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://github.com/lazy0ne369/Vector" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-list">
                {footerLinks.product.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-list">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-list">
                {footerLinks.resources.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-list">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Vector. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <Heart size={14} className="heart-icon" /> for students everywhere
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🇮🇳 Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
