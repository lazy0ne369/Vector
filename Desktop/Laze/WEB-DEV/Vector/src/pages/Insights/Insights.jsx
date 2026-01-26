import { useTranslation } from '../../hooks/useTranslation';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Brain,
  Wallet,
  Package,
  Calendar,
  HelpCircle,
  ChevronRight,
  Bell,
  Filter,
  Sparkles,
  Activity,
  Target,
} from 'lucide-react';
import './Insights.css';

export default function Insights() {
  const { t } = useTranslation();
  const [headerRef, headerVisible] = useScrollAnimation();
  const [insightsRef, insightsVisible] = useScrollAnimation();
  const [nudgesRef, nudgesVisible] = useScrollAnimation();
  const [summariesRef, summariesVisible] = useScrollAnimation();
  const [noteRef, noteVisible] = useScrollAnimation();

  const weeklyInsights = [
    {
      id: 1,
      type: 'academic',
      icon: TrendingUp,
      title: 'Workload Increased',
      message: 'Your academic workload increased by 20% this week compared to last week.',
      detail: 'You have 3 deadlines this week vs 2 last week. Consider prioritizing or asking for extensions.',
      action: 'Review Deadlines',
      actionLink: '/atlas',
      severity: 'warning',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'wellbeing',
      icon: Brain,
      title: 'Check-in Reminder',
      message: 'You missed your weekly well-being check-in.',
      detail: 'Regular check-ins help Atlas understand your state and provide better signals.',
      action: 'Complete Check-in',
      actionLink: '/atlas',
      severity: 'info',
      timestamp: '1 day ago',
    },
    {
      id: 3,
      type: 'finance',
      icon: Wallet,
      title: 'Spending on Track',
      message: 'Great job! You\'re 70% through the month with only 60% of budget spent.',
      detail: 'At this rate, you\'ll have ₹1,750 remaining at the end of January.',
      action: 'View Details',
      actionLink: '/flow',
      severity: 'success',
      timestamp: '2 days ago',
    },
    {
      id: 4,
      type: 'preparedness',
      icon: Package,
      title: 'Kit Progress',
      message: 'You\'re 65% done with your Exam Preparation Kit.',
      detail: 'Complete the remaining items before Feb 10 to be fully prepared.',
      action: 'Continue Kit',
      actionLink: '/kit',
      severity: 'info',
      timestamp: '3 days ago',
    },
  ];

  const nudges = [
    {
      id: 1,
      message: 'Try logging your sleep patterns next week for better well-being insights.',
      dismissed: false,
    },
    {
      id: 2,
      message: 'Consider breaking down your DS Project into smaller tasks.',
      dismissed: false,
    },
    {
      id: 3,
      message: 'You spent more on entertainment this month. Review your spending goals?',
      dismissed: false,
    },
  ];

  const previousSummaries = [
    {
      week: 'Week 3, January 2026',
      highlights: [
        'Completed 5 tasks on time',
        'Spent ₹3,200 (within budget)',
        'Stress level: Moderate',
      ],
    },
    {
      week: 'Week 2, January 2026',
      highlights: [
        'Completed 4 tasks on time',
        'Spent ₹2,800 (within budget)',
        'Stress level: Low',
      ],
    },
  ];

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div className="insights-page">
      <div className="container">
        {/* Header */}
        <header ref={headerRef} className={`insights-header ${headerVisible ? 'animate-in' : ''}`}>
          <div className="header-info">
            <div className="header-icon">
              <Lightbulb size={28} />
            </div>
            <div>
              <h1>{t('insights.title')}</h1>
              <p>{t('insights.subtitle')}</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="header-stat">
              <Activity size={18} />
              <span><strong>4</strong> New Insights</span>
            </div>
            <div className="header-stat">
              <Target size={18} />
              <span><strong>85%</strong> On Track</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Bell size={18} />
              {t('settings.notifications')}
            </button>
          </div>
        </header>

        {/* This Week's Insights */}
        <section ref={insightsRef} className={`current-insights ${insightsVisible ? 'animate-in' : ''}`}>
          <div className="section-header">
            <div className="section-title-group">
              <Sparkles size={20} className="section-icon" />
              <h2>{t('insights.thisWeek')}</h2>
            </div>
            <button className="btn btn-secondary btn-sm">
              <Filter size={16} />
              {t('common.search')}
            </button>
          </div>

          <div className="insights-list">
            {weeklyInsights.map((insight, index) => (
              <div 
                key={insight.id} 
                className={`insight-card ${getSeverityClass(insight.severity)}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="insight-icon">
                  <insight.icon size={20} />
                </div>
                <div className="insight-content">
                  <div className="insight-header">
                    <h3>{insight.title}</h3>
                    <span className="insight-time">{insight.timestamp}</span>
                  </div>
                  <p className="insight-message">{insight.message}</p>
                  <p className="insight-detail">{insight.detail}</p>
                  <div className="insight-footer">
                    <a href={insight.actionLink} className="insight-action">
                      {insight.action}
                      <ChevronRight size={16} />
                    </a>
                    <button className="why-btn">
                      <HelpCircle size={14} />
                      Why am I seeing this?
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gentle Nudges */}
        <section ref={nudgesRef} className={`nudges-section ${nudgesVisible ? 'animate-in' : ''}`}>
          <div className="section-title-group">
            <Sparkles size={20} className="section-icon" />
            <h2>Gentle Nudges</h2>
          </div>
          <p className="section-subtitle">Small suggestions to help you improve</p>
          <div className="nudges-list">
            {nudges.map((nudge, index) => (
              <div 
                key={nudge.id} 
                className="nudge-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="nudge-icon">
                  <Lightbulb size={16} />
                </div>
                <p>{nudge.message}</p>
                <button className="dismiss-btn">×</button>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Summaries */}
        <section ref={summariesRef} className={`previous-summaries ${summariesVisible ? 'animate-in' : ''}`}>
          <div className="section-title-group">
            <Calendar size={20} className="section-icon" />
            <h2>Previous Weeks</h2>
          </div>
          <div className="summaries-list">
            {previousSummaries.map((summary, index) => (
              <div 
                key={index} 
                className="summary-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="summary-header">
                  <Calendar size={18} />
                  <h3>{summary.week}</h3>
                </div>
                <ul className="summary-highlights">
                  {summary.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
                <button className="btn btn-secondary btn-sm">View Full Summary</button>
              </div>
            ))}
          </div>
        </section>

        {/* Explainability Note */}
        <section ref={noteRef} className={`explainability-note ${noteVisible ? 'animate-in' : ''}`}>
          <div className="note-icon">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3>How Insights Work</h3>
            <p>
              All insights are generated based on your data within Vector. We analyze patterns 
              in your academic deadlines, spending habits, and well-being check-ins to provide 
              helpful suggestions. Your data never leaves Vector and is never shared.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
