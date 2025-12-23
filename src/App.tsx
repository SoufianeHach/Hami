import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Moon, Trash2, Play, Lock, Trophy, Coins, Briefcase, ShoppingBag, Utensils, X, Star, AlertTriangle, RefreshCw, Key, Zap } from 'lucide-react';

// --- TEXTE & ZITATE ---
const QUOTES = {
  pet: ["Hach, wie weich! ✨", "Mmh, kraul mich weiter!", "Nicht die Frisur ruinieren!", "Du darfst mich huldigen!"],
  petFull: ["Ich bin wunschlos glücklich!", "Zuneigungslimit erreicht!", "Nerv nicht, Mensch!"],
  feed: ["Thomai hat sich selbst übertroffen!", "Boah, Thomai kocht wie ein Gott!", "Ein Hoch auf Thomai's Küche!"],
  fat: ["Ich pass kaum noch durch die Röhre!", "Hör auf, ich rolle gleich!", "Ich bin pappsatt!"],
  workStart: ["Ab ins Büro... argh.", "Karriere ruft! Hami macht Cash!", "Zeit ist Gold."],
  workCancel: ["Früh Feierabend? Faulpelz!", "Karriere abgebrochen."],
  clean: ["Endlich sauber!", "Glänze wieder wie ein Neuwagen!"],
  gameEnd: ["Spiel vorbei!", "Kerne gesichert!", "Gute Ausbeute!"]
};

// --- KOSTÜM-DEFINITIONEN ---
const COSTUMES = [
  { id: 'default', name: 'Hami Pur', price: 0, lvl: 1, color: '#FFA857' },
  { id: 'gnome', name: 'Wald-Gnom', price: 0, lvl: 2, color: '#2D5A27' },
  { id: 'knight', name: 'Edel-Ritter', price: 0, lvl: 3, color: '#90A4AE' },
  { id: 'santa', name: 'Weihnachten', price: 0, lvl: 4, color: '#D32F2F' },
  { id: 'wizard', name: 'Zauberer', price: 0, lvl: 5, color: '#4527A0' },
  { id: 'ninja', name: 'Rinne-Shinobi', price: 0, lvl: 6, color: '#1a1a1a' },
  { id: 'king', name: 'König Hami', price: 0, lvl: 7, color: '#FFD700' },
  { id: 'angel', name: 'Hami-Engel', price: 100, lvl: 0, color: '#E3F2FD' },
  { id: 'devil', name: 'Teufelsbraten', price: 100, lvl: 0, color: '#B71C1C' },
  { id: 'samurai', name: 'Narbiger Ronin', price: 150, lvl: 0, color: '#880E4F' },
  { id: 'cyber', name: 'Cyberpunk', price: 200, lvl: 0, color: '#00E5FF' },
  { id: 'dino', name: 'Hami-Saurus', price: 150, lvl: 0, color: '#4CAF50' },
  { id: 'unicorn', name: 'Einhorn', price: 250, lvl: 0, color: '#F48FB1' },
  { id: 'astronaut', name: 'Hami-naut', price: 200, lvl: 0, color: '#CFD8DC' },
  { id: 'ghost', name: 'Geist', price: 100, lvl: 0, color: '#F5F5F5' },
  { id: 'chef', name: 'Sternekoch', price: 100, lvl: 0, color: '#FFFFFF' }
  // Weitere Skins folgen derselben Logik...
];

// --- HINTERGRUND DEKO ---
const BackgroundDecor = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(15)].map((_, i) => (
      <motion.div key={i} className="absolute text-pink-200 opacity-30"
        initial={{ y: "110vh", x: Math.random() * 100 + "vw" }}
        animate={{ y: "-10vh", rotate: 360 }}
        transition={{ duration: Math.random() * 10 + 15, repeat: Infinity, ease: "linear" }}
      >
        <Heart size={Math.random() * 30 + 20} fill="currentColor" />
      </motion.div>
    ))}
  </div>
);

// --- DER ÜBERARBEITETE HAMI-AVATAR (GRAFIK-CORE) ---
const HamiRender = ({ id, isWorking }: { id: string, isWorking: boolean }) => {
  const c = useMemo(() => COSTUMES.find(x => x.id === id) || COSTUMES[0], [id]);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const b = setInterval(() => { setIsBlinking(true); setTimeout(() => setIsBlinking(false), 150); }, 4000);
    return () => clearInterval(b);
  }, []);

  return (
    <motion.div className="relative z-10" animate={isWorking ? { x: [-8, 8, -8], rotate: [-2, 2, -2] } : { y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
      <svg width="260" height="260" viewBox="0 0 200 200" className="drop-shadow-2xl overflow-visible">
        
        {/* BACK LAYER (Wings, Swords, Tails) */}
        {id === 'angel' && (
          <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} fill="white" opacity="0.6">
             <path d="M 40 100 Q 0 40 40 60 Q 10 90 40 110" />
             <path d="M 160 100 Q 200 40 160 60 Q 190 90 160 110" />
          </motion.g>
        )}
        {id === 'samurai' && (
          <g transform="translate(145, 60) rotate(45)">
            <rect width="8" height="60" fill="#333" rx="2" />
            <rect width="12" height="15" x="-2" y="45" fill="#8B0000" rx="1" />
          </g>
        )}

        {/* OHREN */}
        <circle cx="65" cy="55" r="18" fill={c.color} stroke="#E8D5B5" strokeWidth="2" />
        <circle cx="135" cy="55" r="18" fill={c.color} stroke="#E8D5B5" strokeWidth="2" />
        
        {/* KÖRPER (DETAILED) */}
        <ellipse cx="100" cy="120" rx="85" ry="75" fill="#FFFFFF" stroke="#E8D5B5" strokeWidth="3" />
        <path d="M 35 110 Q 100 35, 165 110" fill={c.color} opacity="0.9" />
        <ellipse cx="100" cy="135" rx="35" ry="30" fill="#FFF5EE" opacity="0.4" />

        {/* KOSTÜM OVERLAYS */}
        {id === 'santa' && (
          <g>
            <path d="M 60 65 L 100 10 L 140 65 Z" fill="#D32F2F" />
            <rect x="55" y="55" width="90" height="12" rx="6" fill="white" />
            <circle cx="100" cy="10" r="8" fill="white" />
          </g>
        )}
        {id === 'ninja' && (
          <g>
            <rect x="40" y="70" width="120" height="28" fill="#333" />
            <rect x="80" y="74" width="40" height="20" fill="#AAA" rx="2" />
            <g stroke="#444" strokeWidth="1.5">
              <line x1="91" y1="78" x2="91" y2="90" /><line x1="97" y1="78" x2="97" y2="90" />
              <line x1="103" y1="78" x2="103" y2="90" /><line x1="109" y1="78" x2="109" y2="90" />
            </g>
          </g>
        )}
        {id === 'king' && (
          <g>
            <path d="M 55 55 L 65 20 L 82 45 L 100 15 L 118 45 L 135 20 L 145 55 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
            <circle cx="100" cy="25" r="4" fill="red" /><circle cx="68" cy="30" r="3" fill="blue" /><circle cx="132" cy="30" r="3" fill="green" />
          </g>
        )}
        {id === 'knight' && <g><rect x="50" y="45" width="100" height="50" rx="10" fill="#90A4AE" /><rect x="65" y="65" width="70" height="5" fill="#37474F" /></g>}
        {id === 'wizard' && <path d="M 45 70 L 100 -10 L 155 70 Z" fill="#311B92" />}
        {id === 'gnome' && <g><path d="M 60 65 L 100 0 L 140 65 Z" fill="#1B5E20" /><path d="M 70 125 Q 100 180, 130 125" fill="white" /></g>}
        {id === 'unicorn' && <path d="M 100 45 L 110 5 L 120 45 Z" fill="url(#rainbow)" stroke="#BA68C8" />}
        {id === 'cyber' && (
          <g>
            <rect x="55" y="80" width="90" height="25" fill="rgba(0, 229, 255, 0.4)" stroke="#00E5FF" strokeWidth="2" rx="4" />
            <motion.path d="M 40 80 L 20 60" stroke="#00E5FF" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }} />
          </g>
        )}

        {/* AUGEN LAYER */}
        {isBlinking ? (
          <g stroke="#333" strokeWidth="4" strokeLinecap="round">
            <line x1="65" y1="95" x2="85" y2="95" /><line x1="115" y1="95" x2="135" y2="95" />
          </g>
        ) : id === 'ninja' ? (
          <g>
             <circle cx="75" cy="95" r="11" fill="#D1C4E9" stroke="#9575CD" />
             <circle cx="75" cy="95" r="7" fill="none" stroke="#9575CD" opacity="0.5" />
             <circle cx="75" cy="95" r="3" fill="none" stroke="#9575CD" opacity="0.3" />
             <circle cx="125" cy="95" r="11" fill="#D1C4E9" stroke="#9575CD" />
             <circle cx="125" cy="95" r="7" fill="none" stroke="#9575CD" opacity="0.5" />
             <circle cx="125" cy="95" r="3" fill="none" stroke="#9575CD" opacity="0.3" />
          </g>
        ) : (
          <g>
            <circle cx="75" cy="95" r="10" fill="#1a1a1a" />
            <circle cx="125" cy="95" r="10" fill="#1a1a1a" />
            <circle cx="78" cy="91" r="4" fill="white" />
            <circle cx="128" cy="91" r="4" fill="white" />
          </g>
        )}

        {id === 'samurai' && <path d="M 115 80 L 135 110" stroke="#B71C1C" strokeWidth="2" opacity="0.7" />}

        {/* GESICHT DETAILS */}
        <circle cx="55" cy="115" r="10" fill="#FFB6C1" opacity="0.4" />
        <circle cx="145" cy="115" r="10" fill="#FFB6C1" opacity="0.4" />
        <g stroke="#D2B48C" strokeWidth="1">
           <line x1="50" y1="110" x2="20" y2="105" /><line x1="50" y1="118" x2="20" y2="125" />
           <line x1="150" y1="110" x2="180" y2="105" /><line x1="150" y1="118" x2="180" y2="125" />
        </g>
        
        {/* MUND & ZÄHNE */}
        <circle cx="100" cy="110" r="6" fill="#FF80AB" />
        {id === 'dino' ? (
          <g>
            <path d="M 85 125 Q 100 145, 115 125" fill="none" stroke="#333" strokeWidth="3" />
            <path d="M 92 126 L 95 133 L 98 126 M 102 126 L 105 133 L 108 126" fill="white" />
          </g>
        ) : (
          <g>
            <path d="M 90 125 Q 100 135, 110 125" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <rect x="96" y="118" width="8" height="6" fill="white" stroke="#333" strokeWidth="1" />
          </g>
        )}

        {/* PFOTEN */}
        <ellipse cx="70" cy="150" rx="12" ry="10" fill="white" stroke="#E8D5B5" />
        <ellipse cx="130" cy="150" rx="12" ry="10" fill="white" stroke="#E8D5B5" />
        <ellipse cx="75" cy="185" rx="14" ry="8" fill="#FFC0CB" opacity="0.6" />
        <ellipse cx="125" cy="185" rx="14" ry="8" fill="#FFC0CB" opacity="0.6" />

        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF00FF" /><stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

export default function App() {
  const [xp, setXp] = useState(() => Number(localStorage.getItem('h_xp')) || 0);
  const [coins, setCoins] = useState(() => Number(localStorage.getItem('h_coins')) || 0);
  const [hunger, setHunger] = useState(100);
  const [affection, setAffection] = useState(100);
  const [poops, setPoops] = useState<{id: number, x: number, y: number}[]>([]);
  const [currentId, setCurrentId] = useState('default');
  const [unlocked, setUnlocked] = useState(['default']);
  const [isWorking, setIsWorking] = useState(false);
  const [workLeft, setWorkLeft] = useState(0);
  const [message, setMessage] = useState("Hami hat dich vermisst! ✨");
  const [gameActive, setGameActive] = useState(false);
  const [gameResult, setGameResult] = useState<number | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameTime, setGameTime] = useState(20);
  const [seeds, setSeeds] = useState<{id: number, x: number}[]>([]);
  const [lastGame, setLastGame] = useState(() => Number(localStorage.getItem('h_game')) || 0);

  const level = Math.floor(xp / 100) + 1;

  useEffect(() => {
    localStorage.setItem('h_xp', xp.toString());
    localStorage.setItem('h_coins', coins.toString());
    localStorage.setItem('h_game', lastGame.toString());
  }, [xp, coins, lastGame]);

  useEffect(() => {
    const loop = setInterval(() => {
      setHunger(p => Math.max(0, p - 0.02));
      setAffection(p => Math.max(0, p - 0.05));
      if (Math.random() < 0.005 && poops.length < 5) setPoops(p => [...p, { id: Date.now(), x: Math.random() * 60 + 20, y: Math.random() * 50 + 30 }]);
      if (isWorking && workLeft > 0) setWorkLeft(t => t - 1);
      else if (isWorking) { setIsWorking(false); setCoins(c => c + 50); setXp(x => x + 50); }
    }, 1000);
    return () => clearInterval(loop);
  }, [isWorking, workLeft, poops.length]);

  const say = (arr: string[]) => { setMessage(arr[Math.floor(Math.random() * arr.length)]); setTimeout(() => setMessage(""), 6000); };

  const handleCheat1 = () => { if(prompt("Cheat Code (Rich/XP)?") === "6212") { setCoins(c => c + 10000); setXp(x => x + 1000); say(["BAM! Wer ist hier der Boss?"]); }};
  const handleCheat2 = () => { if(prompt("Cheat Code (Hunger/💩)?") === "6212") { setHunger(h => h / 2); setPoops(p => [...p, {id:Date.now(), x:30, y:40},{id:Date.now()+1, x:50, y:60},{id:Date.now()+2, x:70, y:50}]); say(["Oh oh... Bauchgrummeln!"]); }};

  const startGame = () => {
    if (Date.now() - lastGame < 3600000) return say(["Ich bin müde! Komm in einer Stunde wieder."]);
    setGameActive(true); setGameScore(0); setSeeds([]); setGameResult(null); setGameTime(20); setLastGame(Date.now());
  };

  useEffect(() => {
    if (!gameActive) return;
    const spawn = setInterval(() => setSeeds(s => [...s, { id: Date.now(), x: Math.random() * 80 + 10 }]), 500);
    const timer = setInterval(() => {
        setGameTime(t => {
            if (t <= 1) {
                setGameActive(false); setGameResult(gameScore); setXp(x => x + gameScore);
                clearInterval(spawn); clearInterval(timer);
                return 0;
            }
            return t - 1;
        });
    }, 1000);
    return () => { clearInterval(spawn); clearInterval(timer); };
  }, [gameActive, gameScore]);

  return (
    <div className="min-h-screen bg-[#FFF0F5] p-4 font-sans select-none overflow-hidden flex flex-col items-center relative">
      <BackgroundDecor />

      {/* CHEATS */}
      <button onClick={handleCheat2} className="fixed top-2 left-2 bg-pink-100/50 p-1 rounded text-[8px] font-black z-[100] hover:bg-pink-200 border border-pink-300 italic flex items-center gap-1 opacity-40 hover:opacity-100 transition-all"><Key size={8}/> CHEAT: FASTEN</button>
      <button onClick={handleCheat1} className="fixed top-2 right-2 bg-pink-100/50 p-1 rounded text-[8px] font-black z-[100] hover:bg-pink-200 border border-pink-300 italic flex items-center gap-1 opacity-40 hover:opacity-100 transition-all"><Key size={8}/> CHEAT: REICH</button>

      {/* HEADER */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 z-10">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[2rem] shadow-lg border-4 border-pink-100 flex flex-col items-center">
          <Trophy className="text-pink-400 mb-1" />
          <span className="text-2xl font-black italic text-pink-600">LVL {level}</span>
          <div className="w-full h-2 bg-pink-50 rounded-full mt-2 overflow-hidden border border-pink-100"><motion.div animate={{ width: `${xp % 100}%` }} className="h-full bg-pink-400" /></div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[2rem] shadow-lg border-4 border-pink-100 flex flex-col items-center">
          <Coins className="text-amber-400 mb-1" />
          <span className="text-2xl font-black italic text-pink-600">{coins}</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[2rem] shadow-lg border-4 border-pink-100 flex flex-col items-center">
          <Utensils className="text-emerald-400 mb-1" />
          <span className="text-xl font-black italic text-pink-600">{Math.round(hunger)}% Hunger</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-[2rem] shadow-lg border-4 border-pink-100 flex flex-col items-center">
          <Heart className="text-rose-400 mb-1" />
          <span className="text-xl font-black italic text-pink-600">{Math.round(affection)}% Liebe</span>
          <div className="w-full h-2 bg-pink-50 rounded-full mt-2 overflow-hidden border border-pink-100"><motion.div animate={{ width: `${affection}%` }} className="h-full bg-rose-400" /></div>
        </div>
      </div>

      <main className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-center justify-center z-10">
        <div className="w-full md:w-2/3 aspect-square bg-white/60 backdrop-blur-md rounded-[4rem] shadow-2xl relative border-8 border-white overflow-hidden flex items-center justify-center bg-gradient-to-b from-white to-pink-50">
          <AnimatePresence>{message && <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} className="absolute top-10 z-50 bg-white/95 p-4 rounded-3xl shadow-xl border-2 border-pink-100 font-black max-w-[80%] text-center text-pink-600 italic leading-tight">{message}</motion.div>}</AnimatePresence>

          {isWorking ? (
            <div className="text-center">
              <HamiRender id={currentId} isWorking={true} />
              <p className="mt-4 font-black text-pink-300 animate-pulse uppercase tracking-widest">Bin fleißig... {Math.ceil(workLeft/60)}m</p>
              <button onClick={() => {if(window.confirm("Wirklich abbrechen? Keine Belohnung!")){setIsWorking(false); setWorkLeft(0); say(QUOTES.workCancel)}}} className="mt-4 bg-pink-100 text-pink-600 px-6 py-2 rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-sm border border-pink-200">Abbruch</button>
            </div>
          ) : (
            <div className="relative cursor-pointer" onClick={() => { if(affection>95){say(QUOTES.petFull)} else {setXp(x=>x+20); setAffection(100); say(QUOTES.pet)}}}>
              <HamiRender id={currentId} isWorking={false} />
              {poops.map(p => <button key={p.id} onClick={(e) => {e.stopPropagation(); setPoops(o=>o.filter(x=>x.id!==p.id)); setXp(x=>x+20); say(QUOTES.clean)}} style={{left:`${p.x}%`, top:`${p.y}%`}} className="absolute text-4xl z-40 transition-transform hover:scale-125">💩</button>)}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl border-4 border-pink-50 text-center text-pink-400 font-black italic">
             Thomai's Spezialitäten
            <div className="flex justify-around mt-4">
              {['🌻','🍝','🍕','🍟','🥗'].map((e, i) => (
                <button key={i} onClick={() => {if(hunger<90){setHunger(h=>Math.min(100,h+20)); setXp(x=>x+15); say(QUOTES.feed)} else {say(QUOTES.fat)}}} className="text-4xl hover:scale-125 transition-transform">{e}</button>
              ))}
            </div>
          </div>

          <button onClick={() => {if(!isWorking){setIsWorking(true); setWorkLeft(1800); say(QUOTES.workStart)}}} className="w-full bg-pink-400 text-white p-6 rounded-[2.5rem] shadow-lg font-black flex items-center justify-center gap-4 hover:bg-pink-500 transition-all disabled:opacity-50" disabled={isWorking}><Briefcase /> ARBEITEN</button>
          <button onClick={startGame} className="w-full bg-rose-400 text-white p-6 rounded-[2.5rem] shadow-lg font-black flex items-center justify-center gap-4 hover:bg-rose-500 transition-all"><Play /> MINIGAME</button>

          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl border-4 border-pink-50 max-h-60 overflow-y-auto">
             <h3 className="text-[10px] font-black uppercase text-pink-300 mb-4 tracking-widest flex items-center gap-2 italic"><ShoppingBag size={14}/> Kleiderschrank</h3>
             <div className="grid grid-cols-2 gap-2">
                {COSTUMES.map(c => {
                  const canUse = (c.lvl > 0 && level >= c.lvl) || unlocked.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => {
                        if(canUse){ setCurrentId(c.id); } 
                        else if(c.lvl === 0 && coins >= c.price){ setCoins(coins-c.price); setUnlocked([...unlocked, c.id]); setCurrentId(c.id); }
                    }} className={`p-2 rounded-2xl border-2 text-[10px] font-black uppercase transition-all ${currentId === c.id ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-pink-50 text-pink-300'} ${!canUse ? 'opacity-50' : ''}`}>
                      {c.name} {!canUse && <div className="text-[8px] font-bold">{c.lvl > 0 ? `LVL ${c.lvl}` : `💰 ${c.price}`}</div>}
                    </button>
                  );
                })}
             </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {gameActive && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-pink-300 z-[200] p-8 flex flex-col items-center">
             <div className="flex justify-between w-full max-w-2xl mb-4 text-white font-black italic text-4xl uppercase">
                 <h2>KERNE: {gameScore}</h2>
                 <h2>ZEIT: {gameTime}S</h2>
             </div>
             <div className="relative w-full h-full max-w-2xl bg-white/30 rounded-[3rem] overflow-hidden border-8 border-white/40">
               <AnimatePresence>
                 {seeds.map(s => (
                   <motion.div key={s.id} initial={{y:-100, x:`${s.x}%`}} animate={{y:1000}} exit={{scale:0}}
                    onClick={(e) => { e.stopPropagation(); if(gameScore < 40){setGameScore(prev => prev + 1); setSeeds(prev => prev.filter(x => x.id !== s.id));}}} 
                    transition={{duration:2, ease:"linear"}} className="absolute text-5xl cursor-pointer"
                   >🌻</motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => {if(prompt("Reset Code?")==="6212"){localStorage.clear(); window.location.reload();}}} className="fixed bottom-2 left-2 opacity-20 hover:opacity-100 p-2 text-pink-400 transition-all z-[100] flex items-center gap-1 text-[10px] font-black italic"><RefreshCw size={10}/> RESET PROGRESS</button>
    </div>
  );
}
