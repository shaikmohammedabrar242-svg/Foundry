import React, { useState, useEffect } from 'react';
import { Cookie, Check, Sliders, Shield } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'foundry_cookie_consent_v1';

export function getCookieConsent(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface CookieBannerProps {
  onOpenLegal: (tab: 'cookies') => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenLegal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Delay display slightly so it doesn't pop up immediately on first millisecond
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectOptional = () => {
    savePreferences({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustom = () => {
    savePreferences({
      essential: true,
      functional,
      analytics,
      timestamp: new Date().toISOString(),
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
      <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-2xl text-neutral-900 dark:text-neutral-100">
        
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-neutral-800 dark:text-neutral-200">
            <Cookie className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold">Privacy & Cookie Choices</h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              We use minimal cookies for authentication sessions and anonymous product views. Non-essential tracking cookies are never loaded without your consent.{' '}
              <button
                type="button"
                onClick={() => onOpenLegal('cookies')}
                className="underline hover:text-neutral-900 dark:hover:text-white"
              >
                Read Cookie Policy
              </button>
            </p>
          </div>
        </div>

        {/* Customization Drawer */}
        {isCustomizing && (
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              <div>
                <span className="font-semibold block">Essential Cookies</span>
                <span className="text-[11px] text-neutral-400">Required for sign-in and security.</span>
              </div>
              <span className="text-[11px] font-semibold text-neutral-400">Always Active</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              <div>
                <span className="font-semibold block">Functional Cookies</span>
                <span className="text-[11px] text-neutral-400">Remember UI filters & preferences.</span>
              </div>
              <input
                type="checkbox"
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-white"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
              <div>
                <span className="font-semibold block">Analytics Cookies</span>
                <span className="text-[11px] text-neutral-400">Anonymous views & outbound click counts.</span>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="rounded accent-neutral-900 dark:accent-white"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" />
            <span>{isCustomizing ? 'Hide Options' : 'Customize'}</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            {isCustomizing ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
              >
                Save Preferences
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-xs"
                >
                  Accept All
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
