import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, BarChart2, Clock, MapPin, ChevronRight, Check } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none opacity-50 z-0"></div>

            {/* Navbar */}
            <nav className="relative z-10 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">ProfitRider</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                        Log In
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-semibold hover:bg-slate-100 transition-all hover:scale-105"
                    >
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-medium mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    🎉 Public Beta — Free Credits Available
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                    Track Every Mile, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                        Maximize Every Session
                    </span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    The automated profit tracking tool built for delivery couriers. Start with 300 free credits during our public beta.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2"
                    >
                        Get Started Free <ChevronRight size={20} />
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-lg transition-all border border-slate-700"
                    >
                        View Demo
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-24 text-left">
                    <FeatureCard
                        icon={<BarChart2 className="text-blue-400" />}
                        title="Real-Time Analytics"
                        desc="Visualize your earnings, expenses, and net profit instantly."
                    />
                    <FeatureCard
                        icon={<MapPin className="text-indigo-400" />}
                        title="Mileage Tracking"
                        desc="Log your routes and fuel costs with precision."
                    />
                    <FeatureCard
                        icon={<Shield className="text-green-400" />}
                        title="Secure Data"
                        desc="Your financial data is encrypted and private."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800 bg-slate-950 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">© 2026 ProfitRider. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-500 text-sm">
                        <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
                        <Link to="/contact-support" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default Landing;
