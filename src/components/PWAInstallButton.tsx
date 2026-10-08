import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'compact' | 'full' }> = ({
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className={
          variant === 'compact'
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer'
            : 'inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-200 hover:bg-amber-500/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer'
        }
        title="Install Merha Village App for offline access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-modal-title"
        >
          <div className="w-full max-w-md rounded-xl border border-stone-200 dark:border-white/15 bg-white dark:bg-[#0D1E25] p-6 shadow-2xl text-stone-900 dark:text-stone-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="pwa-modal-title" className="text-xl font-semibold font-display">
                  Install Merha Village Portal (मेड़ा गांव ऐप)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Offline-ready Progressive Web App for mobile & desktop
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                aria-label="Close install guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isIOS ? (
                <>
                  <p>To add Merha Village Portal to your iPhone or iPad Home Screen:</p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>
                      Tap the <strong>Share</strong> button in your Safari toolbar.
                    </li>
                    <li>
                      Scroll down and select <strong>Add to Home Screen</strong>.
                    </li>
                    <li>
                      Tap <strong>Add</strong> to access village details anytime, even offline.
                    </li>
                  </ol>
                </>
              ) : (
                <>
                  <p>
                    You can install the Merha Village portal directly onto your phone or computer for fast, offline access:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5">
                    <li>
                      Open this site in <strong>Chrome, Edge, or Brave</strong> (or open in a full browser tab if viewing inside a preview frame).
                    </li>
                    <li>
                      Click the <strong>Install Merha Village</strong> icon in the address bar or browser menu (<strong>Add to Home screen</strong> on Android).
                    </li>
                  </ol>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
