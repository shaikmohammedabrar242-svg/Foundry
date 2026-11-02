import React, { useState } from 'react';
import { useStore } from '../services/store';
import { Sun, Moon, Plus, User, Shield, Briefcase, LogOut, Check } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSubmit: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onOpenSqlSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSubmit,
  onOpenAuth,
  onOpenDashboard,
  onOpenAdmin,
  onOpenSqlSetup,
}) => {
  const { currentUser, theme, toggleTheme, logout, switchUserRole, notifications, isSupabaseLive } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F5]/90 dark:bg-[#0D0D0C]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('discover')}
          className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          FOUNDRY
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onSelectTab('discover')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 ${
              currentTab === 'discover'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Discover
          </button>

          <button
            onClick={() => onSelectTab('upcoming')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 ${
              currentTab === 'upcoming'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => onSelectTab('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 ${
              currentTab === 'categories'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => onSelectTab('community')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-neutral-900 dark:hover:text-neutral-100 ${
              currentTab === 'community'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Community
          </button>

          <button
            onClick={onOpenSubmit}
            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 rounded-md transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User state / Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 hidden sm:inline max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#141413] border border-neutral-200 dark:border-neutral-800 shadow-lg py-1.5 z-50 text-xs"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-800/80">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{currentUser.name}</p>
                    <p className="text-neutral-500 dark:text-neutral-400 truncate">@{currentUser.handle}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenDashboard();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Maker Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <Shield className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Admin Panel</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenSqlSetup();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center justify-between text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Supabase Config</span>
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">SQL</span>
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-1 pb-1">
                    <div className="px-3.5 py-1 text-[11px] font-medium text-neutral-400">Switch Persona (Testing)</div>
                    <button
                      onClick={() => switchUserRole('maker')}
                      className="w-full text-left px-3.5 py-1.5 flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <span>Maker Mode</span>
                      {currentUser.role === 'maker' && <Check className="w-3 h-3 text-neutral-900 dark:text-white" />}
                    </button>
                    <button
                      onClick={() => switchUserRole('admin')}
                      className="w-full text-left px-3.5 py-1.5 flex items-center justify-between text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <span>Admin Mode</span>
                      {currentUser.role === 'admin' && <Check className="w-3 h-3 text-neutral-900 dark:text-white" />}
                    </button>
                  </div>

                  <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
            >
              Sign In
            </button>
          )}

          {/* Primary CTA */}
          <button
            onClick={onOpenSubmit}
            className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            Launch Product
          </button>
        </div>

      </div>

      {/* Mobile nav subbar */}
      <div className="flex md:hidden items-center justify-around border-t border-neutral-200/60 dark:border-neutral-800/60 py-2.5 px-4 text-xs font-medium text-neutral-600 dark:text-neutral-400 bg-[#FAF9F5]/90 dark:bg-[#0D0D0C]/90">
        <button
          onClick={() => onSelectTab('discover')}
          className={currentTab === 'discover' ? 'text-neutral-900 dark:text-white font-semibold' : ''}
        >
          Discover
        </button>
        <button
          onClick={() => onSelectTab('upcoming')}
          className={currentTab === 'upcoming' ? 'text-neutral-900 dark:text-white font-semibold' : ''}
        >
          Upcoming
        </button>
        <button
          onClick={() => onSelectTab('categories')}
          className={currentTab === 'categories' ? 'text-neutral-900 dark:text-white font-semibold' : ''}
        >
          Categories
        </button>
        <button
          onClick={() => onSelectTab('community')}
          className={currentTab === 'community' ? 'text-neutral-900 dark:text-white font-semibold' : ''}
        >
          Community
        </button>
      </div>
    </header>
  );
};
