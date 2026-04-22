
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCTA = () => {
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
              Start speaking Finnish <br className="hidden md:block"/>
              with <span className="text-primary italic">confidence</span>.
            </h2>
            <p className="text-lg md:text-xl text-brandText/70 font-medium leading-relaxed max-w-2xl mx-auto">
              Join the waitlist to get early access to a new kind of language learning experience — one built around real conversation, confidence, and practical fluency.
            </p>
          </div>

          {/* Waitlist CTA Input Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto pt-4">
             <div className="relative w-full sm:w-auto flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email address..."
                  className="w-full px-6 py-4 bg-surface rounded-2xl glass-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/40 font-semibold tracking-wide transition-all"
                />
             </div>
             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-signature-gradient text-white font-bold tracking-wide shadow-soft flex items-center justify-center gap-3 group transition-all shrink-0"
                style={{
                   boxShadow: "0 10px 30px -10px rgba(57, 94, 159, 0.4)"
                }}
             >
                <span>Join Waitlist</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </motion.button>
          </div>

          <div className="pt-8 border-t border-brandText/5 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Optional: Future brand trust badges could go here */}
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};
