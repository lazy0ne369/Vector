import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  PieChart,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Edit2,
  Trash2,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  CreditCard,
  DollarSign,
  PiggyBank,
} from 'lucide-react';
import SavingsGoals from '../../components/SavingsGoals/SavingsGoals';
import './Flow.css';

// Storage keys
const STORAGE_KEYS = {
  transactions: 'vector_flow_transactions',
  budgets: 'vector_flow_budgets',
  settings: 'vector_flow_settings',
};

// Categories with colors
const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', color: '#4F9D9A', icon: '🍔' },
  { id: 'transport', name: 'Transport', color: '#5B8DEF', icon: '🚌' },
  { id: 'entertainment', name: 'Entertainment', color: '#F4A261', icon: '🎬' },
  { id: 'shopping', name: 'Shopping', color: '#E879F9', icon: '🛍️' },
  { id: 'education', name: 'Education', color: '#22D3EE', icon: '📚' },
  { id: 'health', name: 'Health', color: '#4CAF50', icon: '💊' },
  { id: 'utilities', name: 'Utilities', color: '#FF6B6B', icon: '💡' },
  { id: 'other', name: 'Other', color: '#94A3B8', icon: '📦' },
];

const INCOME_CATEGORIES = [
  { id: 'pocket-money', name: 'Pocket Money', color: '#4CAF50', icon: '💵' },
  { id: 'part-time', name: 'Part-time Job', color: '#5B8DEF', icon: '💼' },
  { id: 'freelance', name: 'Freelance', color: '#F4A261', icon: '💻' },
  { id: 'gift', name: 'Gift', color: '#E879F9', icon: '🎁' },
  { id: 'scholarship', name: 'Scholarship', color: '#4F9D9A', icon: '🎓' },
  { id: 'other-income', name: 'Other', color: '#94A3B8', icon: '📦' },
];

// Helper functions
const loadFromStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatCurrency = (amount) => {
  return '₹' + amount.toLocaleString('en-IN');
};

const getMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export default function Flow() {
  const { t } = useTranslation();
  // Tab state
  const [activeTab, setActiveTab] = useState('transactions');
  
  // Data state
  const [transactions, setTransactions] = useState(() => 
    loadFromStorage(STORAGE_KEYS.transactions, [])
  );
  const [budgets, setBudgets] = useState(() => 
    loadFromStorage(STORAGE_KEYS.budgets, {})
  );
  
  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  
  // Form states
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    title: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  
  const [budgetForm, setBudgetForm] = useState({
    category: 'food',
    amount: '',
    month: getCurrentMonthKey(),
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Save to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.budgets, budgets);
  }, [budgets]);

  // Calculate statistics
  const currentMonth = getCurrentMonthKey();
  
  const monthlyTransactions = transactions.filter(t => {
    const tMonth = t.date.substring(0, 7);
    return tMonth === currentMonth;
  });

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = monthlyIncome - monthlyExpenses;

  // Calculate category breakdown
  const categoryBreakdown = EXPENSE_CATEGORIES.map(cat => {
    const catExpenses = monthlyTransactions
      .filter(t => t.type === 'expense' && t.category === cat.id)
      .reduce((sum, t) => sum + t.amount, 0);
    const budget = budgets[`${currentMonth}-${cat.id}`]?.amount || 0;
    return {
      ...cat,
      spent: catExpenses,
      budget,
      percentage: monthlyExpenses > 0 ? Math.round((catExpenses / monthlyExpenses) * 100) : 0,
    };
  }).filter(cat => cat.spent > 0);

  // Total budget for month
  const totalBudget = Object.entries(budgets)
    .filter(([key]) => key.startsWith(currentMonth))
    .reduce((sum, [, b]) => sum + (b.amount || 0), 0);

  // Weekly spending trend
  const getWeeklyTrend = () => {
    const today = new Date();
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayExpenses = transactions
        .filter(t => t.date === dateStr && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      days.push({
        day: dayNames[date.getDay()],
        amount: dayExpenses,
        date: dateStr,
      });
    }
    return days;
  };

  const weeklyTrend = getWeeklyTrend();
  const maxWeeklyAmount = Math.max(...weeklyTrend.map(d => d.amount), 1);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filters.type !== 'all' && t.type !== filters.type) return false;
    if (filters.category !== 'all' && t.category !== filters.category) return false;
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Handlers
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionForm({
      type: 'expense',
      title: '',
      amount: '',
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowTransactionModal(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionForm({
      type: transaction.type,
      title: transaction.title,
      amount: transaction.amount.toString(),
      category: transaction.category,
      date: transaction.date,
      notes: transaction.notes || '',
    });
    setShowTransactionModal(true);
  };

  const handleDeleteTransaction = (id) => {
    if (confirm('Delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      id: editingTransaction?.id || generateId(),
      type: transactionForm.type,
      title: transactionForm.title,
      amount: parseFloat(transactionForm.amount),
      category: transactionForm.category,
      date: transactionForm.date,
      notes: transactionForm.notes,
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transaction : t));
    } else {
      setTransactions(prev => [...prev, transaction]);
    }
    setShowTransactionModal(false);
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setBudgetForm({
      category: 'food',
      amount: '',
      month: getCurrentMonthKey(),
    });
    setShowBudgetModal(true);
  };

  const handleEditBudget = (categoryId, monthKey) => {
    const budgetKey = `${monthKey}-${categoryId}`;
    const existing = budgets[budgetKey];
    setEditingBudget(budgetKey);
    setBudgetForm({
      category: categoryId,
      amount: existing?.amount?.toString() || '',
      month: monthKey,
    });
    setShowBudgetModal(true);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    const budgetKey = `${budgetForm.month}-${budgetForm.category}`;
    setBudgets(prev => ({
      ...prev,
      [budgetKey]: {
        amount: parseFloat(budgetForm.amount),
        category: budgetForm.category,
        month: budgetForm.month,
      },
    }));
    setShowBudgetModal(false);
  };

  const handleDeleteBudget = (budgetKey) => {
    if (confirm('Delete this budget?')) {
      setBudgets(prev => {
        const newBudgets = { ...prev };
        delete newBudgets[budgetKey];
        return newBudgets;
      });
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateFrom: '',
      dateTo: '',
    });
    setShowFilterModal(false);
  };

  const getCategoryInfo = (categoryId, type) => {
    const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return cats.find(c => c.id === categoryId) || { name: 'Other', color: '#94A3B8', icon: '📦' };
  };

  // Export data
  const handleExport = () => {
    const data = {
      transactions,
      budgets,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'savings', label: 'Savings', icon: PiggyBank },
    { id: 'summary', label: 'Summary', icon: PieChart },
  ];

  return (
    <div className="flow-page">
      <div className="container">
        {/* Header */}
        <header className="flow-header">
          <div className="header-info">
            <div className="header-icon">
              <Wallet size={28} />
            </div>
            <div>
              <h1>Flow</h1>
              <p>{t('flow.subtitle')}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={handleExport}>
              <Download size={18} />
              {t('common.save')}
            </button>
            <button className="btn btn-primary" onClick={handleAddTransaction}>
              <Plus size={18} />
              {t('flow.addTransaction')}
            </button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-info">
              <p className="stat-label">Total Spent</p>
              <h3 className="stat-value">{formatCurrency(monthlyExpenses)}</h3>
              <div className="stat-sublabel">This month</div>
            </div>
            <div className="stat-chart">
              <TrendingDown size={32} />
            </div>
          </div>

          <div className="stat-card income">
            <div className="stat-info">
              <p className="stat-label">Total Income</p>
              <h3 className="stat-value">{formatCurrency(monthlyIncome)}</h3>
              <div className="stat-sublabel">This month</div>
            </div>
            <div className="stat-chart">
              <TrendingUp size={32} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Balance</p>
              <h3 className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
                {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
              </h3>
              <div className="stat-sublabel">Income - Expenses</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <p className="stat-label">Budget Status</p>
              {totalBudget > 0 ? (
                <>
                  <h3 className="stat-value">{Math.round((monthlyExpenses / totalBudget) * 100)}%</h3>
                  <div className="budget-bar">
                    <div 
                      className={`budget-progress ${monthlyExpenses > totalBudget ? 'over' : ''}`}
                      style={{ width: `${Math.min((monthlyExpenses / totalBudget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="stat-value">--</h3>
                  <div className="stat-sublabel">No budget set</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flow-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="flow-content">
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="transactions-view">
              <div className="transactions-header">
                <h2>Recent Transactions</h2>
                <div className="transactions-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowFilterModal(true)}>
                    <Filter size={16} />
                    Filter
                    {(filters.type !== 'all' || filters.category !== 'all' || filters.dateFrom || filters.dateTo) && (
                      <span className="filter-badge">•</span>
                    )}
                  </button>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="empty-state-large">
                  <Wallet size={48} />
                  <h3>No transactions yet</h3>
                  <p>Start tracking your expenses and income</p>
                  <button className="btn btn-primary" onClick={handleAddTransaction}>
                    <Plus size={18} />
                    Add First Transaction
                  </button>
                </div>
              ) : (
                <div className="transactions-list">
                  {filteredTransactions.map((transaction) => {
                    const catInfo = getCategoryInfo(transaction.category, transaction.type);
                    return (
                      <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                        <div className={`transaction-icon ${transaction.type}`}>
                          <span>{catInfo.icon}</span>
                        </div>
                        <div className="transaction-info">
                          <h4>{transaction.title}</h4>
                          <p>{catInfo.name} • {formatDate(transaction.date)}</p>
                        </div>
                        <div className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="transaction-actions">
                          <button className="icon-btn" onClick={() => handleEditTransaction(transaction)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-btn danger" onClick={() => handleDeleteTransaction(transaction.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-view">
              <div className="analytics-grid">
                {/* Weekly Trend */}
                <div className="analytics-card">
                  <h3>Weekly Spending</h3>
                  {weeklyTrend.every(d => d.amount === 0) ? (
                    <div className="empty-state">
                      <p>No spending data this week</p>
                    </div>
                  ) : (
                    <div className="bar-chart">
                      {weeklyTrend.map((day, index) => (
                        <div key={index} className="bar-item">
                          <div className="bar-container">
                            <div 
                              className="bar" 
                              style={{ height: `${(day.amount / maxWeeklyAmount) * 100}%` }}
                              title={formatCurrency(day.amount)}
                            ></div>
                          </div>
                          <span className="bar-label">{day.day}</span>
                          <span className="bar-amount">{day.amount > 0 ? formatCurrency(day.amount) : '-'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Breakdown */}
                <div className="analytics-card">
                  <h3>Category Breakdown</h3>
                  {categoryBreakdown.length === 0 ? (
                    <div className="empty-state">
                      <p>No expenses this month</p>
                    </div>
                  ) : (
                    <div className="category-list">
                      {categoryBreakdown.map((cat) => (
                        <div key={cat.id} className="category-item">
                          <div className="category-info">
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                          </div>
                          <div className="category-stats">
                            <span className="category-amount">{formatCurrency(cat.spent)}</span>
                            <span className="category-percent">{cat.percentage}%</span>
                          </div>
                          <div className="category-bar">
                            <div 
                              className="category-progress" 
                              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <div className="budgets-view">
              <div className="budgets-header">
                <h2>Monthly Budgets</h2>
                <button className="btn btn-primary btn-sm" onClick={handleAddBudget}>
                  <Plus size={16} />
                  Set Budget
                </button>
              </div>

              <div className="budget-summary">
                <div className="budget-total-card">
                  <div className="budget-total-info">
                    <h3>Total Budget: {formatCurrency(totalBudget)}</h3>
                    <p>Spent: {formatCurrency(monthlyExpenses)} ({totalBudget > 0 ? Math.round((monthlyExpenses / totalBudget) * 100) : 0}%)</p>
                  </div>
                  <div className="budget-total-bar">
                    <div 
                      className={`budget-total-progress ${monthlyExpenses > totalBudget ? 'over' : ''}`}
                      style={{ width: `${totalBudget > 0 ? Math.min((monthlyExpenses / totalBudget) * 100, 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="budgets-grid">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const budgetKey = `${currentMonth}-${cat.id}`;
                  const budget = budgets[budgetKey];
                  const spent = categoryBreakdown.find(c => c.id === cat.id)?.spent || 0;
                  const percentage = budget?.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
                  const isOver = spent > (budget?.amount || 0) && budget?.amount > 0;

                  return (
                    <div key={cat.id} className={`budget-card ${isOver ? 'over-budget' : ''}`}>
                      <div className="budget-card-header">
                        <span className="budget-category-icon">{cat.icon}</span>
                        <h4>{cat.name}</h4>
                        <div className="budget-card-actions">
                          <button className="icon-btn" onClick={() => handleEditBudget(cat.id, currentMonth)}>
                            <Edit2 size={14} />
                          </button>
                          {budget && (
                            <button className="icon-btn danger" onClick={() => handleDeleteBudget(budgetKey)}>
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="budget-card-stats">
                        <span className="budget-spent">{formatCurrency(spent)}</span>
                        <span className="budget-limit">
                          {budget?.amount ? ` / ${formatCurrency(budget.amount)}` : '/ No budget'}
                        </span>
                      </div>
                      {budget?.amount > 0 && (
                        <>
                          <div className="budget-card-bar">
                            <div 
                              className={`budget-card-progress ${isOver ? 'over' : ''}`}
                              style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: cat.color }}
                            ></div>
                          </div>
                          <div className="budget-card-status">
                            {isOver ? (
                              <span className="over">
                                <AlertCircle size={14} />
                                Over by {formatCurrency(spent - budget.amount)}
                              </span>
                            ) : (
                              <span className="remaining">
                                <CheckCircle size={14} />
                                {formatCurrency(budget.amount - spent)} remaining
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Savings Tab */}
          {activeTab === 'savings' && (
            <div className="savings-view">
              <SavingsGoals />
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="summary-view">
              <div className="summary-card">
                <h3>{getMonthYear(new Date().toISOString())} Summary</h3>
                {categoryBreakdown.length === 0 ? (
                  <div className="empty-state">
                    <p>No data to show. Add some transactions to see your summary.</p>
                  </div>
                ) : (
                  <div className="summary-visual">
                    <div className="pie-chart-container">
                      <svg viewBox="0 0 100 100" className="pie-chart">
                        {categoryBreakdown.reduce((acc, cat, index) => {
                          const startAngle = acc.angle;
                          const sliceAngle = (cat.percentage / 100) * 360;
                          const endAngle = startAngle + sliceAngle;
                          
                          const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                          const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                          const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                          const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                          
                          const largeArc = sliceAngle > 180 ? 1 : 0;
                          
                          acc.elements.push(
                            <path
                              key={index}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={cat.color}
                            />
                          );
                          
                          acc.angle = endAngle;
                          return acc;
                        }, { elements: [], angle: 0 }).elements}
                      </svg>
                      <div className="pie-center">
                        <span className="pie-total">{formatCurrency(monthlyExpenses)}</span>
                        <span className="pie-label">Total Spent</span>
                      </div>
                    </div>
                    <div className="summary-legend">
                      {categoryBreakdown.map((cat) => (
                        <div key={cat.id} className="legend-item">
                          <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                          <span className="legend-name">{cat.name}</span>
                          <span className="legend-amount">{formatCurrency(cat.spent)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-stats-grid">
                <div className="summary-stat-card">
                  <div className="summary-stat-icon income">
                    <ArrowUpRight size={24} />
                  </div>
                  <div className="summary-stat-info">
                    <span className="summary-stat-label">Total Income</span>
                    <span className="summary-stat-value">{formatCurrency(monthlyIncome)}</span>
                  </div>
                </div>
                <div className="summary-stat-card">
                  <div className="summary-stat-icon expense">
                    <ArrowDownRight size={24} />
                  </div>
                  <div className="summary-stat-info">
                    <span className="summary-stat-label">Total Expenses</span>
                    <span className="summary-stat-value">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                </div>
                <div className="summary-stat-card">
                  <div className="summary-stat-icon">
                    <DollarSign size={24} />
                  </div>
                  <div className="summary-stat-info">
                    <span className="summary-stat-label">Transactions</span>
                    <span className="summary-stat-value">{monthlyTransactions.length}</span>
                  </div>
                </div>
                <div className="summary-stat-card">
                  <div className="summary-stat-icon">
                    <Calendar size={24} />
                  </div>
                  <div className="summary-stat-info">
                    <span className="summary-stat-label">Avg Daily Spend</span>
                    <span className="summary-stat-value">
                      {formatCurrency(Math.round(monthlyExpenses / new Date().getDate()))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="modal-close" onClick={() => setShowTransactionModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveTransaction}>
              <div className="form-group">
                <label>Type</label>
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`type-btn ${transactionForm.type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => setTransactionForm(prev => ({ ...prev, type: 'expense', category: 'food' }))}
                  >
                    <TrendingDown size={16} />
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${transactionForm.type === 'income' ? 'active income' : ''}`}
                    onClick={() => setTransactionForm(prev => ({ ...prev, type: 'income', category: 'pocket-money' }))}
                  >
                    <TrendingUp size={16} />
                    Income
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={transactionForm.title}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Lunch at canteen"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Amount (₹)</label>
                  <input
                    type="number"
                    id="amount"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={transactionForm.category}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {(transactionForm.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (optional)</label>
                <textarea
                  id="notes"
                  value={transactionForm.notes}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes..."
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTransactionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTransaction ? 'Update' : 'Add'} Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBudget ? 'Edit Budget' : 'Set Budget'}</h2>
              <button className="modal-close" onClick={() => setShowBudgetModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveBudget}>
              <div className="form-group">
                <label htmlFor="budget-category">Category</label>
                <select
                  id="budget-category"
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                  disabled={!!editingBudget}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget-amount">Budget Amount (₹)</label>
                <input
                  type="number"
                  id="budget-amount"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBudgetModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingBudget ? 'Update' : 'Set'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Filter Transactions</h2>
              <button className="modal-close" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="filter-type">Type</label>
                <select
                  id="filter-type"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="all">All</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="filter-category">Category</label>
                <select
                  id="filter-category"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="all">All Categories</option>
                  <optgroup label="Expenses">
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Income">
                    {INCOME_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="filter-from">From</label>
                  <input
                    type="date"
                    id="filter-from"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="filter-to">To</label>
                  <input
                    type="date"
                    id="filter-to"
                    value={filters.dateTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowFilterModal(false)}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
