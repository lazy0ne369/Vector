import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Download,
  Trash2,
  Eye,
  Moon,
  Sun,
  Globe,
  LogOut,
  ChevronRight,
  Mail,
  Lock,
  Smartphone,
  Upload,
  CheckCircle,
} from 'lucide-react';
import './Settings.css';

export default function Settings() {
  const { user, theme, language, toggleTheme, changeLanguage, logout } = useApp();
  const { t, languages } = useTranslation();
  const [activeSection, setActiveSection] = useState('profile');
  const [viewerMode, setViewerMode] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Export all data
  const handleExport = () => {
    const allData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      atlas: {
        courses: JSON.parse(localStorage.getItem('vector_atlas_courses') || '[]'),
        deadlines: JSON.parse(localStorage.getItem('vector_atlas_deadlines') || '[]'),
        reflections: JSON.parse(localStorage.getItem('vector_atlas_reflections') || '[]'),
      },
      flow: {
        transactions: JSON.parse(localStorage.getItem('vector_flow_transactions') || '[]'),
        budgets: JSON.parse(localStorage.getItem('vector_flow_budgets') || '{}'),
      },
      kit: {
        customKits: JSON.parse(localStorage.getItem('vector_kit_custom') || '[]'),
        savedKits: JSON.parse(localStorage.getItem('vector_kit_saved') || '[]'),
        progress: JSON.parse(localStorage.getItem('vector_kit_progress') || '{}'),
      },
      pomodoro: JSON.parse(localStorage.getItem('vector_pomodoro_stats') || '{}'),
      gpa: JSON.parse(localStorage.getItem('vector_gpa_data') || '{}'),
      savings: JSON.parse(localStorage.getItem('vector_savings_goals') || '[]'),
      user: JSON.parse(localStorage.getItem('vector-user') || 'null'),
      theme: localStorage.getItem('vector-theme') || 'light',
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vector-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Import data
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        
        // Restore Atlas data
        if (data.atlas) {
          if (data.atlas.courses) localStorage.setItem('vector_atlas_courses', JSON.stringify(data.atlas.courses));
          if (data.atlas.deadlines) localStorage.setItem('vector_atlas_deadlines', JSON.stringify(data.atlas.deadlines));
          if (data.atlas.reflections) localStorage.setItem('vector_atlas_reflections', JSON.stringify(data.atlas.reflections));
        }
        
        // Restore Flow data
        if (data.flow) {
          if (data.flow.transactions) localStorage.setItem('vector_flow_transactions', JSON.stringify(data.flow.transactions));
          if (data.flow.budgets) localStorage.setItem('vector_flow_budgets', JSON.stringify(data.flow.budgets));
        }
        
        // Restore Kit data
        if (data.kit) {
          if (data.kit.customKits) localStorage.setItem('vector_kit_custom', JSON.stringify(data.kit.customKits));
          if (data.kit.savedKits) localStorage.setItem('vector_kit_saved', JSON.stringify(data.kit.savedKits));
          if (data.kit.progress) localStorage.setItem('vector_kit_progress', JSON.stringify(data.kit.progress));
        }
        
        // Restore other data
        if (data.pomodoro) localStorage.setItem('vector_pomodoro_stats', JSON.stringify(data.pomodoro));
        if (data.gpa) localStorage.setItem('vector_gpa_data', JSON.stringify(data.gpa));
        if (data.savings) localStorage.setItem('vector_savings_goals', JSON.stringify(data.savings));
        
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          window.location.reload(); // Reload to apply imported data
        }, 2000);
      } catch {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  // Delete all data
  const handleDeleteAllData = () => {
    if (!confirm('Are you sure you want to delete ALL your data? This cannot be undone.')) return;
    if (!confirm('This is your last chance. All your courses, transactions, kits, and progress will be permanently deleted.')) return;
    
    const keysToDelete = [
      'vector_atlas_courses', 'vector_atlas_deadlines', 'vector_atlas_reflections',
      'vector_flow_transactions', 'vector_flow_budgets',
      'vector_kit_custom', 'vector_kit_saved', 'vector_kit_progress',
      'vector_pomodoro_stats', 'vector_gpa_data', 'vector_savings_goals'
    ];
    
    keysToDelete.forEach(key => localStorage.removeItem(key));
    alert('All data has been deleted.');
    window.location.reload();
  };

  const sections = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'privacy', label: t('settings.privacyData'), icon: Shield },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'appearance', label: t('settings.appearance'), icon: Moon },
  ];

  return (
    <div className="settings-page">
      <div className="container">
        {/* Header */}
        <header className="settings-header">
          <div className="header-info">
            <div className="header-icon">
              <SettingsIcon size={28} />
            </div>
            <div>
              <h1>{t('settings.title')}</h1>
              <p>{t('settings.subtitle')}</p>
            </div>
          </div>
        </header>

        <div className="settings-layout">
          {/* Sidebar */}
          <nav className="settings-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={18} />
                <span>{section.label}</span>
                <ChevronRight size={16} className="chevron" />
              </button>
            ))}
            <div className="nav-divider"></div>
            <button className="nav-item danger" onClick={logout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </nav>

          {/* Content */}
          <div className="settings-content">
            {activeSection === 'profile' && (
              <div className="settings-section">
                <h2>Profile Settings</h2>
                <p className="section-description">Manage your personal information</p>

                <div className="profile-card">
                  <div className="avatar-section">
                    <div className="avatar-large">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <button className="btn btn-secondary btn-sm">Change Photo</button>
                  </div>
                  <div className="profile-info">
                    <h3>{user?.name || 'Student User'}</h3>
                    <p>{user?.email || 'user@example.com'}</p>
                  </div>
                </div>

                <form className="settings-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <div className="input-icon">
                        <User size={18} />
                        <input 
                          type="text" 
                          className="form-input" 
                          defaultValue={user?.name || ''} 
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <div className="input-icon">
                        <Mail size={18} />
                        <input 
                          type="email" 
                          className="form-input" 
                          defaultValue={user?.email || ''} 
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <div className="input-icon">
                        <Smartphone size={18} />
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">College Email (Optional)</label>
                      <div className="input-icon">
                        <Mail size={18} />
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="you@college.edu"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </form>

                <div className="password-section">
                  <h3>Change Password</h3>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div className="input-icon">
                      <Lock size={18} />
                      <input type="password" className="form-input" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <div className="input-icon">
                        <Lock size={18} />
                        <input type="password" className="form-input" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <div className="input-icon">
                        <Lock size={18} />
                        <input type="password" className="form-input" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-secondary">Update Password</button>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="settings-section">
                <h2>Privacy & Data Control</h2>
                <p className="section-description">Your data belongs to you. Manage how it's used.</p>

                <div className="setting-item">
                  <div className="setting-info">
                    <Eye size={20} />
                    <div>
                      <h4>Viewer Mode</h4>
                      <p>Show summary-only views without raw data</p>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={viewerMode} 
                      onChange={() => setViewerMode(!viewerMode)} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="data-actions">
                  <h3>Data Management</h3>
                  
                  <div className="action-card">
                    <div className="action-icon">
                      <Download size={20} />
                    </div>
                    <div className="action-info">
                      <h4>Export Your Data</h4>
                      <p>Download all your data in JSON format</p>
                    </div>
                    <button 
                      className={`btn ${exportSuccess ? 'btn-success' : 'btn-secondary'}`}
                      onClick={handleExport}
                    >
                      {exportSuccess ? <><CheckCircle size={16} /> Exported!</> : 'Export'}
                    </button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon">
                      <Upload size={20} />
                    </div>
                    <div className="action-info">
                      <h4>Import Data</h4>
                      <p>Restore your data from a backup file</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      style={{ display: 'none' }}
                    />
                    <button 
                      className={`btn ${importSuccess ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {importSuccess ? <><CheckCircle size={16} /> Imported!</> : 'Import'}
                    </button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon warning">
                      <Trash2 size={20} />
                    </div>
                    <div className="action-info">
                      <h4>Delete All Data</h4>
                      <p>Permanently delete all your data from Vector</p>
                    </div>
                    <button className="btn btn-danger" onClick={handleDeleteAllData}>Delete</button>
                  </div>

                  <div className="action-card">
                    <div className="action-icon danger">
                      <User size={20} />
                    </div>
                    <div className="action-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button className="btn btn-danger" onClick={() => {
                      if (confirm('Delete your account? This will log you out and remove all data.')) {
                        handleDeleteAllData();
                        logout();
                      }
                    }}>Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="settings-section">
                <h2>Notification Preferences</h2>
                <p className="section-description">Control how and when you receive notifications</p>

                <div className="notifications-group">
                  <h3>Email Notifications</h3>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <div>
                        <h4>Weekly Summary</h4>
                        <p>Receive your weekly insights every Monday</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div>
                        <h4>Deadline Reminders</h4>
                        <p>Get notified about upcoming deadlines</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div>
                        <h4>Check-in Reminders</h4>
                        <p>Gentle reminder for weekly well-being check-in</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="setting-item">
                    <div className="setting-info">
                      <div>
                        <h4>Budget Alerts</h4>
                        <p>Get notified when you're approaching your budget limit</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="settings-section">
                <h2>Appearance</h2>
                <p className="section-description">Customize how Vector looks</p>

                <div className="setting-item">
                  <div className="setting-info">
                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                    <div>
                      <h4>Theme</h4>
                      <p>Choose between light and dark mode</p>
                    </div>
                  </div>
                  <div className="theme-toggle">
                    <button 
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => theme === 'dark' && toggleTheme()}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => theme === 'light' && toggleTheme()}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                  </div>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <Globe size={20} />
                    <div>
                      <h4>{t('settings.language')}</h4>
                      <p>{t('settings.chooseLanguage')}</p>
                    </div>
                  </div>
                  <div className="language-select four-lang">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                        onClick={() => changeLanguage(lang.code)}
                        title={lang.name}
                      >
                        <span className="lang-flag">{lang.flag}</span>
                        <span className="lang-name">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
