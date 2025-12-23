import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock } from 'lucide-react';

// --- VERBESSERTER HAMSTER AVATAR ---
const HamsterAvatar = ({ sleeping }: { sleeping: boolean }) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sleeping) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [sleeping]);

  return (
    <div className="relative flex items-center justify-center w-full h-48 bg-orange-50/50 rounded-3xl my-4">
      {/* Schatten unter dem Hamster */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-6 w-24 h-4 bg-black rounded-[100%] blur-md" 
      />
      
      <motion.svg 
        width="120" height="140" viewBox="0 0 140 160"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        {/* Körper */}
        <ellipse cx="70" cy="90" rx="55" ry="50" fill="#FFFFFF" stroke="#F3E5AB" strokeWidth="3"/>
        {/* Ohren/Fell-Akzent */}
        <path d="M 30 65 Q 70 30, 110 65" fill="#FFB347" opacity="0.9"/>
        
        {/* Augen */}
        <g transform="translate(0, 5)">
          {isBlinking || sleeping ? (
            <g stroke="#333" strokeWidth="4" strokeLinecap="round">
              <line x1="45" y1="75" x2="60" y2="75" />
              <line x1="80" y1="75" x2="95" y2="75" />
            </g>
          ) : (
            <g>
              <circle cx="55" cy="75" r="8" fill="#1a1a1a" />
              <circle cx="85" cy="75" r="8" fill="#1a1a1a" />
              <circle cx="58" cy="72" r="3" fill="white" />
              <circle cx="88" cy="72" r="3" fill="white" />
            </g>
          )}
        </g>
        {/* Nase und Mund */}
        <circle cx="70" cy="88" r="5" fill="#FFC0CB"/>
        <path d="M 62 98 Q 70 105, 78 98" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
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
    const pw = window.prompt("Admin Passwort:");
    if (pw === "6212") {
      setCoins(c => c + 700);
      setXp(x => x + 1000);
      alert("Hami-Cheat aktiviert! 🚀");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 font-sans px-4">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden relative border-[12px] border-white ring-1 ring-black/5">
        
        {/* Geheim-Button */}
        <button onClick={handleCheat} className="absolute top-6 right-8 z-50 text-gray-200 hover:text-orange-400 p-2">
          <Lock size={16} />
        </button>

        {/* Oberer Bereich mit Stats */}
        <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-8 pt-10 text-white shadow-inner">
          <h1 className="text-4xl font-black tracking-tighter text-center mb-6">HAMI</h1>
          <div className="grid grid-cols-3 gap-2 bg-black/10 rounded-2xl p-4 text-center backdrop-blur-sm">
            <div><p className="text-[10px] opacity-70 uppercase font-bold">Level</p><p className="font-black text-xl">{level}</p></div>
            <div><p className="text-[10px] opacity-70 uppercase font-bold">XP</p><p className="font-black text-xl">{xp % 100}</p></div>
            <div><p className="text-[10px] opacity-70 uppercase font-bold">Coins</p><p className="font-black text-xl">{coins}</p></div>
          </div>
        </div>

        {/* Status-Balken */}
        <div className="p-8 pb-0 space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase px-1"><span>Hunger</span><span>{Math.round(hunger)}%</span></div>
            <div className="h-6 bg-gray-100 rounded-full border-2 border-gray-50 p-1">
              <motion.div animate={{ width: `${hunger}%` }} className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase px-1"><span>Sauberkeit</span><span>{Math.round(cleanliness)}%</span></div>
            <div className="h-6 bg-gray-100 rounded-full border-2 border-gray-50 p-1">
              <motion.div animate={{ width: `${cleanliness}%` }} className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Hamster */}
        <div className="px-8">
          <HamsterAvatar sleeping={false} />
        </div>

        {/* Interaktionen */}
        <div className="grid grid-cols-2 gap-4 p-8 pt-0">
          <button onClick={() => {setHunger(100); setXp(x => x + 15)}} className="bg-green-500 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-green-200 active:scale-95 transition-all flex flex-col items-center">
            <Sparkles size={28} /> <span className="text-xs mt-2 uppercase tracking-widest">Füttern</span>
          </button>
          <button onClick={() => setShowGame(true)} className="bg-rose-500 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-rose-200 active:scale-95 transition-all flex flex-col items-center">
            <Play size={28} /> <span className="text-xs mt-2 uppercase tracking-widest">Spielen</span>
          </button>
          <button onClick={() => {setCleanliness(100); setXp(x => x + 10)}} className="bg-blue-600 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-blue-200 active:scale-95 transition-all flex flex-col items-center col-span-2">
            <Trash2 size={28} /> <span className="text-xs mt-2 uppercase tracking-widest">Käfig säubern</span>
          </button>
        </div>
      </div>

      {/* Info wenn Spiel öffnet */}
      <AnimatePresence>
        {showGame && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-orange-500/90 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
            <div className="bg-white rounded-[3rem] p-12 text-center shadow-2xl">
              <h2 className="text-4xl font-black mb-4">HAMI GAME</h2>
              <p className="text-gray-400 mb-8 font-medium">Bereit für das nächste Update?</p>
              <button onClick={() => {setShowGame(false); setXp(x => x + 50)}} className="bg-black text-white font-black w-full py-5 rounded-3xl text-xl">ZURÜCK</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
