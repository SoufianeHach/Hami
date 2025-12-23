import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Briefcase, Lock } from 'lucide-react';

const HamsterAvatar = ({ mood, sleeping }: any) => {
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!sleeping) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [sleeping]);

  return (
    <div className="relative flex items-center justify-center py-10">
      <motion.div 
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute bottom-10 w-32 h-6 bg-black/5 rounded-[100%] blur-xl" 
      />
      <motion.svg 
        width="160" height="160" viewBox="0 0 140 160"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <ellipse cx="70" cy="90" rx="50" ry="45" fill="#FFFEF7" stroke="#E8D5B5" strokeWidth="2"/>
        <path d="M 35 70 Q 70 45, 105 70" fill="#FFA857" opacity="0.8"/>
        <g>
          {isBlinking || sleeping ? (
            <g stroke="black" strokeWidth="3" strokeLinecap="round">
              <line x1="45" y1="75" x2="60" y2="75" /><line x1="80" y1="75" x2="95" y2="75" />
            </g>
          ) : (
            <g>
              <circle cx="55" cy="75" r="7" fill="black" />
              <circle cx="85" cy="75" r="7" fill="black" />
              <circle cx="57" cy="72" r="2" fill="white" />
            </g>
          )}
        </g>
        <circle cx="70" cy="87" r="4" fill="#FFB6C1"/>
        <path d="M 60 95 Q 70 100, 80 95" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round"/>
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
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative border-8 border-white">
        
        <button onClick={handleCheat} className="absolute top-6 right-6 z-50 text-amber-200 hover:text-amber-500">
          <Lock size={16} />
        </button>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white text-center">
          <h1 className="text-4xl font-black tracking-tighter">HAMI</h1>
          <div className="flex justify-between mt-6 text-xs font-black bg-black/10 rounded-2xl p-3 uppercase tracking-widest">
            <span>Level {level}</span>
            <span>⭐ {xp % 100}/100</span>
            <span>💰 {coins}</span>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <div className="h-5 bg-gray-100 rounded-full border-2 border-gray-50 overflow-hidden">
            <motion.div animate={{ width: `${hunger}%` }} className="h-full bg-gradient-to-r from-green-400 to-green-500" />
          </div>
          <div className="h-5 bg-gray-100 rounded-full border-2 border-gray-50 overflow-hidden">
            <motion.div animate={{ width: `${cleanliness}%` }} className="h-full bg-gradient-to-r from-blue-400 to-blue-500" />
          </div>
        </div>

        <HamsterAvatar sleeping={false} />

        <div className="grid grid-cols-2 gap-4 p-8 pt-0">
          <button onClick={() => {setHunger(100); setXp(x => x + 15)}} className="bg-green-500 text-white font-black py-5 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center">
            <Sparkles size={24} /> <span className="text-[10px] mt-1 uppercase">Essen</span>
          </button>
          <button onClick={() => setShowGame(true)} className="bg-rose-500 text-white font-black py-5 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center">
            <Play size={24} /> <span className="text-[10px] mt-1 uppercase">Spielen</span>
          </button>
          <button onClick={() => {setCleanliness(100); setXp(x => x + 10)}} className="bg-blue-500 text-white font-black py-5 rounded-3xl shadow-lg active:scale-95 transition-transform flex flex-col items-center col-span-2">
            <Trash2 size={24} /> <span className="text-[10px] mt-1 uppercase">Säubern</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showGame && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] p-10 text-center max-w-xs">
              <h2 className="text-3xl font-black mb-2">HAMI-GAME</h2>
              <p className="text-gray-500 mb-8">Bald verfügbar!</p>
              <button onClick={() => {setShowGame(false); setXp(x => x + 30)}} className="bg-orange-500 text-white font-black w-full py-4 rounded-2xl">ZURÜCK</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
