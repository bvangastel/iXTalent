import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Flame, HelpCircle, RefreshCw, User, Brain } from 'lucide-react';
import { voorbeeldVragen } from '../data/demoClub';

interface Message {
  sender: 'user' | 'coach';
  text: string;
}

export default function AiCoachDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: "Hoppa! Welkom bij de tactische bespreking, sportpioniers! Ik ben jullie iXTalent Coach. Schermen omhoog, borst vooruit. AI is jullie nieuwe superpower om SV Brainport naar een hoger niveau te tillen. Wat gaan we tackelen vandaag? Stel me een harde vraag!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Canned, highly energetic & provocative expert Dutch responses (max 60 words, ending in questions)
  const getCannedResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('tim h.') || q.includes('ouder') || q.includes('druk') || q.includes('ouders')) {
      return "Tackle ouderdruk door ze op te leiden! Ouders van vroegrijpe spelers als Tim H. willen nu winnen, maar wij trainen voor de toekomst. Leg hen uit dat Tim door zijn fysieke voorsprong techniek verwaarloost. Maak ouders pedagogisch partner! Gaan jullie het gesprek aan of buigen jullie voor schreeuwende toeschouwers?";
    }
    if (q.includes('noah k.') || q.includes('schadelijk') || q.includes('vroeg') || q.includes('selecte') || q.includes('doodzonde')) {
      return "Laatbloeiers zoals Noah K. in de JO11-3 steken is sportwetenschappelijke kapitaalvernietiging! Noah heeft een gigantische leerbaarheid maar mist nu de juiste prikkels. Hij haakt dadelijk teleurgesteld af. Durven jullie het aan om op basis van leerpotentieel te selecteren in plaats van de stand in de competitie?";
    }
    if (q.includes('bio-banding') || q.includes('training') || q.includes('rae') || q.includes('leeftijd') || q.includes('geboren') || q.includes('kwartaal')) {
      return "Bio-banding richt je in door spelers tijdens partijvormen flexibel in te delen op basis van biologische rijping, niet op geboortemaand! Zo krijgt de kleine creatieveling ruimte om te excelleren en leert de vroege reus technisch op te lossen. Wie van jullie gaat dit vanavond direct toepassen op de training?";
    }
    if (q.includes('bo de g.') || q.includes('opkomst') || q.includes('trainer') || q.includes('sceptisch') || q.includes('overtuigen')) {
      return "Bij Bo de G. is de fysieke voorsprong een valkuil: hij scoort makkelijk maar leert geen discipline (60% opkomst). Als coach eis je teamspirit en inzet. Geen training is geen basisspeler, ongeacht talent! Hoe gaan jullie de fanatieke trainers overtuigen dat gedrag en motivatie belangrijker zijn dan wekelijkse goals?";
    }

    // Generic fallbacks
    return "Sterke pass! Talentontwikkeling bij SV Brainport United vraagt om moedige keuzes. We moeten stoppen met het kopiëren van profclubs en beginnen met ontwikkelingsgericht opleiden. Gebruik iXTalent om data voor je te laten werken. De bal ligt bij jullie: gaan jullie voor de snelle winst of voor duurzaam sportplezier?";
  };;

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI thinking and reply
    setTimeout(() => {
      const coachText = getCannedResponse(text);
      setMessages(prev => [...prev, { sender: 'coach', text: coachText }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-600 animate-pulse" /> iXTalent Coach Live Chat
        </h1>
        <p className="text-sm text-gray-500">
          Stel kritische vragen aan onze sportwetenschappelijke sparringpartner over het beleid van SV Brainport United.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chat box */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xs p-4 flex flex-col h-[520px] lg:col-span-2">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            {messages.map((m, i) => {
              const isCoach = m.sender === 'coach';
              return (
                <div key={i} className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isCoach 
                      ? 'bg-slate-50 text-slate-800 border border-slate-100' 
                      : 'bg-orange-600 text-white font-medium'
                  }`}>
                    {isCoach && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                        <Flame className="h-3 w-3 animate-pulse text-orange-500" /> iXTalent Coach
                      </span>
                    )}
                    {!isCoach && (
                      <span className="flex items-center gap-1 text-[9px] font-bold text-orange-200 uppercase tracking-wider mb-1">
                        <User className="h-3 w-3" /> Student Sportkunde
                      </span>
                    )}
                    <p>{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Text Input */}
          <div className="border-t border-gray-100 pt-3 flex gap-2">
            <input
              id="chat-input"
              type="text"
              placeholder="Stel hier je provocerende sportvraag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 rounded-xl border border-gray-200 bg-slate-50 py-2.5 px-4 text-xs text-gray-800 placeholder-gray-400 focus:border-orange-500 focus:outline-hidden"
            />
            <button
              id="btn-send-message"
              onClick={() => handleSend(inputValue)}
              className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 text-xs font-semibold transition active:scale-95 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Suggestion & Info Column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggesties voor de discussie</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Klik op een van de onderstaande tactische stellingen om de discussie in het klaslokaal direct op scherp te zetten.
            </p>
            
            <div className="space-y-2">
              {voorbeeldVragen.map((vq, index) => (
                <button
                  id={`suggest-question-${vq.id}`}
                  key={vq.id}
                  onClick={() => handleSend(vq.vraag)}
                  className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 hover:bg-orange-50 hover:border-orange-200 p-3 transition"
                >
                  <div className="text-[11px] font-bold text-slate-800">
                    {index + 1}. {vq.vraag}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {vq.toelichting}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rules Banner */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4 space-y-1 text-xs text-orange-950">
            <h4 className="font-bold flex items-center gap-1 text-orange-800">
              <Brain className="h-4 w-4 text-orange-600" /> Over de iXTalent Coach
            </h4>
            <p className="leading-relaxed opacity-95">
              Onze coach is geprogrammeerd om sportkunde theorieën te vertalen naar felle, praktische adviezen. Hij houdt de antwoorden bewust kort en krachtig zodat de interactie in de zaal maximaal blijft!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
