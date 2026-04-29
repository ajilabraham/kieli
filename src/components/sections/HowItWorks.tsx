
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const HowItWorks = () => {
  /*
  const skills = [
    {
      icon: Mic,
      title: "Speaking Practice",
      desc: "Roleplay real conversations with your AI tutor. Practice introductions, workplace scenarios, shopping, ordering food, customer interactions, and more."
    },
    {
      icon: Headphones,
      title: "Listening Support",
      desc: "Hear natural Finnish responses and improve your ability to understand real spoken language in context."
    },
    {
      icon: BookOpen,
      title: "Reading Guidance",
      desc: "Follow along with guided dialogues, lesson text, prompts, and scenario-based content."
    },
    {
      icon: PenTool,
      title: "Writing Reinforcement",
      desc: "Strengthen your learning through exercises, prompts, memory cards, and simple written recall activities."
    }
  ];
  */

  return (
    <div className="w-full bg-surface py-24 lg:py-32 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 3: How It Works - Hidden per request
        <div className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight">
              Your AI tutor guides you through the 4 essential language skills
            </h2>
            <p className="text-lg text-brandText/70 font-medium">
              Built around the core pillars of language learning: <br className="hidden md:block"/> 
              <span className="text-primary font-bold">Reading. Writing. Speaking. Listening.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                key={i} 
                className="bg-card rounded-[32px] p-8 lg:p-10 shadow-soft glass-border flex flex-col md:flex-row gap-6 items-start group hover:bg-card/80 transition-colors"
              >
                <div className="w-16 h-16 shrink-0 bg-secondary rounded-[20px] flex items-center justify-center shadow-sm glass-border group-hover:scale-110 transition-transform duration-300">
                  <skill.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-brandText">{skill.title}</h3>
                  <p className="text-brandText/70 leading-relaxed font-medium">
                    {skill.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        */}

        {/* Section 4: The Kieli Difference */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-card rounded-[40px] p-10 md:p-16 glass-border shadow-soft text-center space-y-8 relative overflow-hidden"
        >
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradientEnd/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary shadow-sm glass-border mx-auto relative z-10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-brandText/80">
              The Kieli Difference
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brandText leading-tight relative z-10">
            More than a chatbot. <br className="hidden md:block"/>
            More practical than a textbook.
          </h2>

          <p className="text-lg md:text-xl text-brandText/70 font-medium leading-relaxed max-w-2xl mx-auto relative z-10">
            Kieli is designed specifically for spoken Finnish acquisition, not just generic language tutoring. It combines structured pedagogical thinking with AI-driven conversation practice.
          </p>

          <div className="pt-4 border-t border-brandText/10 relative z-10">
            <p className="text-xl md:text-2xl font-semibold text-primary italic">
              "Kieli helps learners move from knowing about Finnish to actually speaking Finnish."
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
