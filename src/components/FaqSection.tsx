import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'What is this platform?',
    answer:
      'Foundry is a minimalist launch and discovery stage built specifically for indie hackers, solo founders, and bootstrapped software teams. We provide an authentic, editorial space to debut your SaaS, connect with early adopters, and offer exclusive launch deals without algorithmic noise or fake upvote rings.',
  },
  {
    question: 'How can I launch my SaaS product?',
    answer:
      'Click the "Launch Product" button in the navigation bar. You can choose to launch immediately today or schedule your debut on the Launch Radar with a live countdown timer. Provide your product name, tagline, description, category, and an optional exclusive launch deal to attract early customers.',
  },
  {
    question: 'Is submitting a product free?',
    answer:
      'Yes, submitting and launching your software on Foundry is 100% free. We believe every great independent product deserves an authentic audience, transparent analytics, and direct feedback from genuine users.',
  },
  {
    question: 'How does product verification work?',
    answer:
      'Makers can verify ownership of their software directly inside the Maker Dashboard by entering a matching domain email (e.g. founder@yourdomain.com), or through manual verification by our curation team. Verified products receive the Verified Maker checkmark badge.',
  },
  {
    question: 'How can I promote my product and attract customers?',
    answer:
      'You can maximize launch interest by scheduling on the Launch Radar to build a pre-launch waitlist, offering an exclusive launch deal (e.g. 30%–50% off for early adopters), sharing regular changelog updates, and engaging directly with community reviews and comments.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 border-b border-neutral-200/80 dark:border-neutral-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Everything you need to know about launching, discovering, and growing on the platform.
          </p>
        </div>

        {/* Lightweight Accordion Interface */}
        <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70 border-y border-neutral-200/70 dark:border-neutral-800/70">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between text-left py-2 group focus:outline-hidden"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? 'rotate-180 text-neutral-900 dark:text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pt-2 pb-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
