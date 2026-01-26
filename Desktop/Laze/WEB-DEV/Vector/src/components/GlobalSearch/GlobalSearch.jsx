import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  BookOpen,
  Target,
  Calendar,
  DollarSign,
  CheckSquare,
  Package,
  ArrowRight,
  Clock,
  Map,
  Wallet,
  Settings,
  Moon,
  Sun,
  Home,
  BarChart3,
  Timer,
  GraduationCap,
  Trash2,
  Command,
  Info,
  Shield,
  HelpCircle,
  Zap,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import './GlobalSearch.css';

const RECENT_SEARCHES_KEY = 'vector_recent_searches';
const MAX_RECENT_SEARCHES = 5;

// Helper to load recent searches
function loadRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState(loadRecentSearches);
  const [wasOpen, setWasOpen] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme, toggleLanguage } = useApp();
  const { t, currentLanguage } = useTranslation();

  // Sync open state - focus on open
  if (isOpen && !wasOpen) {
    // Reset state when opening
    if (query !== '') setQuery('');
    if (selectedIndex !== 0) setSelectedIndex(0);
    const freshRecents = loadRecentSearches();
    if (JSON.stringify(freshRecents) !== JSON.stringify(recentSearches)) {
      setRecentSearches(freshRecents);
    }
  }
  
  // Track wasOpen for next render
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
  }

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Quick actions available via commands
  const quickActions = useMemo(() => [
    {
      type: 'action',
      category: 'Quick Action',
      title: 'Toggle Theme',
      subtitle: `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
      icon: theme === 'light' ? Moon : Sun,
      action: () => toggleTheme(),
      color: 'accent',
      keywords: ['theme', 'dark', 'light', 'mode', 'toggle']
    },
    {
      type: 'action',
      category: 'Quick Action',
      title: 'Change Language',
      subtitle: `Current: ${currentLanguage.nativeName}`,
      icon: Globe,
      action: () => toggleLanguage(),
      color: 'primary',
      keywords: ['language', 'lang', 'hindi', 'english', 'telugu', 'odia', 'bhasha']
    },
    {
      type: 'action',
      category: 'Quick Action',
      title: 'Go to Settings',
      subtitle: 'Manage your preferences',
      icon: Settings,
      path: '/settings',
      color: 'muted',
      keywords: ['settings', 'preferences', 'config']
    },
    {
      type: 'action',
      category: 'Quick Action',
      title: 'Start Pomodoro',
      subtitle: 'Begin a focus session',
      icon: Timer,
      path: '/dashboard',
      color: 'primary',
      keywords: ['pomodoro', 'timer', 'focus', 'study']
    },
    {
      type: 'action',
      category: 'Quick Action',
      title: 'Calculate GPA',
      subtitle: 'Open GPA calculator',
      icon: GraduationCap,
      path: '/dashboard',
      color: 'secondary',
      keywords: ['gpa', 'calculator', 'grades', 'cgpa']
    }
  ], [theme, toggleTheme, currentLanguage.nativeName, toggleLanguage]);

  // Navigation pages
  const pages = useMemo(() => [
    { title: 'Home', subtitle: 'Welcome page', icon: Home, path: '/', color: 'muted', keywords: ['home', 'welcome', 'landing'] },
    { title: 'Dashboard', subtitle: 'Your productivity hub', icon: BarChart3, path: '/dashboard', color: 'primary', keywords: ['dashboard', 'hub', 'main'] },
    { title: 'Atlas', subtitle: 'Academic management', icon: Map, path: '/atlas', color: 'primary', keywords: ['atlas', 'courses', 'academic', 'deadlines'] },
    { title: 'Flow', subtitle: 'Financial tracking', icon: Wallet, path: '/flow', color: 'secondary', keywords: ['flow', 'money', 'finance', 'budget', 'expenses'] },
    { title: 'Kit', subtitle: 'Inventory & checklists', icon: Package, path: '/kit', color: 'accent', keywords: ['kit', 'inventory', 'checklist', 'packing'] },
    { title: 'Insights', subtitle: 'Analytics & stats', icon: BarChart3, path: '/insights', color: 'secondary', keywords: ['insights', 'analytics', 'statistics', 'reports'] },
    { title: 'Settings', subtitle: 'App preferences', icon: Settings, path: '/settings', color: 'muted', keywords: ['settings', 'preferences', 'account'] },
    { title: 'About', subtitle: 'About Vector', icon: Info, path: '/about', color: 'muted', keywords: ['about', 'info', 'information'] },
    { title: 'How It Works', subtitle: 'Learn the app', icon: HelpCircle, path: '/how-it-works', color: 'muted', keywords: ['how', 'help', 'guide', 'tutorial'] },
    { title: 'Privacy', subtitle: 'Privacy policy', icon: Shield, path: '/privacy', color: 'muted', keywords: ['privacy', 'policy', 'data'] }
  ], []);

  // Search through all data sources
  const results = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    
    if (lowerQuery.length < 1) {
      return [];
    }

    const searchResults = [];

    // Check for command prefix
    const isCommand = lowerQuery.startsWith('/');
    const commandQuery = isCommand ? lowerQuery.slice(1) : lowerQuery;

    // Search quick actions
    quickActions.forEach(action => {
      const matchesTitle = action.title.toLowerCase().includes(commandQuery);
      const matchesKeywords = action.keywords?.some(k => k.includes(commandQuery));
      
      if (matchesTitle || matchesKeywords) {
        searchResults.push({
          ...action,
          type: 'action',
          category: 'Quick Action'
        });
      }
    });

    // Search pages
    pages.forEach(page => {
      const matchesTitle = page.title.toLowerCase().includes(commandQuery);
      const matchesKeywords = page.keywords?.some(k => k.includes(commandQuery));
      
      if (matchesTitle || matchesKeywords) {
        searchResults.push({
          ...page,
          type: 'page',
          category: 'Page'
        });
      }
    });

    // If it's a command, only show actions and pages
    if (isCommand) {
      return searchResults.slice(0, 10);
    }

    // Need at least 2 chars for data search
    if (lowerQuery.length < 2) {
      return searchResults.slice(0, 10);
    }

    // Search Atlas data
    try {
      const courses = JSON.parse(localStorage.getItem('vector_atlas_courses') || '[]');
      const deadlines = JSON.parse(localStorage.getItem('vector_atlas_deadlines') || '[]');

      courses.forEach(course => {
        if (course.name?.toLowerCase().includes(lowerQuery) ||
            course.code?.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'atlas',
            category: 'Course',
            title: course.name,
            subtitle: course.code || 'Atlas',
            icon: BookOpen,
            path: '/atlas',
            color: 'primary',
            data: course
          });
        }
      });

      deadlines.forEach(deadline => {
        if (deadline.title?.toLowerCase().includes(lowerQuery)) {
          const date = new Date(deadline.date);
          const isOverdue = date < new Date();
          searchResults.push({
            type: 'atlas',
            category: 'Deadline',
            title: deadline.title,
            subtitle: `${date.toLocaleDateString()}${isOverdue ? ' • Overdue' : ''}`,
            icon: Calendar,
            path: '/atlas',
            color: isOverdue ? 'danger' : 'primary',
            data: deadline
          });
        }
      });
    } catch {
      // Silently handle errors
    }

    // Search Flow data
    try {
      const transactions = JSON.parse(localStorage.getItem('vector_flow_transactions') || '[]');
      
      transactions.slice(0, 50).forEach(tx => {
        if (tx.description?.toLowerCase().includes(lowerQuery) ||
            tx.category?.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'flow',
            category: tx.type === 'income' ? 'Income' : 'Expense',
            title: tx.description,
            subtitle: `₹${tx.amount?.toLocaleString()} • ${tx.category}`,
            icon: DollarSign,
            path: '/flow',
            color: tx.type === 'income' ? 'success' : 'secondary',
            data: tx
          });
        }
      });
    } catch {
      // Silently handle errors
    }

    // Search Kit data
    try {
      const customKits = JSON.parse(localStorage.getItem('vector_kit_custom') || '[]');
      
      customKits.forEach(kit => {
        if (kit.name?.toLowerCase().includes(lowerQuery) ||
            kit.description?.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            type: 'kit',
            category: 'Kit',
            title: kit.name,
            subtitle: kit.description || 'Custom Kit',
            icon: Package,
            path: '/kit',
            color: 'accent',
            data: kit
          });
        }
        
        kit.sections?.forEach(section => {
          section.items?.forEach(item => {
            if (item.name?.toLowerCase().includes(lowerQuery)) {
              searchResults.push({
                type: 'kit',
                category: 'Kit Item',
                title: item.name,
                subtitle: `${kit.name} → ${section.name}`,
                icon: CheckSquare,
                path: '/kit',
                color: 'accent',
                data: { kit, section, item }
              });
            }
          });
        });
      });
    } catch {
      // Silently handle errors
    }

    // Search Savings Goals
    try {
      const goals = JSON.parse(localStorage.getItem('vector_savings_goals') || '[]');
      
      goals.forEach(goal => {
        if (goal.name?.toLowerCase().includes(lowerQuery)) {
          const progress = goal.targetAmount > 0 
            ? Math.round((goal.savedAmount / goal.targetAmount) * 100) 
            : 0;
          searchResults.push({
            type: 'flow',
            category: 'Savings Goal',
            title: goal.name,
            subtitle: `₹${goal.savedAmount?.toLocaleString()} / ₹${goal.targetAmount?.toLocaleString()} (${progress}%)`,
            icon: Target,
            path: '/flow',
            color: 'secondary',
            data: goal
          });
        }
      });
    } catch {
      // Silently handle errors
    }

    return searchResults.slice(0, 15);
  }, [query, quickActions, pages]);

  // Save recent search
  const saveRecentSearch = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    try {
      const recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
      const filtered = recent.filter(s => s !== searchTerm);
      const updated = [searchTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {
      // Silently handle errors
    }
  }, []);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  }, []);

  // Handle result click
  const handleResultClick = useCallback((result) => {
    if (result.action) {
      result.action();
    } else if (result.path) {
      navigate(result.path);
    }
    
    if (query.length >= 2 && result.type !== 'action') {
      saveRecentSearch(query);
    }
    
    onClose();
    setQuery('');
  }, [navigate, onClose, query, saveRecentSearch]);

  // Ensure selectedIndex stays within bounds
  const boundedSelectedIndex = results.length > 0 
    ? Math.min(selectedIndex, results.length - 1) 
    : 0;

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const totalResults = results.length;
    
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(totalResults, 1));
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(totalResults, 1)) % Math.max(totalResults, 1));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (results[boundedSelectedIndex]) {
          handleResultClick(results[boundedSelectedIndex]);
        }
        break;
        
      default:
        break;
    }
  }, [results, boundedSelectedIndex, onClose, handleResultClick]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selectedElement = resultsRef.current.querySelector(`[data-index="${boundedSelectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [boundedSelectedIndex, results.length]);

  // Handle recent search click
  const handleRecentClick = (term) => {
    setQuery(term);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  const showRecentSearches = query.length === 0 && recentSearches.length > 0;
  const showQuickLinks = query.length === 0;
  const showResults = query.length >= 1 && results.length > 0;
  const showNoResults = query.length >= 2 && results.length === 0;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              className="search-clear" 
              onClick={() => setQuery('')}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button className="search-close" onClick={onClose} title="Close (Esc)">
            <X size={18} />
          </button>
        </div>

        <div className="search-body">
          {/* Results */}
          {showResults && (
            <div className="search-results" ref={resultsRef}>
              <div className="results-header">
                <span>{results.length} {results.length !== 1 ? t('search.results') : t('search.result')}</span>
                <span className="results-hint">↑↓ {t('search.toNavigate')} • Enter {t('search.toSelect')}</span>
              </div>
              <div className="results-list">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.title}-${index}`}
                    data-index={index}
                    className={`result-item ${index === boundedSelectedIndex ? 'selected' : ''}`}
                    onClick={() => handleResultClick(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className={`result-icon ${result.color}`}>
                      <result.icon size={16} />
                    </div>
                    <div className="result-info">
                      <span className="result-title">
                        <HighlightMatch text={result.title} query={query} />
                      </span>
                      <span className="result-subtitle">{result.subtitle}</span>
                    </div>
                    <span className="result-category">{result.category}</span>
                    <ArrowRight size={14} className="result-arrow" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="no-results">
              <Search size={32} />
              <p>{t('search.noResults')} "{query}"</p>
              <span>{t('search.tryDifferent')}</span>
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="recent-searches">
              <div className="section-header">
                <span><Clock size={14} /> {t('search.recentSearches')}</span>
                <button onClick={clearRecentSearches} className="clear-recent">
                  <Trash2 size={12} /> {t('common.clear')}
                </button>
              </div>
              <div className="recent-list">
                {recentSearches.map((term, index) => (
                  <button 
                    key={index} 
                    className="recent-item"
                    onClick={() => handleRecentClick(term)}
                  >
                    <Clock size={14} />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Links */}
          {showQuickLinks && (
            <div className="search-hints">
              <div className="section-header">
                <span><Zap size={14} /> {t('search.quickLinks')}</span>
              </div>
              <div className="quick-links">
                <button onClick={() => { navigate('/dashboard'); onClose(); }}>
                  <BarChart3 size={16} />
                  {t('nav.dashboard')}
                </button>
                <button onClick={() => { navigate('/atlas'); onClose(); }}>
                  <Map size={16} />
                  {t('nav.atlas')}
                </button>
                <button onClick={() => { navigate('/flow'); onClose(); }}>
                  <Wallet size={16} />
                  {t('nav.flow')}
                </button>
                <button onClick={() => { navigate('/kit'); onClose(); }}>
                  <Package size={16} />
                  {t('nav.kit')}
                </button>
                <button onClick={() => { navigate('/insights'); onClose(); }}>
                  <BarChart3 size={16} />
                  {t('nav.insights')}
                </button>
              </div>

              <div className="command-hints">
                <div className="section-header">
                  <span><Command size={14} /> {t('search.commands')}</span>
                </div>
                <div className="command-list">
                  <div className="command-item">
                    <code>/theme</code>
                    <span>{t('search.commandTheme')}</span>
                  </div>
                  <div className="command-item">
                    <code>/settings</code>
                    <span>{t('search.commandSettings')}</span>
                  </div>
                  <div className="command-item">
                    <code>/pomodoro</code>
                    <span>{t('search.commandPomodoro')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with shortcuts */}
        <div className="search-footer">
          <div className="search-shortcut">
            <kbd>↑</kbd><kbd>↓</kbd> <span>{t('search.navigate')}</span>
          </div>
          <div className="search-shortcut">
            <kbd>Enter</kbd> <span>{t('search.select')}</span>
          </div>
          <div className="search-shortcut">
            <kbd>Esc</kbd> <span>{t('search.close')}</span>
          </div>
          <div className="search-shortcut">
            <kbd>/</kbd> <span>{t('search.commands')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component to highlight matching text
function HighlightMatch({ text, query }) {
  if (!query || query.length < 1) {
    return <>{text}</>;
  }

  const cleanQuery = query.replace(/^\//, '').toLowerCase();
  if (!cleanQuery) {
    return <>{text}</>;
  }

  const index = text.toLowerCase().indexOf(cleanQuery);
  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + cleanQuery.length)}</mark>
      {text.slice(index + cleanQuery.length)}
    </>
  );
}
