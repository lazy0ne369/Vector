import { useTranslation } from '../../hooks/useTranslation';
import { Shield, Eye, Download, Trash2, Share2, Lock, Server, UserCheck } from 'lucide-react';
import './Privacy.css';

export default function Privacy() {
  const { t } = useTranslation();
  
  const principles = [
    {
      icon: UserCheck,
      title: t('privacy.principle1Title'),
      description: t('privacy.principle1Desc'),
    },
    {
      icon: Lock,
      title: t('privacy.principle2Title'),
      description: t('privacy.principle2Desc'),
    },
    {
      icon: Eye,
      title: t('privacy.principle3Title'),
      description: t('privacy.principle3Desc'),
    },
    {
      icon: Server,
      title: t('privacy.principle4Title'),
      description: t('privacy.principle4Desc'),
    },
  ];

  const controls = [
    {
      icon: Download,
      title: t('privacy.control1Title'),
      description: t('privacy.control1Desc'),
    },
    {
      icon: Trash2,
      title: t('privacy.control2Title'),
      description: t('privacy.control2Desc'),
    },
    {
      icon: Share2,
      title: t('privacy.control3Title'),
      description: t('privacy.control3Desc'),
    },
    {
      icon: Eye,
      title: t('privacy.control4Title'),
      description: t('privacy.control4Desc'),
    },
  ];

  return (
    <div className="privacy-page">
      {/* Hero */}
      <section className="privacy-hero">
        <div className="container">
          <div className="privacy-icon">
            <Shield size={48} />
          </div>
          <h1>{t('privacy.title')}</h1>
          <p>
            {t('privacy.subtitle')}
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="privacy-principles section">
        <div className="container">
          <h2 className="section-title text-center">{t('privacy.principlesTitle')}</h2>
          <p className="section-subtitle text-center">
            {t('privacy.principlesSubtitle')}
          </p>
          <div className="principles-grid">
            {principles.map((principle, index) => (
              <div key={index} className="principle-card">
                <div className="principle-icon">
                  <principle.icon size={24} />
                </div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="privacy-controls section">
        <div className="container">
          <h2 className="section-title text-center">{t('privacy.controlsTitle')}</h2>
          <p className="section-subtitle text-center">
            {t('privacy.controlsSubtitle')}
          </p>
          <div className="controls-grid">
            {controls.map((control, index) => (
              <div key={index} className="control-card">
                <div className="control-icon">
                  <control.icon size={24} />
                </div>
                <div className="control-content">
                  <h3>{control.title}</h3>
                  <p>{control.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="privacy-details section">
        <div className="container">
          <div className="details-content">
            <h2>{t('privacy.whatWeCollect')}</h2>
            <div className="details-list">
              <div className="detail-item">
                <h4>{t('privacy.accountInfo')}</h4>
                <p>{t('privacy.accountInfoDesc')}</p>
              </div>
              <div className="detail-item">
                <h4>{t('privacy.appData')}</h4>
                <p>{t('privacy.appDataDesc')}</p>
              </div>
              <div className="detail-item">
                <h4>{t('privacy.usageAnalytics')}</h4>
                <p>{t('privacy.usageAnalyticsDesc')}</p>
              </div>
            </div>

            <h2>{t('privacy.whatWeNeverDo')}</h2>
            <ul className="never-list">
              <li>❌ {t('privacy.never1')}</li>
              <li>❌ {t('privacy.never2')}</li>
              <li>❌ {t('privacy.never3')}</li>
              <li>❌ {t('privacy.never4')}</li>
              <li>❌ {t('privacy.never5')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="privacy-contact section">
        <div className="container">
          <div className="contact-box">
            <h2>{t('privacy.questionsTitle')}</h2>
            <p>
              {t('privacy.questionsDesc')}
            </p>
            <a href="mailto:privacy@vector.app" className="btn btn-primary btn-lg">
              {t('privacy.contactTeam')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
