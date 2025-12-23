import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock, Trophy, Coins, Briefcase, ShoppingBag, Utensils, X, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

// --- DIE GROSSE TEXT-DATENBANK (FRECHE PERSÖNLICHKEIT) ---
const QUOTES = {
  pet: [
    "Hey! Nicht die Frisur ruinieren!", "Mmh, okay, das ist akzeptabel... für diesmal.", "Ich bin kein Streichelzoo, Kumpel!", "Hach, mein Fell ist einfach göttlich, oder?", "Okay, 10 Sekunden sind um. Verdufte!", "Nur weil ich süß aussehe, heißt das nicht, dass du mich anfassen darfst!"
  ],
  feed: [
    "Thomai hat sich selbst übertroffen! Köstlich!", "Boah, Thomai kocht wie ein Gott! Sag ihm das!", "Endlich! Ich dachte schon, ich verhungere hier!", "Mehr davon! Und sag Thomai, die Würze war perfekt!", "Thomai ist mein Lieblingskoch. Du bist nur der Kellner.", "Nom nom... Thomai for President!"
  ],
  fat: [
    "Mäste mich nicht! Ich pass schon kaum in meine Rüstung!", "Willst du, dass ich rolle statt laufe? Hör auf!", "Ich bin satt! Geh weg mit dem Zeug!", "Denkst du, ich bin ein Fass ohne Boden? Nerv nicht!"
  ],
  workStart: [
    "Ab in den Hamsterknast... äh, ins Büro.", "Ich geh Karriere machen. Stör mich bloß nicht!", "Zeit ist Geld, und ich hab beides nicht. Bis dann!", "Ich schufte, du chillst? Ungerecht!", "Wenn ich reich bin, kauf ich mir einen eigenen Menschen."
  ],
  workCancel: [
    "Früh Feierabend? Du bist ja noch fauler als ich!", "Karriere abgebrochen. Zurück zum Nichtstun!", "Tja, wer nicht arbeitet, bekommt auch kein Gold. Logisch, oder?"
  ],
  clean: [
    "Endlich! Hier hat's gestunken wie in 'nem Pumakäfig.", "Sauberkeit ist eine Zier, doch weiter kommt man ohne ihr... oh, danke.", "Glänze wieder wie ein Neuwagen! Polier gefälligst ordentlich!"
  ]
};

// --- KOSTÜM-DEFINITIONEN ---
const COSTUMES = [
  { id: 'default', name: 'Hami Pur', price: 0, unlockLevel: 1, color: '#FFA857' },
  { id: 'knight', name: 'Ritter', price: 0, unlockLevel: 2, color: '#90A4AE' },
  { id: 'angel', name: 'Engel', price: 100, unlockLevel: 0, color: '#E3F2FD' },
  { id: 'devil', name: 'Teufel', price: 100, unlockLevel: 0, color: '#B71C1C' },
  { id: 'wizard', name: 'Zauberer', price: 0, unlockLevel: 5, color: '#4527A0' },
  { id: 'gnome', name: 'Gnom', price: 0, unlockLevel: 3, color: '#2D5A27' },
  { id: 'chef', name: 'Chefkoch', price: 100, unlockLevel: 0, color: '#FFFFFF' },
  { id: 'pirate', name: 'Pirat', price: 0, unlockLevel: 7, color: '#3E2723' },
  { id: 'king', name: 'König', price: 150, unlockLevel: 0, color: '#FFD700' },
  { id: 'astronaut', name: 'Astronaut', price: 200, unlockLevel: 0, color: '#CFD8DC' }
];

// --- GRAFIK-KOMPONENTE: DER AUFWENDIGE HAMI ---
const HamiRender = ({ id, isWorking }: { id: string, isWorking: boolean }) => {
  return (
    <motion.div 
      className="relative" 
      animate={isWorking ? { x: [-10, 10, -10], rotate: [-2, 2, -2] } : { y: [0, -8, 0] }} 
      transition={{ repeat: Infinity, duration: 2 }}
    >
      <svg width="220" height="220" viewBox="0 0 200 200">
        {/* Hinter dem Körper: Flügel für Engel */}
        {id === 'angel' && (
          <g fill="white" opacity="0.8">
            <path d="M 40 100 C 0 60, 20 20, 60 50 Z" />
            <path d="M 160 100 C 200 60, 180 20, 140 50 Z" />
          </g>
        )}

        {/* Körper-Basis */}
        <ellipse cx="100" cy="115" rx="70" ry="65" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="3" />
        <path d="M 45 105 Q 100 45, 155 105" fill={COSTUMES.find(c=>c.id===id)?.color || '#FFA857'} />

        {/* KOSTÜM-DETAILS */}
        {id === 'knight' && (
          <g>
            <rect x="55" y="45" width="90" height="50" rx="10" fill="#B0BEC5" />
            <rect x="65" y="65" width="70" height="5" fill="#546E7A" />
            <path d="M 100 20 L 110 45 L 90 45 Z" fill="red" />
          </g>
        )}
        {id === 'angel' && <ellipse cx="100" cy="35" rx="30" ry="8" fill="none" stroke="#FFD700" strokeWidth="4" />}
        {id === 'devil' && <g fill="#B71C1C"><path d="M 60 60 L 50 30 L 80 55 Z" /><path d="M 140 60 L 150 30 L 120 55 Z" /></g>}
        {id === 'wizard' && <g><path d="M 50 65 L 100 -10 L 150 65 Z" fill="#311B92" /><circle cx="100" cy="20" r="3" fill="yellow" /></g>}
        {id === 'gnome' && <g><path d="M 55 65 L 100 0 L 145 65 Z" fill="#1B5E20" /><path d="M 70 115 Q 100 170, 130 115 Z" fill="white" /></g>}
        {id === 'chef' && <rect x="75" y="10" width="50" height="55" rx="10" fill="white" stroke="#DDD" />}
        {id === 'king' && <path d="M 65 55 L 75 30 L 100 50 L 125 30 L 135 55 Z" fill="#FFD700" stroke="#B8860B" />}
        {id === 'pirate' && <g><path d="M 50 65 L 150 65 Q 100 20, 50 65" fill="black" /><circle cx="75" cy="90" r="12" fill="black" /></g>}
        {id === 'astronaut' && <circle cx="100" cy="90" r="60" fill="rgba(173, 216, 230, 0.3)" stroke="white" strokeWidth="4" />}

        {/* Gesicht */}
        <circle cx="75" cy="90" r="9" fill="#1a1a1a" />
        <circle cx="125" cy="90" r="9" fill="#1a1a1a" />
        <circle cx="78" cy="87" r="3" fill="white" />
        <circle cx="100" cy="105" r="5" fill="#FF80AB" />
        <path d="M 90 115 Q 100 122, 110 115" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

        {/* Arbeits-Accessoire */}
        {isWorking && (
          <g transform="translate(150, 130)">
            <rect width="35" height="25" fill="#5D4037" rx="3" />
            <path d="M 10 0 L 10 -8 L 25 -8 L 25 0" fill="none" stroke="#5D4037" strokeWidth="2" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};

export default function App() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem('h_xp')) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('h_coins')) || 0);
  const [hunger, setHunger] = useState(100);
  const [cleanliness, setCleanliness] = useState(100);
  const [poops, setPoops] = useState<{id: number, x: number, y: number}[]>([]);
  const [currentId, setCurrentId] = useState('default');
  const [unlocked, setUnlocked] = useState(['default']);
  const [isWorking, setIsWorking] = useState(false);
  const [workLeft, setWorkLeft] = useState(0);
  const [message, setMessage] = useState("Na, was willst du schon wieder?");

  const level = Math.floor(xp / 100) + 1;

  // Persistence
  useEffect(() => {
    localStorage.setItem('h_xp', xp.toString());
    localStorage.setItem('h_coins', coins.toString());
  }, [xp, coins]);

  // Game Loop
  useEffect(() => {
    const loop = setInterval(() => {
      setHunger(p => Math.max(0, p - 0.015));
      if (Math.random() < 0.005 && poops.length < 5) {
        setPoops(p => [...p, { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 50 + 30 }]);
      }
      if (isWorking && workLeft > 0) setWorkLeft(t => t - 1);
      else if (isWorking && workLeft === 0) {
        setIsWorking(false);
        setCoins(c => c + 50);
        setXp(x => x + 50);
        say(QUOTES.feed[0]); // Zufälliger Lob-Satz
      }
    }, 1000);
    return () => clearInterval(loop);
  }, [isWorking, workLeft, poops.length]);

  const say = (arr: string[]) => {
    const text = arr[Math.floor(Math.random() * arr.length)];
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  // CHEATS
  const handleCheat1 = () => {
    const pw = prompt("Admin Key?");
    if (pw === "6212") {
      setCoins(c => c + 10000);
      setXp(x => x + 1000);
      setMessage("Zack! Reich und schlau!");
    }
  };

  const handleCheat2 = () => {
    const pw = prompt("Admin Key?");
    if (pw === "6212") {
      setHunger(h => Math.max(0, h - 50));
      const newPoops = [
        { id: Date.now(), x: 30, y: 40 },
        { id: Date.now()+1, x: 50, y: 60 },
        { id: Date.now()+2, x: 70, y: 50 }
      ];
      setPoops(p => [...p, ...newPoops]);
      setMessage("Ugh... was hast du mir ins Essen gemischt? 💩");
    }
  };

  const cancelWork = () => {
    const confirm = window.confirm("Willst du wirklich abbrechen? Du bekommst KEIN Gold und KEINE XP!");
    if (confirm) {
      setIsWorking(false);
      setWorkLeft(0);
      say(QUOTES.workCancel);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] p-4 font-sans select-none overflow-hidden">
      
      {/* CHEAT BUTTONS */}
      <div onClick={handleCheat2} className="fixed top-2 left-2 w-8 h-8 opacity-0 hover:opacity-10 cursor-pointer bg-black rounded" />
      <div onClick={handleCheat1} className="fixed top-2 right-2 w-8 h-8 opacity-0 hover:opacity-10 cursor-pointer bg-black rounded" />

      {/* HEADER */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-white flex flex-col items-center">
          <Trophy className="text-orange-400 mb-1" />
          <span className="text-2xl font-black">LVL {level}</span>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden border">
            <motion.div animate={{ width: `${xp % 100}%` }} className="h-full bg-orange-400" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-white flex flex-col items-center">
          <Coins className="text-amber-500 mb-1" />
          <span className="text-2xl font-black">{coins}</span>
        </div>
        <div className="bg-white p-4 rounded-3xl shadow-xl border-4 border-white hidden md:flex flex-col items-center">
          <ShieldCheck className="text-sky-500 mb-1" />
          <span className="text-sm font-black uppercase">Premium Hami</span>
        </div>
      </div>

      <main className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* ROOM AREA */}
        <div className="w-full md:w-2/3 aspect-square bg-white rounded-[4rem] shadow-2xl relative border-8 border-white overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
          
          <AnimatePresence>
            {message && (
              <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="absolute top-10 z-50 bg-white p-4 rounded-2xl shadow-xl border-2 border-orange-100 font-bold max-w-[80%] text-center italic">
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          {isWorking ? (
            <div className="text-center z-20">
              <HamiRender id={currentId} isWorking={true} />
              <p className="mt-4 font-black text-slate-400 animate-pulse">BIN SCHUFTEN... {Math.ceil(workLeft/60)}M</p>
              <button onClick={cancelWork} className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-200 transition-all">
                <AlertTriangle size={16}/> Früh Feierabend
              </button>
            </div>
          ) : (
            <div className="relative cursor-pointer" onClick={() => {setXp(x=>x+5); say(QUOTES.pet)}}>
              <HamiRender id={currentId} isWorking={false} />
              {poops.map(p => (
                <button key={p.id} onClick={(e) => {e.stopPropagation(); setPoops(o=>o.filter(x=>x.id!==p.id)); setXp(x=>x+20); say(QUOTES.clean)}} style={{left:`${p.x}%`, top:`${p.y}%`}} className="absolute text-4xl z-40">💩</button>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-white">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Hami's Magen</h3>
            <div className="grid grid-cols-5 gap-2">
              {['🌻','🍝','🍕','🍟','🥗'].map((emoji, i) => (
                <button key={i} onClick={() => { if(hunger<90){setHunger(h=>Math.min(100,h+20)); setXp(x=>x+10); say(QUOTES.feed);} else {say(QUOTES.fat);} }} className="text-3xl hover:scale-125 transition-transform p-2 bg-orange-50 rounded-xl">{emoji}</button>
              ))}
            </div>
          </div>

          <button onClick={() => {
            if(!isWorking) { setIsWorking(true); setWorkLeft(1800); say(QUOTES.workStart); }
          }} className="w-full bg-sky-500 text-white p-6 rounded-[2.5rem] shadow-lg font-black flex items-center justify-center gap-4 hover:bg-sky-600 transition-all disabled:opacity-50" disabled={isWorking}>
            <Briefcase /> {isWorking ? 'BIN BEI DER ARBEIT' : 'ARBEITEN GEHEN'}
          </button>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-white max-h-64 overflow-y-auto">
            <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2"><ShoppingBag size={14}/> Kostüme</h3>
            <div className="grid grid-cols-2 gap-2">
              {COSTUMES.map(c => {
                const isOwned = unlocked.includes(c.id) || (c.unlockLevel > 0 && level >= c.unlockLevel);
                return (
                  <button 
                    key={c.id} 
                    onClick={() => {
                      if(isOwned) setCurrentId(c.id);
                      else if(coins >= c.price) { setCoins(coins-c.price); setUnlocked([...unlocked, c.id]); setCurrentId(c.id); }
                    }}
                    className={`p-2 rounded-xl border-2 text-[10px] font-bold uppercase transition-all ${currentId === c.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}
                  >
                    {c.name}
                    {!isOwned && <div className="text-[8px] text-amber-600">{c.unlockLevel > 0 ? `LVL ${c.unlockLevel}` : `💰 ${c.price}`}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
