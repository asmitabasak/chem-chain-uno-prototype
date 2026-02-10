import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample Database
const ELEMENTS = [
  { id: 1, symbol: 'Na', name: 'Sodium', group: 'Alkali', color: 'bg-orange-500', type: 'Metal', power: 9 },
  { id: 2, symbol: 'Cl', name: 'Chlorine', group: 'Halogen', color: 'bg-green-500', type: 'Non-Metal', power: 8 },
  { id: 3, symbol: 'K', name: 'Potassium', group: 'Alkali', color: 'bg-orange-600', type: 'Metal', power: 10 },
  { id: 4, symbol: 'F', name: 'Fluorine', group: 'Halogen', color: 'bg-green-400', type: 'Non-Metal', power: 10 },
  { id: 5, symbol: 'Ar', name: 'Argon', group: 'Noble', color: 'bg-purple-500', type: 'Inert', power: 0 },
  { id: 6, symbol: 'Mg', name: 'Magnesium', group: 'Alkaline Earth', color: 'bg-yellow-500', type: 'Metal', power: 7 },
];

const ChemChainPrototype = () => {
  const [activeCard, setActiveCard] = useState(ELEMENTS[1]); // Chlorine starts
  const [hand, setHand] = useState([ELEMENTS[0], ELEMENTS[2], ELEMENTS[4], ELEMENTS[5]]);
  const [feedback, setFeedback] = useState("Your turn! Match the Halogen.");
  const [isReaction, setIsReaction] = useState(false);

  const handlePlay = (card, index) => {
    // 1. Check for Reaction (Metal + Non-Metal)
    const canReact = (card.type === 'Metal' && activeCard.type === 'Non-Metal') || 
                     (card.type === 'Non-Metal' && activeCard.type === 'Metal');
    
    // 2. Check for Family Match
    const familyMatch = card.group === activeCard.group;

    if (canReact || familyMatch || card.type === 'Inert') {
      setIsReaction(canReact);
      setActiveCard(card);
      setHand(prev => prev.filter((_, i) => i !== index));
      setFeedback(canReact ? "🔥 REACTION! Compound Formed!" : "Family Match!");
      
      if (canReact) {
        setTimeout(() => setIsReaction(false), 1500);
      }
    } else {
      setFeedback("❌ Incompatible! Draw a card.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white font-sans overflow-hidden flex flex-col items-center justify-between py-10 px-4">
      {/* HUD / Top Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500 border-2 border-white shadow-[0_0_10px_cyan]" />
          <div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Scientist</p>
            <p className="text-lg font-bold">Player_01</p>
          </div>
        </div>
        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
          <p className="text-xs text-slate-400 uppercase">Energy Meter</p>
          <div className="w-32 h-2 bg-slate-700 mt-1 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-cyan-500 shadow-[0_0_10px_cyan]" />
          </div>
        </div>
      </div>

      {/* Main Game Board */}
      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            className={`w-40 h-56 rounded-2xl border-4 border-white/20 shadow-2xl flex flex-col items-center justify-center relative ${activeCard.color} ${isReaction ? 'animate-pulse ring-8 ring-yellow-400/50' : ''}`}
          >
            <span className="absolute top-2 left-3 text-lg font-black opacity-40">{activeCard.power}</span>
            <span className="text-6xl font-black drop-shadow-lg">{activeCard.symbol}</span>
            <span className="text-sm font-medium mt-2 uppercase tracking-widest">{activeCard.name}</span>
          </motion.div>
        </AnimatePresence>
        
        <p className={`mt-8 text-xl font-bold italic transition-all duration-300 ${isReaction ? 'text-yellow-400 scale-125' : 'text-slate-400'}`}>
          {feedback}
        </p>
      </div>

      {/* Player Hand */}
      <div className="w-full max-w-5xl flex justify-center gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {hand.map((card, i) => (
          <motion.button
            whileHover={{ y: -20, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={`${card.id}-${i}`}
            onClick={() => handlePlay(card, i)}
            className={`flex-shrink-0 w-28 h-40 rounded-xl border-2 border-white/30 flex flex-col items-center justify-center shadow-lg cursor-pointer ${card.color} transition-shadow hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
          >
            <span className="text-3xl font-bold">{card.symbol}</span>
            <span className="text-[10px] mt-1 uppercase font-bold text-white/80">{card.group}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ChemChainPrototype;
