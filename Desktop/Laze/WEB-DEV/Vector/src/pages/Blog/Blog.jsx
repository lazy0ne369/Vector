import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { BookOpen, Calendar, User, ArrowRight, Tag, Search } from 'lucide-react';
import './Blog.css';

export default function Blog() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: t('blog.allPosts') },
    { id: 'productivity', label: t('blog.productivity') },
    { id: 'finance', label: t('blog.finance') },
    { id: 'wellness', label: t('blog.wellness') },
    { id: 'updates', label: t('blog.updates') },
  ];

  const blogPosts = [
    {
      id: 1,
      title: '5 Study Techniques That Actually Work',
      excerpt: 'Discover science-backed study methods that will help you retain more information and perform better in exams.',
      category: 'productivity',
      author: 'Vector Team',
      date: 'Jan 20, 2026',
      readTime: '5 min read',
      image: '📚',
      featured: true,
    },
    {
      id: 2,
      title: 'How to Budget on a Student Income',
      excerpt: 'Managing money as a student can be challenging. Here\'s a practical guide to making your funds last all semester.',
      category: 'finance',
      author: 'Vector Team',
      date: 'Jan 18, 2026',
      readTime: '7 min read',
      image: '💰',
      featured: true,
    },
    {
      id: 3,
      title: 'Introducing Flow: Your Personal Finance Companion',
      excerpt: 'We\'re excited to announce Flow, a new module designed to help students track and understand their spending habits.',
      category: 'updates',
      author: 'Vector Team',
      date: 'Jan 15, 2026',
      readTime: '3 min read',
      image: '🚀',
      featured: false,
    },
    {
      id: 4,
      title: 'Dealing with Exam Stress: A Complete Guide',
      excerpt: 'Exam season can be overwhelming. Learn effective strategies to manage stress and perform at your best.',
      category: 'wellness',
      author: 'Vector Team',
      date: 'Jan 12, 2026',
      readTime: '6 min read',
      image: '🧘',
      featured: false,
    },
    {
      id: 5,
      title: 'The Pomodoro Technique: Boost Your Focus',
      excerpt: 'How breaking your work into 25-minute intervals can dramatically improve your productivity and concentration.',
      category: 'productivity',
      author: 'Vector Team',
      date: 'Jan 10, 2026',
      readTime: '4 min read',
      image: '⏱️',
      featured: false,
    },
    {
      id: 6,
      title: 'Essential Items for Your Hostel Room',
      excerpt: 'Moving to a hostel? Here\'s a comprehensive checklist of everything you need for a comfortable stay.',
      category: 'productivity',
      author: 'Vector Team',
      date: 'Jan 8, 2026',
      readTime: '5 min read',
      image: '🏠',
      featured: false,
    },
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="blog-page">
      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <div className="blog-hero-icon">
            <BookOpen size={48} />
          </div>
          <h1>{t('blog.title')}</h1>
          <p>{t('blog.subtitle')}</p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="blog-featured section">
        <div className="container">
          <h2 className="section-title">{t('blog.featured')}</h2>
          <div className="featured-grid">
            {featuredPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="featured-card">
                <div className="featured-image">
                  <span className="post-emoji">{post.image}</span>
                </div>
                <div className="featured-content">
                  <span className="post-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-meta">
                    <span><Calendar size={14} /> {post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="blog-list section">
        <div className="container">
          <div className="blog-header">
            <h2 className="section-title">{t('blog.allPosts')}</h2>
            <div className="blog-search">
              <Search size={18} />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="blog-categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <Link to={`/blog/${post.id}`} key={post.id} className="post-card">
                <div className="post-image">
                  <span className="post-emoji">{post.image}</span>
                </div>
                <div className="post-content">
                  <span className="post-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="post-footer">
                    <div className="post-meta">
                      <span><Calendar size={14} /> {post.date}</span>
                    </div>
                    <span className="read-more">
                      {t('home.learnMoreLink')} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="no-posts">
              <p>{t('common.noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="blog-newsletter section">
        <div className="container">
          <div className="newsletter-box">
            <h2>{t('blog.newsletterTitle')}</h2>
            <p>{t('blog.newsletterDesc')}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t('auth.email')} required />
              <button type="submit" className="btn btn-primary">
                {t('blog.subscribe')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
