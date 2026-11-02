import React from 'react';
import { Database } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenSubmit: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'cookies') => void;
  onOpenSqlSetup: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenSubmit,
  onOpenLegal,
  onOpenSqlSetup,
}) => {
  return (
    <footer className="w-full border-t border-neutral-200/80 dark:border-neutral-800/80 bg-[#FAF9F5] dark:bg-[#0D0D0C] py-12 text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-neutral-200/60 dark:border-neutral-850">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              FOUNDRY
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
              A minimalist editorial stage for indie hackers and SaaS founders to launch their software and reach authentic early customers.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Navigation</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onSelectTab('discover')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Discover Products
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('upcoming')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Upcoming Launches
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('categories')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Community Leaderboard
                </button>
              </li>
            </ul>
          </div>

          {/* Makers & Backend */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Makers & Backend</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenSubmit} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Submit a Product
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('upcoming')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Launch Radar Scheduling
                </button>
              </li>
              <li>
                <button onClick={onOpenSqlSetup} className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-neutral-500" />
                  <span>Supabase PostgreSQL Setup</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Compliance */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-neutral-900 dark:text-neutral-100">Legal & Compliance</div>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('cookies')} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Cookie & Tracking Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} Foundry. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onOpenLegal('privacy')} className="hover:text-neutral-600 dark:hover:text-neutral-300">
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onOpenLegal('terms')} className="hover:text-neutral-600 dark:hover:text-neutral-300">
              Terms of Service
            </button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onOpenLegal('cookies')} className="hover:text-neutral-600 dark:hover:text-neutral-300">
              Cookie Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
