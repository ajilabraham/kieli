
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpenCheck, Building2, Globe, TrendingUp } from 'lucide-react';

export const PlatformVision = () => {
  const ecosystem = [
    {
      icon: GraduationCap,
      title: "For Learners",
      desc: "A supportive AI coach for conversational language practice."
    },
    {
      icon: Users,
      title: "For Teachers",
      desc: "A platform to extend lessons with assignments, voice practice, structured content, and AI-supported feedback."
    },
    {
      icon: BookOpenCheck,
      title: "For Authors & Course Creators",
      desc: "A way to turn language books and teaching frameworks into interactive digital learning experiences."
    },
    {
      icon: Building2,
      title: "For Schools & Training Centers",
      desc: "A scalable platform that can support language teaching with optional AI-powered conversation tools."
    }
  ];

  const marketplaceFeatures = [
    "Educators can upload structured courses",
    "Authors can digitize and monetize their content",
    "Learners can choose courses by goal or profession",
    "Institutions can license tailored learning paths"
  ];

  return (
    <div className="w-full bg-secondary py-24 lg:py-32 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-[600px] h-[600px] bg-gradientEnd/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 11: For Learners, Teachers, and Institutions */}
        <div className="space-y-16">
          <div className="max-w-3xl text-center mx-auto space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight">
              Built to grow into a full spoken-language learning platform
            </h2>
            <p className="text-lg text-brandText/70 leading-relaxed font-medium">
              Kieli starts with a focused learner experience, but the vision is much bigger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((role, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                key={i} 
                className="bg-card rounded-[24px] p-8 shadow-soft glass-border flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1 transition-transform"
              >
                <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors" />
                <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center shadow-sm glass-border">
                  <role.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-brandText">{role.title}</h3>
                <p className="text-brandText/70 leading-relaxed font-medium text-sm">
                  {role.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 12: Marketplace Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-signature-gradient p-1 rounded-[40px] shadow-soft">
             <div className="bg-card rounded-[36px] p-8 lg:p-12 h-full flex flex-col justify-center">
               <TrendingUp className="w-12 h-12 text-primary mb-6" />
               <h3 className="text-xl font-bold text-brandText mb-4">Powerful possibilities:</h3>
               <ul className="space-y-4">
                 {marketplaceFeatures.map((item, i) => (
                   <li key={i} className="flex items-start gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                     <span className="text-brandText/80 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-brandText leading-tight">
              A future marketplace for language educators and content creators
            </h2>
            <div className="space-y-4 text-lg text-brandText/70 leading-relaxed font-medium">
              <p>
                Beyond the initial product, Kieli can evolve into a platform where teachers, authors, and training providers publish language learning programs powered by AI conversation.
              </p>
              <div className="pt-4 border-t border-brandText/10">
                <p className="text-xl font-bold text-primary tracking-wide">
                  One platform. Multiple teachers. Multiple languages. Real spoken learning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 13: Why Finnish, Why Now */}
        <div className="max-w-4xl mx-auto bg-card rounded-[40px] p-10 md:p-16 glass-border shadow-soft text-center space-y-8 relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary shadow-sm glass-border mx-auto relative z-10 mb-2">
            <Globe className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brandText leading-tight relative z-10">
            For many learners, speaking Finnish unlocks everyday life
          </h2>

          <div className="space-y-4 text-lg md:text-xl text-brandText/70 font-medium leading-relaxed max-w-2xl mx-auto relative z-10">
            <p>
              For immigrants, professionals, students, and workers, spoken Finnish can open doors to better integration, better communication, and better opportunities.
            </p>
            <p>
              But many existing tools don't focus enough on practical speaking. Kieli aims to fill that gap with a confidence-first, conversation-first approach built for real communication.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
