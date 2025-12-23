import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock, Trophy, Coins, Briefcase, ShoppingBag, Utensils, X, Star } from 'lucide-react';

// --- KONFIGURATION & THEMEN ---
const THEMES = [
  { id: 'default', name: 'Standard Hami', price: 0, color: '#FFA857', accessories: [] },
  { id: 'gnome', name: 'Gnom Hami', price: 100, color: '#2D5A27', accessories: ['beard', 'pointy-hat'] },
  { id: 'santa', name: 'Weihnachts Hami', price: 100, color: '#D32F2F', accessories: ['santa-hat'] },
  { id: 'knight', name: 'Ritter Hami', price: 100, color: '#78909C', accessories: ['helmet', 'sword'] },
  { id: 'pirate', name: 'Pirat Hami', price: 100, color: '#3E2723', accessories: ['eyepatch', 'pirate-hat'] },
  { id: 'ninja', name: 'Ninja Hami', price: 100, color: '#212121', accessories: ['headband'] },
  { id: 'astronaut', name: 'Hami-naut', price: 100, color: '#E0E0E0', accessories: ['glass-helmet'] },
  { id: 'wizard', name: 'Zauberer Hami', price: 100, color: '#4527A0', accessories: ['wizard-hat', 'stars'] },
  { id: 'king', name: 'König Hami', price: 100, color: '#FFD600', accessories: ['crown'] },
  { id: 'chef', name: 'Chefkoch Hami', price: 100, color: '#FFFFFF', accessories: ['chef-hat'] },
  // ... (weitere 20 Themen werden dynamisch generiert oder können hier ergänzt werden)
];

const FOODS = [
  { name: 'Kerne', hunger: 15, xp: 5, emoji: '🌻' },
  { name: 'Nudeln', hunger: 25, xp: 12, emoji: '🍝' },
  { name: 'Pizza', hunger: 40, xp: 20, emoji: '🍕' },
  { name: 'Pommes', hunger: 35, xp: 18, emoji: '🍟' },
  { name: 'Salat', hunger: 10, xp: 25, emoji: '🥗' }
];

// --- KOMPONENTE: HAMSTER AVATAR MIT KOSTÜMEN ---
const HamsterSVG = ({ theme, mood, isWorking, isEating }: any) => {
  return (
    <motion.svg width="180" height="180" viewBox="0 0 200 200" className="drop-shadow-2xl">
      {/* Körper */}
      <motion.ellipse cx="100" cy="120" rx="70" ry="65" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="3" />
      <motion.path d="M 45 105 Q 100 45, 155 105" fill={theme.color} opacity="0.9" />
      
      {/* Kostüm-Elemente */}
      {theme.accessories.includes('pointy-hat') && <path d="M 60 60 L 100 0 L 140 60" fill="#2E7D32" />}
      {theme.accessories.includes('beard') && <path d="M 60 120 Q 100 180, 140 120" fill="white" />}
      {theme.accessories.includes('santa-hat') && <g><path d="M 60 60 L 110 20 L 140 60" fill="red" /><circle cx="115" cy="20" r="10" fill="white" /></g>}
      {theme.accessories.includes('helmet') && <path d="M 50 50 L 150 50 L 150 100 L 50 100 Z" fill="#B0BEC5" opacity="0.8" />}
      {theme.accessories.includes('eyepatch') && <circle cx="75" cy="95" r="12" fill="black" />}
      
      {/* Augen */}
      <circle cx="75" cy="95" r="10" fill="#1a1a1a" />
      <circle cx="125" cy="95" r="10" fill="#1a1a1a" />
      <circle cx="78" cy="91" r="4" fill="white" />
      
      {/* Mund */}
      <path d="M 90 125 Q 100 135, 110 125" fill="none" stroke="black" strokeWidth="2" />

      {/* Arbeits-Modus Hut & Koffer */}
      {isWorking && (
        <g>
          <rect x="130" y="130" width="40" height="30" fill="#5D4037" rx="5" />
          <rect x="145" y="120" width="10" height="10" fill="none" stroke="#5D4037" strokeWidth="3" />
          <path d="M 60 50 L 140 50 L 100 20 Z" fill="black" />
        </g>
      )}
    </motion.svg>
  );
};

export default function App() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem('hami_xp')) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('hami_coins')) || 0);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [poops, setPoops] = useState<{id: number, x: number, y: number}[]>([]);
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [unlockedThemes, setUnlockedThemes] = useState(['default']);
  const [message, setMessage] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [workTimeLeft, setWorkTimeLeft] = useState(0);
  const [lastPetTime, setLastPetTime] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [minigameActive, setMinigameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [fallingSeeds, setFallingSeeds] = useState<{id: number, left: number}[]>([]);
  const [lastGameTime, setLastGameTime] = useState(() => Number(localStorage.getItem('hami_game')) || 0);

  const level = Math.floor(xp / 100) + 1;

  // Persistence
  useEffect(() => {
    localStorage.setItem('hami_xp', xp.toString());
    localStorage.setItem('hami_coins', coins.toString());
    localStorage.setItem('hami_game', lastGameTime.toString());
  }, [xp, coins, lastGameTime]);

  // Main Loop
  useEffect(() => {
    const tick = setInterval(() => {
      setHunger(p => Math.max(0, p - 0.01));
      setCleanliness(p => Math.max(0, p - 0.005));
      if (Math.random() < 0.005 && poops.length < 5) {
        setPoops(p => [...p, { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 40 + 40 }]);
      }
      if (workTimeLeft > 0) {
        setWorkTimeLeft(t => t - 1);
      } else if (isWorking) {
        setIsWorking(false);
        setCoins(c => c + 50);
        say("Geschafft! 50 Gold verdient. Jetzt erst mal 'ne Pizza.");
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [isWorking, workTimeLeft, poops]);

  const say = (txt: string) => {
    setMessage(txt);
    setTimeout(() => setMessage(""), 3500);
  };

  // Cheat Function
  const handleCheat = () => {
    const pw = window.prompt("Admin Code?");
    if (pw === "6212") {
      setCoins(c => c + 10000);
      setXp(x => x + 1000);
      say("CHEAT AKTIVIERT! Hami ist jetzt reich und weise!");
    }
  };

  const startWork = () => {
    if (isWorking) return;
    setIsWorking(true);
    setWorkTimeLeft(30 * 60);
    say("Ich geh arbeiten... Mit Krawatte und allem. Bis in 30 Min!");
  };

  const petHami = () => {
    const now = Date.now();
    if (now - lastPetTime < 600000) { // 10 Min
      say("Lass mich! Ich bin kein Kuscheltier auf Knopfdruck!");
      return;
    }
    setLastPetTime(now);
    setXp(p => p + 20);
    say("Ooh ja... genau da hinterm Ohr... okay reicht!");
  };

  const feed = (food: typeof FOODS[0]) => {
    if (hunger > 85) {
      say("Mäste mich nicht! Sonst pass ich nicht mehr in meinen Ritterhelm!");
      return;
    }
    setHunger(h => Math.min(100, h + food.hunger));
    setXp(p => p + food.xp);
    const quotes = [
      `Thomai hat sich selbst übertroffen! ${food.emoji}`,
      `Sag Thomai, das war Sterneküche!`,
      `Thomai sollte ein Restaurant eröffnen. Köstlich!`
    ];
    say(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  // MINIGAME LOGIC
  const startMinigame = () => {
    if (Date.now() - lastGameTime < 3600000) { // 1 Std Cooldown
      say("Ich bin noch außer Puste! Komm in 'ner Stunde wieder.");
      return;
    }
    setMinigameActive(true);
    setGameScore(0);
    setFallingSeeds([]);
    setLastGameTime(Date.now());
  };

  useEffect(() => {
    if (!minigameActive) return;
    const gameTimer = setTimeout(() => setMinigameActive(false), 20000);
    const spawnTimer = setInterval(() => {
      setFallingSeeds(p => [...p, { id: Date.now(), left: Math.random() * 80 + 10 }]);
    }, 600);
    return () => { clearTimeout(gameTimer); clearInterval(spawnTimer); };
  }, [minigameActive]);

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans p-4 overflow-hidden select-none">
      
      {/* STATS HEADER */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-3xl shadow-lg border-4 border-white flex flex-col items-center">
          <Trophy className="text-orange-400 mb-1" />
          <span className="text-2xl font-black">LVL {level}</span>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
             <motion.div animate={{ width: `${xp % 100}%` }} className="h-full bg-orange-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-lg border-4 border-white flex flex-col items-center">
          <Coins className="text-amber-500 mb-1" />
          <span className="text-2xl font-black">{coins}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-lg border-4 border-white flex flex-col items-center col-span-2">
          <div className="flex w-full justify-between gap-4">
             <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Hunger</p>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><motion.div animate={{width: `${hunger}%`}} className="h-full bg-green-500" /></div>
             </div>
             <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-slate-400">Hygiene</p>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden"><motion.div animate={{width: `${cleanliness}%`}} className="h-full bg-blue-500" /></div>
             </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* ROOM */}
        <div className="w-full md:w-2/3 aspect-square bg-white rounded-[4rem] shadow-2xl relative border-8 border-white overflow-hidden flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
          <AnimatePresence>{message && (
            <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="absolute top-10 z-50 bg-white p-4 rounded-2xl shadow-xl border-2 border-orange-100 font-bold max-w-[80%] text-center">
              {message}
            </motion.div>
          )}</AnimatePresence>

          <div className="relative cursor-pointer" onClick={petHami}>
            {isWorking && (
              <motion.div animate={{ x: [0, 200] }} transition={{ duration: 1800, repeat: Infinity }} className="flex flex-col items-center italic text-slate-400 font-bold">
                <Briefcase size={40} className="mb-2" /> 🏃‍♂️ Hami geht zur Arbeit...
              </motion.div>
            )}
            {!isWorking && <HamsterSVG theme={currentTheme} isWorking={isWorking} />}
            
            {/* Dirt / Poop */}
            {poops.map(p => (
              <motion.button key={p.id} onClick={(e) => {e.stopPropagation(); setPoops(old => old.filter(x => x.id !== p.id)); setXp(x => x + 20); setCleanliness(c => Math.min(100, c+10))}} style={{left: `${p.x}%`, top: `${p.y}%` }} className="absolute text-4xl hover:scale-125 transition-transform z-40">💩</motion.button>
            ))}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-lg col-span-2">
            <p className="text-xs font-black uppercase text-slate-400 mb-2">Schnellmenü Essen</p>
            <div className="flex justify-between">
              {FOODS.slice(0,4).map(f => (
                <button key={f.name} onClick={() => feed(f)} className="text-2xl hover:scale-125 transition-transform">{f.emoji}</button>
              ))}
            </div>
          </div>
          
          <button onClick={() => setShowShop(true)} className="bg-amber-400 text-white p-6 rounded-[2rem] shadow-lg font-black flex flex-col items-center gap-2 hover:bg-amber-500">
            <ShoppingBag /> SHOP
          </button>
          <button onClick={startMinigame} className="bg-rose-500 text-white p-6 rounded-[2rem] shadow-lg font-black flex flex-col items-center gap-2 hover:bg-rose-600">
            <Play /> SPIEL
          </button>
          <button onClick={startWork} className="bg-sky-500 text-white p-6 rounded-[2rem] shadow-lg font-black flex flex-col items-center gap-2 col-span-2 disabled:opacity-50" disabled={isWorking}>
            <Briefcase /> {isWorking ? `ARBEITET (${Math.ceil(workTimeLeft/60)}m)` : 'ARBEITEN GEHEN (30m)'}
          </button>
        </div>
      </main>

      {/* MINIGAME OVERLAY */}
      <AnimatePresence>
        {minigameActive && (
          <motion.div className="fixed inset-0 bg-sky-400 z-[200] p-8 flex flex-col items-center overflow-hidden">
            <h2 className="text-5xl font-black text-white mb-4 italic">KERN-JAGD! {gameScore}/40</h2>
            <div className="relative w-full h-full max-w-2xl bg-white/20 rounded-3xl overflow-hidden cursor-crosshair">
              {fallingSeeds.map(s => (
                <motion.div 
                  key={s.id} 
                  initial={{ y: -50, x: `${s.left}%` }} 
                  animate={{ y: 800 }} 
                  onClick={() => {if(gameScore < 40){setGameScore(g => g + 1); setXp(x => x + 1); setFallingSeeds(f => f.filter(x => x.id !== s.id))}}}
                  className="absolute text-5xl cursor-pointer"
                  transition={{ duration: 2, ease: "linear" }}
                >🌻</motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHOP OVERLAY */}
      <AnimatePresence>
        {showShop && (
          <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 max-h-[80vh] overflow-y-auto relative">
              <button onClick={() => setShowShop(false)} className="absolute top-8 right-8 p-2 bg-slate-100 rounded-full"><X /></button>
              <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">Hami Boutique</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {THEMES.map(t => {
                  const owned = unlockedThemes.includes(t.id);
                  return (
                    <button 
                      key={t.id} 
                      onClick={() => {
                        if(owned) setCurrentTheme(t);
                        else if(coins >= t.price) { setCoins(c => c - t.price); setUnlockedThemes(u => [...u, t.id]); setCurrentTheme(t); }
                      }}
                      className={`p-4 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 ${currentTheme.id === t.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}
                    >
                      <div className="w-12 h-12 rounded-full" style={{background: t.color}} />
                      <span className="text-[10px] font-black uppercase text-center">{t.name}</span>
                      {!owned && <span className="text-xs font-black text-amber-600 flex items-center gap-1"><Coins size={12}/> {t.price}</span>}
                      {owned && <span className="text-[10px] text-green-500 font-bold uppercase">Besitzt</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHEAT BUTTON HIDDEN */}
      <button onClick={handleCheat} className="fixed bottom-2 left-2 opacity-0 hover:opacity-10 text-[10px]">Cheat</button>
    </div>
  );
}
