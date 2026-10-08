import React, { useState, useEffect } from 'react';
import {
  X,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { GalleryCategory } from '../types/village';

const TABS = [
  { id: 'overview', label: 'Identity & About' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'governance', label: 'Wards & Admin' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'news', label: 'News & Notices' },
  { id: 'map', label: 'Map & API' },
  { id: 'submissions', label: 'Inbox' },
  { id: 'json', label: 'JSON Export / Import' },
];

export const AdminEditorModal: React.FC = () => {
  const {
    data,
    updateData,
    resetData,
    exportDataJson,
    importDataJson,
    submissions,
    clearSubmissions,
    isAdminAuthenticated,
    logoutAdmin,
    isAdminOpen,
    setIsAdminOpen,
    activeAdminTab,
    setActiveAdminTab,
  } = useVillage();

  const [rawJsonText, setRawJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Gallery Photo form state
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoTitleHi, setNewPhotoTitleHi] = useState('');
  const [newPhotoCategory, setNewPhotoCategory] =
    useState<Exclude<GalleryCategory, 'All'>>('Village');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // New News Item form state
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsTitleHi, setNewNewsTitleHi] = useState('');
  const [newNewsCategory, setNewNewsCategory] = useState('Village Development');
  const [newNewsDate, setNewNewsDate] = useState('October 2026');
  const [newNewsSummary, setNewNewsSummary] = useState('');

  useEffect(() => {
    if (isAdminOpen && activeAdminTab === 'json') {
      setRawJsonText(exportDataJson());
    }
  }, [isAdminOpen, activeAdminTab]);

  if (!isAdminAuthenticated || !isAdminOpen) return null;

  const flashStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([exportDataJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'village.json';
    a.click();
    URL.revokeObjectURL(url);
    flashStatus('Downloaded village.json');
  };

  const handleImportJson = () => {
    const res = importDataJson(rawJsonText);
    if (res.success) {
      flashStatus('Village JSON configuration imported and saved locally!');
    } else {
      flashStatus(`Error: ${res.error}`);
    }
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;
    const nextItem = {
      id: `gal-${Date.now()}`,
      title: newPhotoTitle.trim(),
      titleHi: newPhotoTitleHi.trim() || newPhotoTitle.trim(),
      category: newPhotoCategory,
      image: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || newPhotoTitle.trim(),
    };
    updateData({
      ...data,
      gallery: [nextItem, ...data.gallery],
    });
    setNewPhotoTitle('');
    setNewPhotoTitleHi('');
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    flashStatus('Added photo to Village Gallery');
  };

  const handleAddNewsItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim() || !newNewsSummary.trim()) return;
    const nextNews = {
      id: `news-${Date.now()}`,
      title: newNewsTitle.trim(),
      titleHi: newNewsTitleHi.trim() || newNewsTitle.trim(),
      category: newNewsCategory,
      date: newNewsDate.trim() || 'Recent',
      summary: newNewsSummary.trim(),
      priority: 'Community',
    };
    updateData({
      ...data,
      newsUpdates: [nextNews, ...data.newsUpdates],
    });
    setNewNewsTitle('');
    setNewNewsTitleHi('');
    setNewNewsSummary('');
    flashStatus('Published new village notice');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-modal-title"
    >
      <div className="w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl border border-stone-200 dark:border-white/15 bg-[#FAF7F0] dark:bg-[#0B1920] text-stone-900 dark:text-stone-100 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-white/10 flex items-center justify-between gap-4 bg-white dark:bg-[#071318]">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" />
            <div>
              <h2 id="cms-modal-title" className="text-lg sm:text-xl font-bold font-display">
                Merha Village Content Studio (स्थानीय संपादन प्रणाली)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                100% Firebase-Free Architecture · LocalStorage + JSON Config + Custom REST API Ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetData();
                flashStatus('Reset all content to default /src/data/village.json');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset to default village.json"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-lg border border-red-500/30 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Logout
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              aria-label="Close Content Studio"
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 border-b border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-[#0D1E25] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveAdminTab(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeAdminTab === t.id
                  ? 'bg-amber-500 text-stone-950 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-white/10'
              }`}
            >
              {t.label}
              {t.id === 'submissions' && submissions.length > 0
                ? ` (${submissions.length})`
                : ''}
            </button>
          ))}
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & ABOUT */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                    Village Title (English)
                  </label>
                  <input
                    type="text"
                    value={data.identity.nameEn}
                    onChange={(e) =>
                      updateData({
                        ...data,
                        identity: { ...data.identity, nameEn: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                    Location Subtitle (Hindi)
                  </label>
                  <input
                    type="text"
                    value={data.identity.fullLocationHi}
                    onChange={(e) =>
                      updateData({
                        ...data,
                        identity: { ...data.identity, fullLocationHi: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                  Hero Tagline (Hindi)
                </label>
                <input
                  type="text"
                  value={data.identity.taglineHi}
                  onChange={(e) =>
                    updateData({
                      ...data,
                      identity: { ...data.identity, taglineHi: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
                  About Merha Overview Paragraph
                </label>
                <textarea
                  rows={4}
                  value={data.about.overview}
                  onChange={(e) =>
                    updateData({
                      ...data,
                      about: { ...data.about, overview: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 2: STATISTICS */}
          {activeAdminTab === 'statistics' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Keep village counters accurate—adjust numbers and notes below so unverified figures are never displayed as fact.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.statistics.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{stat.label}</span>
                      <span className="text-xs font-hindi text-amber-500">{stat.labelHi}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Counter Number
                        </label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...data.statistics];
                            updated[idx] = {
                              ...stat,
                              value: Number(e.target.value) || 0,
                            };
                            updateData({ ...data, statistics: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-sm font-mono-tabular"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Unit / Suffix
                        </label>
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => {
                            const updated = [...data.statistics];
                            updated[idx] = { ...stat, suffix: e.target.value };
                            updateData({ ...data, statistics: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WARDS & LOCAL ADMINISTRATION */}
          {activeAdminTab === 'governance' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-bold font-display mb-3">
                  Wards Configuration (Ward No. 1 & Ward No. 2)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.wards.map((ward, idx) => (
                    <div
                      key={ward.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] space-y-3"
                    >
                      <p className="text-sm font-bold text-amber-500">{ward.titleEn}</p>
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">
                          Ward Member / Representative Name
                        </label>
                        <input
                          type="text"
                          value={ward.representativeName}
                          onChange={(e) => {
                            const nextWards = [...data.wards];
                            nextWards[idx] = {
                              ...ward,
                              representativeName: e.target.value,
                            };
                            updateData({ ...data, wards: nextWards });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-stone-400 mb-1">
                          Area Description
                        </label>
                        <input
                          type="text"
                          value={ward.areaLabel}
                          onChange={(e) => {
                            const nextWards = [...data.wards];
                            nextWards[idx] = { ...ward, areaLabel: e.target.value };
                            updateData({ ...data, wards: nextWards });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold font-display mb-3">
                  Local Administration Directory (Panchayat, Block, District, Constituency)
                </h3>
                <div className="space-y-3">
                  {data.administration.map((adm, idx) => (
                    <div
                      key={adm.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <div>
                        <p className="text-xs text-amber-500 font-medium">{adm.roleEn}</p>
                        <p className="text-xs text-stone-400">{adm.jurisdiction}</p>
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Representative / Office Holder
                        </label>
                        <input
                          type="text"
                          value={adm.holderName}
                          onChange={(e) => {
                            const nextAdm = [...data.administration];
                            nextAdm[idx] = { ...adm, holderName: e.target.value };
                            updateData({ ...data, administration: nextAdm });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          Contact / Office Note
                        </label>
                        <input
                          type="text"
                          value={adm.contactInfo}
                          onChange={(e) => {
                            const nextAdm = [...data.administration];
                            nextAdm[idx] = { ...adm, contactInfo: e.target.value };
                            updateData({ ...data, administration: nextAdm });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY MANAGER */}
          {activeAdminTab === 'gallery' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddGalleryItem}
                className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3"
              >
                <h3 className="text-sm font-bold">Add New Photo to Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Title (English) *"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Title (Hindi)"
                    value={newPhotoTitleHi}
                    onChange={(e) => setNewPhotoTitleHi(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                  <select
                    value={newPhotoCategory}
                    onChange={(e) =>
                      setNewPhotoCategory(e.target.value as Exclude<GalleryCategory, 'All'>)
                    }
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  >
                    <option value="Village">Village</option>
                    <option value="River">River</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Nature">Nature</option>
                    <option value="Hills">Hills</option>
                    <option value="Fields">Fields</option>
                    <option value="Festivals">Festivals</option>
                    <option value="School">School</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Image URL or /public/... path *"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Caption description"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </form>

              <div className="space-y-2.5">
                {data.gallery.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-amber-500 font-semibold">{item.category}</span>
                        <span>·</span>
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const updated = [...data.gallery];
                          updated[idx] = { ...item, image: e.target.value };
                          updateData({ ...data, gallery: updated });
                        }}
                        className="w-full px-2.5 py-1 rounded border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#0D1E25] text-xs font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        updateData({
                          ...data,
                          gallery: data.gallery.filter((g) => g.id !== item.id),
                        });
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg self-end sm:self-center cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NEWS & UPDATES */}
          {activeAdminTab === 'news' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAddNewsItem}
                className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3"
              >
                <h3 className="text-sm font-bold">Publish New Village Notice</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Headline (English) *"
                    value={newNewsTitle}
                    onChange={(e) => setNewNewsTitle(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Headline (Hindi)"
                    value={newNewsTitleHi}
                    onChange={(e) => setNewNewsTitleHi(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Category (e.g. Road & Bridge, School Updates)"
                    value={newNewsCategory}
                    onChange={(e) => setNewNewsCategory(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Date / Month"
                    value={newNewsDate}
                    onChange={(e) => setNewNewsDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                  />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary details of the village announcement *"
                  value={newNewsSummary}
                  onChange={(e) => setNewNewsSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-white dark:bg-[#071318] text-xs"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </form>

              <div className="space-y-2.5">
                {data.newsUpdates.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-xs text-amber-500">
                        {n.category} · {n.date}
                      </p>
                      <p className="text-sm font-bold mt-0.5">{n.title}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {n.summary}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateData({
                          ...data,
                          newsUpdates: data.newsUpdates.filter((item) => item.id !== n.id),
                        })
                      }
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MAP & CUSTOM API ENDPOINT */}
          {activeAdminTab === 'map' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] space-y-4">
                <h3 className="text-sm font-bold">Village Map Configuration</h3>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    Google Maps Embed URL
                  </label>
                  <input
                    type="text"
                    value={data.mapConfig.embedUrl}
                    onChange={(e) =>
                      updateData({
                        ...data,
                        mapConfig: { ...data.mapConfig, embedUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">
                    External Maps Search Link
                  </label>
                  <input
                    type="text"
                    value={data.mapConfig.externalMapsLink}
                    onChange={(e) =>
                      updateData({
                        ...data,
                        mapConfig: {
                          ...data.mapConfig,
                          externalMapsLink: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318] space-y-4">
                <h3 className="text-sm font-bold">
                  Contact Form Custom REST API / Webhook Endpoint (No Firebase)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Optionally provide a Formspree URL, custom Node/Next API route, or webhook URL to receive JSON POST requests whenever a villager submits the contact form.
                </p>
                <input
                  type="url"
                  placeholder="https://your-custom-api.example.com/api/merha-suggestions"
                  value={data.contactConfig.customEndpointUrl}
                  onChange={(e) =>
                    updateData({
                      ...data,
                      contactConfig: {
                        ...data.contactConfig,
                        customEndpointUrl: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#0D1E25] text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT SUBMISSIONS INBOX */}
          {activeAdminTab === 'submissions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Local suggestions stored in browser LocalStorage ({submissions.length} total).
                </p>
                {submissions.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSubmissions}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 rounded-xl border border-stone-200 dark:border-white/10 text-center text-sm text-stone-500">
                  No contact suggestions submitted yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#071318]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-500">
                        <span>{sub.topic}</span>
                        <span className="font-mono-tabular">{sub.createdAt}</span>
                      </div>
                      <p className="text-sm font-bold mt-1">
                        {sub.name} &nbsp;·&nbsp;{' '}
                        <span className="font-normal text-stone-500">{sub.contact}</span>
                      </p>
                      <p className="text-sm text-stone-700 dark:text-stone-300 mt-2">
                        {sub.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: RAW JSON EXPORT / IMPORT */}
          {activeAdminTab === 'json' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Copy or download this JSON to replace <code>/src/data/village.json</code> in your repository for permanent static deployment on Vercel, Netlify, or GitHub Pages.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadJson}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 text-stone-950 font-semibold text-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download village.json</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleImportJson}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-500/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold text-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Apply Edited JSON</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={16}
                value={rawJsonText}
                onChange={(e) => setRawJsonText(e.target.value)}
                className="w-full p-4 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-950 text-emerald-300 font-mono text-xs leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
