import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseMedical, Code2, Coffee, Layers, UserCog } from 'lucide-react';

export const LearningPath = () => {
  const progressions = [
    "A0", "A1", "A2", "Everyday Fluency", "Workplace Fluency"
  ];

  const professions = [
    { icon: Code2, label: "IT professionals" },
    { icon: UserCog, label: "Customer-facing roles" },
    { icon: Coffee, label: "Restaurant staff" },
    { icon: BriefcaseMedical, label: "Healthcare support" }
  ];

  const scaleComponents = [
    "Guided dialogues", "Pronunciation practice", "Quizzes", "Memory cards",
    "Follow-up assignments", "Scenario roleplay", "Progress-based reinforcement"
  ];

  return (
    <div className="w-full bg-surface py-24 lg:py-32 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 8: Start with Basics, Grow into Fluency */}
        <div className="space-y-12">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight">
              Structured from beginner level — designed for real progression
            </h2>
            <p className="text-lg text-brandText/70 leading-relaxed font-medium">
              Learners can begin with simple foundational dialogues and gradually move toward more advanced, contextual speaking.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-6 lg:p-8 rounded-[32px] glass-border shadow-soft">
              {progressions.map((level, i) => (
                <React.Fragment key={i}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center bg-secondary px-6 py-4 rounded-full font-bold text-primary shadow-sm glass-border text-center flex-1 w-full md:w-auto"
                  >
                    {level}
                  </motion.div>
                  {i < progressions.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-brandText/30 hidden md:block rotate-90 md:rotate-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-brandText/60 font-medium text-sm">
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Basic spoken interactions</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Daily survival Finnish</span>
              <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Work-focused communication</span>
            </div>
          </div>
        </div>

        {/* Section 9: Industry-Focused Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
              Finnish for real professions, not just generic lessons
            </h2>
            <div className="space-y-4 text-lg text-brandText/70 leading-relaxed font-medium">
              <p>
                Language learners often need Finnish for a specific goal: work. Kieli can support profession-oriented learning paths so learners can practice the conversations that matter most in their field.
              </p>
              <div className="pt-4 border-t border-brandText/10">
                <p className="text-xl font-semibold text-primary italic">
                  "Because the fastest way to stay motivated is to learn language that immediately helps in real life and real work."
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {professions.map((prof, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                key={i} 
                className="bg-card p-6 rounded-[24px] glass-border shadow-soft flex items-center gap-4 hover:shadow-lg transition-shadow cursor-default"
              >
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
                  <prof.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-brandText">{prof.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 10: Based on Content That Can Scale */}
        <div className="bg-signature-gradient rounded-[40px] p-[2px] shadow-soft">
          <div className="bg-card/95 backdrop-blur-[20px] rounded-[38px] p-10 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
            
            <div className="flex-1 space-y-6">
              <div className="w-16 h-16 bg-secondary rounded-[20px] flex items-center justify-center shadow-sm glass-border mb-8">
                <Layers className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
                Structured content + AI interaction = practical learning at scale
              </h2>
              <p className="text-lg text-brandText/70 leading-relaxed font-medium">
                Kieli combines curated learning materials with AI tutoring to create a more interactive language learning experience. This means learners don't just consume content — they practice it.
              </p>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-secondary/50 rounded-[24px] p-6 lg:p-8 space-y-4 glass-border">
                <p className="font-semibold text-brandText mb-4">Possible learning components include:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scaleComponents.map((comp, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-brandText/80 font-medium">{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
