import React, { useState } from 'react';
import { 
  initialPlayers, 
  initialClubScan, 
  initialVisieSliders, 
  presetScenarios 
} from './data';
import { Player, ClubScanQuestion, VisieKompasDimension } from './types';

// Component imports
import Dashboard from './components/Dashboard';
import ClubProfile from './components/ClubProfile';
import ClubScan from './components/ClubScan';
import VisieKompas from './components/VisieKompas';
import PlayersOverview from './components/PlayersOverview';
import TeamBuilder from './components/TeamBuilder';
import ScenarioCompare from './components/ScenarioCompare';
import QualityCheck from './components/QualityCheck';
import AiCoachDemo from './components/AiCoachDemo';
import AdviesRapport from './components/AdviesRapport';
import TrainingAssistent from './components/TrainingAssistent';

// Icon imports
import { 
  LayoutDashboard, 
  Shield, 
  Activity, 
  Compass, 
  Users, 
  UserPlus, 
  TrendingUp, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Menu, 
  X, 
  Flame, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export function getVisionProfile(wizardAnswers: any) {
  const { centraal, niveauGewicht, socialeBelang, teamVastheid, evaluatieFrequentie } = wizardAnswers;
  
  const isVisionCompleted = 
    centraal && centraal.length > 0 && 
    niveauGewicht !== '' && 
    socialeBelang !== '' && 
    teamVastheid !== '' && 
    evaluatieFrequentie !== '';

  if (!isVisionCompleted) {
    return {
      name: "Nog geen actieve visie",
      description: "Formuleer eerst de 6 beleidskeuzes in het Visiekompas om jullie strategische opleidingsvisie voor SV Brainport United te ontgrendelen."
    };
  }

  // Calculate profile name & text based on answers
  let devScore = 0;
  let presScore = 0;
  let socScore = 0;

  if (centraal.includes('brede ontwikkeling')) devScore += 3;
  if (centraal.includes('plezier')) { devScore += 2; socScore += 2; }
  if (centraal.includes('sociale veiligheid')) socScore += 3;
  if (centraal.includes('behoud van leden')) { socScore += 2; devScore += 1; }
  if (centraal.includes('prestatie')) presScore += 4;
  if (centraal.includes('passend niveau')) { devScore += 2; presScore += 1; }

  if (niveauGewicht === 'hoog') presScore += 4;
  if (niveauGewicht === 'middel') { devScore += 2; presScore += 1; }
  if (niveauGewicht === 'laag') devScore += 3;

  if (socialeBelang === 'hoog') socScore += 4;
  if (socialeBelang === 'middel') { socScore += 2; devScore += 1; }
  if (socialeBelang === 'laag') presScore += 2;

  if (teamVastheid === 'vast') presScore += 3;
  if (teamVastheid === 'flexibel') devScore += 4;
  if (teamVastheid === 'hybride') { devScore += 2; socScore += 2; }

  let profileType = 'ontwikkelingsgericht-hybride';
  if (presScore > devScore && presScore > socScore) {
    profileType = 'prestatiegericht';
  } else if (socScore > devScore && socScore > presScore) {
    profileType = 'sociaal-pedagogisch';
  } else if (devScore > presScore && devScore > socScore) {
    if (teamVastheid === 'hybride') {
      profileType = 'ontwikkelingsgericht-hybride';
    } else {
      profileType = 'ontwikkelingsgericht';
    }
  }

  switch (profileType) {
    case 'ontwikkelingsgericht-hybride':
      return {
        name: "iX-Ontwikkelingsgericht Hybride Model",
        description: "Een moderne jeugdfilosofie waarin individuele groei, spelplezier en gelijke kansen centraal staan, ondersteund door flexibele, hybride doorstroommogelijkheden per seizoenfase en actieve compensatie voor biologische rijping en geboortekwartaal-bias."
      };
    case 'prestatiegericht':
      return {
        name: "SV Brainport Selectie- & Prestatiegericht Model",
        description: "Een prestatiegerichte benadering gericht op vroege niveau-selectie, hoge intensiteit en het maximaliseren van competitief succes binnen de sterkste jeugdteams, waarbij het winnen van wedstrijden als belangrijke drijfveer geldt."
      };
    case 'sociaal-pedagogisch':
      return {
        name: "Inclusief Sociaal-Pedagogisch Welzijnsmodel",
        description: "Een warme en inclusieve benadering waar sociale binding, vriendschappen en een absoluut veilige en rustige sportomgeving de basis vormen. Voetbalniveau is secundair aan team-chemie en het plezier van samen sporten met vrienden."
      };
    case 'ontwikkelingsgericht':
      return {
        name: "Lange-termijn Duurzaam Ontwikkelingsmodel",
        description: "Een visie gericht op de duurzame lange-termijn ontwikkeling van elke individuele speler door middel van gelijke faciliteiten en speeltijd, brede motorische multisport-vorming en het vermijden van vroegtijdige selectiedruk."
      };
    default:
      return {
        name: "Gefaseerd Hybride Opleidingsmodel",
        description: "Een flexibele combinatie van niveau-indeling en sociale stabiliteit, waarbij spelers op hun eigen tempo kunnen instromen, trainen en doorgroeien binnen een veilige pedagogische leeromgeving."
      };
  }
}

export default function App() {
  // Navigation & States
  const [currentView, setView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core App states
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [clubScan, setClubScan] = useState<ClubScanQuestion[]>(initialClubScan);
  const [visieSliders, setVisieSliders] = useState<VisieKompasDimension[]>(initialVisieSliders);
  
  // 6 Wizard questions state (Starts empty to require completion)
  const [wizardAnswers, setWizardAnswers] = useState({
    centraal: [] as string[],
    niveauGewicht: '',
    socialeBelang: '',
    groeiverschillen: '',
    teamVastheid: '',
    evaluatieFrequentie: ''
  });

  const isVisionCompleted = 
    wizardAnswers.centraal.length > 0 && 
    wizardAnswers.niveauGewicht !== '' && 
    wizardAnswers.socialeBelang !== '' && 
    wizardAnswers.groeiverschillen !== '' && 
    wizardAnswers.teamVastheid !== '' && 
    wizardAnswers.evaluatieFrequentie !== '';

  // Custom naming overrides (let user edit the generated profile text & name)
  const [customVisionName, setCustomVisionName] = useState<string>('');
  const [customVisionDescription, setCustomVisionDescription] = useState<string>('');

  const computedProfile = getVisionProfile(wizardAnswers);
  const activeVisionName = customVisionName || computedProfile.name;
  const activeVisionDescription = customVisionDescription || computedProfile.description;

  // Roster Allocations: default to Traditional selection so they see active data
  const [teamAllocations, setTeamAllocations] = useState<Record<string, string[]>>({
    'JO11-1': ['p1', 'p2', 'p3', 'p4', 'p5', 'p25', 'p26', 'p33', 'p6', 'p7', 'p10'],
    'JO11-2': ['p8', 'p9', 'p11', 'p12', 'p15', 'p17', 'p27', 'p28', 'p13', 'p14', 'p16'],
    'JO11-3': ['p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24', 'p29', 'p30', 'p31', 'p32']
  });

  const [isTeamAllocationFinalized, setIsTeamAllocationFinalized] = useState(false);
  const [isSportlinkConnected, setIsSportlinkConnected] = useState(false);
  const [isPlayersDbConnected, setIsPlayersDbConnected] = useState(false);

  // State update helpers
  const updateScanScore = (id: string, score: number) => {
    setClubScan(prev => prev.map(q => q.id === id ? { ...q, score } : q));
  };

  const resetScan = () => {
    setClubScan(initialClubScan);
  };

  const updateVisieSlider = (id: string, value: number) => {
    setVisieSliders(prev => prev.map(s => s.id === id ? { ...s, value } : s));
  };

  const applySciencePresets = () => {
    setVisieSliders(prev => prev.map(s => ({ ...s, value: s.idealValue })));
  };

  const handleSelectScenario = (allocations: Record<string, string[]>) => {
    setTeamAllocations(allocations);
  };

  // Nav menu items definition
  const navigationItems = [
    { id: 'dashboard', name: 'Startscherm', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'clubprofile', name: 'Club Profiel', icon: <Shield className="h-4 w-4" /> },
    { id: 'visiekompas', name: 'Visiekompas', icon: <Compass className="h-4 w-4" /> },
    { id: 'clubscan', name: 'Clubscan', icon: <Activity className="h-4 w-4" /> },
    { id: 'players', name: 'Spelerspool', icon: <Users className="h-4 w-4" /> },
    { id: 'teambuilder', name: 'TeamWijzer', icon: <UserPlus className="h-4 w-4" /> },
    { id: 'adviesrapport', name: 'Documenten', icon: <FileText className="h-4 w-4" /> },
    { id: 'trainingassistent', name: 'TrainingAssistent', icon: <Sparkles className="h-4 w-4" /> },
  ];

  // Router dispatcher
  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            players={players} 
            clubScan={clubScan} 
            visieSliders={visieSliders} 
            setView={setView}
            teamAllocations={teamAllocations}
            isVisionCompleted={isVisionCompleted}
            isTeamAllocationFinalized={isTeamAllocationFinalized}
            isSportlinkConnected={isSportlinkConnected}
          />
        );
      case 'clubprofile':
        return (
          <ClubProfile 
            players={players}
            setView={setView} 
            isSportlinkConnected={isSportlinkConnected}
            onConnectSportlink={setIsSportlinkConnected}
            isVisionCompleted={isVisionCompleted}
            visionName={activeVisionName}
            visionDescription={activeVisionDescription}
          />
        );
      case 'clubscan':
        return (
          <ClubScan 
            clubScan={clubScan} 
            updateScore={updateScanScore} 
            resetScan={resetScan} 
            setView={setView} 
            isVisionCompleted={isVisionCompleted}
            visionName={activeVisionName}
            visionDescription={activeVisionDescription}
            setCustomVisionName={setCustomVisionName}
            setCustomVisionDescription={setCustomVisionDescription}
          />
        );
      case 'visiekompas':
        return (
          <VisieKompas 
            visieSliders={visieSliders} 
            updateSlider={updateVisieSlider} 
            applySciencePresets={applySciencePresets} 
            setView={setView} 
            wizardAnswers={wizardAnswers}
            setWizardAnswers={setWizardAnswers}
            isVisionCompleted={isVisionCompleted}
            visionName={activeVisionName}
            visionDescription={activeVisionDescription}
            setCustomVisionName={setCustomVisionName}
            setCustomVisionDescription={setCustomVisionDescription}
          />
        );
      case 'players':
        return (
          <PlayersOverview 
            players={players} 
            setView={setView} 
            isPlayersDbConnected={isPlayersDbConnected}
            onConnectPlayersDb={setIsPlayersDbConnected}
            onAddPlayer={(newPlayer: Player) => {
              setPlayers(prev => [...prev, newPlayer]);
              setTeamAllocations(prev => {
                const team = newPlayer.huidigTeam;
                const currentList = prev[team] || [];
                return {
                  ...prev,
                  [team]: [...currentList, newPlayer.id]
                };
              });
            }}
          />
        );
      case 'teambuilder':
        return (
          <TeamBuilder 
            players={players} 
            teamAllocations={teamAllocations} 
            updateAllocations={setTeamAllocations} 
            setView={setView} 
            isVisionCompleted={isVisionCompleted}
            isTeamAllocationFinalized={isTeamAllocationFinalized}
            onFinalizeAllocation={setIsTeamAllocationFinalized}
            visionName={activeVisionName}
            visionDescription={activeVisionDescription}
          />
        );
      case 'adviesrapport':
        return (
          <AdviesRapport 
            players={players} 
            clubScan={clubScan} 
            visieSliders={visieSliders} 
            teamAllocations={teamAllocations} 
            setView={setView} 
            isVisionCompleted={isVisionCompleted}
            wizardAnswers={wizardAnswers}
            visionName={activeVisionName}
            visionDescription={activeVisionDescription}
          />
        );
      case 'trainingassistent':
        return (
          <TrainingAssistent 
            setView={setView}
          />
        );
      default:
        return <div className="p-8 text-center">In ontwikkeling...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800 antialiased">
      
      {/* Top Demo Banner */}
      <div id="demo-indicator-banner" className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4 animate-bounce text-slate-950" />
          <span>Demo met fictieve data en gesimuleerde AI-coaching</span>
        </div>
        <span className="hidden sm:inline bg-slate-950/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold">
          SV Brainport United Casus
        </span>
      </div>

      {/* Navigation Shell */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 shrink-0 border-r border-slate-800 shadow-xl print:hidden">
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-600 text-white shadow-md shadow-orange-500/20">
              <Flame className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-tight block">iX<span className="text-orange-500">Talent</span></span>
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Opleidingsportaal</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/10' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Active Club indicator bottom */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                <Shield className="h-4 w-4" />
              </div>
              <div className="truncate text-xs">
                <span className="font-bold text-white block truncate">SV Brainport United</span>
                <span className="text-emerald-500 font-semibold text-[10px]">Succesvol ingelogd</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Header */}
        <header className="md:hidden bg-slate-900 text-slate-300 p-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-black text-white tracking-tight">iX<span className="text-orange-500">Talent</span></span>
          </div>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md hover:bg-slate-800 focus:outline-hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-1 print:hidden">
            {navigationItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  id={`mobile-nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-orange-600 text-white' 
                      : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Core Main View Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300">
          {renderMainContent()}
        </main>

      </div>
    </div>
  );
}
