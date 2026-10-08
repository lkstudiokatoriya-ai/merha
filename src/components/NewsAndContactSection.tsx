import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { useVillage } from '../context/VillageContext';

export const NewsAndContactSection: React.FC = () => {
  const { data, addSubmission, submissions, openAdminAt, isAdminAuthenticated } = useVillage();
  const { newsUpdates, contactConfig } = data;

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState('Village Development Suggestion');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setFeedback({
        type: 'error',
        text: 'Please fill in your name, email/phone number, and message.',
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const res = await addSubmission({
      name: name.trim(),
      contact: contact.trim(),
      topic,
      message: message.trim(),
    });

    setSubmitting(false);
    setName('');
    setContact('');
    setMessage('');

    if (res.sentToEndpoint) {
      setFeedback({
        type: 'success',
        text: 'Thank you! Your suggestion has been saved and transmitted to the configured village API endpoint.',
      });
    } else if (res.error) {
      setFeedback({
        type: 'info',
        text: `Saved to local village records. (${res.error})`,
      });
    } else {
      setFeedback({
        type: 'success',
        text: 'धन्यवाद! Thank you—your message has been recorded in the village portal.',
      });
    }
  };

  return (
    <div className="bg-[#FAF7F0] dark:bg-[#071318] transition-colors">
      {/* NEWS & UPDATES SECTION */}
      <section
        id="updates"
        className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                10 &nbsp;·&nbsp; Community Bulletin & Notices
              </p>
              <h2
                className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                style={{ textWrap: 'balance' }}
              >
                Village News & Updates (ग्राम समाचार एवं सूचनाएं)
              </h2>
              <p className="mt-3 text-base text-stone-600 dark:text-stone-300">
                Stay informed about village development works, school academic sessions, Kurar River bridge maintenance, festivals, and Gram Sabha announcements.
              </p>
            </div>

            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminAt('news')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-colors self-start lg:self-auto cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publish / Edit Notice</span>
              </button>
            )}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsUpdates.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 sm:p-7 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] flex flex-col justify-between hover:border-amber-500/40 transition-colors"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                    <span className="text-amber-700 dark:text-amber-400 font-medium">
                      {item.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 dark:text-emerald-400">
                      {item.priority}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-xl sm:text-2xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                    {item.title}
                  </h3>
                  <p className="text-sm font-hindi text-stone-600 dark:text-stone-300 mt-1">
                    {item.titleHi}
                  </p>
                  <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Merha Gram Samiti Bulletin</span>
                  <span className="font-mono-tabular">#{idx + 1}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / SUGGESTIONS SECTION */}
      <section id="contact" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium">
                  11 &nbsp;·&nbsp; Citizen Voice & Suggestions
                </p>
                <h2
                  className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                  style={{ textWrap: 'balance' }}
                >
                  Contact & Village Suggestions (संपर्क एवं सुझाव)
                </h2>
                <p className="mt-3 text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                  Share your ideas for village development, school improvements, cultural archiving, or photo contributions for Merha Village.
                </p>
              </div>

              <div className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Village Address
                  </p>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100 mt-1">
                    {contactConfig.officeAddress}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-white/5">
                  <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    Submission Architecture (Firebase-Free)
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                    {contactConfig.helpNote}
                  </p>
                </div>

                {isAdminAuthenticated && (
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400">
                      Saved Suggestions: <strong className="font-mono-tabular text-amber-500">{submissions.length}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => openAdminAt('submissions')}
                      className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Configure Endpoint / View Inbox</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="p-7 sm:p-9 rounded-2xl border border-stone-200 dark:border-white/15 bg-white dark:bg-[#0D1E25] shadow-lg space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                    >
                      Your Full Name (आपका नाम) *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar / राजेश कुमार"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#071318] text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-info"
                      className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                    >
                      Email or Phone Number (ईमेल / मोबाइल) *
                    </label>
                    <input
                      id="contact-info"
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="e.g. +91 98XXXXXX00 or email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#071318] text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    Subject / Category (विषय)
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#071318] text-sm text-stone-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Village Development Suggestion">
                      Village Development Suggestion (ग्राम विकास सुझाव)
                    </option>
                    <option value="School & Education Initiative">
                      School & Education Initiative (शिक्षा एवं विद्यालय)
                    </option>
                    <option value="Road / Kurar River Bridge Update">
                      Road / Kurar River Bridge Update (सड़क एवं कुरार नदी पुल)
                    </option>
                    <option value="Ward No. 1 / Ward No. 2 Civic Matter">
                      Ward No. 1 / Ward No. 2 Civic Matter (वार्ड १ / वार्ड २)
                    </option>
                    <option value="Gallery Photo / Cultural Contribution">
                      Gallery Photo / Cultural Contribution (फोटो एवं संस्कृति)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
                  >
                    Message or Suggestion (संदेश / सुझाव) *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your suggestion, update, or message for Merha Village..."
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 dark:border-white/15 bg-stone-50 dark:bg-[#071318] text-sm text-stone-900 dark:text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {feedback && (
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                      feedback.type === 'error'
                        ? 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{feedback.text}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    100% Independent · No Firebase Dependency
                  </span>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Submit Suggestion'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
