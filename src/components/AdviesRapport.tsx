import React, { useState } from 'react';
import { Player, ClubScanQuestion, VisieKompasDimension } from '../types';
import { 
  FileText, 
  Printer, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Presentation, 
  BookOpen, 
  MessageSquare, 
  Copy, 
  Check, 
  Compass, 
  Activity, 
  Users,
  AlertTriangle
} from 'lucide-react';

interface AdviesRapportProps {
  players: Player[];
  clubScan: ClubScanQuestion[];
  visieSliders: VisieKompasDimension[];
  teamAllocations: Record<string, string[]>;
  setView: (view: string) => void;
  isVisionCompleted: boolean;
  wizardAnswers: {
    centraal: string[];
    niveauGewicht: string;
    socialeBelang: string;
    groeiverschillen: string;
    teamVastheid: string;
    evaluatieFrequentie: string;
  };
  visionName: string;
  visionDescription: string;
}

type DocType = 'presentation' | 'policy' | 'whatsapp_parents' | 'whatsapp_trainers';

export default function AdviesRapport({ 
  players, 
  clubScan, 
  visieSliders, 
  teamAllocations, 
  setView, 
  isVisionCompleted, 
  wizardAnswers,
  visionName,
  visionDescription
}: AdviesRapportProps) {
  const [selectedDoc, setSelectedDoc] = useState<DocType>('presentation');
  const [copied, setCopied] = useState(false);

  const jo11_1 = players.filter(p => (teamAllocations['JO11-1'] || []).includes(p.id));
  const jo11_2 = players.filter(p => (teamAllocations['JO11-2'] || []).includes(p.id));
  const jo11_3 = players.filter(p => (teamAllocations['JO11-3'] || []).includes(p.id));

  // Averages
  const getAverage = (teamPlayers: Player[], key: 'performanceIndex' | 'potentialIndex') => {
    if (teamPlayers.length === 0) return 0;
    return Math.round(teamPlayers.reduce((acc, p) => acc + p[key], 0) / teamPlayers.length);
  };

  const getQ1Q2Share = (teamPlayers: Player[]) => {
    if (teamPlayers.length === 0) return 0;
    const q1q2 = teamPlayers.filter(p => p.birthQuarter <= 2).length;
    return Math.round((q1q2 / teamPlayers.length) * 100);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Human-readable labels for vision choices
  const getCentraalLabel = () => {
    if (!wizardAnswers.centraal || wizardAnswers.centraal.length === 0) return "Nog niet bepaald";
    return wizardAnswers.centraal.join(" & ");
  };

  const getNiveauGewichtLabel = () => {
    switch (wizardAnswers.niveauGewicht) {
      case 'gelijkwaardig': return 'Gelijkwaardig (Gemengde teams en gelijke kansen)';
      case 'niveau': return 'Op niveau (Gelijkgestemden spelen bij elkaar)';
      case 'hybride': return 'Hybride (Deels op niveau, deels gemengd)';
      default: return 'Nog niet bepaald';
    }
  };

  const getSocialeBelangLabel = () => {
    switch (wizardAnswers.socialeBelang) {
      case 'hoog': return 'Sociaal-emotioneel leidend (Vriendjes blijven bij elkaar)';
      case 'gemiddeld': return 'Balans (Sociaal en niveau wegen even zwaar)';
      case 'laag': return 'Ondergeschikt aan sportieve ontwikkeling';
      default: return 'Nog niet bepaald';
    }
  };

  const getGroeiverschillenLabel = () => {
    switch (wizardAnswers.groeiverschillen) {
      case 'bio_banding': return 'Bio-banding (Spelers indelen op biologische leeftijd/rijpheid)';
      case 'rouleren': return 'Rouleren (Spelers wisselen regelmatig van team/niveau)';
      case 'geen': return 'Traditionele geboortejaarsselectie';
      default: return 'Nog niet bepaald';
    }
  };

  const getTeamVastheidLabel = () => {
    switch (wizardAnswers.teamVastheid) {
      case 'vast': return 'Vaste teams gedurende het hele seizoen';
      case 'flexibel': return 'Flexibele teams (Spelers schuiven makkelijk door)';
      case 'hybride': return 'Gedeeltelijk flexibel (Bijv. trainen samen, spelen apart)';
      default: return 'Nog niet bepaald';
    }
  };

  const getEvaluatieFrequentieLabel = () => {
    switch (wizardAnswers.evaluatieFrequentie) {
      case 'maandelijks': return 'Maandelijks (Kort-cyclisch volgen van ontwikkeling)';
      case 'halfjaarlijks': return 'Halfjaarlijks (Winterstop en einde seizoen)';
      case 'jaarlijks': return 'Jaarlijks (Enkel aan het einde van het seizoen)';
      default: return 'Nog niet bepaald';
    }
  };

  // Dynamic document texts
  const getDocumentText = (): { title: string; subtitle: string; content: string } => {
    const clubName = "SV Brainport United";
    const totalPlayers = players.length;
    const dateStr = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });

    const visieSamenvatting = `
VISIE EN STRATEGIE VAN ${clubName.toUpperCase()}
--------------------------------------------------
* Centraal uitgangspunt: Spelersfocus gericht op "${getCentraalLabel()}"
* Niveau-indeling: ${getNiveauGewichtLabel()}
* Sociale verbinding: ${getSocialeBelangLabel()}
* Groeiverschillen & RAE: ${getGroeiverschillenLabel()}
* Teamstructuur: ${getTeamVastheidLabel()}
* Ontwikkeling volgen: ${getEvaluatieFrequentieLabel()}
`;

    const teamLijstText = `
TEAMINDELING DETAILS (TOTAAL ${totalPlayers} SPELERS)
--------------------------------------------------
* JO11-1 (${jo11_1.length} spelers):
  Spelers: ${jo11_1.map(p => `${p.name} (Q${p.birthQuarter})`).join(', ') || 'Geen spelers ingedeeld'}
  Statistieken: Gem. Prestatie: ${getAverage(jo11_1, 'performanceIndex')} | Gem. Potentieel: ${getAverage(jo11_1, 'potentialIndex')} | Q1/Q2-aandeel: ${getQ1Q2Share(jo11_1)}%

* JO11-2 (${jo11_2.length} spelers):
  Spelers: ${jo11_2.map(p => `${p.name} (Q${p.birthQuarter})`).join(', ') || 'Geen spelers ingedeeld'}
  Statistieken: Gem. Prestatie: ${getAverage(jo11_2, 'performanceIndex')} | Gem. Potentieel: ${getAverage(jo11_2, 'potentialIndex')} | Q1/Q2-aandeel: ${getQ1Q2Share(jo11_2)}%

* JO11-3 (${jo11_3.length} spelers):
  Spelers: ${jo11_3.map(p => `${p.name} (Q${p.birthQuarter})`).join(', ') || 'Geen spelers ingedeeld'}
  Statistieken: Gem. Prestatie: ${getAverage(jo11_3, 'performanceIndex')} | Gem. Potentieel: ${getAverage(jo11_3, 'potentialIndex')} | Q1/Q2-aandeel: ${getQ1Q2Share(jo11_3)}%
`;

    switch (selectedDoc) {
      case 'presentation':
        return {
          title: "Slide Presentatie (Ouderavond / Bestuur)",
          subtitle: "Kant-en-klare slides om de visie en teamindeling toe te lichten aan ouders, coaches en het bestuur.",
          content: `SLIDE 1: WELKOM & INTRODUCTIE
--------------------------------------------------
[Titel]: Gelijke Kansen & Duurzaam Plezier bij ${clubName}
[Ondertitel]: Onze nieuwe visie op de JO11-lichting
[Spreker]: Jeugdcommissie & iXTalent-Coach
[Datum]: ${dateStr}

SLIDE 2: WAAROM VERANDEREN WE ONZE COERS?
--------------------------------------------------
* Traditioneel selecteren op jonge leeftijd (JO11) kent grote risico's.
* Het Relatieve-Leeftijdseffect (RAE): Kinderen geboren in Q1 & Q2 worden vaak onbewust overgeselecteerd omdat ze tijdelijk fysiek verder zijn.
* Gevolg: Laatbloeiers (geboren in Q3 & Q4) haken gedesillusioneerd af, terwijl dit juist de parels van de toekomst kunnen zijn.
* Doel van ${clubName}: Ieder kind krijgt dezelfde kwaliteit training en aandacht, onafhankelijk van de geboortemaand.

SLIDE 3: ONZE STRATEGISCHE CLUBVISIE
--------------------------------------------------
Op basis van onze iX-Clubscan en het Visiekompas hebben we de volgende keuzes gemaakt:
${visieSamenvatting}

SLIDE 4: DE NIEUWE TEAMINDELING JO11
--------------------------------------------------
Onze nieuwe teamindeling is samengesteld met oog voor zowel sportwetenschappelijke data als sociale verbinding:
${teamLijstText}

SLIDE 5: HOE NU VERDER IN DE PRAKTIJK?
--------------------------------------------------
1. Gezamenlijk trainen: We trainen als gehele JO11-lichting op dezelfde tijden met een gezamenlijke leerlijn.
2. Flexibel schuiven: Spelers kunnen gedurende het seizoen makkelijk instromen of doorschuiven bij andere teams.
3. Bio-banding proeven: We organiseren speciale interne toernooien en trainingsvormen op basis van biologische leeftijd.
4. Ouders als pedagogisch partner: Support de ontwikkeling van uw kind, focus niet enkel op de stand!

SLIDE 6: RUIMTE VOOR VRAGEN (Q&A)
--------------------------------------------------
* Bedankt voor uw aandacht en vertrouwen!
* "De coach mét AI en visie wint altijd van de coach zonder visie."
* Vragen? Laten we de discussie starten!`
        };

      case 'policy':
        return {
          title: "Technisch Opleidingsplan (Trainers)",
          subtitle: "Het formele beleidskader en de sportieve richtlijnen voor de trainers en begeleiders van de JO11.",
          content: `TECHNISCH OPLEIDINGSPLAN - SEIZOEN 2026/2027
VERENIGING: ${clubName}
CATEGORIE: ONDERBOUW (JO11)
STATUS: VASTGESTELD BELEID
--------------------------------------------------

1. SPORTIEVE EN PEDAGOGISCHE MISSIE
Het hoofddoel van ${clubName} in de JO11-fase is het maximaliseren van het langetermijn-sportplezier en de motorische ontwikkeling. De club stelt expliciet: "${getCentraalLabel()}" staat centraal bij alles wat we doen. Resultaten in de competitie zijn ondergeschikt aan de individuele leersnelheid en persoonlijke groei.

2. BELEIDSKEUZES OP BASIS VAN HET VISIEKOMPAS
${visieSamenvatting}

3. TOELICHTING OP DE INDELING
De JO11-lichtingspool van ${totalPlayers} spelers is verdeeld op basis van zorgvuldige analyses van de prestatie-index, de potentie-index en de biologische rijpheid. We waken streng tegen het Relatieve-Leeftijdseffect. Zoals te zien is in de onderstaande verdeling, streven we naar evenwichtige leeromgevingen waarin laatbloeiers niet worden ondergesneeuwd:
${teamLijstText}

4. RICHTLIJNEN VOOR JEUGDTRAINERS
* Geef positieve coaching: Focus op de actie en de inzet, niet op de fout of de score.
* Gelijke speeltijd: Iedere speler speelt minimaal 50% van de totale wedstrijdduur, ongeacht de stand.
* Positierotatie: Spelers in de JO11 moeten op alle posities ervaring opdoen (verdedigen, middenveld, aanval).
* Werk nauw samen met de iXTalent-Coach om periodiek (frequentie: ${wizardAnswers.evaluatieFrequentie || 'halfjaarlijks'}) de spelersobservaties en leersnelheid bij te werken.`
        };

      case 'whatsapp_parents':
        return {
          title: "WhatsApp Bericht (Ouders)",
          subtitle: "Een beknopt, transparant en vriendelijk bericht om naar de WhatsApp-oudergroepen te sturen.",
          content: `Beste ouders van de JO11-spelers, ⚽🌟

Met veel enthousiasme delen we de nieuwe teamindeling voor het komende seizoen! Binnen ${clubName} hebben we de afgelopen periode hard gewerkt aan een vernieuwde, sportwetenschappelijk onderbouwde visie. 

Onze focus ligt volledig op *${getCentraalLabel()}*. Dit betekent dat we gelijke kansen voor álle kinderen garanderen, ongeacht hun geboortemaand of groeitempo. We willen dat iedereen met plezier kan schitteren op zijn of haar eigen niveau!

De teamindeling voor dit seizoen is als volgt:

*JO11-1*: ${jo11_1.map(p => p.name).join(', ') || 'Geen spelers'}
*JO11-2*: ${jo11_2.map(p => p.name).join(', ') || 'Geen spelers'}
*JO11-3*: ${jo11_3.map(p => p.name).join(', ') || 'Geen spelers'}

In plaats van strakke scheidingen gaan we dit jaar veel intensiever *samen trainen* en werken met flexibele wisselingen, zodat ieder kind de beste begeleiding krijgt. Op de aankomende ouderavond lichten we deze visie en onze samenwerking met de iXTalent-Coach heel graag verder toe. 

Vragen of opmerkingen? Spreek ons gerust aan op de club! Laten we er samen een fantastisch en sportief seizoen van maken voor de kinderen! 🎯🏆

Sportieve groet,
De Jeugdcommissie van ${clubName}`
        };

      case 'whatsapp_trainers':
        return {
          title: "WhatsApp Bericht (Trainers & Coaches)",
          subtitle: "Een helder en motiverend bericht voor de interne trainers- en leidersgroep.",
          content: `Beste trainers en coaches van de JO11, 📋⚽

De kogel is door de kerk: de nieuwe teamindeling voor de JO11 staat klaar! We hebben deze indeling met de jeugdcommissie en de iXTalent-Coach samengesteld op basis van onze vernieuwde clubvisie: *${getCentraalLabel()}* staat centraal.

We stappen dit seizoen definitief af van de rigide, traditionele vroege selectie om het Relatieve-Leeftijdseffect (RAE) tegen te gaan en laatbloeiers een eerlijke kans te geven. 

De indeling van de 33 spelers is als volgt:

*JO11-1*: ${jo11_1.map(p => p.name).join(', ') || 'Geen spelers'}
*JO11-2*: ${jo11_2.map(p => p.name).join(', ') || 'Geen spelers'}
*JO11-3*: ${jo11_3.map(p => p.name).join(', ') || 'Geen spelers'}

*Belangrijk voor ons als trainerscorps:*
1. We trainen gezamenlijk als één grote lichtingspool om de onderlinge verbinding en het niveau te versterken.
2. We hanteren een flexibele structuur (${getTeamVastheidLabel()}) om spelers de optimale weerstand te bieden.
3. We sturen op gelijke speeltijd (min. 50%) en veelzijdige positierotatie.

Laten we deze week even kort bij elkaar zitten om de gezamenlijke trainingen en de kick-off voor te bereiden. De bal ligt bij ons, mannen en vrouwen. Laten we laten zien dat we met deze visie goud in handen hebben! 💪🔥

Groet,
Hoofd Jeugdopleiding ${clubName}`
        };
    }
  };

  const doc = getDocumentText();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header of Portal */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center print:hidden">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" /> Documenten & Clubvisie
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Bekijk de gevormde visie van SV Brainport United en genereer direct professionele documenten voor alle betrokkenen.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-print-portal"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <Printer className="h-4 w-4" /> Print Overzicht
          </button>
        </div>
      </div>

      {/* Grid: Left Column (Vision Dashboard & Metrics), Right Column (Document Generator) */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Left: Clubvisie Overview (5 columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: Visiekompas Beleid keuzes */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
              <div className="rounded-lg bg-orange-50 p-1.5 text-orange-600 shrink-0">
                <Compass className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="font-black text-slate-950 text-sm">Gevormde Clubvisie</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SV Brainport United</span>
              </div>
            </div>

            {!isVisionCompleted ? (
              <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/30 p-4 text-xs space-y-2 text-amber-950">
                <p className="font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Visiekompas is nog incompleet
                </p>
                <p className="text-slate-600 leading-relaxed text-[11px] font-medium">
                  De beleidskeuzes in het Visiekompas zijn nog niet volledig ingevuld. De onderstaande waarden tonen de standaardinstellingen. Vul alle 6 stappen van het Visiekompas in om de clubvisie definitief vast te leggen!
                </p>
                <button
                  onClick={() => setView('visiekompas')}
                  className="mt-2 w-full inline-flex justify-center items-center gap-1 rounded-xl bg-amber-600 text-white py-2 text-xs font-black transition hover:bg-amber-700 active:scale-95 cursor-pointer"
                >
                  Nu Visiekompas invullen <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="rounded-xl bg-emerald-50/50 border border-emerald-100 p-3 text-xs flex items-center gap-2 text-emerald-800 font-bold">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>Clubvisie is officieel geaccordeerd & actief!</span>
              </div>
            )}

            {/* List of dimensions */}
            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Centraal Uitgangspunt</span>
                <span className="font-bold text-slate-900 block">{getCentraalLabel()}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Selectiemethode & Niveau</span>
                <span className="font-bold text-slate-900 block">{getNiveauGewichtLabel()}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">3. Sociale Aspecten</span>
                <span className="font-bold text-slate-900 block">{getSocialeBelangLabel()}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">4. Groeiverschillen & RAE</span>
                <span className="font-bold text-slate-900 block">{getGroeiverschillenLabel()}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">5. Teamvastheid</span>
                <span className="font-bold text-slate-900 block">{getTeamVastheidLabel()}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">6. Evaluatie-frequentie</span>
                <span className="font-bold text-slate-900 block">{getEvaluatieFrequentieLabel()}</span>
              </div>
            </div>
          </div>

          {/* Card: Clubscan quick summary */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs space-y-3">
            <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-400">
              <Activity className="h-4 w-4 text-orange-500" />
              <span>Resultaten Diagnostische Clubscan</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {clubScan.map(q => (
                <div key={q.id} className="p-2.5 bg-slate-50/60 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block truncate">{q.category}</span>
                  <span className="text-sm font-black text-slate-900">{q.score} <span className="text-[10px] text-slate-400">/ 5</span></span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Document Generator Section (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Document selection tabs */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs space-y-4 print:hidden">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">Kies een documenttype om te genereren:</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                id="tab-doc-presentation"
                onClick={() => setSelectedDoc('presentation')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer gap-1.5 ${
                  selectedDoc === 'presentation'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-extrabold'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Presentation className="h-5 w-5" />
                <span className="text-[10px] tracking-tight leading-tight">Slide Presentatie</span>
              </button>

              <button
                id="tab-doc-policy"
                onClick={() => setSelectedDoc('policy')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer gap-1.5 ${
                  selectedDoc === 'policy'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-extrabold'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span className="text-[10px] tracking-tight leading-tight">Opleidingsplan</span>
              </button>

              <button
                id="tab-doc-whatsapp-parents"
                onClick={() => setSelectedDoc('whatsapp_parents')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer gap-1.5 ${
                  selectedDoc === 'whatsapp_parents'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-extrabold'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span className="text-[10px] tracking-tight leading-tight">WhatsApp Ouders</span>
              </button>

              <button
                id="tab-doc-whatsapp-trainers"
                onClick={() => setSelectedDoc('whatsapp_trainers')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer gap-1.5 ${
                  selectedDoc === 'whatsapp_trainers'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-600 font-extrabold'
                    : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="text-[10px] tracking-tight leading-tight">WhatsApp Trainers</span>
              </button>
            </div>
          </div>

          {/* Generated Document Sheet */}
          <div className="rounded-2xl border border-slate-150 bg-white shadow-md overflow-hidden flex flex-col">
            
            {/* Sheet top bar */}
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block">Gegeneerd door iXTalent-Coach</span>
                <h4 className="font-extrabold text-sm text-white">{doc.title}</h4>
              </div>
              <button
                id="btn-copy-doc-content"
                onClick={() => handleCopy(doc.content)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-extrabold">Gekopieerd!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Kopieer Tekst</span>
                  </>
                )}
              </button>
            </div>

            {/* Document metadata info bar */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
              {doc.subtitle}
            </div>

            {/* Interactive content area */}
            <div className="p-6 bg-slate-50/30 overflow-y-auto max-h-[500px] font-mono text-[11px] text-slate-800 leading-relaxed whitespace-pre-wrap">
              {doc.content}
            </div>

            {/* Document Footer Signature */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 font-semibold gap-2">
              <span>Status: Draft Concept | Klaar voor distributie</span>
              <span>SV Brainport United • iXTalent Portal 2026</span>
            </div>

          </div>

          {/* Advice/Tips block */}
          <div className="rounded-xl bg-orange-50/40 border border-orange-100/60 p-4 space-y-2 text-xs">
            <h5 className="font-extrabold text-orange-800 flex items-center gap-1.5">
              <Presentation className="h-4 w-4" /> Tip voor de verspreiding:
            </h5>
            <p className="text-slate-600 leading-relaxed font-semibold text-[11px]">
              Gebruik de gegenereerde WhatsApp-berichten om de indeling direct transparent en met pedagogische toelichting te delen. Dit vermindert de initiële weerstand of teleurstelling bij ouders en trainers aanzienlijk, omdat direct de onderliggende ontwikkelingsvisie wordt uitgelegd.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
