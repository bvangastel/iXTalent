import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Layers, 
  Info, 
  User, 
  Check, 
  Star,
  Brain,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  X,
  Flame,
  Compass
} from 'lucide-react';

interface TeamBuilderProps {
  players: Player[];
  teamAllocations: Record<string, string[]>;
  updateAllocations: (newAllocations: Record<string, string[]>) => void;
  setView: (view: string) => void;
  isVisionCompleted: boolean;
  isTeamAllocationFinalized: boolean;
  onFinalizeAllocation: (finalized: boolean) => void;
  visionName: string;
  visionDescription: string;
}

export default function TeamBuilder({ 
  players, 
  teamAllocations, 
  updateAllocations, 
  setView, 
  isVisionCompleted,
  isTeamAllocationFinalized,
  onFinalizeAllocation,
  visionName,
  visionDescription
}: TeamBuilderProps) {
  
  // State 1: 'overview' (all teams list)
  // State 2: 'team-count-selection' (choose number of teams)
  // State 3: 'board' (interactive drag & drop columns)
  const [builderStep, setBuilderStep] = useState<'overview' | 'team-count-selection' | 'board'>('overview');
  
  // Selected number of teams: 2, 3, or 4
  const [numTeams, setNumTeams] = useState<number>(3);

  // Filters for the unassigned pool
  const [searchTerm, setSearchTerm] = useState('');
  const [quarterFilter, setQuarterFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');

  // AI Feedback / Verdict State
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Reusable list of teams for State A (Glance)
  const ageLayers = [
    { name: 'JO7 (Onder 7)', totalPlayers: 24, teamsCount: 4, teamsList: ['JO7-1', 'JO7-2', 'JO7-3', 'JO7-4'] },
    { name: 'JO8 (Onder 8)', totalPlayers: 32, teamsCount: 4, teamsList: ['JO8-1', 'JO8-2', 'JO8-3', 'JO8-4'] },
    { name: 'JO9 (Onder 9)', totalPlayers: 32, teamsCount: 4, teamsList: ['JO9-1', 'JO9-2', 'JO9-3', 'JO9-4'] },
    { name: 'JO10 (Onder 10)', totalPlayers: 32, teamsCount: 4, teamsList: ['JO10-1', 'JO10-2', 'JO10-3', 'JO10-4'] },
    { name: 'JO11 (Onder 11)', totalPlayers: players.length, isUnassigned: !isTeamAllocationFinalized, teamsCount: isTeamAllocationFinalized ? numTeams : 0, teamsList: isTeamAllocationFinalized ? Object.keys(teamAllocations) : [] },
    { name: 'JO12 (Onder 12)', totalPlayers: 33, teamsCount: 3, teamsList: ['JO12-1', 'JO12-2', 'JO12-3'] },
    { name: 'JO13 (Onder 13)', totalPlayers: 60, teamsCount: 4, teamsList: ['JO13-1', 'JO13-2', 'JO13-3', 'JO13-4'] },
    { name: 'JO15 (Onder 15)', totalPlayers: 64, teamsCount: 4, teamsList: ['JO15-1', 'JO15-2', 'JO15-3', 'JO15-4'] },
    { name: 'JO17 (Onder 17)', totalPlayers: 85, teamsCount: 5, teamsList: ['JO17-1', 'JO17-2', 'JO17-3', 'JO17-4', 'JO17-5'] },
    { name: 'JO19 (Onder 19)', totalPlayers: 85, teamsCount: 5, teamsList: ['JO19-1', 'JO19-2', 'JO19-3', 'JO19-4', 'JO19-5'] }
  ];

  // Map to 3 stars representation
  const mapTo3Stars = (score: number) => {
    if (score >= 5) return 3;
    if (score >= 3) return 2;
    return 1;
  };

  // Check if JO11 is allocated (some players assigned)
  const isCurrentlyAllocated = Object.values(teamAllocations).flat().length > 0;

  // Initialize columns dictionary based on selected numTeams
  const getInitialAllocationsForCount = (count: number): Record<string, string[]> => {
    const defaultAllocs: Record<string, string[]> = {};
    for (let i = 1; i <= count; i++) {
      defaultAllocs[`JO11-${i}`] = [];
    }
    return defaultAllocs;
  };

  // Apply chosen number of teams
  const handleConfirmTeamCount = (count: number) => {
    setNumTeams(count);
    const emptyAllocs = getInitialAllocationsForCount(count);
    updateAllocations(emptyAllocs);
    setBuilderStep('board');
    setAiVerdict(null);
  };

  // Helper to move player manually
  const movePlayer = (playerId: string, targetTeam: string | null) => {
    const nextAllocations = { ...teamAllocations };
    
    // Remove from all current columns
    Object.keys(nextAllocations).forEach(teamId => {
      nextAllocations[teamId] = (nextAllocations[teamId] || []).filter(id => id !== playerId);
    });

    // Add to target team
    if (targetTeam) {
      if (!nextAllocations[targetTeam]) {
        nextAllocations[targetTeam] = [];
      }
      nextAllocations[targetTeam] = [...nextAllocations[targetTeam], playerId];
    }

    updateAllocations(nextAllocations);
    setAiVerdict(null); // Clear verdict upon modification
  };

  // Unallocated / Pool players list
  const allocatedIds = Object.values(teamAllocations).flat();
  const unassignedPlayers = players.filter(p => !allocatedIds.includes(p.id));

  // Filters
  const filteredUnassignedPlayers = unassignedPlayers.filter(p => {
    const matchesSearch = p.naam.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuarter = quarterFilter === 'all' || p.birthQuarter.toString() === quarterFilter;
    const matchesPosition = positionFilter === 'all' || p.positionPreference === positionFilter;
    return matchesSearch && matchesQuarter && matchesPosition;
  });

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, playerId: string) => {
    e.dataTransfer.setData('text/plain', playerId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnTeam = (e: React.DragEvent, teamId: string) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain');
    if (playerId) {
      movePlayer(playerId, teamId);
    }
  };

  const handleDropOnPool = (e: React.DragEvent) => {
    e.preventDefault();
    const playerId = e.dataTransfer.getData('text/plain');
    if (playerId) {
      movePlayer(playerId, null);
    }
  };

  // ================= SCENARIOS AUTO DISTRIBUTION =================

  // Scenario 1: Sociaal scenario (focus friendships, current team context, less level balance)
  const applySociaalScenario = () => {
    const nextAllocs = getInitialAllocationsForCount(numTeams);
    const teamIds = Object.keys(nextAllocs);
    
    // Group players based on friendships or round-robin that groups friends together
    const assigned = new Set<string>();
    
    // Helper to find a team with space
    const getAvailableTeamIdx = () => {
      let minSize = 999;
      let bestIdx = 0;
      teamIds.forEach((id, idx) => {
        const len = nextAllocs[id].length;
        if (len < minSize) {
          minSize = len;
          bestIdx = idx;
        }
      });
      return bestIdx;
    };

    // First handle groupings of friends
    players.forEach(p => {
      if (assigned.has(p.id)) return;
      
      // Select team index for this cluster
      const teamIdx = getAvailableTeamIdx();
      const teamId = teamIds[teamIdx];
      
      // Place player
      nextAllocs[teamId].push(p.id);
      assigned.add(p.id);

      // Try to place preferred friends in the exact same team immediately
      p.socialeVoorkeuren.forEach(friendId => {
        if (!assigned.has(friendId) && nextAllocs[teamId].length < Math.ceil(players.length / numTeams)) {
          nextAllocs[teamId].push(friendId);
          assigned.add(friendId);
        }
      });
    });

    updateAllocations(nextAllocs);
    setAiVerdict(null);
  };

  // Scenario 2: Ontwikkel scenario (equal level, balance RAE birth quarters, no Q1 clusters)
  const applyOntwikkelScenario = () => {
    const nextAllocs = getInitialAllocationsForCount(numTeams);
    const teamIds = Object.keys(nextAllocs);

    // Sort players by level descending
    const sortedByLevel = [...players].sort((a, b) => b.globaleNiveauScore - a.globaleNiveauScore);
    
    // Distribute level evenly using round robin (snake-like distribution)
    sortedByLevel.forEach((p, idx) => {
      // Determine column index
      const teamIdx = idx % numTeams;
      const teamId = teamIds[teamIdx];
      nextAllocs[teamId].push(p.id);
    });

    // Let's check for Birth Quarter balance (avoiding Q1 cluster in JO11-1)
    // If a column has too many Q1 players, we swap them with Q3/Q4 players of equal level
    teamIds.forEach(teamId => {
      const teamPlayers = nextAllocs[teamId].map(id => players.find(p => p.id === id)!);
      const q1Count = teamPlayers.filter(p => p.birthQuarter === 1).length;
      
      // If we have an excessive concentration of Q1 players in one team, swap with another team
      if (q1Count > Math.ceil(players.filter(p => p.birthQuarter === 1).length / numTeams) + 1) {
        // Swap helper
        const excessiveQ1 = teamPlayers.find(p => p.birthQuarter === 1);
        if (excessiveQ1) {
          // Find another team with a Q4 player of similar level
          for (const otherTeamId of teamIds) {
            if (otherTeamId === teamId) continue;
            const otherPlayers = nextAllocs[otherTeamId].map(id => players.find(p => p.id === id)!);
            const q4Player = otherPlayers.find(p => p.birthQuarter === 4 && Math.abs(p.globaleNiveauScore - excessiveQ1.globaleNiveauScore) <= 1);
            if (q4Player) {
              // Perform swap!
              nextAllocs[teamId] = nextAllocs[teamId].filter(id => id !== excessiveQ1.id).concat(q4Player.id);
              nextAllocs[otherTeamId] = nextAllocs[otherTeamId].filter(id => id !== q4Player.id).concat(excessiveQ1.id);
              break;
            }
          }
        }
      }
    });

    updateAllocations(nextAllocs);
    setAiVerdict(null);
  };

  // Scenario 3: Hybride scenario (guarantees at least 1 friend, and equal distribution of level)
  const applyHybrideScenario = () => {
    const nextAllocs = getInitialAllocationsForCount(numTeams);
    const teamIds = Object.keys(nextAllocs);
    const assigned = new Set<string>();

    // Step 1: Pair up friends so everyone gets at least 1 friend
    players.forEach(p => {
      if (assigned.has(p.id)) return;
      
      // Find a friend that is also not assigned yet
      const unassignedFriend = p.socialeVoorkeuren.find(fId => !assigned.has(fId));
      
      // Find team with least players
      let leastSize = 999;
      let teamId = teamIds[0];
      teamIds.forEach(id => {
        if (nextAllocs[id].length < leastSize) {
          leastSize = nextAllocs[id].length;
          teamId = id;
        }
      });

      // Place player
      nextAllocs[teamId].push(p.id);
      assigned.add(p.id);

      if (unassignedFriend) {
        nextAllocs[teamId].push(unassignedFriend);
        assigned.add(unassignedFriend);
      }
    });

    // Step 2: Swap players incrementally to balance average level between teams
    // Let's compute average level per team
    const getAvgLevel = (ids: string[]) => {
      if (ids.length === 0) return 0;
      const sum = ids.reduce((acc, id) => acc + (players.find(p => p.id === id)?.globaleNiveauScore || 3), 0);
      return sum / ids.length;
    };

    // Simple level stabilizer swaps
    for (let loop = 0; loop < 5; loop++) {
      const avgScores = teamIds.map(id => ({ id, score: getAvgLevel(nextAllocs[id]) }));
      avgScores.sort((a, b) => b.score - a.score);
      const highTeam = avgScores[0];
      const lowTeam = avgScores[avgScores.length - 1];
      
      if (highTeam.score - lowTeam.score > 0.4) {
        // Swap a higher-level player from highTeam with a lower-level player from lowTeam
        const highPlayers = nextAllocs[highTeam.id].map(id => players.find(p => p.id === id)!);
        const lowPlayers = nextAllocs[lowTeam.id].map(id => players.find(p => p.id === id)!);
        
        const bestHigh = highPlayers.find(p => p.globaleNiveauScore > 3);
        const bestLow = lowPlayers.find(p => p.globaleNiveauScore < 3);

        if (bestHigh && bestLow) {
          nextAllocs[highTeam.id] = nextAllocs[highTeam.id].filter(id => id !== bestHigh.id).concat(bestLow.id);
          nextAllocs[lowTeam.id] = nextAllocs[lowTeam.id].filter(id => id !== bestLow.id).concat(bestHigh.id);
        }
      }
    }

    updateAllocations(nextAllocs);
    setAiVerdict(null);
  };

  // ================= AI AUDIT / TOETS INDELING OP VISIE =================
  const handleTestVisionAllocation = () => {
    setIsAnalyzing(true);
    setAiVerdict(null);

    setTimeout(() => {
      // Analyze current distribution characteristics
      const teamKeys = Object.keys(teamAllocations);
      if (teamKeys.length === 0) {
        setAiVerdict("Oei! Er zijn nog geen teams geconfigureerd. Kies eerst het aantal gewenste teams om de audit te kunnen starten!");
        setIsAnalyzing(false);
        return;
      }

      // Check if players are actually assigned
      const assignedCount = Object.values(teamAllocations).flat().length;
      if (assignedCount === 0) {
        setAiVerdict("Hoppa! De kolommen staan klaar, maar er is nog geen enkele speler ingedeeld. Sleep spelers naar de teams of klik op een van de automatische scenario's hierboven om een vlijmscherpe analyse te krijgen!");
        setIsAnalyzing(false);
        return;
      }

      // Check for Q1 concentration in the first team (Relative Age Effect)
      const firstTeamId = teamKeys[0];
      const firstTeamIds = teamAllocations[firstTeamId] || [];
      const firstTeamPlayers = players.filter(p => firstTeamIds.includes(p.id));
      const firstTeamQ1Count = firstTeamPlayers.filter(p => p.birthQuarter === 1).length;
      const firstTeamQ1Percentage = firstTeamIds.length > 0 ? Math.round((firstTeamQ1Count / firstTeamIds.length) * 100) : 0;

      // Check for friendship fulfillment
      let friendshipMatches = 0;
      players.forEach(p => {
        const teamId = teamKeys.find(key => (teamAllocations[key] || []).includes(p.id));
        if (teamId) {
          const teammates = teamAllocations[teamId] || [];
          const hasFriend = p.socialeVoorkeuren.some(fId => teammates.includes(fId));
          if (hasFriend) friendshipMatches++;
        }
      });
      const friendshipPercentage = Math.round((friendshipMatches / players.length) * 100);

      // Check for level differences (average globaleNiveauScore) between first and last team
      const levels = teamKeys.map(id => {
        const ids = teamAllocations[id] || [];
        const scoreSum = ids.reduce((acc, pId) => acc + (players.find(p => p.id === pId)?.globaleNiveauScore || 3), 0);
        return ids.length > 0 ? scoreSum / ids.length : 0;
      });
      const maxLevel = Math.max(...levels);
      const minLevel = Math.min(...levels);
      const levelGap = maxLevel - minLevel;

      // Formulate custom Dutch provocative response under 60 words ending with a question
      let feedback = "";
      const prefix = `Getoetst aan de visie: "${visionName}". `;

      if (levelGap > 1.2 && firstTeamQ1Percentage > 60) {
        feedback = `${prefix}Dit is traditionele kalenderselectie! Jullie eerste team (${firstTeamId}) zit ramvol vroeggeboren Q1-krachtpatsers (${firstTeamQ1Percentage}%) en het niveauverschil is gigantisch. Jullie selecteren op geboortemaand, niet op puur voetbalpotentieel. Wie durft de bezem door deze selectie te halen?`;
      } else if (friendshipPercentage > 85 && levelGap < 0.6) {
        feedback = `${prefix}Prachtig werk! Maar liefst ${friendshipPercentage}% van de spelers speelt samen met hun favoriete vriendjes, en het gemiddelde niveau tussen de teams is perfect in balans. Dit minimaliseert drop-outs en bevordert puur spelplezier. Gaan jullie dit succes ook direct vieren met de sceptische trainers?`;
      } else {
        feedback = `${prefix}Een interessante tussenweg! Jullie indeling heeft ${friendshipPercentage}% vriendjes behouden, maar de RAE-bias en niveauverschillen liggen op de loer. Geen ramp, mits jullie op trainingen met flexibele groepen (bio-banding) werken. Durven jullie vanavond deze innovatieve stap te zetten?`;
      }

      setAiVerdict(feedback);
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* State A: Overview of all youth teams */}
      {builderStep === 'overview' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-orange-600" /> TeamWijzer
              </h1>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                De strategische verenigings-indeler. Breng rust, sfeer of uitdaging door de teams optimaal te balanceren.
              </p>
            </div>
          </div>

          {/* Warning or Success banner at top */}
          {isTeamAllocationFinalized ? (
            <div 
              onClick={() => setBuilderStep('board')}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 cursor-pointer hover:bg-emerald-100/85 transition shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2 text-emerald-700 shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">✓ JO11-categorie is definitief ingediend!</h4>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                    De teamindeling is succesvol definitief gemaakt en ingediend. Klik hier om de indeling te bekijken of aan te passen.
                  </p>
                </div>
              </div>
              <button className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3.5 py-2 shrink-0 transition">
                Bekijk Indeling →
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setBuilderStep('team-count-selection')}
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 cursor-pointer hover:bg-rose-100/85 transition shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-rose-100 p-2 text-rose-700 shrink-0">
                  <AlertTriangle className="h-5 w-5 animate-bounce text-rose-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-950 uppercase tracking-wide">⚠️ JO11-categorie is nog niet ingedeeld!</h4>
                  <p className="text-[11px] text-rose-700 font-bold mt-0.5">
                    Klik op deze balk of op de JO11 hieronder om direct de slimme indelingsmodule te starten.
                  </p>
                </div>
              </div>
              <button className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] px-3.5 py-2 shrink-0 transition">
                Start Indeling →
              </button>
            </div>
          )}

          {/* List of youth teams */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4.5 w-4.5 text-orange-600" /> 
              <span>Verenigingstabel &amp; Indelingsstatus</span>
            </h3>

            <div className="space-y-3">
              {ageLayers.map((layer, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    if (layer.name.includes('JO11')) {
                      if (Object.keys(teamAllocations).length > 0) {
                        setBuilderStep('board');
                      } else {
                        setBuilderStep('team-count-selection');
                      }
                    }
                  }}
                  className={`rounded-xl border border-l-4 p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    layer.name.includes('JO11')
                      ? isTeamAllocationFinalized 
                        ? 'border-l-emerald-500 bg-emerald-50/10 cursor-pointer hover:shadow-md hover:scale-[1.01] border-emerald-200' 
                        : 'border-l-rose-500 bg-rose-50/10 cursor-pointer hover:shadow-md hover:scale-[1.01] border-rose-200' 
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-[150px]">
                    <h4 className="font-extrabold text-xs text-slate-800">{layer.name}</h4>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{layer.totalPlayers} spelers</span>
                  </div>

                  {layer.isUnassigned ? (
                    <div className="flex-1 flex md:justify-end items-center">
                      <span className="bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-rose-250 animate-pulse">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                        Nog niet ingedeeld ({players.length} spelers!) - Klik om te verdelen
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 flex-1 md:justify-end">
                      {layer.teamsList.map((t, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-extrabold text-slate-700 shadow-3xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State B: Choice of team counts (2, 3 or 4) */}
      {builderStep === 'team-count-selection' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setBuilderStep('overview')}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Kies aantal teams voor de JO11</h1>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">SV Brainport United heeft {players.length} toekomstige spelers. Bepaal in hoeveel teams je hen wilt opdelen.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 2 Teams */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-800">2 Teams</h3>
                <div className="bg-amber-50 text-amber-800 font-black text-xs px-2.5 py-1 rounded-md inline-block">
                  16.5 spelers per team
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Grote selectiegroepen. Dit leidt tot veel reservespelers en minder individuele speeltijd per kind op de zaterdagen.
                </p>
              </div>
              <button 
                onClick={() => handleConfirmTeamCount(2)}
                className="w-full rounded-xl border border-slate-200 hover:border-orange-500 py-2.5 text-xs font-black text-slate-800 hover:text-orange-600 transition"
              >
                Kies 2 Teams
              </button>
            </div>

            {/* 3 Teams - RECOMMENDED */}
            <div className="rounded-2xl border-2 border-orange-500 bg-orange-50/10 p-5 shadow-md flex flex-col justify-between space-y-4 relative">
              <span className="absolute top-0 right-4 -translate-y-1/2 bg-orange-600 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                Aanbevolen
              </span>
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>3 Teams</span>
                  <CheckCircle2 className="h-4 w-4 text-orange-600" />
                </h3>
                <div className="bg-emerald-100 text-emerald-800 font-black text-xs px-2.5 py-1 rounded-md inline-block">
                  11.0 spelers per team
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-bold">
                  Optimale teamgrootte! Perfect voor KNVB 8v8 jeugdvoetbal. Genoeg wisselspelers voor blessures, maar maximale speeltijd gegarandeerd.
                </p>
              </div>
              <button 
                onClick={() => handleConfirmTeamCount(3)}
                className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 py-2.5 text-xs font-black text-white transition shadow-sm"
              >
                Kies 3 Teams
              </button>
            </div>

            {/* 4 Teams */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-extrabold text-sm text-slate-800">4 Teams</h3>
                <div className="bg-rose-100 text-rose-800 font-black text-xs px-2.5 py-1 rounded-md inline-block">
                  8.25 spelers per team
                </div>
                <p className="text-[11px] text-rose-600 leading-relaxed font-semibold">
                  ⚠️ Te weinig spelers! Bij ziektes of afwezigheid is er direct een tekort op het veld (8v8 vereist minstens 8 actieve spelers).
                </p>
              </div>
              <button 
                onClick={() => handleConfirmTeamCount(4)}
                className="w-full rounded-xl border border-slate-200 hover:border-orange-500 py-2.5 text-xs font-black text-slate-800 hover:text-orange-600 transition"
              >
                Kies 4 Teams
              </button>
            </div>
          </div>
        </div>
      )}

      {/* State C: Interactive Indelings Board */}
      {builderStep === 'board' && (
        <div className="space-y-6">
          
          {/* Header with back-buttons and indicators */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setBuilderStep('team-count-selection')}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">JO11 Indelingsmodule</h1>
                  {isVisionCompleted && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Compass className="h-3 w-3 text-orange-600 animate-spin-slow" /> Toetsinstrument: {visionName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Verdeel de spelers over de teams. Gebruik de scenario's of sleep ze handmatig.
                </p>
              </div>
            </div>

            {/* Selected stats & final submission */}
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] font-black">
                {allocatedIds.length} / {players.length} ingedeeld
              </span>
              <button 
                onClick={() => {
                  const emptyAllocs = getInitialAllocationsForCount(numTeams);
                  updateAllocations(emptyAllocs);
                  setAiVerdict(null);
                }}
                className="rounded-lg border border-slate-200 hover:bg-slate-100 p-2 text-xs font-bold transition flex items-center gap-1.5 text-slate-600"
              >
                Wis indeling
              </button>
              <button 
                onClick={() => onFinalizeAllocation(!isTeamAllocationFinalized)}
                className={`rounded-lg px-3.5 py-2 text-xs font-black transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                  isTeamAllocationFinalized
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/10'
                    : 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm'
                }`}
              >
                {isTeamAllocationFinalized ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Definitief ingediend</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Definitief indienen</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= THREE SCENARIOS AUTOMATIC BUTTONS ================= */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50/15 p-5 space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Automatische Scenario-Verdelingen (1 klik)</h3>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Scenario 1 */}
              <button
                id="btn-auto-sociaal"
                onClick={applySociaalScenario}
                className="rounded-xl border border-orange-200 bg-white hover:bg-orange-50 p-4 transition-all text-left shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-850">1. Sociaal scenario</h4>
                  <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-semibold">
                  Houdt vrienden bij elkaar en baseert verdeling op het huidige team. Vriendjesvoorkeuren krijgen absolute voorrang boven prestatieniveau.
                </p>
              </button>

              {/* Scenario 2 */}
              <button
                id="btn-auto-ontwikkel"
                onClick={applyOntwikkelScenario}
                className="rounded-xl border border-orange-200 bg-white hover:bg-orange-50 p-4 transition-all text-left shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-850">2. Ontwikkel scenario</h4>
                  <Brain className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-semibold">
                  Minimale kwaliteitsverschillen tussen teams. Verdeelt de geboortekwartalen gelijkwaardig om geboortemaand-bias (RAE) te neutraliseren.
                </p>
              </button>

              {/* Scenario 3 */}
              <button
                id="btn-auto-hybride"
                onClick={applyHybrideScenario}
                className="rounded-xl border border-orange-200 bg-white hover:bg-orange-50 p-4 transition-all text-left shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-xs text-slate-850">3. Hybride scenario</h4>
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 font-semibold">
                  Garandeert dat iedereen minimaal 1 voorkeurvriendje in zijn team heeft, en verdeelt de rest op basis van gelijkwaardig speelniveau.
                </p>
              </button>
            </div>
          </div>

          {/* ================= COLUMN BOARD WITH DRAG AND DROP ================= */}
          <div className="grid gap-6 lg:grid-cols-4">
            
            {/* Left Column: Player Pool to allocate */}
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDropOnPool}
              className="lg:col-span-1 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col h-[580px] space-y-3"
            >
              <div className="space-y-1">
                <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Spelerspool</span>
                  <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-bold">
                    {unassignedPlayers.length}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Sleep of verplaats spelers vanuit deze pool naar de teams.
                </p>
              </div>

              {/* Minimal Filter */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Zoek speler..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-250 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-hidden placeholder-slate-400 font-semibold"
                />

                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={quarterFilter}
                    onChange={(e) => setQuarterFilter(e.target.value)}
                    className="rounded-lg border border-slate-250 bg-white p-1 text-[10px] text-slate-700 focus:border-orange-500 focus:outline-hidden font-bold"
                  >
                    <option value="all">Kwartaal</option>
                    <option value="1">Q1</option>
                    <option value="2">Q2</option>
                    <option value="3">Q3</option>
                    <option value="4">Q4</option>
                  </select>

                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="rounded-lg border border-slate-250 bg-white p-1 text-[10px] text-slate-700 focus:border-orange-500 focus:outline-hidden font-bold"
                  >
                    <option value="all">Positie</option>
                    <option value="Aanval">Aanval</option>
                    <option value="Middenveld">Middenveld</option>
                    <option value="Verdediging">Verdediging</option>
                    <option value="Keeper">Keeper</option>
                  </select>
                </div>
              </div>

              {/* Scrollable Player List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredUnassignedPlayers.length === 0 ? (
                  <div className="h-32 flex flex-col justify-center items-center text-center text-slate-400">
                    <User className="h-6 w-6 stroke-[1.5] mb-1" />
                    <span className="text-[10px] font-bold">Geen spelers</span>
                  </div>
                ) : (
                  filteredUnassignedPlayers.map(p => {
                    const stars = mapTo3Stars(p.globaleNiveauScore);
                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, p.id)}
                        onClick={() => movePlayer(p.id, `JO11-1`)} // Quick assign to first team on click
                        className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-orange-400 hover:shadow-xs transition cursor-grab flex items-center justify-between"
                      >
                        <div>
                          <strong className="text-[11px] text-slate-850 block">{p.naam}</strong>
                          <div className="flex gap-1.5 items-center mt-1 text-[9px] text-slate-400 font-bold">
                            <span className="uppercase text-slate-500 font-mono">ID: {p.id}</span>
                            <span>•</span>
                            <span className="capitalize">{p.positionPreference.toLowerCase()}</span>
                            <span>•</span>
                            <span className="text-orange-600">Q{p.birthQuarter}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-black">
                            {stars}★
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Columns: The actual teams columns */}
            <div className={`lg:col-span-3 grid gap-4 h-[580px] overflow-x-auto`} style={{ gridTemplateColumns: `repeat(${numTeams}, minmax(0, 1fr))` }}>
              {Object.keys(teamAllocations).map(teamId => {
                const teamIds = teamAllocations[teamId] || [];
                const teamPlayers = players.filter(p => teamIds.includes(p.id));
                const averageLevel = teamPlayers.length > 0 
                  ? (teamPlayers.reduce((acc, p) => acc + mapTo3Stars(p.globaleNiveauScore), 0) / teamPlayers.length).toFixed(1)
                  : "0.0";

                // Count Q1 birth quarter
                const q1Count = teamPlayers.filter(p => p.birthQuarter === 1).length;

                return (
                  <div
                    key={teamId}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnTeam(e, teamId)}
                    className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col h-full space-y-3 shadow-3xs"
                  >
                    {/* Header of Team column */}
                    <div className="border-b border-slate-100 pb-2.5 flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">{teamId}</h4>
                        <span className="text-[10px] text-orange-600 font-bold">
                          {teamPlayers.length} Spelers (8v8)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="bg-slate-100 text-slate-700 text-[9px] font-black px-2 py-0.5 rounded-md block">
                          Niv: {averageLevel}★
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold block mt-0.5">
                          {q1Count}x Q1
                        </span>
                      </div>
                    </div>

                    {/* Team Players list scrollable */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {teamPlayers.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-center text-slate-300 border border-dashed border-slate-150 rounded-xl p-6">
                          <UserPlus className="h-8 w-8 stroke-[1.2] mb-1.5 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400">Sleep spelers hierheen</span>
                        </div>
                      ) : (
                        teamPlayers.map(p => {
                          const stars = mapTo3Stars(p.globaleNiveauScore);
                          return (
                            <div
                              key={p.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, p.id)}
                              className="rounded-xl border border-slate-150 bg-slate-50/50 p-2.5 shadow-3xs hover:border-orange-300 transition cursor-grab flex justify-between items-center"
                            >
                              <div>
                                <span className="font-extrabold text-[11px] text-slate-850 block leading-snug">
                                  {p.naam}
                                </span>
                                <div className="flex gap-1.5 text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-wider font-mono">
                                  <span>ID: {p.id}</span>
                                  <span>•</span>
                                  <span className="text-slate-500">{p.positionPreference}</span>
                                  <span>•</span>
                                  <span className="text-orange-500">Q{p.birthQuarter}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => movePlayer(p.id, null)}
                                className="rounded-md hover:bg-rose-50 text-slate-300 hover:text-rose-600 p-1 transition"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* ================= TOETS INDELING OP VISIE BUTTON AND RESULT ================= */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-black text-slate-900 text-sm">Toets of dien de teamindeling definitief in</h4>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Controleer of alle spelers optimaal verdeeld zijn, voer de visie-toets uit, of dien de indeling definitief in.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleTestVisionAllocation}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-950 disabled:bg-slate-400 text-white font-black text-xs px-5 py-3.5 transition shadow-sm hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <Brain className="h-4 w-4 shrink-0" />
                  <span>{isAnalyzing ? "Analyseert..." : "Toets indeling op visie"}</span>
                </button>
                <button
                  onClick={() => {
                    onFinalizeAllocation(true);
                    setBuilderStep('overview');
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-6 py-3.5 transition shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 text-white" />
                  <span>Definitief indienen</span>
                </button>
              </div>
            </div>

            {/* AI Verdict result */}
            {aiVerdict && (
              <div className="rounded-xl border border-orange-200 bg-orange-50/20 p-4 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-orange-100 p-1.5 text-orange-600 shrink-0">
                    <Flame className="h-4 w-4 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900">iXTalent-Coach Oordeel</h4>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-bold italic bg-white p-3 rounded-lg border border-orange-150">
                  "{aiVerdict}"
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
