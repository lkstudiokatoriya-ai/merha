import React, { useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Newspaper,
  MapPin,
  Inbox,
  LogOut,
  Eye,
  Edit3,
  CheckCircle2,
  CloudUpload,
  RotateCcw,
  Lock,
  Sparkles,
  Upload,
} from 'lucide-react';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useVillage } from '../context/VillageContext';
import { GalleryCategory } from '../types/village';

// Helper to compress an uploaded image file into a compact DataURL so it fits cleanly inside Firestore (< 1MB doc limit)
function compressImageFile(file: File, maxWidth = 1000, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const AdminSplitStudio: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data,
    updateData,
    saveToFirebase,
    hasUnsavedChanges,
    isSavingCloud,
    resetData,
    submissions,
    clearSubmissions,
    isAdminAuthenticated,
    isFirebaseAdmin,
    firebaseUser,
    signInWithGoogleAdmin,
    loginAdmin,
    logoutAdmin,
    exitAdminWorkspace,
    isInlineEditMode,
    setIsInlineEditMode,
  } = useVillage();

  const [rightTab, setRightTab] = useState<
    'photos' | 'news' | 'places' | 'map' | 'inbox'
  >('photos');

  // Login form state when visiting /admin unauthenticated
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Add New Photo state
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoTitleHi, setPhotoTitleHi] = useState('');
  const [photoCategory, setPhotoCategory] =
    useState<Exclude<GalleryCategory, 'All'>>('Village');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Add New News/Update state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsTitleHi, setNewsTitleHi] = useState('');
  const [newsCategory, setNewsCategory] = useState('Village Development');
  const [newsDate, setNewsDate] = useState('October 2026');
  const [newsSummary, setNewsSummary] = useState('');

  // Add New Important Place state
  const [placeNameEn, setPlaceNameEn] = useState('');
  const [placeNameHi, setPlaceNameHi] = useState('');
  const [placeRelation, setPlaceRelation] = useState('Nearby Locality');
  const [placeDesc, setPlaceDesc] = useState('');
  const [placeImage, setPlaceImage] = useState('');

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 4500);
  };

  const handleSaveAll = async () => {
    try {
      const res = await saveToFirebase();
      showToast(res.message);
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : 'Error saving to Firebase Cloud.'
      );
    }
  };

  const handlePhotoFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onResult: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      // First attempt uploading to merha-d99f3.firebasestorage.app
      try {
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const fileRef = storageRef(
          storage,
          `merha_village/${Date.now()}_${cleanName}`
        );
        await uploadBytes(fileRef, file);
        const downloadUrl = await getDownloadURL(fileRef);
        onResult(downloadUrl);
        showToast('Photo uploaded to Firebase Storage (merha-d99f3)!');
        setUploadingFile(false);
        return;
      } catch {
        // Fallback to high-speed compressed DataURL stored directly in Firestore
        const compressed = await compressImageFile(file);
        onResult(compressed);
        showToast('Photo processed & ready! Click Add or Save Changes.');
      }
    } catch {
      showToast('Failed to process image file.');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;
    const newItem = {
      id: `gal-${Date.now()}`,
      title: photoTitle.trim(),
      titleHi: photoTitleHi.trim() || photoTitle.trim(),
      category: photoCategory,
      image: photoUrl.trim(),
      caption: photoCaption.trim() || photoTitle.trim(),
    };
    updateData({
      ...data,
      gallery: [newItem, ...data.gallery],
    });
    setPhotoTitle('');
    setPhotoTitleHi('');
    setPhotoUrl('');
    setPhotoCaption('');
    showToast('Photo added to gallery! Click "Save Changes" to publish.');
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsSummary.trim()) return;
    const newNotice = {
      id: `news-${Date.now()}`,
      title: newsTitle.trim(),
      titleHi: newsTitleHi.trim() || newsTitle.trim(),
      category: newsCategory.trim() || 'Update',
      date: newsDate.trim() || 'Recent',
      summary: newsSummary.trim(),
      priority: 'Important',
    };
    updateData({
      ...data,
      newsUpdates: [newNotice, ...data.newsUpdates],
    });
    setNewsTitle('');
    setNewsTitleHi('');
    setNewsSummary('');
    showToast('Notice added! Click "Save Changes" to publish.');
  };

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeNameEn.trim() || !placeDesc.trim()) return;
    const nextPlace = {
      id: `place-${Date.now()}`,
      nameEn: placeNameEn.trim(),
      nameHi: placeNameHi.trim() || placeNameEn.trim(),
      relation: placeRelation.trim() || 'Merha Landmark',
      description: placeDesc.trim(),
      image:
        placeImage.trim() ||
        '/src/assets/images/merha_hero_landscape_1791458712697.jpg',
      featured: false,
    };
    updateData({
      ...data,
      importantPlaces: [...data.importantPlaces, nextPlace],
    });
    setPlaceNameEn('');
    setPlaceNameHi('');
    setPlaceDesc('');
    setPlaceImage('');
    showToast('New place added! Click "Save Changes" to publish.');
  };

  // If visiting /admin and not yet authenticated, show the dedicated /admin Login Screen
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071318] text-[#F4F1EA] p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0D1E25] p-7 sm:p-9 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png"
              alt="Merha Village Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-amber-500/50"
            />
            <div>
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold">
                /admin · Official Portal Studio
              </span>
              <h1 className="text-2xl font-bold font-display text-white">
                Merha Village Admin Login
              </h1>
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Sign in to access the <strong>Split-Screen Live Website Editor</strong> (Left: Inline Editable Website · Right: Photos, News & New Items + Firebase Cloud Save).
          </p>

          {/* Google Firebase Admin Login */}
          <button
            type="button"
            onClick={async () => {
              setAuthError(null);
              const res = await signInWithGoogleAdmin();
              if (!res.success && res.error) {
                setAuthError(res.error);
              }
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-white text-stone-950 font-semibold text-xs sm:text-sm hover:bg-stone-100 transition-colors cursor-pointer shadow"
          >
            <CloudUpload className="w-4 h-4 text-amber-600" />
            <span>Sign in with Google (Firebase Cloud Admin)</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-stone-400">
              Or Admin Credentials
            </span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdmin(email, password);
              if (!ok) {
                setAuthError('Invalid admin email or password.');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs text-stone-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lalankumarbnk17@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#071318] text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#071318] text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-2.5">
                {authError}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={exitAdminWorkspace}
                className="px-4 py-2.5 rounded-xl border border-white/15 text-xs text-stone-300 hover:bg-white/5 cursor-pointer"
              >
                ← Back to Public Website
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Login to /admin</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#050E12] text-[#F4F1EA]">
      {/* TOP ADMIN STUDIO BAR */}
      <header className="h-14 shrink-0 px-4 border-b border-white/15 bg-[#071318] flex items-center justify-between gap-3 z-50">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png"
            alt="Merha Logo"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-amber-400"
          />
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-display text-white">
                MERHA /admin STUDIO
              </span>
              <span className="hidden sm:inline-block text-[11px] text-amber-400">
                · Left: Live Editable Website &nbsp;|&nbsp; Right: Photos, Add New & Cloud Sync
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Studio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsInlineEditMode(!isInlineEditMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              isInlineEditMode
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-white/15 bg-white/5 text-stone-300'
            }`}
            title="Toggle dashed inline text boxes on the website preview"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isInlineEditMode ? 'Inline Text Edit: ON' : 'Preview Mode'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSavingCloud}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-lg ${
              hasUnsavedChanges
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 ring-2 ring-amber-300/60'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>
              {isSavingCloud
                ? 'Saving...'
                : hasUnsavedChanges
                ? 'Save Changes'
                : 'Saved'}
            </span>
          </button>

          <button
            type="button"
            onClick={exitAdminWorkspace}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 text-xs text-stone-200 cursor-pointer"
            title="View public website"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Public Site</span>
          </button>

          <button
            type="button"
            onClick={logoutAdmin}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/15 text-xs text-red-400 cursor-pointer"
            title="Logout of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* SAVE TOAST NOTIFICATION */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* SPLIT-SCREEN WORKSPACE: LEFT = LIVE EDITABLE WEBSITE, RIGHT = PHOTO / ADD NEW / CLOUD MANAGER */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT SIDE: ACTUAL WEBSITE WITH INLINE EDITABLE TEXT */}
        <div className="flex-1 lg:w-[60%] xl:w-[64%] h-full overflow-y-auto border-b lg:border-b-0 lg:border-r border-white/15 relative">
          <div className="sticky top-0 z-30 bg-amber-500/95 text-stone-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                LIVE WEBSITE TEXT EDITOR — Click on any dashed text box below to edit directly on the website, then click "Save Changes"
              </span>
            </span>
          </div>
          {children}
        </div>

        {/* RIGHT SIDE: PHOTO UPLOAD, ADD NEW ITEMS, NEWS, PLACES & FIREBASE SYNC */}
        <aside className="w-full lg:w-[40%] xl:w-[36%] h-full overflow-y-auto bg-[#09181F] flex flex-col">
          {/* Firebase Cloud Status Banner */}
          <div className="p-4 border-b border-white/10 bg-[#0D1E25] flex items-center justify-between gap-3">
            <div className="text-xs">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <CloudUpload className="w-4 h-4 text-amber-400" />
                <span>
                  Firebase Project: <code className="text-amber-300">merha-d99f3</code>
                </span>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {isFirebaseAdmin
                  ? `Signed in as ${firebaseUser?.email} · Live Firestore & Analytics active`
                  : 'Connected to merha-d99f3 (Firestore, Storage & Analytics G-SVQC69EY2Y)'}
              </p>
            </div>
            {!isFirebaseAdmin && (
              <button
                type="button"
                onClick={async () => {
                  const res = await signInWithGoogleAdmin();
                  if (res.success) {
                    showToast('Connected to Firebase Cloud as Admin!');
                  } else if (res.error) {
                    showToast(res.error);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs whitespace-nowrap cursor-pointer shrink-0"
              >
                Connect Google
              </button>
            )}
          </div>

          {/* Right Panel Category Tabs */}
          <div className="px-4 py-2.5 border-b border-white/10 bg-[#071318] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              type="button"
              onClick={() => setRightTab('photos')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                rightTab === 'photos'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos & Gallery</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab('news')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                rightTab === 'news'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>Add News / Notice</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab('places')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                rightTab === 'places'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Places & Highlights</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab('map')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                rightTab === 'map'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <span>Map & Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setRightTab('inbox')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer ${
                rightTab === 'inbox'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-300 hover:bg-white/5'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbox ({submissions.length})</span>
            </button>
          </div>

          {/* Right Panel Content Area */}
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            {/* TAB 1: PHOTOS & GALLERY MANAGER */}
            {rightTab === 'photos' && (
              <div className="space-y-6">
                {/* Hero Banner Photo Changer */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0D1E25] space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                    Hero Background Image
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={data.identity.heroImage}
                      onChange={(e) =>
                        updateData({
                          ...data,
                          identity: {
                            ...data.identity,
                            heroImage: e.target.value,
                          },
                        })
                      }
                      placeholder="Image URL or upload below"
                      className="flex-1 px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs font-mono text-white"
                    />
                    <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-medium cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoFileUpload(e, (dataUrl) =>
                            updateData({
                              ...data,
                              identity: {
                                ...data.identity,
                                heroImage: dataUrl,
                              },
                            })
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Add New Photo to Village Gallery */}
                <form
                  onSubmit={handleAddPhoto}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3"
                >
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Add New Photo to Village Gallery</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Photo Title (English) *"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Photo Title (Hindi)"
                      value={photoTitleHi}
                      onChange={(e) => setPhotoTitleHi(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <select
                      value={photoCategory}
                      onChange={(e) =>
                        setPhotoCategory(
                          e.target.value as Exclude<GalleryCategory, 'All'>
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    >
                      <option value="Village">Village (गांव)</option>
                      <option value="River">River (कुरार नदी)</option>
                      <option value="Bridge">Bridge (पुल)</option>
                      <option value="Nature">Nature (प्रकृति)</option>
                      <option value="Hills">Hills (पहाड़ियाँ)</option>
                      <option value="Fields">Fields (खेत)</option>
                      <option value="Festivals">Festivals (पर्व)</option>
                      <option value="School">School (विद्यालय)</option>
                    </select>

                    <label className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-400/50 bg-amber-500/15 text-amber-300 text-xs font-medium cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingFile ? 'Processing...' : 'Choose Photo File'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoFileUpload(e, (dataUrl) =>
                            setPhotoUrl(dataUrl)
                          )
                        }
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Or paste Image URL / path *"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs font-mono text-white"
                  />

                  <input
                    type="text"
                    placeholder="Caption / Description"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    + Add Photo to Gallery
                  </button>
                </form>

                {/* Existing Gallery Photos List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Current Gallery Photos ({data.gallery.length})
                  </h4>
                  {data.gallery.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-white/10 bg-[#0D1E25] flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-white/10"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-amber-400 shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => {
                            const next = [...data.gallery];
                            next[idx] = { ...item, image: e.target.value };
                            updateData({ ...data, gallery: next });
                          }}
                          className="w-full px-2 py-1 rounded border border-white/10 bg-[#071318] text-[11px] font-mono text-stone-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateData({
                            ...data,
                            gallery: data.gallery.filter((g) => g.id !== item.id),
                          })
                        }
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer shrink-0"
                        title="Delete photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ADD / MANAGE NEWS & NOTICES */}
            {rightTab === 'news' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleAddNews}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3"
                >
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Publish New Village Update / Notice</span>
                  </h3>

                  <input
                    type="text"
                    required
                    placeholder="Headline (English) *"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />

                  <input
                    type="text"
                    placeholder="Headline (Hindi / हिंदी शीर्षक)"
                    value={newsTitleHi}
                    onChange={(e) => setNewsTitleHi(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />

                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="Category (e.g. Road & Bridge)"
                      value={newsCategory}
                      onChange={(e) => setNewsCategory(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g. Oct 2026)"
                      value={newsDate}
                      onChange={(e) => setNewsDate(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder="Full details of the announcement *"
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    + Add Village Notice
                  </button>
                </form>

                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Published Notices ({data.newsUpdates.length})
                  </h4>
                  {data.newsUpdates.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-xl border border-white/10 bg-[#0D1E25] flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-[11px] text-amber-400">
                          {n.category} · {n.date}
                        </p>
                        <p className="text-xs font-bold text-white mt-0.5">
                          {n.title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateData({
                            ...data,
                            newsUpdates: data.newsUpdates.filter(
                              (item) => item.id !== n.id
                            ),
                          })
                        }
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PLACES & HIGHLIGHTS PHOTO CHANGER + ADD NEW PLACE */}
            {rightTab === 'places' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleAddPlace}
                  className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3"
                >
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    <span>Add New Important Place</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      required
                      placeholder="Place Name (English) *"
                      value={placeNameEn}
                      onChange={(e) => setPlaceNameEn(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Name (Hindi)"
                      value={placeNameHi}
                      onChange={(e) => setPlaceNameHi(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Relation / Subtitle (e.g. Nearby Village)"
                    value={placeRelation}
                    onChange={(e) => setPlaceRelation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Photo URL or upload"
                      value={placeImage}
                      onChange={(e) => setPlaceImage(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs font-mono text-white"
                    />
                    <label className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs cursor-pointer">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handlePhotoFileUpload(e, (url) => setPlaceImage(url))
                        }
                      />
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    required
                    placeholder="Description of the place *"
                    value={placeDesc}
                    onChange={(e) => setPlaceDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    + Add Important Place
                  </button>
                </form>

                {/* Change Photos for Highlights */}
                <div className="space-y-2.5">
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
                    Highlight Card Photos
                  </h4>
                  {data.highlights.map((hl, idx) => (
                    <div
                      key={hl.id}
                      className="p-3 rounded-xl border border-white/10 bg-[#0D1E25] flex items-center gap-3"
                    >
                      <img
                        src={hl.image}
                        alt={hl.titleEn}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">
                          {hl.titleEn} ({hl.titleHi})
                        </p>
                        <input
                          type="text"
                          value={hl.image}
                          onChange={(e) => {
                            const next = [...data.highlights];
                            next[idx] = { ...hl, image: e.target.value };
                            updateData({ ...data, highlights: next });
                          }}
                          className="mt-1 w-full px-2 py-1 rounded border border-white/10 bg-[#071318] text-[11px] font-mono text-stone-300"
                        />
                      </div>
                      <label className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[11px] text-amber-300 cursor-pointer shrink-0">
                        File
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handlePhotoFileUpload(e, (url) => {
                              const next = [...data.highlights];
                              next[idx] = { ...hl, image: url };
                              updateData({ ...data, highlights: next });
                            })
                          }
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: MAP & SYSTEM RESET */}
            {rightTab === 'map' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl border border-white/10 bg-[#0D1E25] space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                    Google Map Embed URL
                  </h3>
                  <input
                    type="text"
                    value={data.mapConfig.embedUrl}
                    onChange={(e) =>
                      updateData({
                        ...data,
                        mapConfig: {
                          ...data.mapConfig,
                          embedUrl: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs font-mono text-white"
                  />
                  <label className="block text-xs text-stone-400 pt-2">
                    Google Maps External Link
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
                    className="w-full px-3 py-2 rounded-lg border border-white/15 bg-[#071318] text-xs font-mono text-white"
                  />
                </div>

                <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-red-300 font-semibold">
                    Restore Default Village Template
                  </h3>
                  <p className="text-xs text-stone-400">
                    Reset local draft back to the default Merha Village data, then click Save Changes if you wish to overwrite cloud data.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      resetData();
                      showToast('Reset draft to default village.json!');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default Template</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: CITIZEN SUGGESTIONS INBOX */}
            {rightTab === 'inbox' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
                    Citizen Suggestions ({submissions.length})
                  </h3>
                  {submissions.length > 0 && (
                    <button
                      type="button"
                      onClick={clearSubmissions}
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Clear Inbox
                    </button>
                  )}
                </div>

                {submissions.length === 0 ? (
                  <div className="p-6 rounded-xl border border-white/10 text-center text-xs text-stone-400">
                    No suggestions received yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-xl border border-white/10 bg-[#0D1E25] space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-amber-400">
                          <span>{sub.topic}</span>
                          <span>{sub.createdAt}</span>
                        </div>
                        <p className="text-xs font-bold text-white">
                          {sub.name} ·{' '}
                          <span className="font-normal text-stone-400">
                            {sub.contact}
                          </span>
                        </p>
                        <p className="text-xs text-stone-300 pt-1">
                          {sub.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
