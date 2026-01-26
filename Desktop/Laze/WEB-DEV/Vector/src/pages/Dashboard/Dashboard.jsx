import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Map,
  Wallet,
  Package,
  Lightbulb,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Bell,
  Plus,
  Search,
  Clock,
  Target,
  BookOpen,
  Timer,
  Sparkles,
} from 'lucide-react';
import GlobalSearch from '../../components/GlobalSearch/GlobalSearch';
import './Dashboard.css';

// Helper to load from localStorage
const loadFromStorage = (key, fallback = []) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function Dashboard() {
  const { user } = useApp();
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useState(false);

  // Load real data from localStorage - use initializer functions
  const [atlasData] = useState(() => ({
    courses: loadFromStorage('vector_atlas_courses', []),
    deadlines: loadFromStorage('vector_atlas_deadlines', []),
    reflections: loadFromStorage('vector_atlas_reflections', [])
  }));
  const [flowData] = useState(() => ({
    transactions: loadFromStorage('vector_flow_transactions', []),
    budgets: loadFromStorage('vector_flow_budgets', {})
  }));
  const [kitData] = useState(() => ({
    customKits: loadFromStorage('vector_kit_custom', []),
    savedKits: loadFromStorage('vector_kit_saved', []),
    progress: loadFromStorage('vector_kit_progress', {})
  }));
  const [pomodoroStats] = useState(() => 
    loadFromStorage('vector_pomodoro_stats', { todaySessions: 0, totalMinutes: 0 })
  );
  const [savingsGoals] = useState(() => loadFromStorage('vector_savings_goals', []));

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate Atlas Signal
  const getSignal = () => {
    const now = new Date();
    const upcomingDeadlines = atlasData.deadlines.filter(d => {
      const dueDate = new Date(d.date);
      const daysUntil = (dueDate - now) / (1000 * 60 * 60 * 24);
      return daysUntil >= 0 && daysUntil <= 7 && d.status !== 'completed';
    });
    
    const overdueCount = atlasData.deadlines.filter(d => {
      const dueDate = new Date(d.date);
      return dueDate < now && d.status !== 'completed';
    }).length;

    if (overdueCount > 2 || upcomingDeadlines.length > 5) return 'overloaded';
    if (overdueCount > 0 || upcomingDeadlines.length > 3) return 'needs-attention';
    return 'on-track';
  };

  const getSignalInfo = (signal) => {
    switch (signal) {
      case 'on-track':
        return { label: 'On Track', color: 'success', icon: CheckCircle };
      case 'needs-attention':
        return { label: 'Needs Attention', color: 'warning', icon: AlertCircle };
      case 'overloaded':
        return { label: 'Overloaded', color: 'danger', icon: AlertCircle };
      default:
        return { label: 'Unknown', color: 'info', icon: AlertCircle };
    }
  };

  // Get upcoming deadlines
  const upcomingDeadlines = atlasData.deadlines
    .filter(d => {
      const dueDate = new Date(d.date);
      const daysUntil = (dueDate - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntil >= 0 && daysUntil <= 14 && d.status !== 'completed';
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Calculate Flow stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = flowData.transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalSpent = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = Object.values(flowData.budgets).reduce((sum, b) => sum + b, 0) || 10000;

  // Get spending by category
  const categorySpending = {};
  monthlyTransactions.filter(t => t.type === 'expense').forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });

  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, amount]) => ({ name, amount }));

  // Calculate Kit progress
  const totalKits = kitData.customKits.length;
  const completedItems = Object.values(kitData.progress).filter(Boolean).length;

  // Get active savings goal
  const activeGoal = savingsGoals.find(g => g.savedAmount < g.targetAmount);

  const signalInfo = getSignalInfo(getSignal());

  // Check for recent reflection
  const hasRecentReflection = atlasData.reflections.some(r => {
    const reflectionDate = new Date(r.date);
    const daysSince = (new Date() - reflectionDate) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });

  // Generate insights
  const insights = [];
  if (!hasRecentReflection && atlasData.courses.length > 0) {
    insights.push({
      type: 'reminder',
      message: 'Time for your weekly check-in! Reflect on your progress.',
    });
  }
  if (totalSpent > totalBudget * 0.8) {
    insights.push({
      type: 'warning',
      message: `You've spent ${Math.round((totalSpent / totalBudget) * 100)}% of your monthly budget.`,
    });
  }
  if (upcomingDeadlines.some(d => {
    const daysUntil = (new Date(d.date) - new Date()) / (1000 * 60 * 60 * 24);
    return daysUntil <= 2;
  })) {
    insights.push({
      type: 'urgent',
      message: 'You have deadlines approaching in the next 48 hours!',
    });
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('time.morning');
    if (hour < 17) return t('time.afternoon');
    return t('time.evening');
  };

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="welcome">
            <h1>{getGreeting()}, {user?.name?.split(' ')[0] || t('common.student')}!</h1>
            <p>{t('dashboard.overviewToday')}</p>
          </div>
          <div className="header-actions">
            <button 
              className="search-trigger"
              onClick={() => setShowSearch(true)}
            >
              <Search size={18} />
              <span>{t('common.search')}</span>
              <kbd>⌘K</kbd>
            </button>
            <button className="btn btn-secondary icon-only">
              <Bell size={18} />
              {insights.length > 0 && <span className="notification-dot"></span>}
            </button>
          </div>
        </header>

        {/* Insights Banner */}
        {insights.length > 0 && (
          <div className={`insights-banner ${insights[0].type}`}>
            <div className="insight-icon">
              {insights[0].type === 'urgent' ? <AlertCircle size={20} /> : <Lightbulb size={20} />}
            </div>
            <div className="insight-content">
              <strong>{insights[0].type === 'urgent' ? 'Urgent:' : 'Insight:'}</strong> {insights[0].message}
            </div>
            {insights.length > 1 && (
              <Link to="/insights" className="insight-link">+{insights.length - 1} more</Link>
            )}
          </div>
        )}

        {/* Quick Stats Row */}
        <div className="quick-stats">
          <div className="quick-stat">
            <div className="stat-icon atlas">
              <BookOpen size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{atlasData.courses.length}</span>
              <span className="stat-label">{t('atlas.courses')}</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon flow">
              <TrendingUp size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-value">₹{totalSpent.toLocaleString()}</span>
              <span className="stat-label">{t('dashboard.spentThisMonth')}</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon kit">
              <Package size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{totalKits}</span>
              <span className="stat-label">{t('kit.kits')}</span>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon pomodoro">
              <Timer size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{pomodoroStats.todaySessions || 0}</span>
              <span className="stat-label">{t('dashboard.focusSessions')}</span>
            </div>
          </div>
        </div>

        {/* Main Cards Grid */}
        <div className="dashboard-grid">
          {/* Atlas Card */}
          <div className="dashboard-card atlas-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon atlas">
                  <Map size={20} />
                </div>
                <div>
                  <h3>Atlas</h3>
                  <p>{t('atlas.subtitle')}</p>
                </div>
              </div>
              <Link to="/atlas" className="card-link">
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="signal-box">
              <div className={`signal-indicator ${signalInfo.color}`}>
                <signalInfo.icon size={18} />
                <span>{signalInfo.label}</span>
              </div>
              {!hasRecentReflection && atlasData.courses.length > 0 && (
                <span className="check-in-reminder">{t('dashboard.completeCheckIn')}</span>
              )}
            </div>

            <div className="deadlines-section">
              <h4>{t('dashboard.upcomingDeadlines')}</h4>
              {upcomingDeadlines.length > 0 ? (
                <ul className="deadlines-list">
                  {upcomingDeadlines.map((deadline) => {
                    const daysUntil = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <li key={deadline.id} className={daysUntil <= 2 ? 'urgent' : ''}>
                        <span className="deadline-title">{deadline.title}</span>
                        <span className="deadline-date">
                          {daysUntil === 0 ? t('time.today') : daysUntil === 1 ? t('time.tomorrow') : `${daysUntil}${t('time.daysShort')}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="no-data">{t('dashboard.noDeadlines')}</p>
              )}
            </div>
          </div>

          {/* Flow Card */}
          <div className="dashboard-card flow-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon flow">
                  <Wallet size={20} />
                </div>
                <div>
                  <h3>Flow</h3>
                  <p>{t('flow.subtitle')}</p>
                </div>
              </div>
              <Link to="/flow" className="card-link">
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="spending-overview">
              <div className="spending-amount">
                <span className="currency">₹</span>
                <span className="amount">{totalSpent.toLocaleString()}</span>
                <span className="budget">/ ₹{totalBudget.toLocaleString()}</span>
              </div>
              <div className="spending-bar">
                <div 
                  className={`spending-progress ${totalSpent > totalBudget ? 'over' : ''}`}
                  style={{ width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%` }}
                ></div>
              </div>
            </div>

            {topCategories.length > 0 ? (
              <div className="top-categories">
                <h4>{t('dashboard.topCategories')}</h4>
                {topCategories.map((cat, index) => (
                  <div key={index} className="category-row">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-amount">₹{cat.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">{t('dashboard.noTransactions')}</p>
            )}

            {activeGoal && (
              <div className="savings-preview">
                <Target size={14} />
                <span>{activeGoal.name}</span>
                <span className="savings-progress">
                  {Math.round((activeGoal.savedAmount / activeGoal.targetAmount) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Kit Card */}
          <div className="dashboard-card kit-card">
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon kit">
                  <Package size={20} />
                </div>
                <div>
                  <h3>Kit</h3>
                  <p>{t('kit.subtitle')}</p>
                </div>
              </div>
              <Link to="/kit" className="card-link">
                <ArrowRight size={18} />
              </Link>
            </div>

            {totalKits > 0 ? (
              <>
                <div className="kit-progress">
                  <div className="kit-info">
                    <h4>{totalKits} {t('kit.customKits')}</h4>
                    <p>{completedItems} {t('kit.itemsCompleted')}</p>
                  </div>
                  <div className="progress-ring">
                    <svg viewBox="0 0 36 36">
                      <path
                        className="ring-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="ring-progress"
                        strokeDasharray={`${completedItems > 0 ? 50 : 0}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="progress-text">
                      <Sparkles size={16} />
                    </span>
                  </div>
                </div>

                <Link to="/kit" className="btn btn-secondary btn-full">
                  {t('kit.viewKits')}
                </Link>
              </>
            ) : (
              <div className="empty-kit">
                <p>{t('kit.createFirstKit')}</p>
                <Link to="/kit" className="btn btn-secondary btn-full">
                  {t('kit.browseTemplates')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>{t('dashboard.quickActions')}</h3>
          <div className="actions-grid">
            <Link to="/atlas" className="action-card">
              <Calendar size={20} />
              <span>{t('atlas.addDeadline')}</span>
            </Link>
            <Link to="/flow" className="action-card">
              <Plus size={20} />
              <span>{t('flow.logExpense')}</span>
            </Link>
            <Link to="/atlas" className="action-card">
              <Clock size={20} />
              <span>{t('dashboard.startFocus')}</span>
            </Link>
            <Link to="/kit" className="action-card">
              <Package size={20} />
              <span>{t('kit.browseKits')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Global Search */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </div>
  );
}
