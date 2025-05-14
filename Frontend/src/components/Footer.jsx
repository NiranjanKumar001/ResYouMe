import React from "react";
import { Heart, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  // Add these styles to the component
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&family=Chakra+Petch:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <footer className="relative py-16 overflow-hidden bg-slate-950 border-t border-gray-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>

      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <div className="absolute bottom-0 left-[-15%] top-[-15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(217,70,239,0.25),rgba(255,255,255,0))] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-[-15%] top-[-15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(99,102,241,0.3),rgba(255,255,255,0))] animate-pulse-slow-delay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>MUSAFIR</h3>
            <p className="text-gray-400 text-sm leading-relaxed tracking-tight">
              Transforming resumes into beautiful portfolios with AI-powered technology.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>PRODUCT</h3>
            <ul className="space-y-2 text-sm text-gray-400 tracking-tight">
              <li><a href="/insights" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/subscription" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/templates" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coming Soon</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>COMPANY</h3>
            <ul className="space-y-2 text-sm text-gray-400 tracking-tight">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coming Soon</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-wider" style={{ fontFamily: "'Chakra Petch', sans-serif" }}>CONNECT</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4 tracking-tight">
              Subscribe to our newsletter for updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="bg-gray-800/50 border border-gray-700 rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500 w-full tracking-tight"
                style={{ fontFamily: "'DM Mono', monospace" }}
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors tracking-wider">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="h-4 w-4 text-red-400 fill-red-400/20 mr-2" />
            <span className="text-sm text-gray-400 tracking-tight" style={{ fontFamily: "'DM Mono', monospace" }}>
              Crafted with passion by Team Musafir
            </span>
          </div>

          <div className="flex space-x-6 text-sm text-gray-400 tracking-tight">
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
          </div>

          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-400 tracking-tight">
              © {new Date().getFullYear()} MUSAFIR. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes pulse-slow-delay {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slow-delay {
          animation: pulse-slow-delay 10s ease-in-out infinite 2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;