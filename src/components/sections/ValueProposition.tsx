import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, Briefcase, Quote, Play } from 'lucide-react';

export const ValueProposition = () => {
  return (
    <div className="w-full bg-secondary py-24 lg:py-32 relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-gradientEnd/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-32">
        
        {/* Section 1: Why Kieli Exists */}
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight mb-8">
                Speaking a language is different from <span className="text-primary italic">studying</span> a language.
              </h2>
              <div className="space-y-6 text-lg lg:text-xl text-brandText/70 leading-relaxed font-medium">
                <p>
                  Most language apps help you memorize words, complete grammar exercises, and tap through lessons. But when it's time to actually speak in a real situation, many learners freeze.
                </p>
                <p className="text-brandText font-semibold">
                  Kieli is built differently.
                </p>
                <p>
                  We help learners practice real spoken Finnish through immersive AI conversations, so they can build confidence before speaking with real people. No fear of judgment. No embarrassment over mistakes. Just practical, supportive speaking practice that helps learners communicate in everyday life.
                </p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full aspect-square max-w-md mx-auto lg:ml-auto lg:mr-0 bg-card rounded-[40px] glass-border shadow-soft flex flex-col items-center justify-center gap-6 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-signature-gradient opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
              
              <div className="w-24 h-24 rounded-full bg-surface glass-border shadow-soft flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-500">
                <Play className="w-8 h-8 text-primary ml-2 fill-primary/20" />
              </div>
              
              <div className="text-center relative z-10 space-y-2">
                <p className="text-sm font-bold tracking-widest text-primary uppercase">Watch Video</p>
                <p className="text-brandText/50 font-medium">See how Kieli works</p>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Speak without fear",
                desc: "Practice with AI before speaking in real-world situations. Make mistakes privately."
              },
              {
                icon: MessageCircle,
                title: "Learn through conversation",
                desc: "Build fluency by talking, listening, responding, and repeating exactly as you would normally."
              },
              {
                icon: Briefcase,
                title: "Train for real life",
                desc: "Learn Finnish for work, daily errands, public services, and social situations."
              }
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                key={i} 
                className="bg-card rounded-[24px] p-8 shadow-soft glass-border flex flex-col gap-4"
              >
                <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center shadow-sm glass-border">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-brandText">{feature.title}</h3>
                <p className="text-brandText/70 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Section 2: The Core Problem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-brandText leading-tight">
              Learners don't struggle because they lack grammar. They struggle because they lack speaking practice.
            </h2>
            <div className="space-y-6 text-lg text-brandText/70 leading-relaxed font-medium">
              <p>
                Many learners understand some vocabulary and grammar, but still hesitate when they need to speak. Why?
              </p>
              <div className="bg-card p-6 rounded-[24px] glass-border shadow-soft space-y-4">
                <p className="font-semibold text-brandText mb-2">Because real fluency requires:</p>
                <ul className="space-y-3">
                  {[
                    "Confidence under pressure",
                    "Listening comprehension in context",
                    "Quick spoken responses",
                    "Repeated real-life practice"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-brandText/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                Kieli is designed to remove the "fear of making mistakes" barrier by giving every learner a patient, private AI language coach available anytime.
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="w-full bg-signature-gradient p-[2px] rounded-[32px] shadow-soft"
          >
            <div className="h-full w-full bg-card/95 backdrop-blur-[20px] rounded-[30px] p-10 lg:p-14 relative overflow-hidden flex flex-col justify-center">
              <Quote className="absolute top-6 left-6 w-24 h-24 text-primary/10 -z-10" />
              <p className="text-2xl md:text-3xl font-semibold leading-relaxed text-brandText italic relative z-10 text-center">
                "You don't need perfect grammar to start speaking. You need to be understood — and to keep going."
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
