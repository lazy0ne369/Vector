import { Link } from 'react-router-dom';
import { Compass, Heart, Github, Twitter, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/how-it-works' },
      { label: 'Atlas', path: '/atlas' },
      { label: 'Flow', path: '/flow' },
      { label: 'Kit', path: '/kit' },
    ],
    company: [
      { label: 'About', path: '/about' },
      { label: 'Privacy', path: '/privacy' },
      { label: 'Terms', path: '/terms' },
      { label: 'Contact', path: '/contact' },
    ],
    resources: [
      { label: 'Help Center', path: '/help' },
      { label: 'Blog', path: '/blog' },
      { label: 'Changelog', path: '/changelog' },
      { label: 'Status', path: '/status' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <Compass className="logo-icon" />
              <span>Vector</span>
            </Link>
            <p className="footer-tagline">
              Guiding students through life with direction and strength.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Email">
                <Mail size={20} />
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
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Vector. All rights reserved.
          </p>
          <p className="footer-made">
            Made with <Heart size={14} className="heart-icon" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
