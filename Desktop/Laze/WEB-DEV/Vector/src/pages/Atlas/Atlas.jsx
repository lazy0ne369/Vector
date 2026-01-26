import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Map,
  Calendar,
  Plus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Brain,
  Moon,
  Activity,
  HelpCircle,
  X,
  Edit2,
  Trash2,
  Save,
  GraduationCap,
  Target,
  TrendingUp,
  FileText,
  CheckSquare,
  Timer,
  Calculator,
} from 'lucide-react';
import Pomodoro from '../../components/Pomodoro/Pomodoro';
import GPACalculator from '../../components/GPACalculator/GPACalculator';
import './Atlas.css';

// Local Storage Keys
const STORAGE_KEYS = {
  COURSES: 'vector_atlas_courses',
  DEADLINES: 'vector_atlas_deadlines',
  REFLECTIONS: 'vector_atlas_reflections',
};

// Helper function to load from localStorage
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Helper function to save to localStorage
const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export default function Atlas() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [showSignalExplainer, setShowSignalExplainer] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingDeadline, setEditingDeadline] = useState(null);

  // Data states with localStorage persistence
  const [courses, setCourses] = useState(() => 
    loadFromStorage(STORAGE_KEYS.COURSES, [
      { id: 1, name: 'Mathematics III', code: 'MTH301', credits: 4, status: 'on-track', professor: 'Dr. Sharma', schedule: 'Mon, Wed 10:00 AM' },
      { id: 2, name: 'Data Structures', code: 'CS201', credits: 3, status: 'needs-attention', professor: 'Prof. Kumar', schedule: 'Tue, Thu 2:00 PM' },
      { id: 3, name: 'Physics II', code: 'PHY202', credits: 4, status: 'on-track', professor: 'Dr. Patel', schedule: 'Mon, Fri 11:00 AM' },
      { id: 4, name: 'English Communication', code: 'ENG101', credits: 2, status: 'on-track', professor: 'Ms. Singh', schedule: 'Wed 3:00 PM' },
    ])
  );

  const [deadlines, setDeadlines] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DEADLINES, [
      { id: 1, title: 'Math Assignment 3', courseId: 1, date: '2026-01-26', type: 'assignment', priority: 'medium', completed: false, notes: '' },
      { id: 2, title: 'DS Project Presentation', courseId: 2, date: '2026-01-28', type: 'project', priority: 'high', completed: false, notes: 'Prepare slides' },
      { id: 3, title: 'Physics Lab Report', courseId: 3, date: '2026-02-02', type: 'lab', priority: 'medium', completed: false, notes: '' },
      { id: 4, title: 'Mid-Semester Exam', courseId: 1, date: '2026-02-10', type: 'exam', priority: 'high', completed: false, notes: 'Chapters 1-5' },
    ])
  );

  const [reflections, setReflections] = useState(() =>
    loadFromStorage(STORAGE_KEYS.REFLECTIONS, [])
  );

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // January 2026
  const [selectedDate, setSelectedDate] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    name: '', code: '', credits: 3, professor: '', schedule: '', status: 'on-track'
  });

  const [deadlineForm, setDeadlineForm] = useState({
    title: '', courseId: '', date: '', type: 'assignment', priority: 'medium', notes: ''
  });

  const [reflectionForm, setReflectionForm] = useState({
    stress: 0, sleep: 0, workload: 0, notes: ''
  });

  // Persist data to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.COURSES, courses);
  }, [courses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DEADLINES, deadlines);
  }, [deadlines]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REFLECTIONS, reflections);
  }, [reflections]);

  // Calculate signal based on data
  const calculateSignal = () => {
    const now = new Date();
    const upcomingDeadlines = deadlines.filter(d => {
      const deadlineDate = new Date(d.date);
      const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 7 && !d.completed;
    });

    const coursesNeedingAttention = courses.filter(c => c.status === 'needs-attention').length;
    const lastReflection = reflections[reflections.length - 1];
    const daysSinceReflection = lastReflection 
      ? Math.ceil((now - new Date(lastReflection.date)) / (1000 * 60 * 60 * 24))
      : 999;

    let status = 'on-track';
    const factors = [];

    // Academic load factor
    if (coursesNeedingAttention > 2) {
      factors.push({ label: 'Academic Load', value: 'Heavy', status: 'warning' });
    } else if (coursesNeedingAttention > 0) {
      factors.push({ label: 'Academic Load', value: 'Moderate', status: 'info' });
    } else {
      factors.push({ label: 'Academic Load', value: 'Manageable', status: 'good' });
    }

    // Deadlines factor
    if (upcomingDeadlines.length > 3) {
      factors.push({ label: 'Upcoming Deadlines', value: `${upcomingDeadlines.length} this week`, status: 'warning' });
      status = 'needs-attention';
    } else if (upcomingDeadlines.length > 0) {
      factors.push({ label: 'Upcoming Deadlines', value: `${upcomingDeadlines.length} this week`, status: 'info' });
    } else {
      factors.push({ label: 'Upcoming Deadlines', value: 'None urgent', status: 'good' });
    }

    // Well-being factor
    if (daysSinceReflection > 7) {
      factors.push({ label: 'Well-being', value: 'Check-in needed', status: 'warning' });
    } else if (lastReflection) {
      const avgScore = (lastReflection.stress + lastReflection.sleep + lastReflection.workload) / 3;
      if (avgScore < 2.5) {
        factors.push({ label: 'Well-being', value: 'Needs attention', status: 'warning' });
        status = 'needs-attention';
      } else if (avgScore < 3.5) {
        factors.push({ label: 'Well-being', value: 'Moderate', status: 'info' });
      } else {
        factors.push({ label: 'Well-being', value: 'Good', status: 'good' });
      }
    } else {
      factors.push({ label: 'Well-being', value: 'No data yet', status: 'info' });
    }

    // Check for overloaded
    const warningCount = factors.filter(f => f.status === 'warning').length;
    if (warningCount >= 2) {
      status = 'overloaded';
    }

    return { status, factors };
  };

  const signal = calculateSignal();

  // CRUD Operations for Courses
  const handleAddCourse = () => {
    if (!courseForm.name || !courseForm.code) return;

    const newCourse = {
      id: Date.now(),
      ...courseForm,
      credits: parseInt(courseForm.credits),
    };

    setCourses([...courses, newCourse]);
    setCourseForm({ name: '', code: '', credits: 3, professor: '', schedule: '', status: 'on-track' });
    setShowCourseModal(false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse || !courseForm.name || !courseForm.code) return;

    setCourses(courses.map(c => 
      c.id === editingCourse.id 
        ? { ...c, ...courseForm, credits: parseInt(courseForm.credits) }
        : c
    ));
    setEditingCourse(null);
    setCourseForm({ name: '', code: '', credits: 3, professor: '', schedule: '', status: 'on-track' });
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (id) => {
    if (confirm('Are you sure you want to delete this course? This will also remove all associated deadlines.')) {
      setCourses(courses.filter(c => c.id !== id));
      setDeadlines(deadlines.filter(d => d.courseId !== id));
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      name: course.name,
      code: course.code,
      credits: course.credits,
      professor: course.professor || '',
      schedule: course.schedule || '',
      status: course.status,
    });
    setShowCourseModal(true);
  };

  // CRUD Operations for Deadlines
  const handleAddDeadline = () => {
    if (!deadlineForm.title || !deadlineForm.courseId || !deadlineForm.date) return;

    const newDeadline = {
      id: Date.now(),
      ...deadlineForm,
      courseId: parseInt(deadlineForm.courseId),
      completed: false,
    };

    setDeadlines([...deadlines, newDeadline]);
    setDeadlineForm({ title: '', courseId: '', date: '', type: 'assignment', priority: 'medium', notes: '' });
    setShowDeadlineModal(false);
  };

  const handleUpdateDeadline = () => {
    if (!editingDeadline || !deadlineForm.title || !deadlineForm.courseId || !deadlineForm.date) return;

    setDeadlines(deadlines.map(d => 
      d.id === editingDeadline.id 
        ? { ...d, ...deadlineForm, courseId: parseInt(deadlineForm.courseId) }
        : d
    ));
    setEditingDeadline(null);
    setDeadlineForm({ title: '', courseId: '', date: '', type: 'assignment', priority: 'medium', notes: '' });
    setShowDeadlineModal(false);
  };

  const handleDeleteDeadline = (id) => {
    if (confirm('Are you sure you want to delete this deadline?')) {
      setDeadlines(deadlines.filter(d => d.id !== id));
    }
  };

  const handleEditDeadline = (deadline) => {
    setEditingDeadline(deadline);
    setDeadlineForm({
      title: deadline.title,
      courseId: deadline.courseId.toString(),
      date: deadline.date,
      type: deadline.type,
      priority: deadline.priority,
      notes: deadline.notes || '',
    });
    setShowDeadlineModal(true);
  };

  const handleToggleDeadlineComplete = (id) => {
    setDeadlines(deadlines.map(d => 
      d.id === id ? { ...d, completed: !d.completed } : d
    ));
  };

  // Reflection Operations
  const handleSubmitReflection = () => {
    if (reflectionForm.stress === 0 || reflectionForm.sleep === 0 || reflectionForm.workload === 0) {
      alert('Please rate all three areas before submitting.');
      return;
    }

    const newReflection = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...reflectionForm,
    };

    setReflections([...reflections, newReflection]);
    setReflectionForm({ stress: 0, sleep: 0, workload: 0, notes: '' });
    setShowReflectionModal(true);
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDeadlinesForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return deadlines.filter(d => d.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1));
  };

  const getCourseById = (id) => courses.find(c => c.id === id);

  const getSignalIcon = () => {
    switch (signal.status) {
      case 'on-track': return <CheckCircle size={24} />;
      case 'needs-attention': return <AlertCircle size={24} />;
      case 'overloaded': return <AlertTriangle size={24} />;
      default: return <CheckCircle size={24} />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Map },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'deadlines', label: 'Deadlines', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'focus', label: 'Focus Timer', icon: Timer },
    { id: 'gpa', label: 'GPA', icon: Calculator },
    { id: 'reflection', label: 'Reflection', icon: Brain },
    { id: 'history', label: 'History', icon: TrendingUp },
  ];

  // Sort deadlines by date
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcomingDeadlines = sortedDeadlines.filter(d => !d.completed && new Date(d.date) >= new Date());
  const completedDeadlines = sortedDeadlines.filter(d => d.completed);

  return (
    <div className="atlas-page">
      <div className="container">
        {/* Header */}
        <header className="atlas-header">
          <div className="header-info">
            <div className="header-icon">
              <Map size={28} />
            </div>
            <div>
              <h1>Atlas</h1>
              <p>{t('atlas.subtitle')}</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => {
              setEditingCourse(null);
              setCourseForm({ name: '', code: '', credits: 3, professor: '', schedule: '', status: 'on-track' });
              setShowCourseModal(true);
            }}>
              <Plus size={18} />
              {t('atlas.addCourse')}
            </button>
            <button className="btn btn-primary" onClick={() => {
              setEditingDeadline(null);
              setDeadlineForm({ title: '', courseId: '', date: '', type: 'assignment', priority: 'medium', notes: '' });
              setShowDeadlineModal(true);
            }}>
              <Plus size={18} />
              {t('atlas.addDeadline')}
            </button>
          </div>
        </header>

        {/* Signal Banner */}
        <div className={`signal-banner ${signal.status}`}>
          <div className="signal-main">
            {getSignalIcon()}
            <div>
              <h3>
                {signal.status === 'on-track' && "You're On Track!"}
                {signal.status === 'needs-attention' && 'Needs Attention'}
                {signal.status === 'overloaded' && "You're Overloaded"}
              </h3>
              <p>Based on your academics and recent check-ins</p>
            </div>
          </div>
          <div className="signal-factors">
            {signal.factors.map((factor, index) => (
              <div key={index} className={`factor ${factor.status}`}>
                <span className="factor-label">{factor.label}</span>
                <span className="factor-value">{factor.value}</span>
              </div>
            ))}
          </div>
          <button className="why-btn" onClick={() => setShowSignalExplainer(true)}>
            <HelpCircle size={16} />
            Why am I seeing this?
          </button>
        </div>

        {/* Tabs */}
        <nav className="atlas-tabs">
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
        <div className="atlas-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {/* Quick Stats */}
              <div className="stats-row">
                <div className="stat-card">
                  <GraduationCap size={24} />
                  <div>
                    <span className="stat-value">{courses.length}</span>
                    <span className="stat-label">Courses</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Target size={24} />
                  <div>
                    <span className="stat-value">{upcomingDeadlines.length}</span>
                    <span className="stat-label">Upcoming</span>
                  </div>
                </div>
                <div className="stat-card">
                  <CheckSquare size={24} />
                  <div>
                    <span className="stat-value">{completedDeadlines.length}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
                <div className="stat-card">
                  <Brain size={24} />
                  <div>
                    <span className="stat-value">{reflections.length}</span>
                    <span className="stat-label">Reflections</span>
                  </div>
                </div>
              </div>

              {/* Courses Preview */}
              <section className="courses-section">
                <div className="section-header">
                  <h2>Your Courses</h2>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('courses')}>
                    View All
                  </button>
                </div>
                <div className="courses-list">
                  {courses.slice(0, 4).map((course) => (
                    <div key={course.id} className="course-card">
                      <div className="course-info">
                        <div className={`course-status ${course.status}`}></div>
                        <div>
                          <h4>{course.name}</h4>
                          <p>{course.code} • {course.credits} credits</p>
                        </div>
                      </div>
                      <BookOpen size={18} className="course-icon" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Upcoming Deadlines Preview */}
              <section className="deadlines-section">
                <div className="section-header">
                  <h2>Upcoming Deadlines</h2>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('deadlines')}>
                    View All
                  </button>
                </div>
                <div className="deadlines-list">
                  {upcomingDeadlines.slice(0, 4).map((deadline) => {
                    const course = getCourseById(deadline.courseId);
                    return (
                      <div key={deadline.id} className="deadline-card">
                        <div className={`deadline-type ${deadline.type}`}>
                          <Clock size={16} />
                        </div>
                        <div className="deadline-info">
                          <h4>{deadline.title}</h4>
                          <p>{course?.code || 'Unknown Course'}</p>
                        </div>
                        <div className="deadline-date">
                          {new Date(deadline.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {upcomingDeadlines.length === 0 && (
                    <p className="empty-state">No upcoming deadlines. You're all caught up!</p>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className="courses-view">
              <div className="section-header">
                <h2>All Courses ({courses.length})</h2>
                <button className="btn btn-primary" onClick={() => {
                  setEditingCourse(null);
                  setCourseForm({ name: '', code: '', credits: 3, professor: '', schedule: '', status: 'on-track' });
                  setShowCourseModal(true);
                }}>
                  <Plus size={18} />
                  Add Course
                </button>
              </div>
              
              <div className="courses-grid">
                {courses.map((course) => (
                  <div key={course.id} className="course-detail-card">
                    <div className="course-detail-header">
                      <div className={`course-status-badge ${course.status}`}>
                        {course.status === 'on-track' ? 'On Track' : 'Needs Attention'}
                      </div>
                      <div className="course-actions">
                        <button className="icon-btn" onClick={() => handleEditCourse(course)}>
                          <Edit2 size={16} />
                        </button>
                        <button className="icon-btn danger" onClick={() => handleDeleteCourse(course.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3>{course.name}</h3>
                    <p className="course-code">{course.code}</p>
                    <div className="course-details">
                      <span><BookOpen size={14} /> {course.credits} credits</span>
                      {course.professor && <span><GraduationCap size={14} /> {course.professor}</span>}
                      {course.schedule && <span><Clock size={14} /> {course.schedule}</span>}
                    </div>
                    <div className="course-deadlines-count">
                      {deadlines.filter(d => d.courseId === course.id && !d.completed).length} pending deadlines
                    </div>
                  </div>
                ))}
              </div>

              {courses.length === 0 && (
                <div className="empty-state-large">
                  <GraduationCap size={48} />
                  <h3>No courses yet</h3>
                  <p>Add your first course to start tracking your academics.</p>
                  <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
                    <Plus size={18} />
                    Add Course
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Deadlines Tab */}
          {activeTab === 'deadlines' && (
            <div className="deadlines-view">
              <div className="section-header">
                <h2>All Deadlines</h2>
                <button className="btn btn-primary" onClick={() => {
                  setEditingDeadline(null);
                  setDeadlineForm({ title: '', courseId: '', date: '', type: 'assignment', priority: 'medium', notes: '' });
                  setShowDeadlineModal(true);
                }}>
                  <Plus size={18} />
                  Add Deadline
                </button>
              </div>

              {/* Upcoming */}
              <div className="deadlines-group">
                <h3>Upcoming ({upcomingDeadlines.length})</h3>
                <div className="deadlines-table">
                  {upcomingDeadlines.map((deadline) => {
                    const course = getCourseById(deadline.courseId);
                    const daysUntil = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={deadline.id} className={`deadline-row ${deadline.priority}`}>
                        <button 
                          className="complete-btn"
                          onClick={() => handleToggleDeadlineComplete(deadline.id)}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <div className={`deadline-type-badge ${deadline.type}`}>
                          {deadline.type}
                        </div>
                        <div className="deadline-content">
                          <h4>{deadline.title}</h4>
                          <p>{course?.name || 'Unknown Course'}</p>
                        </div>
                        <div className={`deadline-days ${daysUntil <= 2 ? 'urgent' : ''}`}>
                          {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </div>
                        <div className="deadline-date-col">
                          {new Date(deadline.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="deadline-actions">
                          <button className="icon-btn" onClick={() => handleEditDeadline(deadline)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-btn danger" onClick={() => handleDeleteDeadline(deadline.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingDeadlines.length === 0 && (
                    <p className="empty-state">No upcoming deadlines</p>
                  )}
                </div>
              </div>

              {/* Completed */}
              <div className="deadlines-group completed">
                <h3>Completed ({completedDeadlines.length})</h3>
                <div className="deadlines-table">
                  {completedDeadlines.map((deadline) => {
                    const course = getCourseById(deadline.courseId);
                    return (
                      <div key={deadline.id} className="deadline-row completed">
                        <button 
                          className="complete-btn checked"
                          onClick={() => handleToggleDeadlineComplete(deadline.id)}
                        >
                          <CheckCircle size={20} />
                        </button>
                        <div className={`deadline-type-badge ${deadline.type}`}>
                          {deadline.type}
                        </div>
                        <div className="deadline-content">
                          <h4>{deadline.title}</h4>
                          <p>{course?.name || 'Unknown Course'}</p>
                        </div>
                        <div className="deadline-date-col">
                          {new Date(deadline.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="deadline-actions">
                          <button className="icon-btn danger" onClick={() => handleDeleteDeadline(deadline.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {completedDeadlines.length === 0 && (
                    <p className="empty-state">No completed deadlines yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="calendar-view">
              <div className="calendar-header">
                <button className="cal-nav" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft size={20} />
                </button>
                <h3>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button className="cal-nav" onClick={() => navigateMonth(1)}>
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="calendar-grid">
                <div className="cal-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                <div className="cal-days">
                  {Array.from({ length: 42 }, (_, i) => {
                    const firstDay = getFirstDayOfMonth(currentMonth);
                    const daysInMonth = getDaysInMonth(currentMonth);
                    const day = i - firstDay + 1;
                    const isCurrentMonth = day >= 1 && day <= daysInMonth;
                    const dayDeadlines = isCurrentMonth ? getDeadlinesForDate(day) : [];
                    const isToday = isCurrentMonth && 
                      day === new Date().getDate() && 
                      currentMonth.getMonth() === new Date().getMonth() &&
                      currentMonth.getFullYear() === new Date().getFullYear();
                    
                    return (
                      <div 
                        key={i} 
                        className={`cal-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${dayDeadlines.length > 0 ? 'has-event' : ''} ${selectedDate === day ? 'selected' : ''}`}
                        onClick={() => isCurrentMonth && setSelectedDate(day)}
                      >
                        {isCurrentMonth && day}
                        {dayDeadlines.length > 0 && (
                          <div className="event-dots">
                            {dayDeadlines.slice(0, 3).map((d, idx) => (
                              <span key={idx} className={`event-dot ${d.type}`}></span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Details */}
              {selectedDate && (
                <div className="selected-date-details">
                  <h4>
                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h4>
                  <div className="date-deadlines">
                    {getDeadlinesForDate(selectedDate).length > 0 ? (
                      getDeadlinesForDate(selectedDate).map((deadline) => {
                        const course = getCourseById(deadline.courseId);
                        return (
                          <div key={deadline.id} className="date-deadline-item">
                            <div className={`deadline-type-badge ${deadline.type}`}>
                              {deadline.type}
                            </div>
                            <div>
                              <strong>{deadline.title}</strong>
                              <span>{course?.name}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="empty-state">No deadlines on this day</p>
                    )}
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => {
                    setDeadlineForm({
                      ...deadlineForm,
                      date: `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
                    });
                    setShowDeadlineModal(true);
                  }}>
                    <Plus size={16} />
                    Add Deadline
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Focus Timer Tab */}
          {activeTab === 'focus' && (
            <div className="focus-view">
              <div className="focus-layout">
                <div className="focus-main">
                  <Pomodoro />
                </div>
                <div className="focus-tips">
                  <h3>Focus Tips</h3>
                  <ul>
                    <li>🎯 Set a clear goal before starting</li>
                    <li>📱 Put your phone on silent/DND</li>
                    <li>💧 Keep water nearby</li>
                    <li>🧘 Take breaks seriously - stretch!</li>
                    <li>📝 After 4 pomodoros, take a long break</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* GPA Calculator Tab */}
          {activeTab === 'gpa' && (
            <div className="gpa-view">
              <GPACalculator />
            </div>
          )}

          {/* Reflection Tab */}
          {activeTab === 'reflection' && (
            <div className="reflection-view">
              <div className="reflection-intro">
                <Brain size={48} className="reflection-icon" />
                <h2>Weekly Well-being Check-in</h2>
                <p>Take a moment to reflect on how you're doing. This helps Atlas understand your overall state and give you better signals.</p>
              </div>

              <form className="reflection-form" onSubmit={(e) => { e.preventDefault(); handleSubmitReflection(); }}>
                <div className="reflection-question">
                  <label>
                    <Activity size={20} />
                    How would you rate your stress level this week?
                  </label>
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button 
                        key={value} 
                        type="button" 
                        className={`rating-btn ${reflectionForm.stress === value ? 'selected' : ''}`}
                        onClick={() => setReflectionForm({ ...reflectionForm, stress: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="scale-labels">
                    <span>Very High (Bad)</span>
                    <span>Very Low (Good)</span>
                  </div>
                </div>

                <div className="reflection-question">
                  <label>
                    <Moon size={20} />
                    How was your sleep quality?
                  </label>
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button 
                        key={value} 
                        type="button" 
                        className={`rating-btn ${reflectionForm.sleep === value ? 'selected' : ''}`}
                        onClick={() => setReflectionForm({ ...reflectionForm, sleep: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="scale-labels">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="reflection-question">
                  <label>
                    <BookOpen size={20} />
                    How manageable was your workload?
                  </label>
                  <div className="rating-scale">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button 
                        key={value} 
                        type="button" 
                        className={`rating-btn ${reflectionForm.workload === value ? 'selected' : ''}`}
                        onClick={() => setReflectionForm({ ...reflectionForm, workload: value })}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="scale-labels">
                    <span>Overwhelming</span>
                    <span>Very Manageable</span>
                  </div>
                </div>

                <div className="reflection-question">
                  <label>
                    <FileText size={20} />
                    Any additional notes? (Optional)
                  </label>
                  <textarea
                    className="form-input"
                    placeholder="How are you feeling? Any challenges or wins this week?"
                    rows={3}
                    value={reflectionForm.notes}
                    onChange={(e) => setReflectionForm({ ...reflectionForm, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={18} />
                  Submit Reflection
                </button>
              </form>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="history-view">
              <div className="section-header">
                <h2>Reflection History</h2>
              </div>

              {reflections.length > 0 ? (
                <div className="reflections-timeline">
                  {[...reflections].reverse().map((reflection) => (
                    <div key={reflection.id} className="reflection-entry">
                      <div className="reflection-date">
                        {new Date(reflection.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="reflection-scores">
                        <div className="score-item">
                          <Activity size={16} />
                          <span>Stress: {6 - reflection.stress}/5</span>
                          <div className="score-bar">
                            <div className="score-fill stress" style={{ width: `${(6 - reflection.stress) * 20}%` }}></div>
                          </div>
                        </div>
                        <div className="score-item">
                          <Moon size={16} />
                          <span>Sleep: {reflection.sleep}/5</span>
                          <div className="score-bar">
                            <div className="score-fill sleep" style={{ width: `${reflection.sleep * 20}%` }}></div>
                          </div>
                        </div>
                        <div className="score-item">
                          <BookOpen size={16} />
                          <span>Workload: {reflection.workload}/5</span>
                          <div className="score-bar">
                            <div className="score-fill workload" style={{ width: `${reflection.workload * 20}%` }}></div>
                          </div>
                        </div>
                      </div>
                      {reflection.notes && (
                        <p className="reflection-notes">"{reflection.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-large">
                  <TrendingUp size={48} />
                  <h3>No reflections yet</h3>
                  <p>Complete your first weekly check-in to see your history here.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('reflection')}>
                    Start Check-in
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="modal-overlay" onClick={() => setShowCourseModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button className="modal-close" onClick={() => setShowCourseModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              editingCourse ? handleUpdateCourse() : handleAddCourse();
            }}>
              <div className="form-group">
                <label className="form-label">Course Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Data Structures and Algorithms"
                  value={courseForm.name}
                  onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course Code *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., CS201"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Credits *</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    max="6"
                    value={courseForm.credits}
                    onChange={(e) => setCourseForm({ ...courseForm, credits: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Professor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Dr. Sharma"
                  value={courseForm.professor}
                  onChange={(e) => setCourseForm({ ...courseForm, professor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Schedule</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Mon, Wed 10:00 AM"
                  value={courseForm.schedule}
                  onChange={(e) => setCourseForm({ ...courseForm, schedule: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={courseForm.status}
                  onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                >
                  <option value="on-track">On Track</option>
                  <option value="needs-attention">Needs Attention</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCourse ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deadline Modal */}
      {showDeadlineModal && (
        <div className="modal-overlay" onClick={() => setShowDeadlineModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDeadline ? 'Edit Deadline' : 'Add New Deadline'}</h2>
              <button className="modal-close" onClick={() => setShowDeadlineModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={(e) => {
              e.preventDefault();
              editingDeadline ? handleUpdateDeadline() : handleAddDeadline();
            }}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Assignment 3"
                  value={deadlineForm.title}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Course *</label>
                <select
                  className="form-input"
                  value={deadlineForm.courseId}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, courseId: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={deadlineForm.date}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input"
                    value={deadlineForm.type}
                    onChange={(e) => setDeadlineForm({ ...deadlineForm, type: e.target.value })}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="project">Project</option>
                    <option value="exam">Exam</option>
                    <option value="lab">Lab</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={deadlineForm.priority}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  placeholder="Any additional notes..."
                  rows={3}
                  value={deadlineForm.notes}
                  onChange={(e) => setDeadlineForm({ ...deadlineForm, notes: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeadlineModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDeadline ? 'Update Deadline' : 'Add Deadline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reflection Success Modal */}
      {showReflectionModal && (
        <div className="modal-overlay" onClick={() => setShowReflectionModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-success">
              <CheckCircle size={48} />
              <h2>Reflection Submitted!</h2>
              <p>Thank you for checking in. Your well-being data has been recorded and will help improve your signal accuracy.</p>
              <button className="btn btn-primary" onClick={() => setShowReflectionModal(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signal Explainer Modal */}
      {showSignalExplainer && (
        <div className="modal-overlay" onClick={() => setShowSignalExplainer(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Understanding Your Signal</h2>
              <button className="modal-close" onClick={() => setShowSignalExplainer(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="signal-explainer">
              <p>Your signal is calculated based on three factors:</p>
              
              <div className="explainer-section">
                <h4><GraduationCap size={18} /> Academic Load</h4>
                <p>How many of your courses need attention and the overall credit load you're carrying.</p>
              </div>

              <div className="explainer-section">
                <h4><Target size={18} /> Upcoming Deadlines</h4>
                <p>The number and urgency of deadlines in the next 7 days.</p>
              </div>

              <div className="explainer-section">
                <h4><Brain size={18} /> Well-being</h4>
                <p>Based on your weekly check-ins - stress levels, sleep quality, and workload manageability.</p>
              </div>

              <div className="signal-states">
                <div className="signal-state on-track">
                  <CheckCircle size={20} />
                  <div>
                    <strong>On Track</strong>
                    <span>Things are balanced. Keep it up!</span>
                  </div>
                </div>
                <div className="signal-state needs-attention">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Needs Attention</strong>
                    <span>One or two areas could use some focus.</span>
                  </div>
                </div>
                <div className="signal-state overloaded">
                  <AlertTriangle size={20} />
                  <div>
                    <strong>Overloaded</strong>
                    <span>Multiple areas need attention. Consider seeking help.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
