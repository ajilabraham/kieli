
import { useState, useEffect } from 'react';
import { PhoneMockup } from './PhoneMockup';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, MessageCircle, MonitorSmartphone, Briefcase } from 'lucide-react';
import { ValueProposition } from './sections/ValueProposition';
import { HowItWorks } from './sections/HowItWorks';
import { FeaturesGrid } from './sections/FeaturesGrid';
import { LearningPath } from './sections/LearningPath';
import { PlatformVision } from './sections/PlatformVision';
import { SocialProofAndFAQ } from './sections/SocialProofAndFAQ';
import { FinalCTA } from './sections/FinalCTA';

export const LandingPage = () => {
  const languages = ["Finnish", "German", "Swedish", "Spanish", "French"];
  const [langIndex, setLangIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % languages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-x-hidden">
       {/* Brand Header */}
       <div className="absolute top-8 left-6 lg:left-12 z-50 flex items-center gap-3">
         <div className="w-[60px] h-[60px] rounded-2xl bg-card shadow-soft glass-border flex items-center justify-center p-2 overflow-hidden">
           <img src="/Logo.png" alt="Kieli Logo" className="w-full h-full object-contain" />
         </div>
         <span className="text-3xl font-bold tracking-tight text-brandText">Kieli</span>
       </div>

       {/* Background decorative elements */}
       <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
       <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradientEnd/10 rounded-full blur-[120px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 lg:pt-24 lg:pb-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center z-10 flex-1">
          
          {/* Left Column: Marketing Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start gap-8 max-w-2xl"
          >
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface shadow-soft glass-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-brandText/80">
                   Meet Your New Language Coach
                </span>
             </div>

             <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight text-brandText leading-tight">
                  Master{' '}
                  <span className="inline-grid overflow-hidden">
                    <AnimatePresence>
                      <motion.span
                        key={languages[langIndex]}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        style={{ gridArea: "1 / 1" }}
                      >
                        {languages[langIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <br/> 
                  <span className="text-primary italic">conversationally.</span>
                </h1>
                <p className="text-lg lg:text-xl text-brandText/70 leading-relaxed max-w-lg font-medium">
                  Kieli uses an advanced AI tutor to guide you through real-time immersive conversations. Zero stress, 100% natural interaction.
                </p>
             </div>

             {/* Waitlist CTA Area */}
             <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
                <div className="relative w-full sm:w-auto flex-1 max-w-md">
                   <input 
                     type="email" 
                     placeholder="Enter your email address..."
                     className="w-full px-6 py-4 bg-card rounded-2xl glass-border shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/40 font-semibold tracking-wide transition-all"
                   />
                </div>
                <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-signature-gradient text-white font-bold tracking-wide shadow-soft flex items-center justify-center gap-3 group transition-all"
                   style={{
                      boxShadow: "0 10px 30px -10px rgba(57, 94, 159, 0.4)"
                   }}
                >
                   <span>Join Waitlist</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
             </div>
             
             {/* Instructional CTA pointing to mockup */}
             <motion.div 
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="mt-2 flex items-center gap-3 py-3 px-6 bg-card rounded-full glass-border shadow-soft w-fit border border-primary/20 self-end"
             >
                <p className="text-[13px] font-bold tracking-[0.1em] text-primary">
                  TRY IT DIRECTLY HERE, TAP CALL 📞
                </p>
                <ArrowRight className="w-4 h-4 text-primary hidden lg:block" />
                {/* Arrow points down on mobile where the mockup is stacked below */}
                <ArrowRight className="w-4 h-4 text-primary lg:hidden rotate-90" />
             </motion.div>
             
             {/* Micro feature metrics */}
             <div className="mt-4 flex flex-wrap gap-x-10 gap-y-8 border-t border-brandText/10 pt-8 w-full max-w-xl">
               <div className="space-y-1.5 flex flex-col items-start">
                 <div className="flex items-center gap-2 text-brandText">
                   <Clock className="w-5 h-5 text-primary/60" />
                   <p className="text-2xl font-bold tracking-tight">24/7</p>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brandText/50">Availability</p>
               </div>
               
               <div className="space-y-1.5 flex flex-col items-start">
                 <div className="flex items-center gap-2 text-brandText">
                   <MessageCircle className="w-5 h-5 text-primary/60" />
                   <p className="text-2xl font-bold tracking-tight">Native</p>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brandText/50">Fluency</p>
               </div>
               
               <div className="space-y-1.5 flex flex-col items-start">
                 <div className="flex items-center gap-2 text-brandText">
                   <MonitorSmartphone className="w-5 h-5 text-primary/60" />
                   <p className="text-2xl font-bold tracking-tight">Hybrid</p>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brandText/50">Learning</p>
               </div>
               
               <div className="space-y-1.5 flex flex-col items-start">
                 <div className="flex items-center gap-2 text-brandText">
                   <Briefcase className="w-5 h-5 text-primary/60" />
                   <p className="text-2xl font-bold tracking-tight">Career</p>
                 </div>
                 <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brandText/50">Focused</p>
               </div>
               
             </div>
          </motion.div>

          {/* Right Column: Phone Mockup */}
          <div className="flex items-center justify-center lg:justify-end relative h-full w-full pt-10 lg:pt-0">
            <PhoneMockup />
          </div>

        </div>
       
       {/* Sub-sections */}
       <ValueProposition />
       <HowItWorks />
       <FeaturesGrid />
       <LearningPath />
       <PlatformVision />
       <SocialProofAndFAQ />
       <FinalCTA />

    </div>
  );
};
