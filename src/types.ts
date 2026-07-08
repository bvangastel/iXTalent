export interface Player {
  id: string;
  name: string; // for backward compatibility
  naam: string; // Dutch name
  birthMonth: string; // for backward compatibility
  geboortemaand: string; // Dutch birth month
  birthQuarter: number; // 1 (Jan-Mar), 2 (Apr-Jun), 3 (Jul-Sep), 4 (Oct-Dec)
  performanceIndex: number; // 1-100 (current skill / physical level)
  potentialIndex: number; // 1-100 (underlying cognitive/technical potential)
  developmentSpeed: 'Vroeg' | 'Normaal' | 'Laat'; // Biological development speed (Bio-banding)
  positionPreference: 'Aanval' | 'Middenveld' | 'Verdediging' | 'Keeper';
  motivation: number; // 1-100
  relativeAgeEffectRisk: boolean;

  // New fields requested by user
  huidigTeam: string;
  globaleNiveauScore: number; // 1 t/m 5
  motivatieScore: number; // 1 t/m 5
  leerbaarheidScore: number; // 1 t/m 5
  trainingsopkomstPercentage: number; // 0-100
  socialeVoorkeuren: string[]; // max 3 speler-id's
  positieVoorkeur: 'Aanval' | 'Middenveld' | 'Verdediging' | 'Keeper';
  fysiekeVoorsprong: 'laag' | 'gemiddeld' | 'hoog';
  trainerObservatie: string;
  aandachtspunt: string;
}

export interface ClubScanQuestion {
  id: string;
  category: 'Visie' | 'Pedagogiek' | 'Gelijke Kansen' | 'Omgeving';
  questionText: string;
  description: string;
  score: number; // 1-5 scale
  lowLabel: string;
  highLabel: string;
}

export interface VisieKompasDimension {
  id: string;
  name: string;
  leftLabel: string;
  rightLabel: string;
  value: number; // 0-100 slider value (0 = left-heavy, 100 = right-heavy)
  description: string;
  idealValue: number; // Sport Science optimal value
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  teamAllocations: Record<string, string[]>; // teamId -> playerIds[]
  stats: {
    raePercentageJO11_1: number; // Q1+Q2 share in JO11-1
    averagePotentialJO11_1: number;
    averagePerformanceJO11_1: number;
    lateDevelopersInFirstTeam: number;
    parentClashRisk: 'Laag' | 'Gemiddeld' | 'Hoog';
    dropoutRiskOverall: 'Laag' | 'Gemiddeld' | 'Hoog';
  };
}
