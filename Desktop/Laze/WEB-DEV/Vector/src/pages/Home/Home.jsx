import { Link } from 'react-router-dom';
import {
  Compass,
  Map,
  Wallet,
  Package,
  ArrowRight,
  CheckCircle,
  Shield,
  Sparkles,
  Users,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import './Home.css';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Map,
      title: 'Atlas',
      subtitle: t('home.atlasSubtitle'),
      description: t('home.atlasDescription'),
      color: '#4F9D9A',
    },
    {
      icon: Wallet,
      title: 'Flow',
      subtitle: t('home.flowSubtitle'),
      description: t('home.flowDescription'),
      color: '#5B8DEF',
    },
    {
      icon: Package,
      title: 'Kit',
      subtitle: t('home.kitSubtitle'),
      description: t('home.kitDescription'),
      color: '#F4A261',
    },
  ];

  const benefits = [
    { icon: Shield, text: t('home.benefit1') },
    { icon: Sparkles, text: t('home.benefit2') },
    { icon: Users, text: t('home.benefit3') },
    { icon: TrendingUp, text: t('home.benefit4') },
  ];

  const stats = [
    { value: '10K+', label: t('home.students') },
    { value: '50+', label: t('home.colleges') },
    { value: '100K+', label: t('home.tasksCompleted') },
    { value: '4.8', label: t('home.appRating') },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Compass size={16} />
              <span>{t('home.badge')}</span>
            </div>
            <h1 className="hero-title">
              {t('home.heroTitle1')} <span className="text-primary">{t('home.heroTitle2')}</span> {t('home.heroTitle3')} <span className="text-primary">{t('home.heroTitle4')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('home.heroSubtitle')}
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                {t('home.getStarted')}
                <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn-outline btn-lg">
                {t('home.seeHowItWorks')}
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <div className="mini-card-header">
                <Map size={20} />
                <span>Atlas</span>
              </div>
              <div className="signal-display">
                <div className="signal signal-green"></div>
                <span>{t('home.onTrack')}</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="mini-card-header">
                <Wallet size={20} />
                <span>Flow</span>
              </div>
              <div className="mini-chart">
                <div className="bar" style={{ height: '60%' }}></div>
                <div className="bar" style={{ height: '80%' }}></div>
                <div className="bar" style={{ height: '40%' }}></div>
                <div className="bar" style={{ height: '90%' }}></div>
                <div className="bar" style={{ height: '50%' }}></div>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <div className="mini-card-header">
                <Package size={20} />
                <span>Kit</span>
              </div>
              <div className="checklist-preview">
                <div className="check-item done"><CheckCircle size={14} /> {t('home.hostelSetup')}</div>
                <div className="check-item done"><CheckCircle size={14} /> {t('home.documents')}</div>
                <div className="check-item"><CheckCircle size={14} /> {t('home.essentials')}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-gradient"></div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t('home.featuresTitle')}</h2>
            <p className="section-subtitle">
              {t('home.featuresSubtitle')}
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-subtitle">{feature.subtitle}</p>
                <p className="feature-description">{feature.description}</p>
                <Link to={`/${feature.title.toLowerCase()}`} className="feature-link">
                  {t('home.learnMoreLink')} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">{t('home.whyChoose')}</h2>
              <p className="section-subtitle">
                {t('home.whyChooseSubtitle')}
              </p>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index} className="benefit-item">
                    <div className="benefit-icon">
                      <benefit.icon size={20} />
                    </div>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="benefits-visual">
              <div className="insight-card">
                <div className="insight-header">
                  <Sparkles size={18} />
                  <span>{t('home.weeklyInsight')}</span>
                </div>
                <p className="insight-text">
                  {t('home.insightText')}
                </p>
                <button className="insight-action">{t('home.viewDetails')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">{t('home.ctaTitle')}</h2>
            <p className="cta-subtitle">
              {t('home.ctaSubtitle')}
            </p>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                {t('home.createAccount')}
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                {t('home.learnMore')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
