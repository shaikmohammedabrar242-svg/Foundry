import React from 'react';
import { Compass, ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  onBackToDiscover: () => void;
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onBackToDiscover,
  onReturnHome,
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Minimalist 404 Visual Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141413] shadow-xs">
          <Compass className="w-8 h-8 text-neutral-400 dark:text-neutral-500 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-semibold text-neutral-400 dark:text-neutral-500 tracking-widest uppercase">
            Error 404 · Orbit Desynchronized
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 text-balance">
            Looks like this launch missed its destination.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-balance">
            The page, product link, or maker resource you requested doesn't exist or may have been repositioned.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onBackToDiscover}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discover</span>
          </button>

          <button
            onClick={onReturnHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </button>
        </div>

      </div>
    </div>
  );
};
