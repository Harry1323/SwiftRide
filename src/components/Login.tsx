import { useState, useEffect } from "react";
import { LogIn, ShieldCheck, MapPin, Navigation, Sparkles, Bike } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { APP_NAME } from "../constants";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <Bike className="w-24 h-24 text-white animate-bounce" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200%" }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-1 bg-white/20 rounded-full overflow-hidden"
              >
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-1/2 h-full bg-white"
                />
              </motion.div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black text-white mt-12 tracking-tighter"
            >
              {APP_NAME}
            </motion.h1>
            <p className="text-white/40 text-sm mt-2 font-medium uppercase tracking-widest">Riding to the future...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/seed/ride/1920/1080?blur=10')] bg-cover bg-center opacity-5 shadow-inner" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md w-full relative z-10"
        >
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div 
              whileHover={{ rotate: 0 }}
              initial={{ rotate: 12 }}
              className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-transform duration-500"
            >
              <div className="w-10 h-10 bg-white rounded-lg rotate-45" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">{APP_NAME}</h1>
            <p className="text-lg text-gray-500 font-medium max-w-xs">
              The future of urban mobility, powered by AI.
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-bold text-gray-700">Real-time GPS Tracking</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-bold text-gray-700">AI Route Optimization</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                <p className="text-sm font-bold text-gray-700">Verified & Insured Rides</p>
              </div>
            </div>

            <button
              onClick={onLogin}
              className="w-full bg-black text-white py-5 rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center justify-center gap-3"
            >
              <LogIn className="w-6 h-6" />
              Continue with Google
            </button>

            <p className="text-center text-xs text-gray-400 font-medium px-6">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Global Coverage</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Secure Payments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

