import { motion } from 'framer-motion';
import { Bot, Users, PlayCircle, Network } from 'lucide-react';

const layers = [
  {
    id: 1,
    title: "AI Language Tutor",
    description: "Provides scale, daily continuity, and zero-judgment practice.",
    icon: Bot,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
    borderColor: "border-blue-500/20"
  },
  {
    id: 2,
    title: "Human Language Experts",
    description: "Provides depth, targeted correction, and emotional support.",
    icon: Users,
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-500",
    borderColor: "border-purple-500/20"
  },
  {
    id: 3,
    title: "Scenario-Based Video Learning",
    description: "Provides behavioral context and workplace realism.",
    icon: PlayCircle,
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-500",
    borderColor: "border-orange-500/20"
  },
  {
    id: 4,
    title: "Trade-Peer Induction Support",
    description: "Provides workforce confidence and cultural orientation.",
    icon: Network,
    color: "from-green-500/20 to-green-600/5",
    iconColor: "text-green-500",
    borderColor: "border-green-500/20"
  }
];

export const TrainingLayers = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-surface">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft glass-border mb-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              The Kieli Architecture
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText"
          >
            Comprehensive Training Layers
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brandText/60"
          >
            A multi-layered approach designed to build fluency, confidence, and cultural readiness from the ground up.
          </motion.p>
        </div>

        {/* Layers Stack Visualization */}
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-brandText/5 via-primary/20 to-brandText/5 -translate-x-1/2 hidden md:block" />

          <div className="space-y-6 md:space-y-8">
            {layers.map((layer, index) => (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 group"
              >
                {/* Number indicator for mobile */}
                <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-card glass-border text-brandText font-bold shadow-soft z-10 shrink-0">
                  {layer.id}
                </div>

                {/* Left side (empty on even, content on odd) */}
                <div className={`flex-1 w-full md:text-right ${index % 2 !== 0 ? 'md:order-1' : ''}`}>
                  <div className={`bg-card rounded-3xl p-6 md:p-8 shadow-soft glass-border border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${layer.borderColor} group-hover:border-primary/30`}>
                    {/* Subtle gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${layer.color} opacity-50`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex items-center gap-3 mb-4 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-2xl bg-surface glass-border flex items-center justify-center shadow-sm ${layer.iconColor}`}>
                          <layer.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-brandText/50 mb-1">Layer {layer.id}</p>
                          <h3 className="text-xl font-bold text-brandText">{layer.title}</h3>
                        </div>
                      </div>
                      
                      <p className={`text-brandText/70 leading-relaxed ${index % 2 !== 0 ? 'md:text-right' : 'md:text-left'} text-left`}>
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Center dot for desktop */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-card glass-border shadow-soft z-10 shrink-0 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-150 animate-ping opacity-20" style={{ animationDelay: `${index * 0.5}s` }} />
                  <span className="text-lg font-bold text-brandText">{layer.id}</span>
                </div>

                {/* Right side (content on even, empty on odd) */}
                <div className={`flex-1 hidden md:block ${index % 2 !== 0 ? 'md:order-0' : ''}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
