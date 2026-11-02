import React, { useState } from 'react';
import { X, Shield, FileText, Cookie, AlertTriangle, Trash2 } from 'lucide-react';
import { useStore } from '../services/store';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'cookies';
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(initialTab);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { currentUser, logout } = useStore();

  if (!isOpen) return null;

  const handleDeleteAccount = () => {
    alert('Your account and associated profile data have been marked for immediate deletion.');
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold">Legal & Compliance Documentation</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2 text-xs bg-neutral-50/50 dark:bg-neutral-900/50">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'cookies'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Policy</span>
          </button>
        </div>

        {/* Legal Counsel Notice Banner */}
        <div className="px-6 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Notice: This document is provided as a standard operational draft and is marked for review by a qualified legal professional before full commercial deployment.
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Privacy Policy</h4>
              <p className="text-xs text-neutral-400">Effective Date: November 2, 2026</p>

              <div className="space-y-3 pt-2">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">1. Information We Collect</h5>
                <p>
                  Foundry collects information you provide directly to us when creating an account, launching a product, submitting comments, or voting:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, avatar, username, and bio.</li>
                  <li><strong>Product Submissions:</strong> Product titles, descriptions, website URLs, categories, screenshots, and launch deals.</li>
                  <li><strong>Usage & Analytics:</strong> Aggregate page views, outbound website click counts, deal coupon clicks, and upvote events.</li>
                </ul>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">2. How Data Is Used</h5>
                <p>
                  We use the information collected exclusively to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Display your software product and maker profile to prospective customers.</li>
                  <li>Prevent vote manipulation, duplicate submissions, and spam.</li>
                  <li>Provide transparent launch metrics (views, outbound clicks, upvotes) to makers.</li>
                  <li>Notify waitlist subscribers when scheduled launches go live.</li>
                </ul>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">3. Cookies and Analytics</h5>
                <p>
                  We prioritize privacy. We do not use third-party invasive trackers. Minimal cookies are utilized strictly for persistent authentication sessions and storing consent preferences.
                </p>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">4. Third-Party Links & Services</h5>
                <p>
                  Product listings contain outbound links to independent third-party websites and tools. Foundry does not control and is not responsible for the privacy practices of external third-party software.
                </p>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">5. Account & Data Deletion</h5>
                <p>
                  You have the right to request the permanent deletion of your account, profile, comments, and submitted products at any time.
                </p>

                {currentUser && (
                  <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 my-3">
                    <div className="font-semibold text-red-900 dark:text-red-200 flex items-center gap-1.5 mb-1">
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Exercise Account Deletion</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 mb-3">
                      Logged in as <strong>{currentUser.email}</strong>. Deleting your account will remove your profile and personal records.
                    </p>
                    {deleteConfirm ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                        >
                          Confirm Permanent Deletion
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(false)}
                          className="px-3 py-1.5 rounded-lg text-xs border border-neutral-300 dark:border-neutral-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 hover:bg-red-50"
                      >
                        Request Account Deletion
                      </button>
                    )}
                  </div>
                )}

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">6. Contact Information</h5>
                <p>
                  For privacy inquiries, contact the team at <code>privacy@foundry.io</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Terms & Conditions</h4>
              <p className="text-xs text-neutral-400">Effective Date: November 2, 2026</p>

              <div className="space-y-3 pt-2">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">1. Intellectual Property & Ownership</h5>
                <p>
                  Makers retain full, unencumbered ownership and intellectual property rights over any software, code, logos, and materials submitted to the platform. By submitting, you grant Foundry a non-exclusive license to display your listing and preview screenshots.
                </p>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">2. User-Generated Content Rules</h5>
                <p>
                  All community reviews, comments, and discussions must remain constructive, respectful, and genuine. We strictly prohibit:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Automated bot voting, vote purchasing, or reciprocal vote-trading syndicates.</li>
                  <li>Harassment, hate speech, or defamatory attacks.</li>
                  <li>Deceptive launch deals or malicious software links.</li>
                </ul>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">3. Moderation & Removal</h5>
                <p>
                  Foundry administrators reserve the right to unpublish, edit, or reject listings that violate community guidelines or compromise user security.
                </p>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">4. Limitation of Liability</h5>
                <p>
                  Foundry is provided on an "as is" and "as available" basis. Under no circumstances shall Foundry or its operators be liable for direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform or third-party products featured herein.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Cookie & Tracking Policy</h4>
              <p className="text-xs text-neutral-400">Effective Date: November 2, 2026</p>

              <div className="space-y-3 pt-2">
                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100">1. What Are Cookies</h5>
                <p>
                  Cookies are small data files placed on your device to maintain session state, recall your preferences, and facilitate smooth navigation.
                </p>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">2. Categories of Cookies We Use</h5>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Essential Cookies:</strong> Strictly necessary for authentication sessions, security CSRF protection, and storing your theme preference. These cannot be disabled.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Retain your UI filter choices (e.g., active category filters, dark mode setting).
                  </li>
                  <li>
                    <strong>Analytics Cookies (Optional):</strong> Measure anonymous aggregated metrics such as page visits and outbound click rates to provide makers with honest feedback. We do not load non-essential tracking cookies without consent.
                  </li>
                </ul>

                <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 pt-2">3. Managing Your Cookie Preferences</h5>
                <p>
                  You can adjust your consent choices at any time via our Cookie Consent banner or by clearing your browser cache.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
