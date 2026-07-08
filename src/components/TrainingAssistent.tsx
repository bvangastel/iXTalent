import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  MessageSquare, 
  Link2, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  HelpCircle,
  TrendingUp,
  Brain,
  Zap,
  BookOpen
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  logo: string;
  color: string;
  tagline: string;
  focus: string;
  suggestedPrompt: string;
}

const TOOLS: Tool[] = [
  { 
    id: 'rinus', 
    name: 'Rinus App (KNVB)', 
    logo: '🇳🇱', 
    color: 'from-orange-500 to-amber-600', 
    tagline: 'De officiële KNVB trainingsplanner',
    focus: 'KNVB speelwijze-richtlijnen & leerlijnen',
    suggestedPrompt: 'Training voor JO11 over druk zetten'
  },
  { 
    id: 'tacticalpad', 
    name: 'Tactical Pad', 
    logo: '📋', 
    color: 'from-blue-500 to-cyan-600', 
    tagline: 'Tactische analyses & 3D animaties',
    focus: 'Positiespelen en visuele spelpatronen',
    suggestedPrompt: 'Hoe visualiseer ik de omschakeling?'
  },
  { 
    id: 'soccertutor', 
    name: 'SoccerTutor Tactics Manager', 
    logo: '📊', 
    color: 'from-indigo-500 to-blue-700', 
    tagline: 'Tactische tekensoftware & database',
    focus: 'Structuur, veldafmetingen en herhalingsvormen',
    suggestedPrompt: 'Vormen voor compact verdedigen'
  },
  { 
    id: 'toptekkers', 
    name: 'TopTekkers', 
    logo: '⭐', 
    color: 'from-yellow-500 to-orange-500', 
    tagline: 'Speler-volg-en-leer-platform voor techniek',
    focus: 'Individuele balbeheersing & huiswerk-challenges',
    suggestedPrompt: 'Hoe trainen we 1v1 duelkracht?'
  },
  { 
    id: 'coachbetter', 
    name: 'Coachbetter', 
    logo: '🎓', 
    color: 'from-emerald-500 to-teal-600', 
    tagline: 'Volledig verenigings- en trainingsmanagement',
    focus: 'Belastbaarheid, teamplanning & video-analyse',
    suggestedPrompt: 'Conditiebehoud tijdens de winterstop'
  },
  { 
    id: 'sportsession', 
    name: 'SportSessionPlanner', 
    logo: '⏱️', 
    color: 'from-purple-500 to-indigo-600', 
    tagline: 'Professionele 3D trainingsplannen',
    focus: 'Periodisering en gedetailleerde sessietekeningen',
    suggestedPrompt: 'Spelvorm 4v4 + 2 kaatsers'
  }
];

interface ChatMessage {
  sender: 'tool' | 'user';
  text: string;
}

interface TrainingAssistentProps {
  setView: (view: string) => void;
}

export default function TrainingAssistent({ setView }: TrainingAssistentProps) {
  const [selectedTool, setSelectedTool] = useState<Tool>(TOOLS[0]);
  const [connections, setConnections] = useState<Record<string, 'disconnected' | 'connecting' | 'connected'>>({
    'rinus': 'connected', // start with Rinus connected as default indicator
  });
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    'rinus': [
      { sender: 'tool', text: "Hallo! Welkom bij Rinus App (KNVB)! Waar kan ik je bij helpen?" }
    ]
  });
  
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedTool]);

  const handleConnect = (tool: Tool) => {
    if (connections[tool.id] === 'connected') {
      setSelectedTool(tool);
      return;
    }

    setConnections(prev => ({ ...prev, [tool.id]: 'connecting' }));
    
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [tool.id]: 'connected' }));
      setSelectedTool(tool);
      
      // Initialize chat if not exists
      if (!messages[tool.id]) {
        setMessages(prev => ({
          ...prev,
          [tool.id]: [
            { sender: 'tool', text: `Hallo! Welkom bij ${tool.name}! Waar kan ik je bij helpen?` }
          ]
        }));
      }
    }, 850);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const toolId = selectedTool.id;

    const userMsg: ChatMessage = { sender: 'user', text };
    setMessages(prev => ({
      ...prev,
      [toolId]: [...(prev[toolId] || []), userMsg]
    }));
    setInputValue('');

    // Dynamic responses under 60 words, sport-passionate & provocative, ending with a question
    setTimeout(() => {
      let reply = "";
      const q = text.toLowerCase();

      if (q.includes('druk') || q.includes('druk zetten') || q.includes('persen')) {
        switch (toolId) {
          case 'rinus':
            reply = "Druk zetten begint bij de KNVB-as! Dwingen we de tegenstander naar de zijlijn of sluiten we het centrum af? Voor JO11 adviseer ik een chaotische 4v4-vorm met vier doeltjes. Hoe gaan jullie spelers coachen op het moment van omschakeling?";
            break;
          case 'tacticalpad':
            reply = "Visualiseer de druk-driehoek! Op Tactical Pad zien spelers direct hoe de afstanden tussen linies onder de 12 meter moeten blijven. Richt je op de schaduwdekking achter de drukzetter. Is jullie spits bereid om de passlijn naar de verdedigende middenvelder direct te blokkeren?";
            break;
          case 'soccertutor':
            reply = "Gebruik een afgebakende 'drukzone' van 20x15 meter. Als de bal daar komt, moet er binnen 3 seconden druk zijn. SoccerTutor adviseert herhaaldelijk korte, intensieve intervalvormen. Hoe houden jullie spelers gemotiveerd als de eerste druk mislukt?";
            break;
          case 'toptekkers':
            reply = "Druk zetten is 1v1 duelkracht! TopTekkers adviseert speler-challenges om de verdedigende basishouding te trainen: door de knieën, zijwaarts staan en sturen. Welke speler in jullie JO11 blinkt momenteel uit in het veroveren van de bal zonder overtreding?";
            break;
          case 'coachbetter':
            reply = "Coachbetter adviseert video-feedback! Film een 5v5 partijvorm en laat spelers zien hoe compact ze werkelijk staan als de keeper van de tegenpartij opbouwt. Durven jullie spelers zélf de fouten te laten ontdekken op het scherm, of kauwen jullie alles voor?";
            break;
          default:
            reply = "Druk zetten vereist collectieve afstemming! Maak de velden klein om succeservaringen te garanderen. SportSessionPlanner adviseert een 4v4 + 2 neutrale kaatsers vorm om direct druk na balverlies te stimuleren. Hebben jullie hier de juiste conditie voor?";
        }
      } else if (q.includes('omschakeling') || q.includes('transitie') || q.includes('balverlies')) {
        reply = "De omschakeling is het meest dynamische moment! Zodra de bal verloren is, direct 5 seconden felle druk (gegenpressing) of direct in de organisatie? Hoe reageren jullie verdedigers als de spits de bal verliest?";
      } else if (q.includes('techniek') || q.includes('1v1') || q.includes('bal')) {
        reply = "Techniek floreert bij maximale balcontacten! Vergeet saaie rijtjes; kies voor duelvormen in kleine ruimtes met direct resultaat. Wie van jullie trainers durft de nadruk te leggen op creativiteit in plaats van risicovermijding?";
      } else {
        reply = `Geweldige uitdaging voor de ${selectedTool.name}! Om dit succesvol te trainen, moeten spelers de logica van de ruimte snappen. Focus op spelplezier en intense herhalingen. Gaan jullie de oefenstof direct integreren in het leerplan van SV Brainport United?`;
      }

      setMessages(prev => ({
        ...prev,
        [toolId]: [...(prev[toolId] || []), { sender: 'tool', text: reply }]
      }));
    }, 600);
  };

  const currentChat = messages[selectedTool.id] || [
    { sender: 'tool', text: `Hallo! Welkom bij ${selectedTool.name}! Waar kan ik je bij helpen?` }
  ];

  const isCurrentConnected = connections[selectedTool.id] === 'connected';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-orange-500 animate-pulse" />
              TrainingAssistent
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Koppel direct met toonaangevende externe databases en trainingsplanner tools om jullie visie moeiteloos te vertalen naar het veld.
            </p>
          </div>
          <div className="text-[11px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            Koppelingsmodule v1.2
          </div>
        </div>
      </div>

      {/* HORIZONTAL LINE OF INTERACTIVE TOOLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
            Selecteer en koppel een trainingsplanner database
          </span>
          <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-md">
            {Object.values(connections).filter(c => c === 'connected').length} van {TOOLS.length} verbonden
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {TOOLS.map((tool) => {
            const status = connections[tool.id] || 'disconnected';
            const isSelected = selectedTool.id === tool.id;

            return (
              <button
                key={tool.id}
                id={`btn-tool-connect-${tool.id}`}
                onClick={() => handleConnect(tool)}
                className={`group relative text-left rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between min-h-[135px] cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-950 shadow-md ring-2 ring-orange-500' 
                    : 'bg-white text-slate-800 border-slate-150 shadow-2xs hover:shadow-sm'
                }`}
              >
                {/* Logo & Connection Indicator */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-2xl">{tool.logo}</span>
                  <div className="flex items-center gap-1">
                    {status === 'connected' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                    {status === 'connecting' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                    {status === 'disconnected' && (
                      <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                    )}
                    <span className={`text-[9px] font-black uppercase ${
                      status === 'connected' ? 'text-emerald-500' :
                      status === 'connecting' ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      {status === 'connected' ? 'OK' : status === 'connecting' ? '...' : 'LINK'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-0.5">
                  <h3 className={`text-xs font-black tracking-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {tool.name}
                  </h3>
                  <p className={`text-[9px] leading-snug font-semibold line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {tool.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CHAT INTERFACE */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden h-[520px]">
        {/* Active app bar */}
        <div className={`p-4 flex items-center justify-between border-b border-slate-100 bg-gradient-to-r ${selectedTool.color} text-white`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedTool.logo}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-sm">{selectedTool.name}</h2>
                <span className="bg-white/20 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  Live Chatbot
                </span>
              </div>
              <p className="text-[10px] opacity-90 font-medium">
                {isCurrentConnected ? `Verbonden met API & Oefeningen-database` : `Koppeling vereist`}
              </p>
            </div>
          </div>

          {/* Connection control */}
          <button
            onClick={() => handleConnect(selectedTool)}
            className={`rounded-lg px-3 py-1.5 text-[10px] font-black transition cursor-pointer ${
              isCurrentConnected 
                ? 'bg-emerald-600/30 text-white border border-emerald-500' 
                : 'bg-white text-slate-900 hover:bg-slate-100 shadow-xs'
            }`}
          >
            {isCurrentConnected ? '✓ Gekoppeld' : 'Koppel nu'}
          </button>
        </div>

        {/* Chat message flow */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {isCurrentConnected ? (
            <>
              <div className="text-center py-2">
                <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider">
                  API-sessie gestart • SV Brainport United • Focusgebied: {selectedTool.focus}
                </span>
              </div>
              
              {currentChat.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md rounded-2xl p-4 shadow-3xs ${
                    msg.sender === 'user'
                      ? 'bg-orange-600 text-white rounded-br-none font-semibold text-xs leading-relaxed'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none font-medium text-xs leading-relaxed space-y-2'
                  }`}>
                    {msg.sender === 'tool' && (
                      <span className="text-[8px] font-black uppercase text-orange-600 block mb-1">
                        {selectedTool.name}
                      </span>
                    )}
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Link2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">Geen actieve verbinding</h3>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Klik hierboven op de <strong>Koppel nu</strong> knop om de database van {selectedTool.name} te synchroniseren met jullie opleidingsvisie.
                </p>
              </div>
              <button
                onClick={() => handleConnect(selectedTool)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs px-4 py-2.5 transition shadow-xs cursor-pointer active:scale-95"
              >
                <Link2 className="h-3.5 w-3.5" /> Start verbinding
              </button>
            </div>
          )}
        </div>

        {/* Chat input box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="p-3 border-t border-slate-100 bg-white flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isCurrentConnected}
              placeholder={isCurrentConnected ? `Stel een trainingsvraag aan ${selectedTool.name}...` : `Koppel de applicatie eerst`}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 focus:bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-400 transition"
            />
            <button
              type="submit"
              disabled={!isCurrentConnected || !inputValue.trim()}
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 disabled:bg-slate-200 text-white px-4 transition cursor-pointer active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          {isCurrentConnected && (
            <button
              type="button"
              onClick={() => handleSend(selectedTool.suggestedPrompt)}
              className="text-left px-3 py-2 rounded-xl border border-orange-100 bg-orange-50/30 hover:bg-orange-50 text-slate-800 font-bold text-[10px] transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <MessageSquare className="h-3.5 w-3.5 text-orange-600" />
              <span>Voorbeeldvraag: "{selectedTool.suggestedPrompt}"</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
