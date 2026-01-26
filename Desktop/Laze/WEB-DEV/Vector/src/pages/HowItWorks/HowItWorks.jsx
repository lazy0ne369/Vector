import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Map,
  Wallet,
  Package,
  ArrowRight,
  Calendar,
  BarChart2,
  CheckSquare,
  Bell,
  PieChart,
  TrendingUp,
  ListChecks,
  Lightbulb,
  Download,
  Share2,
} from 'lucide-react';
import './HowItWorks.css';

export default function HowItWorks() {
  const { t } = useTranslation();
  
  const modules = [
    {
      id: 'atlas',
      icon: Map,
      title: 'Atlas',
      subtitle: t('atlas.subtitle'),
      color: '#4F9D9A',
      description: t('home.atlasDescription'),
      features: [
        { icon: Calendar, text: t('hiw.atlasFeature1') },
        { icon: BarChart2, text: t('hiw.atlasFeature2') },
        { icon: Bell, text: t('hiw.atlasFeature3') },
        { icon: CheckSquare, text: t('hiw.atlasFeature4') },
      ],
      screens: [t('hiw.atlasScreen1'), t('hiw.atlasScreen2'), t('hiw.atlasScreen3'), t('hiw.atlasScreen4')],
    },
    {
      id: 'flow',
      icon: Wallet,
      title: 'Flow',
      subtitle: t('flow.subtitle'),
      color: '#5B8DEF',
      description: t('home.flowDescription'),
      features: [
        { icon: ListChecks, text: t('hiw.flowFeature1') },
        { icon: PieChart, text: t('hiw.flowFeature2') },
        { icon: TrendingUp, text: t('hiw.flowFeature3') },
        { icon: Download, text: t('hiw.flowFeature4') },
      ],
      screens: [t('hiw.flowScreen1'), t('hiw.flowScreen2'), t('hiw.flowScreen3'), t('hiw.flowScreen4')],
    },
    {
      id: 'kit',
      icon: Package,
      title: 'Kit',
      subtitle: t('kit.subtitle'),
      color: '#F4A261',
      description: t('home.kitDescription'),
      features: [
        { icon: CheckSquare, text: t('hiw.kitFeature1') },
        { icon: BarChart2, text: t('hiw.kitFeature2') },
        { icon: Share2, text: t('hiw.kitFeature3') },
        { icon: Lightbulb, text: t('hiw.kitFeature4') },
      ],
      screens: [t('hiw.kitScreen1'), t('hiw.kitScreen2'), t('hiw.kitScreen3'), t('hiw.kitScreen4')],
    },
  ];

  const steps = [
    {
      number: '01',
      title: t('hiw.step1Title'),
      description: t('hiw.step1Desc'),
    },
    {
      number: '02',
      title: t('hiw.step2Title'),
      description: t('hiw.step2Desc'),
    },
    {
      number: '03',
      title: t('hiw.step3Title'),
      description: t('hiw.step3Desc'),
    },
    {
      number: '04',
      title: t('hiw.step4Title'),
      description: t('hiw.step4Desc'),
    },
  ];

  return (
    <div className="how-it-works">
      {/* Hero */}
      <section className="hiw-hero">
        <div className="container">
          <h1>{t('hiw.title')}</h1>
          <p>{t('hiw.subtitle')}</p>
        </div>
      </section>

      {/* Steps */}
      <section className="hiw-steps section">
        <div className="container">
          <h2 className="section-title text-center">{t('hiw.gettingStarted')}</h2>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="hiw-modules section">
        <div className="container">
          <h2 className="section-title text-center">{t('hiw.exploreModules')}</h2>
          <p className="section-subtitle text-center">
            {t('hiw.moduleSubtitle')}
          </p>

          {modules.map((module, index) => (
            <div key={module.id} className={`module-section ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="module-content">
                <div className="module-header">
                  <div className="module-icon" style={{ backgroundColor: `${module.color}15`, color: module.color }}>
                    <module.icon size={32} />
                  </div>
                  <div>
                    <h3 className="module-title">{module.title}</h3>
                    <p className="module-subtitle">{module.subtitle}</p>
                  </div>
                </div>
                <p className="module-description">{module.description}</p>
                <ul className="module-features">
                  {module.features.map((feature, i) => (
                    <li key={i}>
                      <feature.icon size={18} />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/${module.id}`} className="btn btn-outline" style={{ borderColor: module.color, color: module.color }}>
                  {t('hiw.try')} {module.title}
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="module-preview">
                <div className="preview-card" style={{ borderColor: module.color }}>
                  <div className="preview-header" style={{ backgroundColor: module.color }}>
                    <module.icon size={20} />
                    <span>{module.title}</span>
                  </div>
                  <div className="preview-screens">
                    {module.screens.map((screen, i) => (
                      <div key={i} className="preview-screen">
                        <div className="screen-dot"></div>
                        <span>{screen}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="hiw-cta section">
        <div className="container">
          <div className="cta-box">
            <h2>{t('home.ctaTitle')}</h2>
            <p>{t('home.ctaSubtitle')}</p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              {t('home.createAccount')}
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
