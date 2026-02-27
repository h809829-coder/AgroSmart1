import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Droplets, 
  CloudSun, 
  Wallet, 
  MapPin, 
  ChevronRight, 
  ArrowRight, 
  History, 
  Download, 
  AlertTriangle,
  Menu,
  X,
  Thermometer,
  Wind,
  Layers,
  Calendar,
  MessageSquare,
  Send,
  User,
  Bot,
  Mic,
  MicOff,
  LogIn,
  LogOut,
  Lock,
  Mail,
  UserPlus
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for Tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ isLoggedIn, onLogout }: { isLoggedIn: boolean, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'Get Advice', path: '/form' },
    { name: 'History', path: '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Sprout className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Agro Smart
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <button 
                onClick={onLogout}
                className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <Link 
                to="/login" 
                className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <Sprout className="text-primary w-6 h-6" />
            <span className="text-xl font-bold text-white">Agro Smart</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed">
            Empowering farmers with data-driven crop planning and real-time weather advisory for a sustainable future.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/form" className="hover:text-primary transition-colors">Crop Advice</Link></li>
            <li><Link to="/history" className="hover:text-primary transition-colors">History</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>support@agrosmart.com</li>
            <li>+1 (555) 123-4567</li>
            <li>123 Farming Lane, Tech City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs">
        <p>© 2026 Agro Smart. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
            alt="Farming Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-6">
              Smart Farming Solution
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Plan Your Harvest <br />
              <span className="text-emerald-300 italic">With Precision</span>
            </h1>
            <p className="text-xl text-emerald-50 text-opacity-90 mb-10 leading-relaxed">
              Agro Smart uses advanced data analytics to recommend the best crops for your soil, season, and budget. Get real-time weather alerts and expert advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/form" 
                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center group"
              >
                Get Crop Advice
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/history" 
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
              >
                View History
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-0 right-0 z-10 hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-6">
              {[
                { icon: Layers, label: 'Soil Analysis', value: '5+ Types' },
                { icon: CloudSun, label: 'Weather Data', value: 'Real-time' },
                { icon: Sprout, label: 'Crop Database', value: '100+ Varieties' },
                { icon: Wallet, label: 'Budget Planning', value: 'Optimized' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center space-x-4"
                >
                  <div className="bg-white/20 p-3 rounded-xl">
                    <stat.icon className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase font-bold tracking-wider">{stat.label}</p>
                    <p className="text-white text-lg font-bold">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our intelligent system analyzes multiple factors to provide you with the most accurate farming advice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Input Details', 
                desc: 'Provide your location, soil type, and seasonal preferences.',
                icon: MapPin,
                color: 'bg-emerald-100 text-emerald-600'
              },
              { 
                title: 'AI Analysis', 
                desc: 'Our engine processes your data against historical yields and climate patterns.',
                icon: Layers,
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                title: 'Expert Advice', 
                desc: 'Receive a comprehensive report with crop, fertilizer, and irrigation plans.',
                icon: Sprout,
                color: 'bg-amber-100 text-amber-600'
              },
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 rounded-3xl border border-slate-100 card-hover">
                <div className={cn("inline-flex p-4 rounded-2xl mb-6", feature.color)}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const FormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    soilType: 'Loamy',
    season: 'Kharif',
    waterAvailability: 'Medium',
    budget: 'Medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing
    setTimeout(async () => {
      try {
        const response = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        setLoading(false);
        navigate('/result', { state: { recommendation: data.recommendation, input: formData } });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="bg-primary p-8 text-white">
            <h2 className="text-2xl font-bold">Crop Advisory Form</h2>
            <p className="text-emerald-50/80">Fill in the details to get your personalized recommendation.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-primary" />
                  Location / Region
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. Andhra Pradesh, India"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-primary" />
                  Soil Type
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.soilType}
                  onChange={(e) => setFormData({...formData, soilType: e.target.value})}
                >
                  {['Red', 'Black', 'Sandy', 'Loamy', 'Clay'].map(s => (
                    <option key={s} value={s}>{s} Soil</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  Season
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                >
                  {['Kharif', 'Rabi', 'Zaid'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Droplets className="w-4 h-4 mr-2 text-primary" />
                  Water Availability
                </label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  value={formData.waterAvailability}
                  onChange={(e) => setFormData({...formData, waterAvailability: e.target.value})}
                >
                  {['Low', 'Medium', 'High'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-primary" />
                  Budget Range
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Low', 'Medium', 'High'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({...formData, budget: b})}
                      className={cn(
                        "py-3 rounded-xl border font-medium transition-all",
                        formData.budget === b 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-primary"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  Processing...
                </>
              ) : (
                <>
                  Generate Advisory
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<any>(null);
  const { recommendation, input } = location.state || {};

  useEffect(() => {
    if (!recommendation) {
      navigate('/form');
      return;
    }

    // Fetch weather
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather?lat=17.3850&lon=78.4867'); // Default to Hyderabad coords for demo
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeather();
  }, [recommendation, navigate]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text("Agro Smart Advisory Report", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Location: ${input.location}`, 20, 37);
    
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 45, 190, 45);
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("Recommended Crop:", 20, 55);
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129);
    doc.text(recommendation.name, 20, 65);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Fertilizer Advice:", 20, 80);
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(recommendation.fertilizer, 20, 88);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Irrigation Schedule:", 20, 100);
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(recommendation.irrigation_schedule, 20, 108);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Expected Yield:", 20, 120);
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(recommendation.expected_yield, 20, 128);
    
    doc.save(`AgroSmart_Report_${recommendation.name}.pdf`);
  };

  if (!recommendation) return null;

  const chartData = [
    { name: 'Water', value: recommendation.water_requirement === 'High' ? 90 : recommendation.water_requirement === 'Medium' ? 60 : 30 },
    { name: 'Budget', value: input.budget === 'High' ? 90 : input.budget === 'Medium' ? 60 : 30 },
    { name: 'Yield', value: 85 },
  ];

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Weather Alert Banner */}
        {weather?.alerts?.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center"
          >
            <AlertTriangle className="text-amber-500 w-6 h-6 mr-3 flex-shrink-0" />
            <p className="text-amber-800 font-medium">{weather.alerts[0]}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Result Card */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
              <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-emerald-100 text-sm font-bold uppercase tracking-widest">Recommended Crop</span>
                  <h1 className="text-5xl font-black mt-2">{recommendation.name}</h1>
                </div>
                <Sprout className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-3 rounded-xl">
                      <Layers className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Fertilizer Advice</h3>
                      <p className="text-slate-500 text-sm mt-1">{recommendation.fertilizer}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Droplets className="text-secondary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Irrigation Schedule</h3>
                      <p className="text-slate-500 text-sm mt-1">{recommendation.irrigation_schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-xl">
                      <Sprout className="text-amber-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Expected Yield</h3>
                      <p className="text-slate-500 text-sm mt-1">{recommendation.expected_yield}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                    <History className="w-5 h-5 mr-2 text-primary" />
                    Analysis Overview
                  </h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-slate-500 text-sm italic">Based on {input.soilType} soil in {input.season} season.</p>
                <button 
                  onClick={downloadPDF}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center shadow-lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Weather & Alerts */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <CloudSun className="w-6 h-6 mr-2 text-secondary" />
                Weather Advisory
              </h3>
              
              {weather ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-5xl font-black text-slate-900">{Math.round(weather.main?.temp || 0)}°C</p>
                      <p className="text-slate-500 capitalize">{weather.weather?.[0]?.description}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <CloudSun className="w-12 h-12 text-secondary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Humidity</p>
                      <div className="flex items-center">
                        <Droplets className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-bold text-slate-700">{weather.main?.humidity}%</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Wind Speed</p>
                      <div className="flex items-center">
                        <Wind className="w-4 h-4 text-emerald-500 mr-2" />
                        <span className="font-bold text-slate-700">{weather.wind?.speed || 5} km/h</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-emerald-800 text-sm font-medium">
                      Ideal conditions for {recommendation.name} planting in the next 48 hours.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-slate-100 rounded-xl w-3/4" />
                  <div className="h-24 bg-slate-100 rounded-xl" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-slate-100 rounded-xl" />
                    <div className="h-16 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              )}
            </motion.div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
              <h3 className="font-bold mb-4">Need Expert Help?</h3>
              <p className="text-slate-400 text-sm mb-6">Connect with a certified agricultural consultant for a detailed field analysis.</p>
              <button className="w-full bg-primary py-3 rounded-xl font-bold hover:bg-primary/90 transition-all">
                Talk to Expert
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        setHistory(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewDetails = async (item: any) => {
    try {
      const res = await fetch(`/api/crop/${item.recommended_crop}`);
      const cropData = await res.json();
      
      navigate('/result', { 
        state: { 
          recommendation: cropData, 
          input: {
            location: item.location,
            soilType: item.soil_type,
            season: item.season,
            waterAvailability: item.water_availability,
            budget: item.budget
          } 
        } 
      });
    } catch (err) {
      console.error("Failed to fetch crop details:", err);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recommendation History</h1>
            <p className="text-slate-500">View your past crop advisories and analysis.</p>
          </div>
          <Link to="/form" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            New Analysis
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white h-48 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 card-hover"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Sprout className="text-primary w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.recommended_crop}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-2" />
                    {item.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Layers className="w-3.5 h-3.5 mr-2" />
                    {item.soil_type} Soil • {item.season}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                    item.water_availability === 'High' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                  )}>
                    {item.water_availability} Water
                  </span>
                  <button 
                    onClick={() => handleViewDetails(item)}
                    className="text-primary text-sm font-bold flex items-center hover:underline"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
            <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No History Yet</h3>
            <p className="text-slate-500 mt-2">Start your first analysis to see it here.</p>
            <Link to="/form" className="inline-block mt-6 text-primary font-bold hover:underline">
              Get Started Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const AboutPage = () => (
  <div className="pt-32 pb-20 min-h-screen bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About Agro Smart</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Agro Smart is a cutting-edge agricultural advisory platform dedicated to empowering farmers with data-driven insights. Our mission is to bridge the gap between traditional farming wisdom and modern technology.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img 
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" 
          alt="Our Mission" 
          className="rounded-3xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            We envision a world where every farmer, regardless of their scale, has access to the same high-quality data and expert advice as large industrial farms. By leveraging AI and real-time weather data, we help optimize yields and reduce waste.
          </p>
          <ul className="space-y-4">
            {[
              "Sustainable farming practices",
              "Data-driven crop selection",
              "Real-time weather risk management",
              "Accessible agricultural expertise"
            ].map((item, i) => (
              <li key={i} className="flex items-center text-slate-700">
                <div className="bg-primary/10 p-1 rounded-full mr-3">
                  <ChevronRight className="w-4 h-4 text-primary" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ServicesPage = () => (
  <div className="pt-32 pb-20 min-h-screen bg-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Comprehensive solutions designed to support every stage of your farming journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Crop Recommendation",
            desc: "Get scientific advice on the best crops to plant based on your soil, season, and local climate.",
            icon: Sprout,
            color: "bg-emerald-500"
          },
          {
            title: "Soil Health Analysis",
            desc: "Understand your soil composition and get tailored fertilizer recommendations to maintain fertility.",
            icon: Layers,
            color: "bg-blue-500"
          },
          {
            title: "Weather Advisory",
            desc: "Stay ahead of the weather with real-time alerts and long-term forecasts for your specific location.",
            icon: CloudSun,
            color: "bg-amber-500"
          },
          {
            title: "Irrigation Planning",
            desc: "Optimize your water usage with smart irrigation schedules based on crop needs and rainfall.",
            icon: Droplets,
            color: "bg-cyan-500"
          },
          {
            title: "Market Insights",
            desc: "Access data on market trends and expected yields to plan your sales and maximize profit.",
            icon: Wallet,
            color: "bg-indigo-500"
          },
          {
            title: "AI Chat Support",
            desc: "Get instant answers to your farming questions from our advanced AgroAI assistant.",
            icon: Bot,
            color: "bg-rose-500"
          }
        ].map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 card-hover"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg", service.color)}>
              <service.icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Get in Touch</h1>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Have questions about our platform or need technical support? Our team is here to help you grow.
            </p>

            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Us</h4>
                  <p className="text-slate-500">support@agrosmart.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-secondary/10 p-4 rounded-2xl">
                  <MapPin className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Visit Us</h4>
                  <p className="text-slate-500">123 Farming Lane, Tech City, IN 500001</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Name</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email</label>
                    <input required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Subject</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    onLogin();
    navigate('/');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-100"
      >
        <div className="bg-primary p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-emerald-50/80">Login to access your farming dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-primary" />
              Email Address
            </label>
            <input 
              required
              type="email" 
              placeholder="farmer@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center">
              <Lock className="w-4 h-4 mr-2 text-primary" />
              Password
            </label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Sign In
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Mock registration
    alert("Registration successful! Please login.");
    navigate('/login');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border border-slate-100"
      >
        <div className="bg-secondary p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-blue-50/80">Join Agro Smart to optimize your farm</p>
        </div>

        <form onSubmit={handleRegister} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <User className="w-3.5 h-3.5 mr-2 text-secondary" />
              Full Name
            </label>
            <input 
              required
              type="text" 
              placeholder="John Farmer"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-secondary" />
              Email Address
            </label>
            <input 
              required
              type="email" 
              placeholder="farmer@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-2 text-secondary" />
              Password
            </label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-2 text-secondary" />
              Confirm Password
            </label>
            <input 
              required
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all text-sm"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold text-base hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20 mt-4"
          >
            Create Account
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Hello! I am your Agro Smart AI assistant. How can I help you with your farming today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Voice Recognition Setup
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "You are an expert agricultural AI assistant for the Agro Smart application. Provide helpful, accurate, and concise advice on crop planning, soil health, irrigation, fertilizers, and weather-related farming decisions. Keep your tone professional and encouraging for farmers.",
        },
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col overflow-hidden border border-slate-100 mb-4"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6" />
                <div>
                  <h3 className="font-bold text-sm">AgroAI Assistant</h3>
                  <p className="text-[10px] text-emerald-100">Online & Ready to help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-100 text-xs flex items-center space-x-1">
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={startListening}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    isListening ? "bg-red-100 text-red-500 animate-pulse" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input 
                  type="text" 
                  placeholder={isListening ? "Listening..." : "Ask about crops, soil..."}
                  className="flex-grow px-4 py-2 bg-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110",
          isOpen ? "bg-slate-800 text-white rotate-90" : "bg-primary text-white"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

// --- Main App ---

const ProtectedRoute = ({ isLoggedIn, children }: { isLoggedIn: boolean, children: React.ReactNode }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/form" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <FormPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <ResultPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute isLoggedIn={isLoggedIn}>
                  <HistoryPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}
