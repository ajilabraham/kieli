import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareQuote, ChevronDown } from 'lucide-react';

export const SocialProofAndFAQ = () => {
  const testimonials = [
    "I finally practiced speaking without feeling embarrassed.",
    "It felt like having a patient private tutor anytime.",
    "The roleplay practice helped me in real conversations."
  ];

  const faqs = [
    {
      q: "Is Kieli focused on grammar?",
      a: "Kieli prioritizes spoken communication first. Grammar is supported, but the core goal is helping learners speak and be understood."
    },
    {
      q: "Is this only for beginners?",
      a: "No. Kieli can support learners from beginner level through more advanced real-world and work-related speaking practice."
    },
    {
      q: "Can learners receive guidance in their own language?",
      a: "Yes, that is part of the product vision — helping users learn Finnish through a language they already understand well."
    },
    {
      q: "Is this like Duolingo or ChatGPT Voice?",
      a: "Kieli is being designed specifically around spoken Finnish learning, roleplay practice, confidence building, contextual feedback, and practical communication scenarios."
    },
    {
      q: "Can this support teachers and institutions later?",
      a: "Yes. The broader vision includes support for teachers, schools, course creators, and language learning organizations."
    },
    {
      q: "Can it support profession-specific learning?",
      a: "Yes. Industry-focused learning paths are a key part of the concept."
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="w-full bg-surface py-24 lg:py-32 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 14: Testimonials Placeholder */}
        <div className="space-y-16">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight">
              Early learners are looking for something more practical than traditional apps
            </h2>
            <p className="text-lg text-brandText/70 leading-relaxed font-medium">
              Language learners want tools that help them actually speak — not just study. Kieli is built for that need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((quote, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                key={i} 
                className="bg-card rounded-[24px] p-8 shadow-soft glass-border flex flex-col gap-6 relative"
              >
                <MessageSquareQuote className="w-8 h-8 text-primary/40 absolute top-6 right-6" />
                <div className="flex gap-1 text-primary">
                  {/* Stars placeholder */}
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-brandText/80 leading-relaxed font-medium italic text-lg">
                  "{quote}"
                </p>
                <div className="pt-4 border-t border-brandText/5 mt-auto">
                  <p className="font-bold text-brandText">Early User</p>
                  <p className="text-sm text-brandText/50">Language Learner</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 15: FAQ */}
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                viewport={{ once: true }}
                key={i} 
                className="bg-card rounded-[20px] shadow-soft glass-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-brandText text-lg pr-8">{faq.q}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`} 
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-brandText/70 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
