import { Player, ClubScanQuestion, VisieKompasDimension, Scenario } from './types';
import { 
  demoPlayers, 
  demoScenarios, 
  clubProfiel, 
  opleidingsVisie, 
  leeftijdscategorieJO11, 
  kwaliteitsChecks, 
  voorbeeldAdviezen, 
  voorbeeldVragen 
} from './data/demoClub';

export const initialPlayers: Player[] = demoPlayers;

export const initialClubScan: ClubScanQuestion[] = [
  {
    id: 'cs1',
    category: 'Visie',
    questionText: 'Is de opleidingsvisie van SV Brainport United helder beschreven en bekend bij trainers én ouders?',
    description: 'Bestaat er een gedeeld beeld over plezier, leren en talent, of regeert de waan van de dag?',
    score: 0,
    lowLabel: 'Niet vastgelegd / Alleen prestatie-gericht',
    highLabel: 'Volledig uitgedragen, ontwikkelingsgericht'
  },
  {
    id: 'cs2',
    category: 'Gelijke Kansen',
    questionText: 'Bieden we alle kinderen (selectie én breedte) gelijke faciliteiten, speeltijd en gekwalificeerde trainers?',
    description: 'Vaak krijgen de geselecteerde teams de beste trainers, de beste tijden en de meeste aandacht.',
    score: 0,
    lowLabel: 'Sterke focus op eerste selectieteams',
    highLabel: 'Gelijke ontwikkelkansen voor elk kind'
  },
  {
    id: 'cs3',
    category: 'Pedagogiek',
    questionText: 'Hoe gaan we om met prestatiedruk en verwachtingspatronen van ouders langs de lijn?',
    description: 'Ouderdruk is voelbaar bij alle jeugdteams. Wordt er actief gecommuniceerd over groeimindset en autonomie?',
    score: 0,
    lowLabel: 'Schreeuwende ouders, focus op winnen',
    highLabel: 'Pedagogisch partnerschap, rustige zijlijn'
  },
  {
    id: 'cs4',
    category: 'Omgeving',
    questionText: 'In hoeverre monitoren we het Relatieve-Leeftijdseffect (RAE) en biologische rijping bij de indeling?',
    description: 'Zijn onze selectieteams binnen de jeugdafdeling overwegend gevuld met vroeggeboren spelers (januari-maart)?',
    score: 0,
    lowLabel: 'Geen idee, we delen in op actuele sterkte',
    highLabel: 'Actieve compensatie voor geboortemaand en groei'
  }
];

export const initialVisieSliders: VisieKompasDimension[] = [
  {
    id: 'vk1',
    name: 'Selectie vs. Gelijke Kansen',
    leftLabel: 'Vroeg Selecteren (Prestatiegericht)',
    rightLabel: 'Brede Instroom & Gelijke Kansen',
    value: 30,
    idealValue: 80,
    description: 'Vroeg selecteren leidt vaak tot selectiefouten en drop-outs. Gelijke kansen houdt de poel groter.'
  },
  {
    id: 'vk2',
    name: 'Resultaat vs. Ontwikkeling',
    leftLabel: 'Focus op Winnen (Kampioenschap)',
    rightLabel: 'Focus op Individuele Groei',
    value: 40,
    idealValue: 90,
    description: 'Bij de jeugd gaat het om het ontdekken van talent en fouten durven maken, niet om de stand in de competitie.'
  },
  {
    id: 'vk3',
    name: 'Specialisatie vs. Brede Motoriek',
    leftLabel: 'Vaste Posities & Vroege Focus',
    rightLabel: 'Multisport & Positierotatie',
    value: 35,
    idealValue: 85,
    description: 'Spelers die op meerdere posities spelen ontwikkelen een beter spelinzicht en betere motorische vaardigheden.'
  },
  {
    id: 'vk4',
    name: 'Beoordelingstijdstip',
    leftLabel: 'Momentopname (Huidige sterkte)',
    rightLabel: 'Lange-termijn Potentieel',
    value: 25,
    idealValue: 85,
    description: 'Huidig presteren wordt vaak beïnvloed door fysieke voorsprong. Potentieel kijkt naar leersnelheid en tactisch inzicht.'
  }
];

export const presetScenarios: Scenario[] = demoScenarios;

export interface SportScienceChallenge {
  title: string;
  triggerCondition: string;
  challengeText: string;
  question: string;
}

export const sportScienceChallenges: SportScienceChallenge[] = [
  {
    title: 'Geboortemaand-bias Alarm (Relatieve Leeftijdseffect)',
    triggerCondition: 'Wanneer je JO11-1 team meer dan 60% spelers bevat uit Kwartaal 1 (Jan-Maart).',
    challengeText: 'Boem! Je JO11-1 zit vol met vroege vogels uit kwartaal 1. Dit is geen talentontwikkeling, dit is een kalenderselectie! Je selecteert op fysieke voorsprong, niet op voetbalintelligentie.',
    question: 'Durf je drie spelers uit kwartaal 1 te ruilen voor creatieve laatbloeiers uit kwartaal 4 om hun leersnelheid te testen?'
  },
  {
    title: 'De Laatbloeier Valkuil (Bio-banding)',
    triggerCondition: 'Wanneer je biologische laatbloeiers uitsluitend in JO11-3 plaatst.',
    challengeText: 'Laatbloeiers zoals Noah K. (potentiële topspeler!) worden weggestopt in JO11-3 omdat ze nu kleiner zijn. Hiermee gooi je goud in de sloot. Ze missen weerstand en haken dadelijk gedesillusioneerd af.',
    question: 'Hoe zorgen we dat laatbloeiers met een hoog potentieel toch de uitdaging krijgen die ze nodig hebben?'
  },
  {
    title: 'De "Winnen ten koste van alles" valstrik',
    triggerCondition: 'Altijd relevant bij JO11.',
    challengeText: 'Als we JO11-1 samenstellen om kampioen te worden, trainen we voor de zaterdag, niet voor de toekomst. Een jeugdafdeling is geen eredivisieclub. Ontwikkeling is grillig, succes op JO11-niveau voorspelt nul komma nul voor senioren.',
    question: 'Wat is voor SV Brainport United belangrijker: een kampioenschapsschaal bij de JO11 of 5 extra seniorenspelers met plezier?'
  },
  {
    title: 'De Ouderdruk Uitdaging',
    triggerCondition: 'Wanneer ouders druk uitoefenen op de JO11-1 selectie.',
    challengeText: 'Ouders eisen selectie-indeling en dreigen met overstappen naar een andere club als hun zoon of dochter niet in de "1" speelt. Dit is hèt moment om je visie te tonen, niet om te buigen.',
    question: 'Hoe betrekken we ouders bij een visie waarin we niet praten over de "beste" spelers, maar over "de juiste prikkel op het juiste moment"?'
  }
];

// Re-export other demoClub structures for direct access across views
export {
  clubProfiel,
  opleidingsVisie,
  leeftijdscategorieJO11,
  kwaliteitsChecks,
  voorbeeldAdviezen,
  voorbeeldVragen
};
