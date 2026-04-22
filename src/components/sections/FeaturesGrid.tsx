
import { motion } from 'framer-motion';
import { Globe2, Heart, CheckCircle2 } from 'lucide-react';

export const FeaturesGrid = () => {
  const scenarios = [
    "Introducing yourself", "Asking for directions", "Workplace communication", 
    "Talking to colleagues", "Visiting a restaurant", "Handling customer service", 
    "Shopping and payments", "Booking appointments", "Public services and forms", 
    "Everyday social conversations"
  ];

  const nativeFeatures = [
    "Explanations in a familiar language",
    "Lower learning anxiety",
    "Faster understanding of corrections",
    "More inclusive language learning experience"
  ];

  const confidenceFeatures = [
    "Repeat phrases as many times as needed",
    "Try speaking without fear of judgment",
    "Receive calm, constructive feedback",
    "Improve pronunciation over time",
    "Gain confidence before real human interactions"
  ];

  return (
    <div className="w-full bg-secondary py-24 lg:py-32 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 5: Practice Real-Life Scenarios */}
        <div className="space-y-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight mb-6">
              Train for the conversations that <span className="text-primary italic">actually</span> matter
            </h2>
            <p className="text-lg text-brandText/70 leading-relaxed font-medium">
              Kieli helps learners practice Finnish across practical, everyday situations — not just textbook examples. Each session is designed to simulate realistic spoken situations so learners can build confidence step by step.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {scenarios.map((scenario, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                viewport={{ once: true, margin: "-50px" }}
                key={i}
                className="px-6 py-3 bg-card rounded-full glass-border shadow-sm text-brandText font-semibold hover:border-primary/30 transition-colors cursor-default"
              >
                {scenario}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 6: Learn Through Your Native Language */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 bg-card rounded-[32px] p-10 glass-border shadow-soft h-full flex flex-col justify-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
             <Globe2 className="w-12 h-12 text-primary mb-8" />
             <ul className="space-y-4">
               {nativeFeatures.map((item, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                   <span className="text-brandText font-medium">{item}</span>
                 </li>
               ))}
             </ul>
          </motion.div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
              Learn Finnish through the language you already know
            </h2>
            <div className="space-y-4 text-lg text-brandText/70 leading-relaxed font-medium">
              <p>
                Not every learner is comfortable receiving corrections in English. Kieli is designed to support learners through their mother tongue or strongest language, making explanations more accessible and learning more natural.
              </p>
              <p>
                Whether a learner speaks English, Hindi, Malayalam, or another language, the goal is simple: make spoken Finnish easier to understand, practice, and retain.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7: Built for Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
              Make mistakes privately. Speak confidently publicly.
            </h2>
            <div className="space-y-4 text-lg text-brandText/70 leading-relaxed font-medium">
              <p>
                One of the biggest barriers in language learning is shame — the fear of sounding wrong in front of others. Kieli removes that pressure.
              </p>
              <div className="pt-4 border-t border-brandText/10">
                <p className="text-xl font-semibold text-primary italic">
                  "Kieli turns hesitation into speaking momentum."
                </p>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-card rounded-[32px] p-10 glass-border shadow-soft h-full flex flex-col justify-center relative overflow-hidden"
          >
             <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradientEnd/10 rounded-full blur-[60px] pointer-events-none" />
             <Heart className="w-12 h-12 text-primary mb-8" />
             <p className="font-semibold text-brandText mb-4">With an AI tutor, learners can:</p>
             <ul className="space-y-4">
               {confidenceFeatures.map((item, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                   <span className="text-brandText/80 font-medium">{item}</span>
                 </li>
               ))}
             </ul>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
