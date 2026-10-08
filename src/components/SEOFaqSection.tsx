import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface FAQItem {
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
}

const VILLAGE_FAQS: FAQItem[] = [
  {
    questionEn: 'Where is Merha Village (मेड़ा गांव) located in Bihar?',
    questionHi: 'मेड़ा गांव (Merha Village) बिहार में कहाँ स्थित है?',
    answerEn:
      'Merha Village is situated in Jamdhaha Gram Panchayat under Katoria Block of Banka District in Bihar, India.',
    answerHi:
      'मेड़ा गांव भारत के बिहार राज्य में बांका ज़िले के कटोरिया प्रखंड (Katoria Block) की जमदाहा ग्राम पंचायत (Jamdhaha Panchayat) में स्थित है।',
  },
  {
    questionEn: 'Which river and bridge are located at Merha Village?',
    questionHi: 'मेड़ा गांव के पास कौन सी नदी और पुल स्थित है?',
    answerEn:
      'The scenic Kurar River (कुरार नदी) flows beside Merha Village, and the Kurar River Bridge (कुरार नदी पुल) serves as the primary all-weather road link connecting Merha to Jamdhaha and nearby markets.',
    answerHi:
      'मेड़ा गांव के किनारे कुरार नदी (Kurar River) बहती है और कुरार नदी पुल गांव को जमदाहा तथा मुख्य सड़क से जोड़ने वाला प्रमुख माध्यम है।',
  },
  {
    questionEn: 'What are the neighboring villages and important places near Merha?',
    questionHi: 'मेड़ा गांव के आस-पास के प्रमुख स्थान और पड़ोसी गांव कौन से हैं?',
    answerEn:
      'Key places surrounding Merha Village include Kurar River, Kurar River Bridge, Jamdhaha (Panchayat HQ), Domuhan (दोमुहान), Manija (मनिजा), and Karjhausa (करझौसा).',
    answerHi:
      'मेड़ा गांव के आस-पास कुरार नदी, कुरार नदी पुल, जमदाहा बाज़ार/पंचायत, दोमुहान, मनिजा और करझौसा प्रमुख स्थान हैं।',
  },
  {
    questionEn: 'How many wards and schools serve Merha Village?',
    questionHi: 'मेड़ा गांव में कितने वार्ड और विद्यालय हैं?',
    answerEn:
      'Merha Village includes Ward No. 1 and Ward No. 2 under Jamdhaha Panchayat, with educational access to Middle School and High School facilities in the Merha–Jamdhaha belt.',
    answerHi:
      'मेड़ा गांव में वार्ड संख्या १ और वार्ड संख्या २ शामिल हैं, तथा बच्चों की शिक्षा के लिए मध्य विद्यालय और उच्च विद्यालय की सुविधा उपलब्ध है।',
  },
];

export const SEOFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Dynamically set canonical link to official production domain for SEO authority
  useEffect(() => {
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const hostname = window.location.hostname;
    const url =
      hostname === 'vill-merha.ai.studio'
        ? 'https://vill-merha.ai.studio/'
        : 'https://vill-merha.vercel.app/';
    if (existingCanonical) {
      existingCanonical.setAttribute('href', url);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = url;
      document.head.appendChild(link);
    }
  }, []);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 sm:py-24 border-t border-stone-200 dark:border-white/10 bg-[#F3EFE6] dark:bg-[#09181F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Visible Semantic Breadcrumb Trail for Search Engines & Visitors */}
        <nav
          aria-label="Geographic Breadcrumb"
          className="mb-10 pb-4 border-b border-stone-200/80 dark:border-white/10 flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400"
        >
          <span>India (भारत)</span>
          <span aria-hidden="true">/</span>
          <span>Bihar (बिहार)</span>
          <span aria-hidden="true">/</span>
          <span>Banka District (बांका ज़िला)</span>
          <span aria-hidden="true">/</span>
          <span>Katoria Block (कटोरिया प्रखंड)</span>
          <span aria-hidden="true">/</span>
          <span>Jamdhaha Panchayat (जमदाहा पंचायत)</span>
          <span aria-hidden="true">/</span>
          <strong className="text-amber-700 dark:text-amber-400 font-semibold">
            Merha Village (मेड़ा गांव)
          </strong>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              <Search className="w-3.5 h-3.5" />
              <span>Quick Directory & Search Guide</span>
            </div>
            <h2
              id="faq-heading"
              className="mt-2 text-3xl sm:text-4xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
              style={{ textWrap: 'balance' }}
            >
              Frequently Asked Questions About Merha Village (मेड़ा गांव से जुड़े सामान्य प्रश्न)
            </h2>
            <p className="mt-3 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed">
              Verified geographic, administrative, and local directory answers for anyone searching for{' '}
              <strong>Merha Village (मेड़ा गांव), Jamdhaha, Katoria, Banka, Bihar</strong> on Google or other search engines.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {VILLAGE_FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                        {faq.questionEn}
                      </h3>
                      <p className="text-xs sm:text-sm font-hindi text-amber-700 dark:text-amber-400 mt-0.5">
                        {faq.questionHi}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 shrink-0 mt-1 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 border-t border-stone-100 dark:border-white/5 space-y-2 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                      <p>{faq.answerEn}</p>
                      <p className="font-hindi text-stone-700 dark:text-stone-200">
                        {faq.answerHi}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
