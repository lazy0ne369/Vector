import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  X,
  Edit2,
  Trash2,
  TrendingUp,
  Sparkles,
  Calendar,
  PiggyBank
} from 'lucide-react';
import './SavingsGoals.css';

const STORAGE_KEY = 'vector_savings_goals';

const loadGoals = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveGoals = (goals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const GOAL_ICONS = {
  general: '🎯',
  travel: '✈️',
  gadget: '📱',
  education: '📚',
  emergency: '🏥',
  gift: '🎁',
  entertainment: '🎮',
  shopping: '🛍️'
};

export default function SavingsGoals({ minimal = false }) {
  const [goals, setGoals] = useState(loadGoals);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showAddMoney, setShowAddMoney] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    category: 'general',
    deadline: ''
  });

  const openModal = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        savedAmount: goal.savedAmount.toString(),
        category: goal.category,
        deadline: goal.deadline || ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: '',
        targetAmount: '',
        savedAmount: '0',
        category: 'general',
        deadline: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGoal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
      id: editingGoal?.id || generateId(),
      name: formData.name.trim(),
      targetAmount: parseFloat(formData.targetAmount) || 0,
      savedAmount: parseFloat(formData.savedAmount) || 0,
      category: formData.category,
      deadline: formData.deadline,
      createdAt: editingGoal?.createdAt || new Date().toISOString()
    };

    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? goalData : g));
    } else {
      setGoals([...goals, goalData]);
    }
    
    closeModal();
  };

  const deleteGoal = (id) => {
    if (confirm('Delete this savings goal?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const handleAddMoney = (goalId) => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) return;

    setGoals(goals.map(g => {
      if (g.id === goalId) {
        return { ...g, savedAmount: g.savedAmount + amount };
      }
      return g;
    }));

    setShowAddMoney(null);
    setAddAmount('');
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.savedAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const completedGoals = goals.filter(g => g.savedAmount >= g.targetAmount).length;

  if (minimal) {
    const topGoal = goals.filter(g => g.savedAmount < g.targetAmount)[0];
    
    return (
      <div className="savings-minimal">
        <div className="savings-mini-header">
          <PiggyBank size={18} />
          <span>Savings Goals</span>
        </div>
        {topGoal ? (
          <div className="mini-goal">
            <span className="mini-goal-icon">{GOAL_ICONS[topGoal.category]}</span>
            <div className="mini-goal-info">
              <span className="mini-goal-name">{topGoal.name}</span>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ width: `${Math.min(100, (topGoal.savedAmount / topGoal.targetAmount) * 100)}%` }}
                />
              </div>
            </div>
            <span className="mini-goal-percent">
              {Math.round((topGoal.savedAmount / topGoal.targetAmount) * 100)}%
            </span>
          </div>
        ) : (
          <p className="no-goals">No active goals</p>
        )}
      </div>
    );
  }

  return (
    <div className="savings-goals">
      <div className="savings-header">
        <div className="savings-title">
          <Target size={20} />
          <h3>Savings Goals</h3>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => openModal()}>
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="savings-summary">
          <div className="summary-stat">
            <span className="summary-value">₹{totalSaved.toLocaleString()}</span>
            <span className="summary-label">Total Saved</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">₹{totalTarget.toLocaleString()}</span>
            <span className="summary-label">Total Target</span>
          </div>
          <div className="summary-stat">
            <span className="summary-value">{completedGoals}/{goals.length}</span>
            <span className="summary-label">Completed</span>
          </div>
        </div>
      )}

      <div className="goals-list">
        {goals.length === 0 ? (
          <div className="empty-goals">
            <Sparkles size={40} />
            <h4>No savings goals yet</h4>
            <p>Start saving towards something special!</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <Plus size={16} />
              Create First Goal
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const progress = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100);
            const isCompleted = goal.savedAmount >= goal.targetAmount;
            const remaining = goal.targetAmount - goal.savedAmount;

            return (
              <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                <div className="goal-header">
                  <span className="goal-icon">{GOAL_ICONS[goal.category]}</span>
                  <div className="goal-info">
                    <h4>{goal.name}</h4>
                    {goal.deadline && (
                      <span className="goal-deadline">
                        <Calendar size={12} />
                        {new Date(goal.deadline).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <div className="goal-actions">
                    <button className="icon-btn" onClick={() => openModal(goal)}>
                      <Edit2 size={14} />
                    </button>
                    <button className="icon-btn danger" onClick={() => deleteGoal(goal.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="progress-percent">{Math.round(progress)}%</span>
                </div>

                <div className="goal-amounts">
                  <span className="saved">₹{goal.savedAmount.toLocaleString()}</span>
                  <span className="target">of ₹{goal.targetAmount.toLocaleString()}</span>
                </div>

                {!isCompleted && (
                  showAddMoney === goal.id ? (
                    <div className="add-money-form">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        autoFocus
                      />
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddMoney(goal.id)}>
                        Add
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setShowAddMoney(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="add-money-btn"
                      onClick={() => setShowAddMoney(goal.id)}
                    >
                      <Plus size={14} />
                      Add ₹{remaining.toLocaleString()} more to reach goal
                    </button>
                  )
                )}

                {isCompleted && (
                  <div className="goal-completed-badge">
                    <Sparkles size={14} />
                    Goal Reached! 🎉
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal ? 'Edit Goal' : 'New Savings Goal'}</h2>
              <button className="modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., New Laptop, Trip to Goa"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Amount *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="₹0"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Already Saved</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.savedAmount}
                    onChange={(e) => setFormData({ ...formData, savedAmount: e.target.value })}
                    placeholder="₹0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {Object.entries(GOAL_ICONS).map(([key, icon]) => (
                      <option key={key} value={key}>
                        {icon} {key.charAt(0).toUpperCase() + key.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGoal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
