import { useEffect } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const PhoneMockup = () => {
  useEffect(() => {
    // Dynamically inject the ElevenLabs widget script
    const scriptId = 'eleven-labs-convai';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-[340px] h-[720px] bg-surface rounded-[48px] glass-border flex flex-col overflow-hidden mx-auto"
      style={{
        boxShadow: "0 25px 50px -12px rgba(57, 94, 159, 0.25), inset 0 0 0 8px #f0f4f7",
      }}
    >
      {/* Top App Bar inside Mockup */}
      <div className="flex items-center justify-between px-6 pt-10 pb-3 bg-surface/80 backdrop-blur-[20px] z-10 sticky top-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-card shadow-sm glass-border overflow-hidden p-1">
          <img src="/Logo.png" alt="Kieli" className="w-full h-full object-contain" />
        </div>
        
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-card shadow-soft glass-border">
          <span className="text-sm font-semibold text-brandText tracking-wide">Suomi</span>
          <ChevronDown className="w-4 h-4 text-brandText/60" />
        </div>
        
        <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary flex items-center justify-center text-primary">
          <User className="w-5 h-5" />
        </div>
      </div>

      {/* Main App Content area */}
      <div className="flex-1 flex flex-col px-6 pt-4 pb-6 space-y-4 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        
        <div className="space-y-1">
          <p className="label-caps text-primary">Your focus</p>
          <h2 className="text-[28px] font-bold tracking-tight text-brandText leading-tight">
            You can speak Finnish like a native
          </h2>
        </div>

        {/* Tutor Card Showcase */}
        <div className="bg-card rounded-[24px] p-4 shadow-soft glass-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-caps text-brandText/50 mb-1.5">Current AI Tutor</p>
              <h3 className="text-lg font-bold text-brandText">Krishna Regmi</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface glass-border flex items-center justify-center shadow-sm">
              <span className="text-2xl">🧔🏽‍♂️</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-secondary rounded-full text-xs font-semibold text-brandText/70 tracking-wide glass-border">Strict Focus</span>
            <span className="px-3 py-1.5 bg-secondary rounded-full text-xs font-semibold text-brandText/70 tracking-wide glass-border">Conversational</span>
          </div>
        </div>

        {/* Dynamic ElevenLabs Widget Container */}
        <div className="flex-1 flex flex-col justify-end items-center pb-0 relative z-20">
          <div className="w-full relative h-[400px] flex items-center justify-center bg-card rounded-[32px] glass-border shadow-soft overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/40 pointer-events-none" />
            
            <div className="absolute top-4 text-center w-full z-10 px-4">
               <p className="text-xs font-semibold tracking-wide text-brandText/50 uppercase">Live Practice Session</p>
            </div>
            
             {/* The ElevenLabs Web Component - This needs space to render properly */}
             <div className="h-full w-full flex items-center justify-center scale-[0.85] pt-0">
               {/* @ts-ignore - Custom Element */}
               <elevenlabs-convai agent-id="agent_8001kpap365sfter9vyz7ntkp0mk"></elevenlabs-convai>
             </div>
          </div>
        </div>
      </div>
      
      {/* Home Indicator visual element */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-brandText/20 rounded-full"></div>
    </motion.div>
  );
};
