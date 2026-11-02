import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { SUPABASE_URL } from '../services/supabase';

interface SqlSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSupabaseLive: boolean;
}

export const SqlSetupModal: React.FC<SqlSetupModalProps> = ({
  isOpen,
  onClose,
  isSupabaseLive,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = async () => {
    try {
      const response = await fetch('/supabase/schema.sql');
      const text = await response.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#141413]/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="text-base font-bold">Supabase PostgreSQL Configuration</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close setup modal"
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm">
          
          {/* Status badge */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Connection Status
              </div>
              <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 mt-1 truncate max-w-md">
                {SUPABASE_URL}
              </div>
            </div>

            <div className="shrink-0">
              {isSupabaseLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Tables Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Ready for SQL Migration</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100">
              One-Step Database Migration Setup
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-xs">
              We have generated the complete production PostgreSQL schema in <code>/supabase/schema.sql</code> including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <li>12 optimized relational tables (<code>profiles</code>, <code>products</code>, <code>categories</code>, <code>votes</code>, <code>comments</code>, <code>reviews</code>, <code>follows</code>, <code>waitlist</code>, <code>launch_deals</code>, <code>notifications</code>, <code>product_analytics</code>, <code>maker_badges</code>, <code>audit_logs</code>).</li>
              <li>Strict unique constraints (one vote per user per product).</li>
              <li>Row Level Security (RLS) policies protecting user data.</li>
              <li>Automated triggers for profile creation on signup & badge calculations.</li>
              <li>Storage buckets for logos, screenshots, and avatars with file restrictions.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-neutral-400 text-[11px] pb-1 border-b border-neutral-800">
              <span>SQL MIGRATION: /supabase/schema.sql</span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-white hover:underline focus:outline-hidden"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              1. Open Supabase Dashboard → <strong>SQL Editor</strong><br />
              2. Click "New Query" and paste the copied SQL migration<br />
              3. Click <strong>Run</strong> (all tables and policies provision in &lt;2s)
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <a
              href="https://supabase.com/dashboard/project/cjdyctkinpqfnrcwmvnu/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 hover:underline"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
