import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Mail, MessageSquare, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t('contact.emailUs'),
      value: 'hello@vector.app',
      link: 'mailto:hello@vector.app',
    },
    {
      icon: MessageSquare,
      title: t('contact.liveChat'),
      value: t('contact.availableHours'),
      link: '#',
    },
    {
      icon: MapPin,
      title: t('contact.location'),
      value: 'Bhubaneswar, India',
      link: '#',
    },
  ];

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="container">
          <div className="success-message">
            <CheckCircle size={64} className="success-icon" />
            <h1>{t('contact.thankYou')}</h1>
            <p>{t('contact.receivedMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-icon">
            <MessageSquare size={48} />
          </div>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h2>{t('contact.sendMessage')}</h2>
              <p>{t('contact.formDesc')}</p>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">{t('auth.name')}</label>
                    <input
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder={t('auth.namePlaceholder')}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('auth.email')}</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('contact.subject')}</label>
                  <select
                    name="subject"
                    className="form-input"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">{t('contact.selectSubject')}</option>
                    <option value="general">{t('contact.generalInquiry')}</option>
                    <option value="support">{t('contact.technicalSupport')}</option>
                    <option value="feedback">{t('contact.feedback')}</option>
                    <option value="partnership">{t('contact.partnership')}</option>
                    <option value="privacy">{t('contact.privacyConcern')}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('contact.message')}</label>
                  <textarea
                    name="message"
                    className="form-input form-textarea"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? t('common.loading') : (
                    <>
                      <Send size={18} />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-wrapper">
              <h2>{t('contact.otherWays')}</h2>
              <div className="contact-info-cards">
                {contactInfo.map((info, index) => (
                  <a key={index} href={info.link} className="contact-info-card">
                    <div className="info-icon">
                      <info.icon size={24} />
                    </div>
                    <div className="info-content">
                      <h3>{info.title}</h3>
                      <p>{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="faq-section">
                <h3>{t('contact.faqTitle')}</h3>
                <p>{t('contact.faqDesc')}</p>
                <a href="/help" className="btn btn-secondary">
                  {t('contact.visitHelpCenter')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
