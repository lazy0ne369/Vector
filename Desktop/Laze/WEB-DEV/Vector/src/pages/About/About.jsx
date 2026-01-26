import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { Compass, Target, Heart, Users, Globe, Zap } from 'lucide-react';
import './About.css';

export default function About() {
  const { t } = useTranslation();
  
  const values = [
    {
      icon: Target,
      title: t('about.value1Title'),
      description: t('about.value1Desc'),
    },
    {
      icon: Heart,
      title: t('about.value2Title'),
      description: t('about.value2Desc'),
    },
    {
      icon: Users,
      title: t('about.value3Title'),
      description: t('about.value3Desc'),
    },
    {
      icon: Zap,
      title: t('about.value4Title'),
      description: t('about.value4Desc'),
    },
  ];

  const team = [
    { name: t('about.mission1Title'), role: t('about.mission1Desc') },
    { name: t('about.mission2Title'), role: t('about.mission2Desc') },
    { name: t('about.mission3Title'), role: t('about.mission3Desc') },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-icon">
              <Compass size={48} />
            </div>
            <h1 className="about-title">{t('about.title')}</h1>
            <p className="about-subtitle">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>{t('about.whyVector')}</h2>
              <p>
                {t('about.story1')}
              </p>
              <p>
                {t('about.story2')}
              </p>
              <p>
                {t('about.story3')}
              </p>
            </div>
            <div className="story-visual">
              <div className="vector-illustration">
                <div className="vector-line"></div>
                <div className="vector-arrow"></div>
                <span className="vector-label">{t('about.yourPath')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values section">
        <div className="container">
          <h2 className="section-title text-center">{t('about.coreValues')}</h2>
          <p className="section-subtitle text-center">
            {t('about.coreValuesSubtitle')}
          </p>
          <div className="values-grid">
            {values.map((value) => (
              <div key={value.title} className="value-card">
                <div className="value-icon">
                  <value.icon size={24} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="about-mission section">
        <div className="container">
          <div className="mission-grid">
            {team.map((item, index) => (
              <div key={index} className="mission-card">
                <div className="mission-number">{String(index + 1).padStart(2, '0')}</div>
                <h3>{item.name}</h3>
                <p>{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global */}
      <section className="about-global section">
        <div className="container">
          <div className="global-content">
            <Globe size={48} className="global-icon" />
            <h2>{t('about.builtForStudents')}</h2>
            <p>
              {t('about.globalDesc')}
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              {t('about.joinCommunity')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
