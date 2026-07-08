import React, { useState } from 'react';
import { Player } from '../types';
import { Shield, Users2, ArrowRight, Layers, ArrowUpRight, Database, Link, Loader2, Wifi, CheckCircle2, Compass, Sparkles } from 'lucide-react';

interface ClubProfileProps {
  players: Player[];
  setView: (view: string) => void;
  isSportlinkConnected: boolean;
  onConnectSportlink: (connected: boolean) => void;
  isVisionCompleted: boolean;
  visionName: string;
  visionDescription: string;
}

export default function ClubProfile({ 
  players,
  setView, 
  isSportlinkConnected, 
  onConnectSportlink,
  isVisionCompleted,
  visionName,
  visionDescription
}: ClubProfileProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      onConnectSportlink(true);
    }, 1500);
  };

  // Data for the age layers JO7 t/m JO19
  const ageLayers = [
    {
      name: 'JO7 (Onder 7)',
      totalPlayers: 24,
      teams: [
        { name: 'JO7-1', players: 6 },
        { name: 'JO7-2', players: 6 },
        { name: 'JO7-3', players: 6 },
        { name: 'JO7-4', players: 6 }
      ],
      color: 'border-l-orange-500 bg-orange-50/20'
    },
    {
      name: 'JO8 (Onder 8)',
      totalPlayers: 32,
      teams: [
        { name: 'JO8-1', players: 8 },
        { name: 'JO8-2', players: 8 },
        { name: 'JO8-3', players: 8 },
        { name: 'JO8-4', players: 8 }
      ],
      color: 'border-l-amber-500 bg-amber-50/20'
    },
    {
      name: 'JO9 (Onder 9)',
      totalPlayers: 32,
      teams: [
        { name: 'JO9-1', players: 8 },
        { name: 'JO9-2', players: 8 },
        { name: 'JO9-3', players: 8 },
        { name: 'JO9-4', players: 8 }
      ],
      color: 'border-l-yellow-500 bg-yellow-50/20'
    },
    {
      name: 'JO10 (Onder 10)',
      totalPlayers: 32,
      teams: [
        { name: 'JO10-1', players: 8 },
        { name: 'JO10-2', players: 8 },
        { name: 'JO10-3', players: 8 },
        { name: 'JO10-4', players: 8 }
      ],
      color: 'border-l-lime-500 bg-lime-50/20'
    },
    {
      name: 'JO11 (Onder 11)',
      totalPlayers: players.length,
      teams: [
        { name: 'JO11-1', players: Math.ceil(players.length / 3) },
        { name: 'JO11-2', players: Math.floor((players.length - Math.ceil(players.length / 3)) / 2) },
        { name: 'JO11-3', players: players.length - Math.ceil(players.length / 3) - Math.floor((players.length - Math.ceil(players.length / 3)) / 2) }
      ],
      color: 'border-l-emerald-500 bg-emerald-50/20'
    },
    {
      name: 'JO12 (Onder 12)',
      totalPlayers: 33,
      teams: [
        { name: 'JO12-1', players: 11 },
        { name: 'JO12-2', players: 11 },
        { name: 'JO12-3', players: 11 }
      ],
      color: 'border-l-teal-500 bg-teal-50/20'
    },
    {
      name: 'JO13 (Onder 13)',
      totalPlayers: 60,
      teams: [
        { name: 'JO13-1', players: 15 },
        { name: 'JO13-2', players: 15 },
        { name: 'JO13-3', players: 15 },
        { name: 'JO13-4', players: 15 }
      ],
      color: 'border-l-cyan-500 bg-cyan-50/20'
    },
    {
      name: 'JO15 (Onder 15)',
      totalPlayers: 64,
      teams: [
        { name: 'JO15-1', players: 16 },
        { name: 'JO15-2', players: 16 },
        { name: 'JO15-3', players: 16 },
        { name: 'JO15-4', players: 16 }
      ],
      color: 'border-l-sky-500 bg-sky-50/20'
    },
    {
      name: 'JO17 (Onder 17)',
      totalPlayers: 85,
      teams: [
        { name: 'JO17-1', players: 17 },
        { name: 'JO17-2', players: 17 },
        { name: 'JO17-3', players: 17 },
        { name: 'JO17-4', players: 17 },
        { name: 'JO17-5', players: 17 }
      ],
      color: 'border-l-indigo-500 bg-indigo-50/20'
    },
    {
      name: 'JO19 (Onder 19)',
      totalPlayers: 85,
      teams: [
        { name: 'JO19-1', players: 17 },
        { name: 'JO19-2', players: 17 },
        { name: 'JO19-3', players: 17 },
        { name: 'JO19-4', players: 17 },
        { name: 'JO19-5', players: 17 }
      ],
      color: 'border-l-violet-500 bg-violet-50/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubprofiel</h1>
          <p className="text-sm text-gray-500">De specifieke context van onze vereniging: SV Brainport United.</p>
        </div>
        {isSportlinkConnected ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 animate-pulse" /> Sportlink Gekoppeld
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Database className="h-3.5 w-3.5 text-slate-500" /> Geen database gekoppeld
          </div>
        )}
      </div>

      {!isSportlinkConnected ? (
        <div className="max-w-2xl mx-auto my-8 p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-xs text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            <Database className="h-10 w-10 stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Koppel Sportlink-verenigingsdatabase</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Het Club Profiel is momenteel leeg. Maak verbinding met de officiële landelijke <strong>Sportlink-database</strong> om alle ledenbestanden, teamindelingen, en KNVB-leeftijdslagen voor <strong>SV Brainport United</strong> direct in te laden.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 max-w-md mx-auto space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Wifi className="h-4 w-4 text-emerald-500" /> Waarom Sportlink koppelen?
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside font-medium leading-relaxed">
              <li>Automatische import van alle {447 + players.length} actieve jeugdleden.</li>
              <li>Volledige leeftijdsopbouw (JO7 t/m JO19) inzichtelijk.</li>
              <li>Synchronisatie met de officiële KNVB wedstrijdsystemen.</li>
            </ul>
          </div>

          <div className="pt-4">
            {isConnecting ? (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs px-6 py-3.5"
              >
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span>Gegevens ophalen van Sportlink...</span>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer animate-pulse"
              >
                <Link className="h-4 w-4" /> Verbinden met Sportlink
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Actieve Opleidingsvisie Profiel */}
          <div id="clubprofile-vision-card" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex gap-4 items-start">
              <div className="rounded-2xl bg-orange-50 p-3.5 text-orange-600 shrink-0 border border-orange-100">
                <Compass className="h-6 w-6 text-orange-600 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Gekoppelde Opleidingsvisie
                  </span>
                  {isVisionCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Sparkles className="h-3 w-3 text-emerald-600" /> Actief Toetsinstrument
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      Nog niet ingevuld
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight mt-1.5">
                  {visionName}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-semibold">
                  {visionDescription}
                </p>
              </div>
            </div>
            <button
              onClick={() => setView('visiekompas')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-950 text-white font-black text-xs px-4 py-3 transition shadow-xs cursor-pointer active:scale-95 shrink-0"
            >
              <span>{isVisionCompleted ? "Pas visie aan" : "Configureer Visie"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Hero card with interactive layout */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Crest & Basics */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center flex flex-col justify-between">
              <div className="space-y-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md">
                  <Shield className="h-12 w-12 stroke-[1.5]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">SV Brainport United</h2>
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-widest mt-1">Eindhoven & Omstreken</p>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Gelegen in de technologische hotspot van Nederland. Ambitieus, innovatief, maar worstelend met traditionele sport-gewoonten en selectieperikelen.
                </p>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Opgericht</span>
                  <strong className="text-gray-900">2014 (Fusie)</strong>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Type vereniging</span>
                  <strong className="text-gray-900">Middelgrote amateurclub</strong>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Locatie</span>
                  <strong className="text-gray-900">Sportpark De Run</strong>
                </div>
              </div>
            </div>

            {/* Club Demographics */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-orange-600" /> Club Demografie & Faciliteiten
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Ledenbestand en facilitaire capaciteit van de jeugdafdeling.</p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                {/* Jeugdleden 2026 vs 2025 */}
                <div className="rounded-xl bg-slate-50 p-4 relative overflow-hidden border border-slate-100">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Totaal Jeugdleden (2026)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-850">{447 + players.length}</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +{(447 + players.length) - 465}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1 font-semibold">tov 465 in 2025 (Groei)</span>
                </div>

                {/* Aantal Teams 2026 vs 2025 */}
                <div className="rounded-xl bg-slate-50 p-4 relative overflow-hidden border border-slate-100">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Aantal Jeugdteams (2026)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-850">40</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <ArrowUpRight className="h-3 w-3" /> +2
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1 font-semibold">tov 38 in 2025 (Groei)</span>
                </div>

                {/* Aantal Beschikbare Velden */}
                <div className="rounded-xl bg-slate-50 p-4 relative overflow-hidden border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Beschikbare Velden</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-850">4</span>
                    <span className="text-xs font-bold text-slate-500">voetbalvelden</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-1 font-semibold">Volledige wedstrijdcapaciteit</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Focus-jaarlaag: JO11 Spelersverdeling ({players.length} Spelers)</h4>
                <div className="flex h-5 rounded-full bg-gray-100 overflow-hidden text-[10px] text-white font-bold text-center">
                  <div className="bg-orange-500 flex items-center justify-center" style={{ width: `${(Math.ceil(players.length / 3) / players.length * 100).toFixed(1)}%` }}>JO11-1 ({Math.ceil(players.length / 3)} spelers)</div>
                  <div className="bg-amber-500 flex items-center justify-center" style={{ width: `${(Math.floor((players.length - Math.ceil(players.length / 3)) / 2) / players.length * 100).toFixed(1)}%` }}>JO11-2 ({Math.floor((players.length - Math.ceil(players.length / 3)) / 2)} spelers)</div>
                  <div className="bg-slate-400 flex items-center justify-center" style={{ width: `${((players.length - Math.ceil(players.length / 3) - Math.floor((players.length - Math.ceil(players.length / 3)) / 2)) / players.length * 100).toFixed(1)}%` }}>JO11-3 ({players.length - Math.ceil(players.length / 3) - Math.floor((players.length - Math.ceil(players.length / 3)) / 2)} spelers)</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
                  *Huidige situatie: De JO11-1 bestaat nagenoeg volledig uit fysiek sterke spelers geboren in Kwartaal 1 (januari-maart). Er is grote weerstand vanuit ouders van JO11-2 en JO11-3 spelers wegens het gebrek aan doorstroming.
                </p>
              </div>
            </div>
          </div>

          {/* 📊 Overzicht van alle jaarlagen JO7 t/m JO19 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="h-4.5 w-4.5 text-orange-600" /> Overzicht alle Jaarlagen (JO7 t/m JO19)
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Een compleet, logisch overzicht van de verenigingsbrede jeugdafdeling. Zie in één oogopslag de teamgroottes en spelerstellingen.
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[11px] font-black text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {447 + players.length} spelers verdeeld over 40 teams
                </span>
              </div>
            </div>

            {/* Vertical Stack List of age layers */}
            <div className="space-y-3.5">
              {ageLayers.map((layer, idx) => (
                <div key={idx} className={`rounded-xl border border-l-4 p-4 border-slate-100 transition hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${layer.color}`}>
                  
                  {/* Left Side: Name and stats */}
                  <div className="min-w-[160px]">
                    <h4 className="font-extrabold text-sm text-slate-800">{layer.name}</h4>
                    <div className="flex gap-2.5 text-[10px] font-bold text-slate-500 mt-1">
                      <span>{layer.teams.length} Teams</span>
                      <span>•</span>
                      <span className="text-orange-600">{layer.totalPlayers} Spelers totaal</span>
                    </div>
                  </div>

                  {/* Right Side: Visual listing of teams with size tags */}
                  <div className="flex flex-wrap items-center gap-2 flex-1 md:justify-end">
                    {layer.teams.map((team, tIdx) => (
                      <div 
                        key={tIdx} 
                        className="flex items-center gap-2 bg-white/90 border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-3xs"
                      >
                        <span className="text-[10px] font-black text-slate-700">{team.name}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100">
                          {team.players} spelers
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Action Block - Start the Visiekompas */}
          <div className="rounded-2xl border border-orange-100 bg-orange-50/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-black text-slate-900 text-sm">Stap 1: Formuleer jullie visie in het VisieKompas</h4>
              <p className="text-xs text-slate-500 font-semibold">
                Upload jullie verenigingsbeleid of geef jullie visiekeuzes aan via de interactieve wizard om een pedagogisch en sportief toetsinstrument op te stellen.
              </p>
            </div>
            <button
              id="btn-clubprofile-start-visie"
              onClick={() => setView('visiekompas')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-3 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
            >
              Naar het VisieKompas <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

    </div>
  );
}
