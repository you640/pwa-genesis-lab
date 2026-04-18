import React from 'react';
import { PageRoute } from '../types';

interface FooterProps {
    onNavigate: (route: PageRoute, slug?: string | null) => void;
    isPaused: boolean;
    onTogglePause: () => void;
}

export const Footer: React.FC<FooterProps> = React.memo(({ onNavigate, isPaused, onTogglePause }) => {
    const handleNavigation = (route: PageRoute, slug: string | null = null) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onNavigate(route, slug);
    };

    return (
        <footer className="bg-black border-t border-slate-800 relative overflow-hidden">
            {/* Animated top border */}
            <div className="absolute top-0 left-0 w-full h-1">
                <div className="live-border"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Column 1: Branding and Socials */}
                    <div className="space-y-4">
                        <h3 className="font-teko text-4xl font-bold text-lime-400 uppercase">THE FORGE</h3>
                        <p className="text-slate-400 text-sm">Elite gear and supplements for the dedicated athlete. No excuses. Only results.</p>
                        <div className="flex space-x-4">
                            {/* Social Icons with hover effect */}
                            <a href="#" className="text-slate-500 hover:text-lime-400 transition-transform transform hover:scale-125" aria-label="Visit our Twitter">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-lime-400 transition-transform transform hover:scale-125" aria-label="Visit our Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.667 0 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"></path>
                                </svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-lime-400 transition-transform transform hover:scale-125" aria-label="Visit our Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4z"></path>
                                </svg>
                            </a>
                        </div>
                        <div className="mt-6 space-y-3 pt-4 border-t border-slate-800">
                             <a href="tel:+15551234567" className="flex items-center text-slate-400 hover:text-lime-400 transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 flex-shrink-0 text-slate-500 group-hover:text-lime-400 transition-colors">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                                <span>+1 (555) 123-4567</span>
                            </a>
                             <a href="mailto:support@theforge.com" className="flex items-center text-slate-400 hover:text-lime-400 transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3 flex-shrink-0 text-slate-500 group-hover:text-lime-400 transition-colors">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <span>support@theforge.com</span>
                            </a>
                        </div>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-teko text-2xl uppercase text-white">Quick Links</h4>
                        <ul className="mt-4 space-y-2">
                            <li><button onClick={handleNavigation('home')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Home</button></li>
                             <li><button onClick={handleNavigation('blog')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Protocols</button></li>
                            <li><button onClick={handleNavigation('contact')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Contact Us</button></li>
                        </ul>
                    </div>
                    {/* Column 3: Information */}
                     <div>
                        <h4 className="font-teko text-2xl uppercase text-white">Information</h4>
                        <ul className="mt-4 space-y-2">
                           <li><button onClick={handleNavigation('terms-of-service')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Terms of Service</button></li>
                           <li><button onClick={handleNavigation('privacy-policy')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Privacy Policy</button></li>
                           <li><button onClick={handleNavigation('shipping-and-returns')} className="text-slate-400 hover:text-lime-400 transition-transform transform hover:translate-x-2">Shipping & Returns</button></li>
                        </ul>
                    </div>
                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="font-teko text-2xl uppercase text-white">Join The Legion</h4>
                        <p className="mt-4 text-slate-400 text-sm">Get exclusive access to new drops, training protocols, and expert content.</p>
                        <form className="mt-4">
                            <div className="flex group">
                                <input type="email" placeholder="Your Email Address" className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-lime-500"/>
                                <button className="bg-lime-500 text-slate-900 font-bold px-4 py-2 rounded-r-md hover:bg-lime-400 transition-colors group-hover:scale-105 transform" aria-label="Subscribe to newsletter">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-16 border-t border-slate-800 pt-8 text-slate-500 text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} THE FORGE Industries. All Rights Reserved. Unleash Your Potential.</p>
                    <button
                        onClick={onTogglePause}
                        className="btn-3d p-0 w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                        aria-label={isPaused ? "Resume animations" : "Pause animations"}
                    >
                        {isPaused ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-0.5">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            <style>{`
                .live-border {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 15%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #a3e635);
                    animation: scan 5s linear infinite;
                }
                @keyframes scan {
                    0% {
                        left: -15%;
                    }
                    100% {
                        left: 100%;
                    }
                }
            `}</style>
        </footer>
    );
});