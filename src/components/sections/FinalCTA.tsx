
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export const FinalCTA = ({ selectedLanguage }: { selectedLanguage: string }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'a2be38e0-82b5-4f99-9935-7b0bfc938f59',
          name: 'Kieli',
          email: email,
          subject: 'New Waitlist Signup for Kieli',
          from_name: 'Kieli Waitlist',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
      } else {
        setStatus('idle');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('idle');
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="w-full bg-surface py-24 lg:py-32 relative overflow-hidden">
      
      {/* Heavy brand gradient background for contrast */}
      <div className="absolute inset-0 bg-signature-gradient opacity-10" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-card/90 backdrop-blur-[40px] rounded-[40px] p-10 lg:p-16 glass-border shadow-[0_20px_60px_-15px_rgba(57,94,159,0.1)] text-center space-y-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-full h-1 bg-signature-gradient" />

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-secondary shadow-sm glass-border mx-auto relative z-10 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brandText leading-tight">
              Start speaking {selectedLanguage} <br className="hidden md:block"/>
              with <span className="text-primary italic">confidence</span>.
            </h2>
            <p className="text-lg md:text-xl text-brandText/70 font-medium leading-relaxed max-w-2xl mx-auto">
              Join the waitlist to get early access to a new kind of language learning experience — one built around real conversation, confidence, and practical fluency.
            </p>
          </div>

          {/* Waitlist CTA Input Group */}
          <div className="w-full max-w-lg mx-auto pt-4 min-h-[72px]">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary font-bold"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>You're on the list! We'll be in touch.</span>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
                >
                   <div className="relative w-full sm:w-auto flex-1">
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="w-full px-6 py-4 bg-surface rounded-2xl glass-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/40 font-semibold tracking-wide transition-all"
                      />
                   </div>
                   <motion.button 
                      type="submit"
                      disabled={status === 'submitting'}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-signature-gradient text-white font-bold tracking-wide shadow-soft flex items-center justify-center gap-3 group transition-all shrink-0 disabled:opacity-70"
                      style={{
                         boxShadow: "0 10px 30px -10px rgba(57, 94, 159, 0.4)"
                      }}
                   >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <span>Join Waitlist</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                   </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-8 border-t border-brandText/5 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Optional: Future brand trust badges could go here */}
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};
