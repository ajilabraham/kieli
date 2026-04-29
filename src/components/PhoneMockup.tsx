import { useEffect } from 'react';
import { ChevronDown, User, BookOpen, Users, Briefcase } from 'lucide-react';
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

    // Hide "Powered by" and "ElevenAgents" watermark inside Shadow DOM
    const hideWatermark = () => {
      const widget = document.querySelector('elevenlabs-convai');
      if (widget && widget.shadowRoot) {
        // Inject CSS to hide all anchor tags (the ElevenLabs link)
        if (!widget.shadowRoot.querySelector('#hide-watermark-style')) {
          const style = document.createElement('style');
          style.id = 'hide-watermark-style';
          style.innerHTML = `
            a {
              display: none !important;
              opacity: 0 !important;
              pointer-events: none !important;
              visibility: hidden !important;
            }
          `;
          widget.shadowRoot.appendChild(style);
        }

        // Also aggressively hide any text nodes containing the branding
        const walker = document.createTreeWalker(widget.shadowRoot, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (node.nodeValue?.includes('Powered by') || node.nodeValue?.includes('ElevenAgents')) {
            const parent = node.parentElement;
            if (parent) {
              parent.style.display = 'none';
              parent.style.opacity = '0';
              parent.style.visibility = 'hidden';
              parent.style.pointerEvents = 'none';
            }
          }
        }
      }
    };
    
    const interval = setInterval(hideWatermark, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-[356px] h-[736px] rounded-[56px] p-[10px] mx-auto bg-white/60 backdrop-blur-2xl border border-white"
      style={{
        boxShadow: "0 40px 80px -20px rgba(57, 94, 159, 0.4), inset 0 1px 2px rgba(255,255,255,0.9)",
      }}
    >
      {/* Hardware Buttons */}
      <div className="absolute top-28 -left-[2px] w-[2px] h-8 bg-brandText/20 rounded-l-sm" />
      <div className="absolute top-44 -left-[2px] w-[2px] h-14 bg-brandText/20 rounded-l-sm" />
      <div className="absolute top-64 -left-[2px] w-[2px] h-14 bg-brandText/20 rounded-l-sm" />
      <div className="absolute top-48 -right-[2px] w-[2px] h-16 bg-brandText/20 rounded-r-sm" />

      {/* Inner Screen */}
      <div className="relative w-full h-full bg-surface rounded-[46px] flex flex-col overflow-hidden border border-brandText/10"
           style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.02)" }}>
        
        {/* Subtle Earpiece */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-brandText/10 rounded-full z-50"></div>
      {/* Top App Bar inside Mockup */}
      <div className="flex items-center justify-between px-6 pt-10 pb-3 bg-surface/80 backdrop-blur-[20px] z-10 sticky top-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card shadow-sm glass-border overflow-hidden p-1.5">
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
        <div className="bg-card rounded-[24px] p-4 shadow-soft glass-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-caps text-brandText/50 mb-1.5 flex items-center justify-between">Current AI Tutor</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-brandText leading-none">Kieli AI</h3>
                <div className="flex items-center gap-1.5 ml-1 opacity-70">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface glass-border flex items-center justify-center shadow-sm">
              <span className="text-2xl">🧔🏽‍♂️</span>
            </div>
          </div>
        </div>

        {/* Dynamic ElevenLabs Widget Container */}
        <div className="flex-1 flex flex-col justify-end items-center pb-0 relative z-20">
          <div className="w-full relative h-[400px] flex items-center justify-center bg-card rounded-[32px] glass-border shadow-soft overflow-hidden group">
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/40 pointer-events-none" />
            
            <div className="absolute top-4 text-center w-full z-10 px-4">
               <p className="text-xs font-semibold tracking-wide text-black uppercase">Live Practice Session</p>
            </div>
            
             {/* The ElevenLabs Web Component - This needs space to render properly */}
             <div className="h-full w-full flex items-center justify-center scale-[0.85] pt-0">
               {/* @ts-ignore - Custom Element */}
               <elevenlabs-convai agent-id="agent_8001kpap365sfter9vyz7ntkp0mk" disable-banner="true"></elevenlabs-convai>
             </div>
          </div>
        </div>
      </div>
      
        {/* Home Indicator visual element */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-brandText/20 rounded-full"></div>
      </div>
    </motion.div>
  );
};
