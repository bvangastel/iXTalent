import React, { useState, useRef, useEffect } from 'react';
import { Player, VisieKompasDimension, ClubScanQuestion } from '../types';
import { 
  Flame, 
  ArrowRight, 
  Users, 
  Compass, 
  Activity, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Brain, 
  MessageSquare,
  HelpCircle,
  Database,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  players: Player[];
  clubScan: ClubScanQuestion[];
  visieSliders: VisieKompasDimension[];
  setView: (view: string) => void;
  teamAllocations: Record<string, string[]>;
  isVisionCompleted: boolean;
  isTeamAllocationFinalized: boolean;
  isSportlinkConnected: boolean;
}

interface Message {
  sender: 'user' | 'coach';
  text: string;
}

export default function Dashboard({ 
  players, 
  clubScan, 
  setView, 
  teamAllocations, 
  isVisionCompleted,
  isTeamAllocationFinalized,
  isSportlinkConnected
}: DashboardProps) {
  
  // Calculate dynamic allocation progress
  const allocatedCount = isSportlinkConnected ? Object.values(teamAllocations).reduce((acc, cur) => acc + cur.length, 0) : 0;
  const totalPlayersCount = isSportlinkConnected ? players.length : 0;
  const progressPercentage = totalPlayersCount > 0 ? Math.round((allocatedCount / totalPlayersCount) * 100) : 0;

  // Calculate scan progress of answered questions
  const answeredScanCount = clubScan.filter(q => q.score > 0).length;
  const scanProgressPercentage = Math.round((answeredScanCount / clubScan.length) * 100);
  const avgScanScore = answeredScanCount > 0 
    ? (clubScan.filter(q => q.score > 0).reduce((acc, q) => acc + q.score, 0) / answeredScanCount).toFixed(1)
    : "0.0";

  // AI Promptbox State
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'coach',
      text: "Welkom bij jouw persoonlijke iXTalent Coach. Ik help je om jullie sportvisie te vormen en te vertalen naar ouders, trainers en spelers. Stel hieronder je vraag of gebruik de snelle vragen!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Provocative AI Coach Dutch responses (under 60 words, ending with a question)
  const getCannedResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('ouder') || q.includes('betrek') || q.includes('vereniging') || q.includes('uitleg') || q.includes('visie vertalen')) {
      return "Tackle ouderdruk door ze op te leiden! Maak ouders pedagogisch partner van de clubvisie. Leg hen uit dat selecteren op fysiek in JO11 talent vernietigt. Gaan jullie dit gesprek aan op een ouderavond of buigen jullie voor schreeuwende toeschouwers?";
    }
    if (q.includes('trainer') || q.includes('sceptisch') || q.includes('verkoop') || q.includes('overtuigen')) {
      return "Sceptische trainers overtuig je met feiten! Toon de RAE-cijfers en laat hen zien dat laatbloeiers nu verloren gaan. Een coach mét AI wint altijd van de coach zonder AI. Gaan jullie trainers opleiden of laten jullie ze vasthouden aan ouderwetse selectie?";
    }
    if (q.includes('vroeg') || q.includes('selectie') || q.includes('schadelijk') || q.includes('visie vormen')) {
      return "Vroege selectie in JO11 is sportwetenschappelijke kapitaalvernietiging! Kinderen groeien grillig. De uitblinker van nu is vaak gewoon biologisch ouder. Wie durft er bij SV Brainport op basis van leersnelheid en plezier te selecteren in plaats van de stand?";
    }
    if (q.includes('vertaal') || q.includes('training') || q.includes('praktijk') || q.includes('hoe')) {
      return "Vertaal je visie door flexibele bio-banding! Deel spelers op de training in op biologische leeftijd in plaats van geboortemaand. Zo leert de fysieke reus technisch oplossen en schittert de kleine creatieveling. Welke trainer gaat dit vanavond direct toepassen?";
    }

    return "Scherpe vraag, sportpionier! Talentontwikkeling vraagt om moedige keuzes binnen de club. Stop met praten en laat de data voor je werken met iXTalent. De bal ligt bij jullie: gaan jullie voor snelle bekers of voor duurzaam sportplezier?";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulated quick reply
    setTimeout(() => {
      const replyText = getCannedResponse(text);
      setMessages(prev => [...prev, { sender: 'coach', text: replyText }]);
    }, 500);
  };

  const snelVragen = [
    { label: "1. Vormen: Waarom is te vroege selectie schadelijk?", vraag: "Waarom is te vroege selectie in de JO11-fase schadelijk voor talent?" },
    { label: "2. Vertalen: Hoe leg ik dit uit aan mondige ouders?", vraag: "Hoe kan ik de nieuwe visie helder uitleggen aan veeleisende ouders?" },
    { label: "3. Vertalen: Hoe overtuig ik sceptische trainers?", vraag: "Hoe overtuig ik sceptische, prestatiegerichte trainers van deze visie?" },
    { label: "4. Praktijk: Hoe vertaal ik dit naar trainingen?", vraag: "Hoe vertaal ik het Visiekompas naar concrete oefenvormen zoals bio-banding?" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (Simplified Orange Cadre) */}
      <div id="orange-welcome-banner" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-6 text-white shadow-lg md:p-8">
        <div className="relative z-10 max-w-3xl">
          <p className="font-sans text-lg font-extrabold leading-relaxed text-white md:text-xl">
            Welkom bij jouw persoonlijke iXTalent Coach. Ik help je om jullie sportvisie te vormen en te vertalen naar ouders, trainers en spelers. Stel hieronder je vraag of gebruik de snelle vragen!
          </p>
          <div className="mt-6">
            <button
              id="btn-start-clubscan-welcome"
              onClick={() => setView('visiekompas')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-orange-600 transition hover:bg-orange-50 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
            >
              Start het Visiekompas <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 opacity-15 md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white_0%,transparent_70%)]" />
          <svg className="h-full w-full stroke-white/20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="10" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Sportlink Connection Warning Alert - Show if not connected */}
      {!isSportlinkConnected && (
        <div id="sportlink-warning-alert" className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50/70 p-4 shadow-xs">
          <div className="flex gap-3 items-center">
            <div className="rounded-lg bg-rose-100 p-1.5 text-rose-700 shrink-0">
              <Database className="h-4 w-4 animate-pulse text-rose-600" />
            </div>
            <p className="text-xs text-rose-800 font-bold">
              Let op: Er is nog geen Sportlink-verenigingsdatabase gekoppeld. Koppel deze in het Club Profiel om de verenigingsgegevens van SV Brainport United te laden.
            </p>
          </div>
          <button
            onClick={() => setView('clubprofile')}
            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 text-white px-3 py-1.5 text-[10px] font-black transition hover:bg-rose-700 active:scale-95 cursor-pointer shrink-0"
          >
            Koppel Sportlink
          </button>
        </div>
      )}

      {/* Visiekompas Warning Alert - Show only if not configured yet */}
      {isSportlinkConnected && !isVisionCompleted && (
        <div id="visie-warning-alert" className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-xs">
          <div className="flex gap-3 items-center">
            <div className="rounded-lg bg-amber-100 p-1.5 text-amber-700 shrink-0">
              <Compass className="h-4 w-4 animate-spin-slow text-amber-600" />
            </div>
            <p className="text-xs text-amber-800 font-bold">
              Tip: Vul ook het Visiekompas in om de clubvisie voor SV Brainport United officieel vorm te geven!
            </p>
          </div>
          <button
            onClick={() => setView('visiekompas')}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 text-white px-3 py-1.5 text-[10px] font-black transition hover:bg-amber-700 active:scale-95 cursor-pointer"
          >
            Formuleer Visie
          </button>
        </div>
      )}

      {/* KPI Metrics Grid (Only the required 3 columns now) */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Metric 1: Jeugdleden Aantal */}
        <div id="kpi-jeugdleden" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jeugdleden Aantal</span>
            <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-850">
              {isSportlinkConnected ? (447 + players.length).toString() : "0"}
            </span>
            <span className="text-[10px] font-extrabold text-slate-500">
              {isSportlinkConnected ? "actieve leden" : "niet gekoppeld"}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-medium text-slate-400">
            {isSportlinkConnected ? "SV Brainport United vereniging" : "Koppel Sportlink in Club Profiel"}
          </p>
        </div>

        {/* Metric 2: Voortgang Teamindelingen */}
        <div id="kpi-teamindeling-voortgang" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voortgang Teamindelingen</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-850">
              {isSportlinkConnected ? allocatedCount : "0"} / {isSportlinkConnected ? players.length : "0"}
            </span>
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              {isSportlinkConnected ? `${progressPercentage}%` : "0%"}
            </span>
          </div>
          <p className="mt-2 text-[11px] font-bold">
            {!isSportlinkConnected ? (
              <span className="text-slate-400">⚠️ Wacht op Sportlink koppeling</span>
            ) : isTeamAllocationFinalized ? (
              <span className="text-emerald-600">✓ JO11 is definitief ingedeeld!</span>
            ) : (
              <span className="text-rose-600">⚠️ JO11 is nog niet ingedeeld!</span>
            )}
          </p>
        </div>

        {/* Metric 3: Voortgang Clubscan Score */}
        <div id="kpi-clubscan-voortgang" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voortgang Clubscan</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-850">{scanProgressPercentage}%</span>
            <span className="text-slate-400 text-xs font-bold">ingevuld</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${scanProgressPercentage}%` }} />
          </div>
          <p className="mt-2 text-[11px] font-bold">
            {scanProgressPercentage === 100 ? (
              <span className="text-emerald-600">✓ Voltooid! Score: {avgScanScore}/5.0</span>
            ) : scanProgressPercentage > 0 ? (
              <span className="text-amber-600">⚠️ Invoeren... ({answeredScanCount}/4 vragen)</span>
            ) : (
              <span className="text-rose-600">❌ Nog niet gestart (0%)</span>
            )}
          </p>
        </div>
      </div>

      {/* Interactive AI Prompt Window */}
      <div id="ai-prompt-window" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col md:grid md:grid-cols-3">
        
        {/* Left Column: Input and Chat History */}
        <div className="p-5 md:col-span-2 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Brain className="h-4.5 w-4.5 text-orange-600" />
              <span>Stel je vraag & Vertaal je visie</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Vraag advies aan de iXTalent Coach over het vormen van de visie of het overtuigen van ouders en trainers.
            </p>
          </div>

          {/* Chat History Messages */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 h-64 overflow-y-auto space-y-3">
            {messages.map((m, i) => {
              const isCoach = m.sender === 'coach';
              return (
                <div key={i} className={`flex ${isCoach ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[90%] rounded-xl p-3 text-xs leading-relaxed ${
                    isCoach 
                      ? 'bg-white text-slate-800 border border-slate-200/60 shadow-2xs' 
                      : 'bg-orange-600 text-white font-semibold shadow-xs'
                  }`}>
                    <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider mb-1 opacity-75">
                      {isCoach ? (
                        <>
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span>iXTalent Coach</span>
                        </>
                      ) : (
                        <span>Jouw vraag</span>
                      )}
                    </div>
                    <p className="font-medium text-[11px]">{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Text Input with Send button */}
          <div className="flex gap-2">
            <input
              id="dashboard-prompt-input"
              type="text"
              placeholder="Typ hier je vraag (bijv. 'Hoe overtuig ik sceptische trainers?')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-hidden transition-all"
            />
            <button
              id="btn-send-prompt"
              onClick={() => handleSend(inputValue)}
              className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 text-xs font-bold transition active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Sneltoetsen (Quick-question suggestion buttons) */}
        <div className="p-5 bg-slate-50/60 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>Snelle vragen</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Klik op een van de onderstaande stellingen om direct een scherp antwoord of argument te ontvangen:
            </p>
          </div>

          {/* Sneltoets buttons list */}
          <div className="space-y-2.5">
            {snelVragen.map((sv, idx) => (
              <button
                id={`sneltoets-${idx}`}
                key={idx}
                onClick={() => handleSend(sv.vraag)}
                className="w-full text-left rounded-xl border border-slate-100 bg-white hover:bg-orange-50 hover:border-orange-200 p-2.5 shadow-2xs transition cursor-pointer"
              >
                <div className="text-[10px] font-extrabold text-slate-800 leading-tight">
                  {sv.label}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Disclaimer / Tone Description */}
          <div className="text-[10px] text-slate-400 leading-relaxed font-semibold bg-white border border-slate-150 p-3 rounded-xl">
            Onze iXTalent Coach spreekt met sportpassie, is beknopt (onder 60 woorden) en inspireert!
          </div>
        </div>

      </div>

    </div>
  );
}
