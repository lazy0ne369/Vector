import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import {
  Package,
  Search,
  Plus,
  CheckSquare,
  Square,
  ChevronRight,
  Star,
  Users,
  Bookmark,
  BookmarkCheck,
  GraduationCap,
  Home,
  Briefcase,
  Plane,
  X,
  Edit2,
  Trash2,
  ChevronLeft,
  Copy,
  Sparkles,
  ListChecks,
  Folder,
} from 'lucide-react';
import './Kit.css';

// Storage keys
const STORAGE_KEYS = {
  customKits: 'vector_kit_custom',
  savedKits: 'vector_kit_saved',
  kitProgress: 'vector_kit_progress',
};

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

// Template kits (pre-built)
const TEMPLATE_KITS = [
  {
    id: 'template-hostel',
    title: 'Hostel Setup Essentials',
    description: 'Everything you need for a comfortable hostel life',
    icon: 'Home',
    category: 'Living',
    isTemplate: true,
    users: 1250,
    sections: [
      {
        id: 's1',
        name: 'Documents',
        items: [
          { id: 'i1', text: 'ID Card / Aadhar Copy', completed: false },
          { id: 'i2', text: 'Admission Letter', completed: false },
          { id: 'i3', text: 'Passport Size Photos', completed: false },
          { id: 'i4', text: 'Medical Certificate', completed: false },
        ],
      },
      {
        id: 's2',
        name: 'Bedding & Comfort',
        items: [
          { id: 'i5', text: 'Bedsheet (2 sets)', completed: false },
          { id: 'i6', text: 'Pillow & Pillow Cover', completed: false },
          { id: 'i7', text: 'Blanket / Quilt', completed: false },
          { id: 'i8', text: 'Mattress Protector', completed: false },
        ],
      },
      {
        id: 's3',
        name: 'Daily Essentials',
        items: [
          { id: 'i9', text: 'Toiletries Kit', completed: false },
          { id: 'i10', text: 'Towels (2-3)', completed: false },
          { id: 'i11', text: 'Laundry Bag', completed: false },
          { id: 'i12', text: 'Water Bottle', completed: false },
        ],
      },
      {
        id: 's4',
        name: 'Electronics',
        items: [
          { id: 'i13', text: 'Power Strip / Extension', completed: false },
          { id: 'i14', text: 'Phone Charger', completed: false },
          { id: 'i15', text: 'Laptop & Charger', completed: false },
          { id: 'i16', text: 'Earphones / Headphones', completed: false },
        ],
      },
    ],
  },
  {
    id: 'template-exam',
    title: 'Exam Preparation Kit',
    description: 'Study materials, strategies, and wellness tips for exams',
    icon: 'GraduationCap',
    category: 'Academic',
    isTemplate: true,
    users: 3420,
    sections: [
      {
        id: 's1',
        name: 'Study Materials',
        items: [
          { id: 'i1', text: 'Collect all lecture notes', completed: false },
          { id: 'i2', text: 'Organize previous year papers', completed: false },
          { id: 'i3', text: 'Create summary sheets', completed: false },
          { id: 'i4', text: 'Download relevant e-books', completed: false },
        ],
      },
      {
        id: 's2',
        name: 'Study Plan',
        items: [
          { id: 'i5', text: 'Create study timetable', completed: false },
          { id: 'i6', text: 'Set daily targets', completed: false },
          { id: 'i7', text: 'Schedule revision days', completed: false },
          { id: 'i8', text: 'Plan mock tests', completed: false },
        ],
      },
      {
        id: 's3',
        name: 'Wellness',
        items: [
          { id: 'i9', text: 'Plan regular breaks', completed: false },
          { id: 'i10', text: 'Stock healthy snacks', completed: false },
          { id: 'i11', text: 'Set sleep schedule', completed: false },
          { id: 'i12', text: 'Plan light exercise', completed: false },
        ],
      },
    ],
  },
  {
    id: 'template-internship',
    title: 'Internship Ready',
    description: 'Prepare for your first internship experience',
    icon: 'Briefcase',
    category: 'Career',
    isTemplate: true,
    users: 890,
    sections: [
      {
        id: 's1',
        name: 'Resume & Profile',
        items: [
          { id: 'i1', text: 'Update resume', completed: false },
          { id: 'i2', text: 'LinkedIn profile optimization', completed: false },
          { id: 'i3', text: 'GitHub portfolio (if tech)', completed: false },
          { id: 'i4', text: 'Professional photo', completed: false },
        ],
      },
      {
        id: 's2',
        name: 'Interview Prep',
        items: [
          { id: 'i5', text: 'Research common questions', completed: false },
          { id: 'i6', text: 'Practice mock interviews', completed: false },
          { id: 'i7', text: 'Prepare STAR examples', completed: false },
          { id: 'i8', text: 'Dress code ready', completed: false },
        ],
      },
      {
        id: 's3',
        name: 'First Day',
        items: [
          { id: 'i9', text: 'Know office location', completed: false },
          { id: 'i10', text: 'Reporting manager details', completed: false },
          { id: 'i11', text: 'Documents for joining', completed: false },
          { id: 'i12', text: 'Notebook & stationery', completed: false },
        ],
      },
    ],
  },
  {
    id: 'template-relocation',
    title: 'Relocation Checklist',
    description: 'Moving to a new city for studies or work',
    icon: 'Plane',
    category: 'Living',
    isTemplate: true,
    users: 560,
    sections: [
      {
        id: 's1',
        name: 'Before Moving',
        items: [
          { id: 'i1', text: 'Accommodation booked', completed: false },
          { id: 'i2', text: 'Travel tickets confirmed', completed: false },
          { id: 'i3', text: 'Important documents packed', completed: false },
          { id: 'i4', text: 'Bank/payment apps ready', completed: false },
        ],
      },
      {
        id: 's2',
        name: 'On Arrival',
        items: [
          { id: 'i5', text: 'Local SIM card', completed: false },
          { id: 'i6', text: 'Explore neighborhood', completed: false },
          { id: 'i7', text: 'Locate essentials (grocery, pharmacy)', completed: false },
          { id: 'i8', text: 'Set up workspace', completed: false },
        ],
      },
      {
        id: 's3',
        name: 'First Week',
        items: [
          { id: 'i9', text: 'Local registration if required', completed: false },
          { id: 'i10', text: 'Set routine', completed: false },
          { id: 'i11', text: 'Connect with peers/colleagues', completed: false },
          { id: 'i12', text: 'Emergency contacts saved', completed: false },
        ],
      },
    ],
  },
];

const ICON_MAP = {
  Home,
  GraduationCap,
  Briefcase,
  Plane,
  Package,
  ListChecks,
  Folder,
};

export default function Kit() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKit, setSelectedKit] = useState(null);
  
  // Data states
  const [customKits, setCustomKits] = useState(() => 
    loadFromStorage(STORAGE_KEYS.customKits, [])
  );
  const [savedKitIds, setSavedKitIds] = useState(() => 
    loadFromStorage(STORAGE_KEYS.savedKits, [])
  );
  const [kitProgress, setKitProgress] = useState(() => 
    loadFromStorage(STORAGE_KEYS.kitProgress, {})
  );

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [kitForm, setKitForm] = useState({
    title: '',
    description: '',
    icon: 'Package',
    category: 'Personal',
  });
  const [sectionForm, setSectionForm] = useState({ name: '' });
  const [itemForm, setItemForm] = useState({ text: '', sectionId: '' });

  // Save to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.customKits, customKits);
  }, [customKits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.savedKits, savedKitIds);
  }, [savedKitIds]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.kitProgress, kitProgress);
  }, [kitProgress]);

  // Get all kits (templates + custom)
  const allKits = [...TEMPLATE_KITS, ...customKits];

  // Filter kits
  const filteredKits = allKits.filter(kit => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return kit.title.toLowerCase().includes(q) || 
           kit.description.toLowerCase().includes(q) ||
           kit.category.toLowerCase().includes(q);
  });

  // Get kit with progress applied
  const getKitWithProgress = (kit) => {
    const progress = kitProgress[kit.id];
    if (!progress) return kit;
    
    return {
      ...kit,
      sections: kit.sections.map(section => ({
        ...section,
        items: section.items.map(item => ({
          ...item,
          completed: progress.completedItems?.includes(item.id) || false,
        })),
      })),
    };
  };

  // Calculate stats
  const calculateProgress = (kit) => {
    const withProgress = getKitWithProgress(kit);
    const totalItems = withProgress.sections.reduce((sum, s) => sum + s.items.length, 0);
    const completedItems = withProgress.sections.reduce(
      (sum, s) => sum + s.items.filter(i => i.completed).length, 
      0
    );
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getCompletedCount = (kit) => {
    const withProgress = getKitWithProgress(kit);
    return withProgress.sections.reduce(
      (sum, s) => sum + s.items.filter(i => i.completed).length, 
      0
    );
  };

  const getTotalItems = (kit) => {
    return kit.sections.reduce((sum, s) => sum + s.items.length, 0);
  };

  // Check if kit is saved
  const isKitSaved = (kitId) => savedKitIds.includes(kitId);

  // Toggle save
  const toggleSaveKit = (kitId, e) => {
    e?.stopPropagation();
    setSavedKitIds(prev => 
      prev.includes(kitId) 
        ? prev.filter(id => id !== kitId)
        : [...prev, kitId]
    );
  };

  // Toggle item completion
  const toggleItemComplete = (kitId, itemId) => {
    setKitProgress(prev => {
      const kitProg = prev[kitId] || { completedItems: [], startedAt: new Date().toISOString() };
      const completed = kitProg.completedItems || [];
      return {
        ...prev,
        [kitId]: {
          ...kitProg,
          completedItems: completed.includes(itemId)
            ? completed.filter(id => id !== itemId)
            : [...completed, itemId],
        },
      };
    });
  };

  // Kit CRUD
  const handleCreateKit = () => {
    setEditingKit(null);
    setKitForm({
      title: '',
      description: '',
      icon: 'Package',
      category: 'Personal',
    });
    setShowCreateModal(true);
  };

  const handleEditKit = (kit, e) => {
    e?.stopPropagation();
    setEditingKit(kit);
    setKitForm({
      title: kit.title,
      description: kit.description,
      icon: kit.icon,
      category: kit.category,
    });
    setShowCreateModal(true);
  };

  const handleSaveKit = (e) => {
    e.preventDefault();
    if (editingKit) {
      setCustomKits(prev => prev.map(k => 
        k.id === editingKit.id 
          ? { ...k, ...kitForm }
          : k
      ));
    } else {
      const newKit = {
        id: generateId(),
        ...kitForm,
        isTemplate: false,
        sections: [],
        createdAt: new Date().toISOString(),
      };
      setCustomKits(prev => [...prev, newKit]);
    }
    setShowCreateModal(false);
  };

  const handleDeleteKit = (kitId, e) => {
    e?.stopPropagation();
    if (confirm('Delete this kit? This cannot be undone.')) {
      setCustomKits(prev => prev.filter(k => k.id !== kitId));
      setKitProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[kitId];
        return newProgress;
      });
      if (selectedKit?.id === kitId) {
        setSelectedKit(null);
      }
    }
  };

  const handleDuplicateKit = (kit, e) => {
    e?.stopPropagation();
    const newKit = {
      ...kit,
      id: generateId(),
      title: `${kit.title} (Copy)`,
      isTemplate: false,
      sections: kit.sections.map(s => ({
        ...s,
        id: generateId(),
        items: s.items.map(i => ({
          ...i,
          id: generateId(),
          completed: false,
        })),
      })),
      createdAt: new Date().toISOString(),
    };
    setCustomKits(prev => [...prev, newKit]);
  };

  // Section CRUD
  const handleAddSection = () => {
    setSectionForm({ name: '' });
    setEditingSection(null);
    setShowAddSectionModal(true);
  };

  const handleEditSection = (section, e) => {
    e?.stopPropagation();
    setEditingSection(section);
    setSectionForm({ name: section.name });
    setShowAddSectionModal(true);
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    if (!selectedKit) return;

    if (editingSection) {
      // Update section
      if (selectedKit.isTemplate) {
        // For templates, we need to copy to custom first
        const customKit = customKits.find(k => k.id === selectedKit.id);
        if (customKit) {
          setCustomKits(prev => prev.map(k => 
            k.id === selectedKit.id 
              ? {
                  ...k,
                  sections: k.sections.map(s => 
                    s.id === editingSection.id ? { ...s, name: sectionForm.name } : s
                  ),
                }
              : k
          ));
          setSelectedKit(prev => ({
            ...prev,
            sections: prev.sections.map(s => 
              s.id === editingSection.id ? { ...s, name: sectionForm.name } : s
            ),
          }));
        }
      } else {
        setCustomKits(prev => prev.map(k => 
          k.id === selectedKit.id 
            ? {
                ...k,
                sections: k.sections.map(s => 
                  s.id === editingSection.id ? { ...s, name: sectionForm.name } : s
                ),
              }
            : k
        ));
        setSelectedKit(prev => ({
          ...prev,
          sections: prev.sections.map(s => 
            s.id === editingSection.id ? { ...s, name: sectionForm.name } : s
          ),
        }));
      }
    } else {
      // Add new section
      const newSection = {
        id: generateId(),
        name: sectionForm.name,
        items: [],
      };
      setCustomKits(prev => prev.map(k => 
        k.id === selectedKit.id 
          ? { ...k, sections: [...k.sections, newSection] }
          : k
      ));
      setSelectedKit(prev => ({
        ...prev,
        sections: [...prev.sections, newSection],
      }));
    }
    setShowAddSectionModal(false);
  };

  const handleDeleteSection = (sectionId, e) => {
    e?.stopPropagation();
    if (confirm('Delete this section and all its items?')) {
      setCustomKits(prev => prev.map(k => 
        k.id === selectedKit.id 
          ? { ...k, sections: k.sections.filter(s => s.id !== sectionId) }
          : k
      ));
      setSelectedKit(prev => ({
        ...prev,
        sections: prev.sections.filter(s => s.id !== sectionId),
      }));
    }
  };

  // Item CRUD
  const handleAddItem = (sectionId) => {
    setItemForm({ text: '', sectionId });
    setEditingItem(null);
    setShowAddItemModal(true);
  };

  const handleEditItem = (item, sectionId, e) => {
    e?.stopPropagation();
    setEditingItem(item);
    setItemForm({ text: item.text, sectionId });
    setShowAddItemModal(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!selectedKit) return;

    if (editingItem) {
      // Update item
      setCustomKits(prev => prev.map(k => 
        k.id === selectedKit.id 
          ? {
              ...k,
              sections: k.sections.map(s => 
                s.id === itemForm.sectionId 
                  ? {
                      ...s,
                      items: s.items.map(i => 
                        i.id === editingItem.id ? { ...i, text: itemForm.text } : i
                      ),
                    }
                  : s
              ),
            }
          : k
      ));
      setSelectedKit(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === itemForm.sectionId 
            ? {
                ...s,
                items: s.items.map(i => 
                  i.id === editingItem.id ? { ...i, text: itemForm.text } : i
                ),
              }
            : s
        ),
      }));
    } else {
      // Add new item
      const newItem = {
        id: generateId(),
        text: itemForm.text,
        completed: false,
      };
      setCustomKits(prev => prev.map(k => 
        k.id === selectedKit.id 
          ? {
              ...k,
              sections: k.sections.map(s => 
                s.id === itemForm.sectionId 
                  ? { ...s, items: [...s.items, newItem] }
                  : s
              ),
            }
          : k
      ));
      setSelectedKit(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === itemForm.sectionId 
            ? { ...s, items: [...s.items, newItem] }
            : s
        ),
      }));
    }
    setShowAddItemModal(false);
  };

  const handleDeleteItem = (sectionId, itemId, e) => {
    e?.stopPropagation();
    setCustomKits(prev => prev.map(k => 
      k.id === selectedKit.id 
        ? {
            ...k,
            sections: k.sections.map(s => 
              s.id === sectionId 
                ? { ...s, items: s.items.filter(i => i.id !== itemId) }
                : s
            ),
          }
        : k
    ));
    setSelectedKit(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId 
          ? { ...s, items: s.items.filter(i => i.id !== itemId) }
          : s
      ),
    }));
    // Also remove from progress
    setKitProgress(prev => ({
      ...prev,
      [selectedKit.id]: {
        ...prev[selectedKit.id],
        completedItems: (prev[selectedKit.id]?.completedItems || []).filter(id => id !== itemId),
      },
    }));
  };

  // Get icon component
  const getIconComponent = (iconName) => ICON_MAP[iconName] || Package;

  const tabs = [
    { id: 'browse', label: 'Browse Kits', icon: Package },
    { id: 'progress', label: 'My Progress', icon: CheckSquare },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'custom', label: 'My Kits', icon: Sparkles },
  ];

  const activeKitsInProgress = allKits.filter(kit => getCompletedCount(kit) > 0);
  const savedKits = allKits.filter(kit => isKitSaved(kit.id));

  return (
    <div className="kit-page">
      <div className="container">
        {/* Header */}
        <header className="kit-header">
          <div className="header-info">
            <div className="header-icon">
              <Package size={28} />
            </div>
            <div>
              <h1>Kit</h1>
              <p>{t('kit.subtitle')}</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <Search size={18} />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleCreateKit}>
              <Plus size={18} />
              {t('kit.createKit')}
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="kit-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setSelectedKit(null); }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="kit-content">
          {/* Browse View */}
          {activeTab === 'browse' && !selectedKit && (
            <div className="browse-view">
              {/* Quick Stats */}
              <div className="kit-stats-row">
                <div className="kit-stat-card">
                  <Package size={24} />
                  <div>
                    <span className="stat-value">{allKits.length}</span>
                    <span className="stat-label">Total Kits</span>
                  </div>
                </div>
                <div className="kit-stat-card">
                  <CheckSquare size={24} />
                  <div>
                    <span className="stat-value">{activeKitsInProgress.length}</span>
                    <span className="stat-label">In Progress</span>
                  </div>
                </div>
                <div className="kit-stat-card">
                  <Bookmark size={24} />
                  <div>
                    <span className="stat-value">{savedKits.length}</span>
                    <span className="stat-label">Saved</span>
                  </div>
                </div>
                <div className="kit-stat-card">
                  <Sparkles size={24} />
                  <div>
                    <span className="stat-value">{customKits.length}</span>
                    <span className="stat-label">Custom</span>
                  </div>
                </div>
              </div>

              {/* All Kits */}
              <section className="kits-section">
                <div className="section-header">
                  <h2>All Kits</h2>
                </div>
                {filteredKits.length === 0 ? (
                  <div className="empty-state-large">
                    <Package size={48} />
                    <h3>No kits found</h3>
                    <p>Try a different search or create your own kit</p>
                  </div>
                ) : (
                  <div className="kits-grid">
                    {filteredKits.map((kit) => {
                      const IconComponent = getIconComponent(kit.icon);
                      const progress = calculateProgress(kit);
                      return (
                        <div 
                          key={kit.id} 
                          className="kit-card"
                          onClick={() => setSelectedKit(getKitWithProgress(kit))}
                        >
                          <div className="kit-card-header">
                            <div className="kit-icon">
                              <IconComponent size={24} />
                            </div>
                            <div className="kit-card-actions">
                              {!kit.isTemplate && (
                                <>
                                  <button 
                                    className="icon-btn"
                                    onClick={(e) => handleEditKit(kit, e)}
                                    title="Edit"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button 
                                    className="icon-btn danger"
                                    onClick={(e) => handleDeleteKit(kit.id, e)}
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                              <button 
                                className="icon-btn"
                                onClick={(e) => handleDuplicateKit(kit, e)}
                                title="Duplicate"
                              >
                                <Copy size={16} />
                              </button>
                              <button 
                                className={`save-btn ${isKitSaved(kit.id) ? 'saved' : ''}`}
                                onClick={(e) => toggleSaveKit(kit.id, e)}
                              >
                                {isKitSaved(kit.id) ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                              </button>
                            </div>
                          </div>
                          <h3>{kit.title}</h3>
                          <p>{kit.description}</p>
                          <div className="kit-meta">
                            <span><CheckSquare size={14} /> {getTotalItems(kit)} items</span>
                            {kit.isTemplate && (
                              <span><Users size={14} /> {kit.users?.toLocaleString()}</span>
                            )}
                            {kit.category && (
                              <span className="kit-category">{kit.category}</span>
                            )}
                          </div>
                          {progress > 0 && (
                            <div className="kit-progress">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span>{progress}% complete</span>
                            </div>
                          )}
                          <button className="kit-cta">
                            {progress > 0 ? 'Continue' : 'Start Kit'}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Kit Detail View */}
          {selectedKit && (
            <div className="kit-detail-view">
              <button 
                className="back-btn"
                onClick={() => setSelectedKit(null)}
              >
                <ChevronLeft size={18} />
                Back to Kits
              </button>

              <div className="kit-detail-header">
                <div className="kit-detail-icon">
                  {(() => {
                    const IconComponent = getIconComponent(selectedKit.icon);
                    return <IconComponent size={32} />;
                  })()}
                </div>
                <div className="kit-detail-info">
                  <h2>{selectedKit.title}</h2>
                  <p>{selectedKit.description}</p>
                </div>
                <div className="kit-detail-progress">
                  <div className="progress-ring">
                    <svg viewBox="0 0 36 36">
                      <path
                        className="ring-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="ring-progress"
                        strokeDasharray={`${calculateProgress(selectedKit)}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span>{calculateProgress(selectedKit)}%</span>
                  </div>
                  <div className="progress-stats">
                    {getCompletedCount(selectedKit)} / {getTotalItems(selectedKit)} items
                  </div>
                </div>
              </div>

              {!selectedKit.isTemplate && (
                <div className="kit-detail-actions">
                  <button className="btn btn-secondary btn-sm" onClick={handleAddSection}>
                    <Plus size={16} />
                    Add Section
                  </button>
                </div>
              )}

              <div className="checklist-sections">
                {selectedKit.sections.length === 0 ? (
                  <div className="empty-state-large">
                    <ListChecks size={48} />
                    <h3>No sections yet</h3>
                    <p>Add sections and items to your kit</p>
                    {!selectedKit.isTemplate && (
                      <button className="btn btn-primary" onClick={handleAddSection}>
                        <Plus size={18} />
                        Add First Section
                      </button>
                    )}
                  </div>
                ) : (
                  selectedKit.sections.map((section) => (
                    <div key={section.id} className="checklist-section">
                      <div className="section-header">
                        <h3>{section.name}</h3>
                        {!selectedKit.isTemplate && (
                          <div className="section-actions">
                            <button 
                              className="icon-btn"
                              onClick={(e) => handleEditSection(section, e)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="icon-btn danger"
                              onClick={(e) => handleDeleteSection(section.id, e)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="checklist-items">
                        {section.items.map((item) => {
                          const isCompleted = kitProgress[selectedKit.id]?.completedItems?.includes(item.id) || item.completed;
                          return (
                            <div key={item.id} className={`checklist-item ${isCompleted ? 'completed' : ''}`}>
                              <button 
                                className="checkbox"
                                onClick={() => toggleItemComplete(selectedKit.id, item.id)}
                              >
                                {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                              </button>
                              <span>{item.text}</span>
                              {!selectedKit.isTemplate && (
                                <div className="item-actions">
                                  <button 
                                    className="icon-btn"
                                    onClick={(e) => handleEditItem(item, section.id, e)}
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    className="icon-btn danger"
                                    onClick={(e) => handleDeleteItem(section.id, item.id, e)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {!selectedKit.isTemplate && (
                        <button 
                          className="add-item-btn"
                          onClick={() => handleAddItem(section.id)}
                        >
                          <Plus size={16} />
                          Add Item
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {selectedKit.isTemplate && (
                <div className="template-notice">
                  <Star size={18} />
                  <p>This is a template kit. <button onClick={(e) => { handleDuplicateKit(selectedKit, e); setSelectedKit(null); }}>Make a copy</button> to customize it.</p>
                </div>
              )}
            </div>
          )}

          {/* Progress View */}
          {activeTab === 'progress' && !selectedKit && (
            <div className="progress-view">
              <h2>Your Active Kits</h2>
              {activeKitsInProgress.length === 0 ? (
                <div className="empty-state-large">
                  <CheckSquare size={48} />
                  <h3>No active kits</h3>
                  <p>Start a kit from the Browse tab to track your progress here.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('browse')}>
                    Browse Kits
                  </button>
                </div>
              ) : (
                <div className="active-kits-list">
                  {activeKitsInProgress.map((kit) => {
                    const IconComponent = getIconComponent(kit.icon);
                    const progress = calculateProgress(kit);
                    return (
                      <div 
                        key={kit.id} 
                        className="active-kit-card"
                        onClick={() => setSelectedKit(getKitWithProgress(kit))}
                      >
                        <div className="active-kit-icon">
                          <IconComponent size={24} />
                        </div>
                        <div className="active-kit-info">
                          <h3>{kit.title}</h3>
                          <p>{getCompletedCount(kit)} of {getTotalItems(kit)} items completed</p>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <button className="btn btn-primary btn-sm">Continue</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Saved View */}
          {activeTab === 'saved' && !selectedKit && (
            <div className="saved-view">
              <h2>Saved Kits</h2>
              {savedKits.length === 0 ? (
                <div className="empty-state-large">
                  <Bookmark size={48} />
                  <h3>No saved kits</h3>
                  <p>Save kits you want to try later by clicking the bookmark icon.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('browse')}>
                    Browse Kits
                  </button>
                </div>
              ) : (
                <div className="saved-kits-list">
                  {savedKits.map((kit) => {
                    const IconComponent = getIconComponent(kit.icon);
                    return (
                      <div 
                        key={kit.id} 
                        className="saved-kit-card"
                        onClick={() => setSelectedKit(getKitWithProgress(kit))}
                      >
                        <div className="saved-kit-icon">
                          <IconComponent size={24} />
                        </div>
                        <div className="saved-kit-info">
                          <h3>{kit.title}</h3>
                          <p>{kit.description}</p>
                        </div>
                        <button 
                          className="save-btn saved"
                          onClick={(e) => toggleSaveKit(kit.id, e)}
                        >
                          <BookmarkCheck size={20} />
                        </button>
                        <button className="btn btn-secondary btn-sm">Start</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Custom Kits View */}
          {activeTab === 'custom' && !selectedKit && (
            <div className="custom-view">
              <div className="custom-header">
                <h2>My Custom Kits</h2>
                <button className="btn btn-primary" onClick={handleCreateKit}>
                  <Plus size={18} />
                  Create Kit
                </button>
              </div>
              {customKits.length === 0 ? (
                <div className="empty-state-large">
                  <Sparkles size={48} />
                  <h3>No custom kits yet</h3>
                  <p>Create your own personalized checklists for anything</p>
                  <button className="btn btn-primary" onClick={handleCreateKit}>
                    <Plus size={18} />
                    Create First Kit
                  </button>
                </div>
              ) : (
                <div className="kits-grid">
                  {customKits.map((kit) => {
                    const IconComponent = getIconComponent(kit.icon);
                    const progress = calculateProgress(kit);
                    return (
                      <div 
                        key={kit.id} 
                        className="kit-card"
                        onClick={() => setSelectedKit(getKitWithProgress(kit))}
                      >
                        <div className="kit-card-header">
                          <div className="kit-icon">
                            <IconComponent size={24} />
                          </div>
                          <div className="kit-card-actions">
                            <button 
                              className="icon-btn"
                              onClick={(e) => handleEditKit(kit, e)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="icon-btn danger"
                              onClick={(e) => handleDeleteKit(kit.id, e)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <h3>{kit.title}</h3>
                        <p>{kit.description}</p>
                        <div className="kit-meta">
                          <span><CheckSquare size={14} /> {getTotalItems(kit)} items</span>
                          <span className="kit-category">{kit.category}</span>
                        </div>
                        {progress > 0 && (
                          <div className="kit-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span>{progress}% complete</span>
                          </div>
                        )}
                        <button className="kit-cta">
                          {progress > 0 ? 'Continue' : 'Start Kit'}
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Kit Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingKit ? 'Edit Kit' : 'Create New Kit'}</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveKit}>
              <div className="form-group">
                <label htmlFor="kit-title">Title</label>
                <input
                  type="text"
                  id="kit-title"
                  value={kitForm.title}
                  onChange={(e) => setKitForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Weekend Trip Checklist"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="kit-description">Description</label>
                <textarea
                  id="kit-description"
                  value={kitForm.description}
                  onChange={(e) => setKitForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this kit for?"
                  rows="2"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="kit-icon">Icon</label>
                  <select
                    id="kit-icon"
                    value={kitForm.icon}
                    onChange={(e) => setKitForm(prev => ({ ...prev, icon: e.target.value }))}
                  >
                    <option value="Package">📦 Package</option>
                    <option value="Home">🏠 Home</option>
                    <option value="GraduationCap">🎓 Education</option>
                    <option value="Briefcase">💼 Work</option>
                    <option value="Plane">✈️ Travel</option>
                    <option value="ListChecks">✅ Checklist</option>
                    <option value="Folder">📁 General</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="kit-category">Category</label>
                  <select
                    id="kit-category"
                    value={kitForm.category}
                    onChange={(e) => setKitForm(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Living">Living</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingKit ? 'Save Changes' : 'Create Kit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Section Modal */}
      {showAddSectionModal && (
        <div className="modal-overlay" onClick={() => setShowAddSectionModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSection ? 'Edit Section' : 'Add Section'}</h2>
              <button className="modal-close" onClick={() => setShowAddSectionModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveSection}>
              <div className="form-group">
                <label htmlFor="section-name">Section Name</label>
                <input
                  type="text"
                  id="section-name"
                  value={sectionForm.name}
                  onChange={(e) => setSectionForm({ name: e.target.value })}
                  placeholder="e.g., Documents"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSectionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSection ? 'Save' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay" onClick={() => setShowAddItemModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add Item'}</h2>
              <button className="modal-close" onClick={() => setShowAddItemModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="modal-form" onSubmit={handleSaveItem}>
              <div className="form-group">
                <label htmlFor="item-text">Item Text</label>
                <input
                  type="text"
                  id="item-text"
                  value={itemForm.text}
                  onChange={(e) => setItemForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="e.g., Pack passport"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddItemModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
