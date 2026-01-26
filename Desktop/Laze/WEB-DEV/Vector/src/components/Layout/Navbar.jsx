import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Compass,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Map,
  Wallet,
  Package,
  Lightbulb,
  Search,
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ onSearchClick }) {
  const { isAuthenticated, user, theme, toggleTheme, toggleLanguage, logout } = useApp();
  const { t, currentLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const publicLinks = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/about', labelKey: 'nav.about' },
    { path: '/how-it-works', labelKey: 'nav.howItWorks' },
    { path: '/contact', labelKey: 'nav.contact' },
  ];

  const authLinks = [
    { path: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
    { path: '/atlas', labelKey: 'nav.atlas', icon: Map },
    { path: '/flow', labelKey: 'nav.flow', icon: Wallet },
    { path: '/kit', labelKey: 'nav.kit', icon: Package },
    { path: '/insights', labelKey: 'nav.insights', icon: Lightbulb },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <Compass className="logo-icon" />
          <span className="logo-text">Vector</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          {isAuthenticated ? (
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <link.icon size={18} />
                <span>{t(link.labelKey)}</span>
              </Link>
            ))
          ) : (
            publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {t(link.labelKey)}
              </Link>
            ))
          )}
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Search Button */}
          <button 
            className="search-btn" 
            onClick={onSearchClick}
            title="Search (Ctrl+K)"
          >
            <Search size={20} />
            <span className="search-shortcut">⌘K</span>
          </button>

          {/* Language Switcher */}
          <button className="icon-btn" onClick={toggleLanguage} title="Toggle Language">
            <Globe size={20} />
            <span className="lang-label">{currentLanguage.code.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {isAuthenticated ? (
            /* Profile Dropdown */
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="avatar">
                  {user?.name?.[0] || 'U'}
                </div>
                <ChevronDown size={16} />
              </button>

              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name || 'User'}</p>
                    <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/settings" className="dropdown-item" onClick={() => setProfileDropdownOpen(false)}>
                    <Settings size={16} />
                    {t('nav.settings')}
                  </Link>
                  <button className="dropdown-item" onClick={() => { logout(); setProfileDropdownOpen(false); }}>
                    <LogOut size={16} />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons */
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">{t('nav.login')}</Link>
              <Link to="/signup" className="btn btn-primary">{t('nav.signup')}</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            authLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={18} />
                {t(link.labelKey)}
              </Link>
            ))
          ) : (
            <>
              {publicLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="mobile-auth">
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>{t('nav.login')}</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>{t('nav.signup')}</Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
