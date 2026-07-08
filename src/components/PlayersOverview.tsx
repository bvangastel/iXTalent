import React, { useState } from 'react';
import { Player } from '../types';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  User, 
  Star, 
  X, 
  ChevronRight, 
  Layers, 
  Users2,
  Calendar,
  Heart,
  TrendingUp,
  Award,
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  Database,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PlayersOverviewProps {
  players: Player[];
  setView: (view: string) => void;
  isPlayersDbConnected: boolean;
  onConnectPlayersDb: (connected: boolean) => void;
  onAddPlayer?: (player: Player) => void;
}

// Deterministic birth day generator to make player birthdates look natural and realistic
const getPlayerBirthDay = (player: Player) => {
  const str = player.id + player.naam;
  let charSum = 0;
  for (let i = 0; i < str.length; i++) {
    charSum += str.charCodeAt(i);
  }
  return (charSum % 28) + 1;
};

export default function PlayersOverview({ 
  players, 
  setView,
  isPlayersDbConnected,
  onConnectPlayersDb,
  onAddPlayer
}: PlayersOverviewProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    simulateUpload(file.name);
  };

  const handleInstantConnect = () => {
    setUploading(true);
    setUploadedFileName('sv_brainport_united_leden_2026.csv');
    setTimeout(() => {
      setUploading(false);
      onConnectPlayersDb(true);
      setActiveTab('all-teams');
    }, 1200);
  };

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setUploadedFileName(fileName);
    setTimeout(() => {
      setUploading(false);
      onConnectPlayersDb(true);
      setActiveTab('all-teams');
    }, 1500);
  };

  // State to switch between 'all-teams' overview and 'jo11-pool' detail list
  const [activeTab, setActiveTab] = useState<'all-teams' | 'jo11-pool'>('all-teams');

  const [searchTerm, setSearchTerm] = useState('');
  const [quarterFilter, setQuarterFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [niveauFilter, setNiveauFilter] = useState<string>('all');

  // Selected player for detail sidebar
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<'naam' | 'birthDate' | 'birthQuarter' | 'globaleNiveauScore' | 'positionPreference' | 'huidigTeam'>('naam');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Collapsible Form State for adding a player
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [justAddedPlayerName, setJustAddedPlayerName] = useState<string | null>(null);

  // Form Fields
  const [newNaam, setNewNaam] = useState('');
  const [newGeboortedatum, setNewGeboortedatum] = useState('2016-05-15');
  const [newNiveau, setNewNiveau] = useState<number>(3);
  const [newPositie, setNewPositie] = useState<'Aanval' | 'Middenveld' | 'Verdediging' | 'Keeper'>('Middenveld');
  const [newTeam, setNewTeam] = useState<string>('JO11');
  const [newVriendje1, setNewVriendje1] = useState('');
  const [newVriendje2, setNewVriendje2] = useState('');
  const [newTrainerObservatie, setNewTrainerObservatie] = useState('');
  const [newAandachtspunt, setNewAandachtspunt] = useState('');

  const handleAddPlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNaam.trim()) return;

    // Parse birth date
    const dateObj = new Date(newGeboortedatum);
    const day = isNaN(dateObj.getTime()) ? 15 : dateObj.getDate();
    const monthIndex = isNaN(dateObj.getTime()) ? 4 : dateObj.getMonth(); // 0-indexed
    const months = [
      'januari', 'februari', 'maart', 'april', 'mei', 'juni',
      'juli', 'augustus', 'september', 'oktober', 'november', 'december'
    ];
    const birthMonth = months[monthIndex];
    const birthQuarter = Math.ceil((monthIndex + 1) / 3);

    const newPlayer: Player = {
      id: `p_new_${Date.now()}`,
      name: newNaam,
      naam: newNaam,
      birthMonth: birthMonth,
      geboortemaand: birthMonth,
      birthQuarter,
      performanceIndex: newNiveau === 3 ? 85 : newNiveau === 2 ? 60 : 35,
      potentialIndex: 80, // Default potential
      developmentSpeed: 'Normaal',
      positionPreference: newPositie,
      motivation: 80,
      relativeAgeEffectRisk: birthQuarter >= 3,
      huidigTeam: newTeam,
      globaleNiveauScore: newNiveau,
      motivatieScore: 4,
      leerbaarheidScore: 4,
      trainingsopkomstPercentage: 90,
      socialeVoorkeuren: [newVriendje1.trim(), newVriendje2.trim()].filter(Boolean),
      positieVoorkeur: newPositie,
      fysiekeVoorsprong: 'gemiddeld',
      trainerObservatie: newTrainerObservatie || 'Nieuw toegevoegde speler.',
      aandachtspunt: newAandachtspunt || 'N.v.t.',
      geboortedag: day // Custom property for deterministic birth day fallback
    } as any;

    if (onAddPlayer) {
      onAddPlayer(newPlayer);
    }

    setJustAddedPlayerName(newNaam);
    setIsAddFormOpen(false);

    // Reset Form
    setNewNaam('');
    setNewGeboortedatum('2016-05-15');
    setNewNiveau(3);
    setNewPositie('Middenveld');
    setNewTeam('JO11');
    setNewVriendje1('');
    setNewVriendje2('');
    setNewTrainerObservatie('');
    setNewAandachtspunt('');

    setTimeout(() => {
      setJustAddedPlayerName(null);
    }, 4000);
  };

  // Reusable age layers data
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
      color: 'border-l-orange-500 bg-orange-50/10'
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
      color: 'border-l-amber-500 bg-amber-50/10'
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
      color: 'border-l-yellow-500 bg-yellow-50/10'
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
      color: 'border-l-lime-500 bg-lime-50/10'
    },
    {
      name: 'JO11 (Onder 11)',
      totalPlayers: players.length,
      isUnassigned: true,
      teams: [],
      color: 'border-l-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
    },
    {
      name: 'JO12 (Onder 12)',
      totalPlayers: 33,
      teams: [
        { name: 'JO12-1', players: 11 },
        { name: 'JO12-2', players: 11 },
        { name: 'JO12-3', players: 11 }
      ],
      color: 'border-l-teal-500 bg-teal-50/10'
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
      color: 'border-l-cyan-500 bg-cyan-50/10'
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
      color: 'border-l-sky-500 bg-sky-50/10'
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
      color: 'border-l-indigo-500 bg-indigo-50/10'
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
      color: 'border-l-violet-500 bg-violet-50/10'
    }
  ];

  // Map user-defined 1-3 stars
  const mapTo3Stars = (score: number) => {
    if (score >= 5) return 3;
    if (score >= 3) return 2;
    return 1;
  };

  const renderStars = (starsCount: number) => {
    return (
      <div className="flex gap-0.5 justify-center">
        {[1, 2, 3].map((s) => (
          <Star 
            key={s} 
            className={`h-3 w-3 ${s <= starsCount ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
          />
        ))}
      </div>
    );
  };

  // Map friend IDs to actual names
  const getFriendName = (id: string) => {
    if (!id) return '-';
    const found = players.find(p => p.id === id);
    return found ? found.naam : id;
  };

  // Filtering JO11 players
  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.naam.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuarter = quarterFilter === 'all' || p.birthQuarter.toString() === quarterFilter;
    const matchesPosition = positionFilter === 'all' || p.positionPreference === positionFilter;
    
    const mappedStars = mapTo3Stars(p.globaleNiveauScore);
    const matchesNiveau = niveauFilter === 'all' || mappedStars.toString() === niveauFilter;

    return matchesSearch && matchesQuarter && matchesPosition && matchesNiveau;
  });

  const MONTH_ORDER: Record<string, number> = {
    'januari': 1, 'februari': 2, 'maart': 3, 'april': 4, 'mei': 5, 'juni': 6,
    'juli': 7, 'augustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'december': 12
  };

  const getBirthDateValue = (p: Player) => {
    const monthStr = p.geboortemaand ? p.geboortemaand.toLowerCase() : '';
    const monthNum = MONTH_ORDER[monthStr] || 1;
    const day = getPlayerBirthDay(p);
    return monthNum * 100 + day;
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'globaleNiveauScore' || field === 'birthQuarter' ? 'desc' : 'asc');
    }
  };

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    let valA: any = '';
    let valB: any = '';

    if (sortField === 'naam') {
      valA = a.naam.toLowerCase();
      valB = b.naam.toLowerCase();
    } else if (sortField === 'birthDate') {
      valA = getBirthDateValue(a);
      valB = getBirthDateValue(b);
    } else if (sortField === 'birthQuarter') {
      valA = a.birthQuarter;
      valB = b.birthQuarter;
    } else if (sortField === 'globaleNiveauScore') {
      valA = a.globaleNiveauScore;
      valB = b.globaleNiveauScore;
    } else if (sortField === 'positionPreference') {
      valA = a.positionPreference.toLowerCase();
      valB = b.positionPreference.toLowerCase();
    } else if (sortField === 'huidigTeam') {
      valA = a.huidigTeam.toLowerCase();
      valB = b.huidigTeam.toLowerCase();
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6">
      
      {/* Hidden file input used by both layouts */}
      <input
        type="file"
        id="players-db-upload"
        accept=".csv,.xml,.json,.txt"
        className="hidden"
        onChange={handleFileUpload}
        disabled={uploading}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="h-6 w-6 text-orange-600" /> Spelerspool
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Overzicht van alle actieve jeugdteams en diepgaande fitte parameters van onze verenigingsleden.
          </p>
        </div>

        {isPlayersDbConnected && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-stretch md:self-auto">
            <button
              onClick={() => setActiveTab('all-teams')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-extrabold rounded-lg transition-all ${
                activeTab === 'all-teams' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Teamoverzicht (1 oogopslag)
            </button>
            <button
              onClick={() => setActiveTab('jo11-pool')}
              className={`flex-1 md:flex-initial px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'jo11-pool' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Toekomstige JO11 Spelers
              <span className="bg-rose-100 text-rose-700 font-black text-[9px] px-1.5 py-0.5 rounded-full">
                {players.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {!isPlayersDbConnected ? (
        <div className="max-w-2xl mx-auto my-8 p-8 rounded-3xl border-2 border-dashed border-slate-200 bg-white shadow-xs text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-600 border border-orange-100">
            <Database className="h-10 w-10 stroke-[1.5]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Koppel database met spelersdata</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              De spelerspool is momenteel leeg. Koppel of upload een spelerdatabase-bestand (CSV, XML of JSON).
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 max-w-md mx-auto space-y-3">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="h-4 w-4 text-orange-500" /> Waarom de database koppelen?
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside font-medium leading-relaxed">
              <li>Direct overzicht van alle jeugdspelers.</li>
              <li>Per jaarlaag, per team.</li>
              <li>Mogelijkheid om betere teams samen te stellen.</li>
            </ul>
          </div>

          <div className="pt-4">
            {uploading ? (
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs px-6 py-3.5"
              >
                <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                <span>Gegevens importeren...</span>
              </button>
            ) : (
              <button
                onClick={handleInstantConnect}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3.5 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Upload className="h-4 w-4" /> Spelersdatabase koppelen
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ⚠️ Non-assigned warning header */}
          <div 
            onClick={() => setView('teambuilder')}
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 cursor-pointer hover:bg-rose-100/80 transition shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-rose-100 p-2 text-rose-700 shrink-0">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-black text-rose-900 uppercase tracking-wide">De JO11 is nog niet ingedeeld!</h4>
                <p className="text-[11px] text-rose-700 font-semibold mt-0.5">
                  Klik hier om de 33 spelers in te delen in de TeamWijzer.
                </p>
              </div>
            </div>
            <button className="rounded-lg bg-rose-600 text-white font-black text-[10px] px-3 py-2 shrink-0 transition hover:bg-rose-700 active:scale-95">
              Verdeel Teams →
            </button>
          </div>

          {/* Database Spelersdata Koppelen Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-orange-600" />
                  <span>Koppel database met spelersdata</span>
                </h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Upload een spelerdatabase-bestand (CSV, XML of JSON) om gedetailleerde fitte parameters, fysieke testscores en sociale verbindingen in te laden.
                </p>
              </div>

              <div className="relative shrink-0 w-full md:w-auto">
                {uploading ? (
                  <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs px-5 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                    <span>Spelersdatabase inlezen...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-4 py-2.5">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      <span className="max-w-[150px] truncate">{uploadedFileName || "spelers_database.csv"}</span>
                    </div>
                    <button
                      onClick={handleInstantConnect}
                      className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2.5 transition active:scale-95 cursor-pointer text-center"
                    >
                      Opnieuw
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!uploading && (
              <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-600 font-bold bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>✓ Externe spelersdatabase succesvol gekoppeld! 480 spelers zijn ingeladen</span>
              </div>
            )}
          </div>

      {/* TAB 1: ALL TEAMS GLANCE (ONE VIEW CONSTRAINTS MET) */}
      {activeTab === 'all-teams' && (
        <div className="space-y-6">
          {/* Gekoppeld/Succesvol toegevoegd notification */}
          {justAddedPlayerName && (
            <div className="p-4 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-md animate-bounce">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
              <span>Speler {justAddedPlayerName} is succesvol toegevoegd en direct ingedeeld!</span>
            </div>
          )}

          {/* Brede Knop om Speler Toe te Voegen */}
          <div className="w-full">
            <button
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              className="w-full flex items-center justify-between gap-2 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-4.5 transition shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 shrink-0" />
                <span>Nieuwe Jeugdspeler Toevoegen &amp; Direct Indelen</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-orange-700 px-2 py-1 rounded-md text-orange-100 font-extrabold">Handmatige invoer</span>
                {isAddFormOpen ? (
                  <ChevronUp className="h-4 w-4 text-orange-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-orange-200" />
                )}
              </div>
            </button>

            {/* Collapsible Form Section (Pulldown menu effect) */}
            {isAddFormOpen && (
              <div className="mt-3 p-5 bg-white border border-slate-200 rounded-2xl shadow-lg space-y-4">
                <div className="border-b border-slate-100 pb-2.5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                    Spelersinformatie &amp; Teamtoewijzing
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Vul alle fitte parameters, fysieke testscores en teamtoewijzing in om deze speler direct op te nemen in de actieve spelerslijst.</p>
                </div>
                
                <form onSubmit={handleAddPlayerSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {/* Naam */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Volledige Naam</label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Milan de Jong"
                      value={newNaam}
                      onChange={(e) => setNewNaam(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Geboortedatum */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Geboortedatum</label>
                    <input
                      type="date"
                      required
                      value={newGeboortedatum}
                      onChange={(e) => setNewGeboortedatum(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Voorkeurpositie */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Voorkeurpositie</label>
                    <select
                      value={newPositie}
                      onChange={(e) => setNewPositie(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value="Keeper">Keeper</option>
                      <option value="Verdediging">Verdediger</option>
                      <option value="Middenveld">Middenvelder</option>
                      <option value="Aanval">Aanvaller</option>
                    </select>
                  </div>

                  {/* Toewijzen aan jaarlaag */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-orange-700 uppercase">Toewijzen aan jaarlaag</label>
                    <select
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      className="w-full rounded-xl border border-orange-200 bg-orange-50/30 p-2.5 text-xs font-black text-orange-700 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    >
                      {['JO7', 'JO8', 'JO9', 'JO10', 'JO11', 'JO12', 'JO13', 'JO14', 'JO15', 'JO16', 'JO17', 'JO18', 'JO19'].map((layer) => (
                        <option key={layer} value={layer}>{layer}</option>
                      ))}
                    </select>
                  </div>

                  {/* Niveau (1-3★) */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Technisch Niveau</label>
                    <select
                      value={newNiveau}
                      onChange={(e) => setNewNiveau(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    >
                      <option value={3}>3★ (Hoog / Selectie)</option>
                      <option value={2}>2★ (Gemiddeld)</option>
                      <option value={1}>1★ (Beginner / Breedtesport)</option>
                    </select>
                  </div>

                  {/* Vriendje 1 */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Vriendje 1 (Naam of ID)</label>
                    <input
                      type="text"
                      placeholder="bijv. Milan"
                      value={newVriendje1}
                      onChange={(e) => setNewVriendje1(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Vriendje 2 */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Vriendje 2 (Naam of ID)</label>
                    <input
                      type="text"
                      placeholder="bijv. Sem"
                      value={newVriendje2}
                      onChange={(e) => setNewVriendje2(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Trainer Observatie */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Trainer Observatie (Kwaliteiten)</label>
                    <input
                      type="text"
                      placeholder="bijv. Rustig aan de bal, goed spelinzicht en sterke pass."
                      value={newTrainerObservatie}
                      onChange={(e) => setNewTrainerObservatie(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  {/* Aandachtspunt */}
                  <div className="space-y-1 md:col-span-3">
                    <label className="block text-[9px] font-extrabold text-slate-600 uppercase">Aandachtspunt voor Ontwikkeling</label>
                    <input
                      type="text"
                      placeholder="bijv. Kan fysiek duel nog ontwijken, heeft stimulans nodig."
                      value={newAandachtspunt}
                      onChange={(e) => setNewAandachtspunt(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 pt-2.5 flex justify-end gap-2.5 border-t border-slate-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddFormOpen(false)}
                      className="px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-extrabold text-xs transition cursor-pointer"
                    >
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      className="px-5.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs transition shadow-md cursor-pointer"
                    >
                      Speler Opslaan &amp; Indelen
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-250 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4.5 w-4.5 text-orange-600" /> 
              <span>Verenigingsbreed Teamoverzicht</span>
            </h3>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
              {ageLayers.map((layer, idx) => {
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      if (layer.isUnassigned) {
                        setActiveTab('jo11-pool');
                      }
                    }}
                    className={`rounded-xl border border-l-4 p-4 transition-all flex flex-col justify-between ${
                      layer.isUnassigned 
                        ? 'border-l-rose-500 bg-rose-50/10 cursor-pointer hover:shadow-md hover:scale-[1.01] border-rose-200' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-xs text-slate-800">{layer.name}</h4>
                        {layer.isUnassigned ? (
                          <span className="bg-rose-100 text-rose-700 font-black text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md animate-pulse">
                            Indeling nog niet definitief!
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-extrabold">
                            {layer.teams.length} Teams
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[11px] font-black text-orange-600 mt-1">
                        {layer.totalPlayers} spelers totaal
                      </p>

                      {/* Team names lists in 1 glance */}
                      {!layer.isUnassigned ? (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {layer.teams.map((t, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-[9px] font-extrabold text-slate-700 shadow-3xs"
                            >
                              {t.name} ({t.players})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-3 text-[10px] text-rose-600 font-bold flex items-center justify-between bg-white border border-rose-150 p-2.5 rounded-lg">
                          <span>Bekijk alle 33 spelers & categories</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-rose-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: JO11 DETAILED POOL */}
      {activeTab === 'jo11-pool' && (
        <div className="space-y-6">
          {/* Header instructions with button to TeamWijzer */}
          <div className="rounded-2xl bg-rose-50/40 border border-rose-200 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-black text-rose-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600 animate-bounce" />
                <span>JO11 Indeling Nog Niet Definitief Gemaakt!</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed max-w-2xl">
                Dit zijn de 33 spelers die momenteel in de <strong>JO10</strong>-jaarlaag spelen en volgend seizoen de overstap maken naar <strong>JO11</strong>. Deze indeling is momenteel nog niet definitief opgeslagen in de database. Klik op de knop rechts om direct door te gaan naar de <strong>TeamWijzer</strong> om deze spelers optimaal in te delen.
              </p>
            </div>
            <button
              onClick={() => setView('teambuilder')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-3 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer shrink-0"
            >
              <span>Door naar TeamWijzer</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Table filters */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-3xs flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Filter className="h-4 w-4 text-orange-600" /> Filters
            </div>

            <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 flex-1 max-w-3xl">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Zoek speler..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-hidden"
                />
              </div>

              {/* Kwartaal */}
              <select
                value={quarterFilter}
                onChange={(e) => setQuarterFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-hidden"
              >
                <option value="all">Kwartaal (Alle)</option>
                <option value="1">Kwartaal 1 (Jan-Mrt)</option>
                <option value="2">Kwartaal 2 (Apr-Jun)</option>
                <option value="3">Kwartaal 3 (Jul-Sep)</option>
                <option value="4">Kwartaal 4 (Okt-Dec)</option>
              </select>

              {/* Positie */}
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-hidden"
              >
                <option value="all">Positie (Alle)</option>
                <option value="Aanval">Aanvaller</option>
                <option value="Middenveld">Middenvelder</option>
                <option value="Verdediging">Verdediger</option>
                <option value="Keeper">Keeper</option>
              </select>

              {/* Niveau */}
              <select
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-xs text-slate-700 focus:border-orange-500 focus:outline-hidden"
              >
                <option value="all">Voetbalniveau (Alle)</option>
                <option value="3">3 Sterren</option>
                <option value="2">2 Sterren</option>
                <option value="1">1 Ster</option>
              </select>
            </div>

            <div className="text-[11px] font-bold text-slate-400">
              {filteredPlayers.length} spelers gevonden
            </div>
          </div>

          {/* Table area */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs lg:col-span-2">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[11px] text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 font-black uppercase tracking-wider text-[9px] text-slate-500">
                      <th 
                        onClick={() => handleSort('naam')} 
                        className="px-4 py-3 cursor-pointer hover:bg-slate-100 transition group select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Naam &amp; ID</span>
                          {sortField === 'naam' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('birthDate')} 
                        className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition group select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Geboortedatum</span>
                          {sortField === 'birthDate' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('birthQuarter')} 
                        className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition group select-none text-center"
                      >
                        <div className="flex items-center gap-1.5 justify-center">
                          <span>Kwartaal</span>
                          {sortField === 'birthQuarter' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('globaleNiveauScore')} 
                        className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition group select-none text-center"
                      >
                        <div className="flex items-center gap-1.5 justify-center">
                          <span>Niveau (1-3★)</span>
                          {sortField === 'globaleNiveauScore' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('positionPreference')} 
                        className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition group select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Voorkeurpositie</span>
                          {sortField === 'positionPreference' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleSort('huidigTeam')} 
                        className="px-3 py-3 cursor-pointer hover:bg-slate-100 transition group select-none"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Huidig Team (JO10)</span>
                          {sortField === 'huidigTeam' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 text-orange-600 shrink-0" /> : <ArrowDown className="h-3 w-3 text-orange-600 shrink-0" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400 shrink-0 transition" />
                          )}
                        </div>
                      </th>
                      <th className="px-3 py-3 select-none">Vriendje 1</th>
                      <th className="px-3 py-3 select-none">Vriendje 2</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                    {sortedPlayers.map((p) => {
                      const isSelected = selectedPlayer?.id === p.id;
                      const mappedStars = mapTo3Stars(p.globaleNiveauScore);
                      
                      // Convert 'JO11-X' to 'JO10-X' to show as current team
                      const currentTeamJO10 = p.huidigTeam.replace('JO11', 'JO10');

                      return (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedPlayer(p)}
                          className={`hover:bg-orange-50/40 cursor-pointer transition ${
                            isSelected ? 'bg-orange-50/80 border-l-2 border-l-orange-600' : ''
                          }`}
                        >
                          {/* Naam */}
                          <td className="px-4 py-3">
                            <div className="font-black text-slate-900">{p.naam}</div>
                            <div className="text-[9px] text-slate-400 font-medium font-mono uppercase">ID: {p.id}</div>
                          </td>

                          {/* Geboortedatum */}
                          <td className="px-3 py-3 text-slate-500">
                            {getPlayerBirthDay(p)} {p.geboortemaand} 2016
                          </td>

                          {/* Geboortekwartaal */}
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[8px] font-extrabold ${
                              p.birthQuarter === 1 ? 'bg-rose-100 text-rose-800' :
                              p.birthQuarter === 2 ? 'bg-amber-100 text-amber-800' :
                              p.birthQuarter === 3 ? 'bg-blue-100 text-blue-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              Q{p.birthQuarter}
                            </span>
                          </td>

                          {/* Voetbalniveau */}
                          <td className="px-3 py-3 text-center">
                            {renderStars(mappedStars)}
                          </td>

                          {/* Voorkeurspositie */}
                          <td className="px-3 py-3 capitalize text-slate-700">
                            {p.positionPreference.toLowerCase()}
                          </td>

                          {/* Huidige team */}
                          <td className="px-3 py-3 font-bold text-slate-900">
                            {currentTeamJO10}
                          </td>

                          {/* Vriendje 1 */}
                          <td className="px-3 py-3 text-slate-500">
                            {getFriendName(p.socialeVoorkeuren[0])}
                          </td>

                          {/* Vriendje 2 */}
                          <td className="px-3 py-3 text-slate-500">
                            {getFriendName(p.socialeVoorkeuren[1])}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Detail Card */}
            <div className="col-span-1">
              {selectedPlayer ? (
                <div className="rounded-xl border border-orange-250 bg-white p-5 shadow-sm space-y-4 sticky top-6">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{selectedPlayer.naam}</h3>
                      <div className="flex flex-col gap-0.5 text-[10px] text-slate-500 font-semibold mt-0.5">
                        <p>Momenteel in: <span className="font-extrabold text-slate-700">{selectedPlayer.huidigTeam.replace('JO11', 'JO10')}</span></p>
                        <p>Geboortedatum: <span className="font-extrabold text-slate-700">{getPlayerBirthDay(selectedPlayer)} {selectedPlayer.geboortemaand} 2016</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedPlayer(null)}
                      className="rounded-full p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Observatie */}
                  <div className="bg-slate-50 rounded-xl p-3 text-[11px] leading-relaxed border border-slate-100">
                    <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">Trainer-observatie</span>
                    <p className="italic text-slate-700 font-medium">"{selectedPlayer.trainerObservatie}"</p>
                  </div>

                  {/* Aandachtspunt */}
                  <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-[11px] leading-relaxed">
                    <span className="text-[9px] text-rose-500 uppercase font-black block mb-1">Aandachtspunt</span>
                    <p className="text-rose-900 font-bold">{selectedPlayer.aandachtspunt}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block font-bold">Ontwikkeling</span>
                      <strong className="text-slate-800 block text-xs mt-0.5">{selectedPlayer.developmentSpeed === 'Laat' ? 'Laatbloeier' : selectedPlayer.developmentSpeed === 'Vroeg' ? 'Vroegrijp' : 'Normaal'}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-400 block font-bold">Opkomst</span>
                      <strong className="text-slate-800 block text-xs mt-0.5">{selectedPlayer.trainingsopkomstPercentage}%</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400 sticky top-6">
                  <User className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-600">Selecteer een speler</p>
                  <p className="text-[10px] text-slate-500 mt-1">Klik op een speler in de tabel aan de linkerkant om de volledige sportwetenschappelijke details en observaties te bekijken.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
}
