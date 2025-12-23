import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock, Trophy, Coins } from 'lucide-react';

// --- VERBESSERTER HAMSTER (CUTE VERSION) ---
const HamsterAvatar = ({ mood, sleeping }: { mood: string; sleeping: boolean }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sleeping) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3800);
    return () => clearInterval(interval);
  }, [sleeping]);

  return (
    <div className="relative flex items-center justify-center w-full h-64 select-none">
      {/* Schatten */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-10 w-40 h-6 bg-black rounded-[100%] blur-xl" 
      />
      
      <motion.svg 
        width="200" height="200" viewBox="0 0 200 200"
        animate={{ y: [0, -10, 0], rotate: [0, 1, -1, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Ohren */}
        <circle cx="65" cy="55" r="18" fill="#E8944A" />
        <circle cx="65" cy="55" r="10" fill="#FFC0CB" />
        <circle cx="135" cy="55" r="18" fill="#E8944A" />
        <circle cx="135" cy="55" r="10" fill="#FFC0CB" />

        {/* Körper (Fell) */}
        <ellipse cx="100" cy="110" rx="75" ry="70" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="3"/>
        <path d="M 40 100 Q 100 40, 160 100" fill="#FFA857" opacity="0.9"/>
        
        {/* Bauch-Fleck */}
        <ellipse cx="100" cy="130" rx="35" ry="30" fill="#FFF5EE" opacity="0.5" />

        {/* Schnurrhaare */}
        <g stroke="#D2B48C" strokeWidth="1" strokeLinecap="round">
          <line x1="50" y1="110" x2="20" y2="105" /><line x1="50" y1="115" x2="25" y2="125" />
          <line x1="150" y1="110" x2="180" y2="105" /><line x1="150" y1="115" x2="175" y2="125" />
        </g>

        {/* Augen */}
        <g transform="translate(0, 5)">
          {isBlinking || sleeping ? (
            <g stroke="#333" strokeWidth="5" strokeLinecap="round" fill="none">
              <path d="M 65 95 Q 75 95, 85 95" />
              <path d="M 115 95 Q 125 95, 135 95" />
            </g>
          ) : (
            <g>
              <circle cx="75" cy="95" r="10" fill="#1a1a1a" />
              <circle cx="125" cy="95" r="10" fill="#1a1a1a" />
              <circle cx="78" cy="91" r="4" fill="white" />
              <circle cx="128" cy="91" r="4" fill="white" />
            </g>
          )}
        </g>

        {/* Bäckchen (Blush) */}
        <circle cx="55" cy="115" r="8" fill="#FFB6C1" opacity="0.4" />
        <circle cx="145" cy="115" r="8" fill="#FFB6C1" opacity="0.4" />

        {/* Nase & Mund */}
        <path d="M 92 110 L 108 110 L 100 118 Z" fill="#FF80AB" />
        <path d="M 90 125 Q 100 132, 110 125" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Pfötchen */}
        <circle cx="65" cy="160" r="10" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="2" />
        <circle cx="135" cy="160" r="10" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="2" />
      </motion.svg>
    </div>
  );
};

export default function App() {
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [showGame, setShowGame] = useState(false);

  const level = Math.floor(xp / 100) + 1;

  const handleCheat = () => {
    const pw = window.prompt("Hami Admin Key:");
    if (pw === "6212") {
      setCoins(c => c + 700);
      setXp(x => x + 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans selection:bg-orange-200">
      {/* Desktop Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-amber-200 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 p-6">
        
        {/* Left Side: The Hamster Room */}
        <div className="w-full md:w-3/5 bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-white relative aspect-square md:aspect-auto md:h-[650px] flex flex-col items-center justify-center bg-gradient-to-b from-orange-50/50 to-white">
          <button onClick={handleCheat} className="absolute top-8 right-8 text-orange-100 hover:text-orange-300 transition-colors z-50">
            <Lock size={20} />
          </button>

          <AnimatePresence>
            {xp > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="absolute top-10 left-10 bg-orange-100 text-orange-700 px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2"
              >
                <Trophy size={16} /> Level {level}
              </motion.div>
            )}
          </AnimatePresence>

          <HamsterAvatar mood="happy" sleeping={false} />
          
          <div className="absolute bottom-12 w-full px-12">
            <div className="flex justify-between mb-2 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Hami's Glück</span>
              <span>{Math.round((hunger + cleanliness) / 2)}%</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
              <motion.div 
                animate={{ width: `${(hunger + cleanliness) / 2}%` }} 
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Controls & Stats */}
        <div className="w-full md:w-2/5 flex flex-col gap-6">
          {/* Stats Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <Coins size={32} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Dein Kontostand</p>
                <p className="text-3xl font-black">{coins} <span className="text-lg text-amber-500 font-bold">CC</span></p>
              </div>
            </div>
          </div>

          {/* Progress Bars Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-4 border-white space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-sm px-1"><span>Hunger</span><span className={hunger < 30 ? 'text-red-500' : ''}>{Math.round(hunger)}%</span></div>
              <div className="h-6 bg-slate-50 rounded-2xl overflow-hidden p-1 border">
                <motion.div animate={{ width: `${hunger}%` }} className={`h-full rounded-xl ${hunger < 30 ? 'bg-red-400' : 'bg-green-400'}`} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between font-bold text-sm px-1"><span>Sauberkeit</span><span>{Math.round(cleanliness)}%</span></div>
              <div className="h-6 bg-slate-50 rounded-2xl overflow-hidden p-1 border">
                <motion.div animate={{ width: `${cleanliness}%` }} className="h-full bg-blue-400 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {setHunger(prev => Math.min(100, prev + 20)); setXp(prev => prev + 10)}}
              className="group bg-green-500 hover:bg-green-600 text-white p-6 rounded-[2rem] shadow-lg shadow-green-100 transition-all active:scale-95 flex flex-col items-center gap-2"
            >
              <Sparkles className="group-hover:rotate-12 transition-transform" size={32} />
              <span className="font-black text-sm uppercase">Füttern</span>
            </button>
            <button 
              onClick={() => setShowGame(true)}
              className="group bg-rose-500 hover:bg-rose-600 text-white p-6 rounded-[2rem] shadow-lg shadow-rose-100 transition-all active:scale-95 flex flex-col items-center gap-2"
            >
              <Play className="group-hover:scale-110 transition-transform" size={32} />
              <span className="font-black text-sm uppercase">Spielen</span>
            </button>
            <button 
              onClick={() => {setCleanliness(100); setXp(prev => prev + 5)}}
              className="group bg-sky-500 hover:bg-sky-600 text-white p-6 rounded-[2rem] shadow-lg shadow-sky-100 transition-all active:scale-95 flex flex-col items-center gap-2 col-span-2"
            >
              <Trash2 className="group-hover:-translate-y-1 transition-transform" size={32} />
              <span className="font-black text-sm uppercase tracking-widest">Zimmer putzen</span>
            </button>
          </div>
        </div>
      </main>

      {/* Game Overlay */}
      <AnimatePresence>
        {showGame && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-orange-600/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[4rem] p-12 text-center max-w-lg shadow-2xl"
            >
              <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play size={48} fill="currentColor" />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">HAMI RUN</h2>
              <p className="text-slate-400 mb-10 text-lg font-medium leading-relaxed">Sammle so viele Sonnenblumenkerne wie möglich! Das Spiel wird gerade vorbereitet...</p>
              <button 
                onClick={() => {setShowGame(false); setXp(x => x + 40)}}
                className="bg-slate-900 text-white font-black w-full py-6 rounded-3xl text-xl hover:bg-black transition-colors"
              >
                JETZT TESTEN (+40 XP)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
