import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock, Trophy, Coins, Briefcase, ShoppingBag, Utensils, X } from 'lucide-react';

// --- DATEN-KONFIGURATION ---
const FOOD_ITEMS = [
  { id: 'seeds', name: 'Sonnenblumenkerne', hunger: 15, xp: 5, icon: '🌻' },
  { id: 'pasta', name: 'Nudeln', hunger: 30, xp: 15, icon: '🍝' },
  { id: 'pizza', name: 'Pizza', hunger: 45, xp: 25, icon: '🍕' },
  { id: 'fries', name: 'Pommes', hunger: 40, xp: 20, icon: '🍟' },
  { id: 'salad', name: 'Salat', hunger: 20, xp: 10, icon: '🥗' },
];

const COSTUMES = Array.from({ length: 30 }, (_, i) => ({
  id: `c${i + 1}`,
  name: i < 10 ? `Level Belohnung ${i + 1}` : `Premium Outfit ${i - 9}`,
  price: i < 10 ? 0 : 100,
  unlockLevel: i < 10 ? i + 1 : 0,
  color: [
    '#FFA857', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#34495E', '#E67E22',
    '#2ECC71', '#F1C40F', '#E74C3C', '#95A5A6', '#1ABC9C', '#3498DB', '#7F8C8D', '#D35400', '#C0392B', '#16A085',
    '#27AE60', '#2980B9', '#8E44AD', '#2C3E50', '#F39C12', '#BDC3C7', '#7F8C8D', '#FF8A80', '#82B1FF', '#B2FF59'
  ][i]
}));

// --- HILFSKOMPONENTE: SPRECHBLASE ---
const SpeechBubble = ({ text }: { text: string }) => (
  <motion.div 
    initial={{ scale: 0, opacity: 0, y: 10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0, opacity: 0 }}
    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border-2 border-orange-100 font-bold text-sm min-w-[150px] text-center z-50"
  >
    {text}
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-orange-100 rotate-45" />
  </motion.div>
);

export default function App() {
  // --- STATE ---
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [lastPet, setLastPet] = useState(0);
  const [workEndTime, setWorkEndTime] = useState<number | null>(null);
  const [poops, setPoops] = useState<{id: number, x: number, y: number}[]>([]);
  const [message, setMessage] = useState("");
  const [currentCostume, setCurrentCostume] = useState(COSTUMES[0]);
  const [ownedCostumes, setOwnedCostumes] = useState(['c1']);
  const [activeMenu, setActiveMenu] = useState<'none' | 'food' | 'shop'>( 'none');
  const [isBlinking, setIsBlinking] = useState(false);

  const level = Math.floor(xp / 100) + 1;

  // --- PERSISTENZ (Laden) ---
  useEffect(() => {
    const saved = localStorage.getItem('hami_v2');
    if (saved) {
      const d = JSON.parse(saved);
      setXp(d.xp || 0);
      setCoins(d.coins || 0);
      setHunger(d.hunger || 100);
      setCleanliness(d.cleanliness || 100);
      setLastPet(d.lastPet || 0);
      setWorkEndTime(d.workEndTime || null);
      setPoops(d.poops || []);
      setOwnedCostumes(d.ownedCostumes || ['c1']);
      const lastCostume = COSTUMES.find(c => c.id === d.currentCostumeId);
      if (lastCostume) setCurrentCostume(lastCostume);
    }
  }, []);

  // --- PERSISTENZ (Speichern) ---
  useEffect(() => {
    const data = { xp, coins, hunger, cleanliness, lastPet, workEndTime, poops, ownedCostumes, currentCostumeId: currentCostume.id };
    localStorage.setItem('hami_v2', JSON.stringify(data));
  }, [xp, coins, hunger, cleanliness, lastPet, workEndTime, poops, ownedCostumes, currentCostume]);

  // --- GAME LOOPS ---
  useEffect(() => {
    const timer = setInterval(() => {
      // Hunger sinkt (alle 2 Std leer = 100 / (120 min * 60 sek) = ca 0.013 pro sek)
      setHunger(prev => Math.max(0, prev - 0.015));
      
      // Dreckig werden
      setCleanliness(prev => Math.max(0, prev - 0.005));

      // Zufälliger Poop (Schnitt alle 3 Min = 1/180 Chance pro Sek)
      if (Math.random() < 1/180 && poops.length < 5) {
        setPoops(prev => [...prev, { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 40 + 40 }]);
      }

      // Check Work
      if (workEndTime && Date.now() >= workEndTime) {
        setWorkEndTime(null);
        setCoins(c => c + 50);
        say("Bin zurück! Wo ist meine Kohle? Oh, da ist sie. 💰");
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [poops.length, workEndTime]);

  // --- LOGIK FUNKTIONEN ---
  const say = (txt: string) => {
    setMessage(txt);
    setTimeout(() => setMessage(""), 4000);
  };

  const feed = (item: typeof FOOD_ITEMS[0]) => {
    if (hunger > 90) {
      say("Willst du mich mästen? Ich pass so schon kaum durch die Röhre! 💢");
      return;
    }
    const thomsiQuotes = [
      `Boah, Thomai hat echt Skill an der Pfanne! ${item.icon}`,
      `Sag Thomai, das war Sterneküche! Mehr davon!`,
      `Respekt an Thomai, das schmeckt fast so gut wie Freiheit!`,
      `Thomai kocht, Hami frisst. So muss das sein!`
    ];
    setHunger(prev => Math.min(100, prev + item.hunger));
    setXp(prev => prev + item.xp);
    say(thomsiQuotes[Math.floor(Math.random() * thomsiQuotes.length)]);
    setActiveMenu('none');
  };

  const pet = () => {
    const now = Date.now();
    if (now - lastPet < 10 * 60 * 1000) {
      say("Finger weg! Ich bin kein Kuscheltier auf Abruf! 🙄");
      return;
    }
    const petQuotes = ["Na gut, aber nicht zu fest drücken!", "Hach, mein Fell ist einfach göttlich, oder?", "Okay, das reicht wieder für 10 Minuten. Verdufte!"];
    setLastPet(now);
    setXp(prev => prev + 15);
    say(petQuotes[Math.floor(Math.random() * petQuotes.length)]);
  };

  const cleanPoop = (id: number) => {
    setPoops(prev => prev.filter(p => p.id !== id));
    setXp(prev => prev + 20);
    say("Endlich! Hier hat's gestunken wie in 'nem Hamsterknast.");
  };

  const startWork = () => {
    if (workEndTime) return;
    setWorkEndTime(Date.now() + 30 * 60 * 1000);
    say("Ich geh schuften. Stör mich bloß nicht, ich mach Karriere! 💼");
  };

  const buyCostume = (c: typeof COSTUMES[0]) => {
    if (ownedCostumes.includes(c.id)) {
      setCurrentCostume(c);
      say(`Schau mich an! Das ist mein Stil: ${c.name}!`);
    } else if (coins >= c.price && (c.unlockLevel === 0 || level >= c.unlockLevel)) {
      setCoins(prev => prev - c.price);
      setOwnedCostumes(prev => [...prev, c.id]);
      setCurrentCostume(c);
      say(`Gekauft! Ich seh aus wie 'ne Million Dollar! 😎`);
    } else {
      say("Zu teuer! Denkst du, ich bin aus Gold? Geh arbeiten!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-slate-800 font-sans p-4 md:p-8 overflow-x-hidden">
      
      {/* UI HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1 bg-white rounded-[2rem] p-6 shadow-xl border-4 border-white flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Hami's Status</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200">
                {level}
              </div>
              <div>
                <p className="text-lg font-black leading-none">Level {level}</p>
                <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden border">
                  <motion.div animate={{ width: `${xp % 100}%` }} className="h-full bg-orange-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Budget</p>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl font-black">{coins}</span>
              <Coins className="text-amber-500" size={24} />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* ROOM AREA */}
        <div className="w-full md:w-3/5 bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white relative aspect-square flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
          
          <AnimatePresence>{message && <SpeechBubble text={message} />}</AnimatePresence>
          
          {/* Work Overlay */}
          <AnimatePresence>
            {workEndTime && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-8 text-center">
                <Briefcase size={64} className="text-orange-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-black mb-2 uppercase italic">Bin schuften!</h2>
                <p className="text-slate-500">Komm in ca. {Math.ceil((workEndTime - Date.now()) / 60000)} Min. wieder!</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hami Avatar & Items */}
          <div className="relative w-full h-full flex items-center justify-center" onClick={pet}>
             {/* Poops */}
             {poops.map(p => (
               <motion.button 
                key={p.id} 
                initial={{scale:0}} animate={{scale:1}}
                onClick={(e) => {e.stopPropagation(); cleanPoop(p.id)}}
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                className="absolute text-3xl z-30 filter drop-shadow-md hover:scale-125 transition-transform"
               >💩</motion.button>
             ))}

             {/* Dirt Spots */}
             {cleanliness < 70 && (
               <motion.div 
                onClick={(e) => {e.stopPropagation(); setCleanliness(100); setXp(prev => prev + 10); say("Glänze wieder wie ein Neuwagen!")}}
                className="absolute w-24 h-16 bg-slate-800/10 rounded-full blur-xl z-10 cursor-pointer"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
               />
             )}

             <div className="relative z-20 pointer-events-none">
                <motion.svg width="240" height="240" viewBox="0 0 200 200" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                  <circle cx="65" cy="55" r="18" fill={currentCostume.color} />
                  <circle cx="135" cy="55" r="18" fill={currentCostume.color} />
                  <ellipse cx="100" cy="110" rx="75" ry="70" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="3"/>
                  <path d="M 40 100 Q 100 40, 160 100" fill={currentCostume.color} opacity="0.9"/>
                  <g>
                    {isBlinking ? (
                      <g stroke="#333" strokeWidth="5" strokeLinecap="round" fill="none"><path d="M 65 95 Q 75 95, 85 95" /><path d="M 115 95 Q 125 95, 135 95" /></g>
                    ) : (
                      <g><circle cx="75" cy="95" r="10" fill="#1a1a1a" /><circle cx="125" cy="95" r="10" fill="#1a1a1a" /></g>
                    )}
                  </g>
                  <path d="M 92 110 L 108 110 L 100 118 Z" fill="#FF80AB" />
                  <path d="M 90 125 Q 100 132, 110 125" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
                </motion.svg>
             </div>
          </div>
        </div>

        {/* SIDEBAR ACTIONS */}
        <div className="w-full md:w-2/5 flex flex-col gap-4">
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveMenu('food')} className="bg-green-500 text-white p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center gap-2 font-black uppercase tracking-widest hover:bg-green-600 transition-colors">
              <Utensils /> Essen
            </button>
            <button onClick={() => setActiveMenu('shop')} className="bg-amber-500 text-white p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center gap-2 font-black uppercase tracking-widest hover:bg-amber-600 transition-colors">
              <ShoppingBag /> Shop
            </button>
            <button onClick={startWork} className="bg-sky-500 text-white p-6 rounded-[2.5rem] shadow-lg flex flex-col items-center gap-2 font-black uppercase tracking-widest hover:bg-sky-600 transition-colors col-span-2">
              <Briefcase /> Arbeiten gehen (30 min)
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border-4 border-white flex-1">
            <h3 className="font-black uppercase text-xs text-slate-400 mb-4 tracking-widest">Vitalwerte</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold px-1"><span>Hunger</span><span>{Math.round(hunger)}%</span></div>
                <div className="h-4 bg-slate-100 rounded-full p-1"><motion.div animate={{width:`${hunger}%`}} className="h-full bg-green-400 rounded-full" /></div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold px-1"><span>Sauberkeit</span><span>{Math.round(cleanliness)}%</span></div>
                <div className="h-4 bg-slate-100 rounded-full p-1"><motion.div animate={{width:`${cleanliness}%`}} className="h-full bg-blue-400 rounded-full" /></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {activeMenu !== 'none' && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{y:50}} animate={{y:0}} className="bg-white rounded-[3rem] w-full max-w-lg p-8 shadow-2xl relative max-h-[80vh] overflow-y-auto">
              <button onClick={() => setActiveMenu('none')} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"><X/></button>
              
              <h2 className="text-3xl font-black mb-6 uppercase">
                {activeMenu === 'food' ? 'Hami\'s Restaurant' : 'Kleiderschrank'}
              </h2>

              {activeMenu === 'food' && (
                <div className="grid gap-3">
                  {FOOD_ITEMS.map(item => (
                    <button key={item.id} onClick={() => feed(item)} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-orange-50 rounded-2xl border-2 border-transparent hover:border-orange-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl group-hover:scale-125 transition-transform">{item.icon}</span>
                        <div className="text-left">
                          <p className="font-black uppercase text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500">Sättigt: {item.hunger}%</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">+{item.xp} XP</span>
                    </button>
                  ))}
                </div>
              )}

              {activeMenu === 'shop' && (
                <div className="grid grid-cols-2 gap-3">
                  {COSTUMES.map(c => {
                    const isOwned = ownedCostumes.includes(c.id);
                    const isLocked = c.unlockLevel > level;
                    return (
                      <button key={c.id} onClick={() => buyCostume(c)} disabled={isLocked} className={`p-4 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 ${isOwned ? 'border-orange-400 bg-orange-50' : 'border-slate-100 bg-slate-50 hover:border-orange-200'} ${isLocked ? 'opacity-50 grayscale' : ''}`}>
                        <div className="w-12 h-12 rounded-full shadow-inner" style={{backgroundColor: c.color}} />
                        <p className="text-[10px] font-black uppercase text-center">{c.name}</p>
                        {isOwned ? (
                          <span className="text-[10px] text-orange-500 font-bold">In Besitz</span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 text-[10px] text-slate-400"><Lock size={10}/> LVL {c.unlockLevel}</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-black text-amber-600"><Coins size={12}/> {c.price}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => {const pw = window.prompt("Admin?"); if(pw==="6212"){setCoins(c=>c+1000); setXp(x=>x+500);}}} className="fixed bottom-4 right-4 opacity-0 hover:opacity-10 text-[10px]">Cheat</button>
    </div>
  );
}
