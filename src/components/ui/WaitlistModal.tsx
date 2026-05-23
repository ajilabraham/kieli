import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Copy, Loader2 } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const WaitlistModal = ({ isOpen, onClose, initialEmail = '' }: WaitlistModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync initial email when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setStatus('idle');
      setCopied(false);
      setName('');
    }
  }, [isOpen, initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'a2be38e0-82b5-4f99-9935-7b0bfc938f59',
          name: name,
          email: email,
          subject: 'New Waitlist Signup for Kieli',
          from_name: 'Kieli Waitlist',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Generate a mock referral link based on the user's name
        const mockRefCode = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 5) + Math.floor(Math.random() * 1000);
        setReferralLink(`https://kieli.app/?ref=${mockRefCode}`);
        setStatus('success');
      } else {
        console.error('Web3Forms Error:', result);
        setStatus('idle');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setStatus('idle');
      alert('Network error. Please try again.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card w-full max-w-md rounded-[32px] p-8 glass-border shadow-[0_20px_60px_-15px_rgba(57,94,159,0.2)] relative z-10 overflow-hidden"
        >
          {/* Decorative background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradientEnd/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary text-brandText/60 hover:text-brandText transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {status !== 'success' ? (
            <div className="space-y-8 relative z-10">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-[16px] flex items-center justify-center shadow-sm mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-brandText">Join the Waitlist</h3>
                <p className="text-brandText/70 font-medium">
                  Be the first to know when Kieli launches and secure early access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-brandText/80 pl-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-5 py-3 bg-surface rounded-xl glass-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-brandText/80 pl-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-5 py-3 bg-surface rounded-xl glass-border shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full mt-6 py-4 rounded-xl bg-signature-gradient text-white font-bold tracking-wide shadow-soft flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Securing your spot...</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 relative z-10 py-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-brandText">You're on the list!</h3>
                <p className="text-brandText/70 font-medium">
                  Thanks for joining, {name}! We've sent a confirmation email to {email}. You'll be the first to know when we launch.
                </p>
              </div>

              <div className="bg-secondary p-6 rounded-2xl border border-primary/10 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[30px]" />
                
                <h4 className="font-bold text-brandText">Want 3 months for free? 🎁</h4>
                <p className="text-sm text-brandText/70 font-medium leading-relaxed">
                  Share your unique referral link below. If 5 people join the waitlist using your link, you'll get 3 months of Kieli absolutely free!
                </p>
                
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 bg-surface px-4 py-3 rounded-xl border border-primary/10 text-sm font-medium text-brandText/80 truncate">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors flex shrink-0"
                    title="Copy Link"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 rounded-xl bg-surface hover:bg-secondary text-brandText font-bold tracking-wide border border-primary/10 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
