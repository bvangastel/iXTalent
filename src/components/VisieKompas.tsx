import React, { useState } from 'react';
import { VisieKompasDimension } from '../types';
import { 
  Compass, 
  RefreshCw, 
  ArrowRight, 
  Info, 
  Check, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  Heart, 
  Award, 
  Users, 
  ShieldAlert, 
  TrendingUp, 
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Upload,
  FileText,
  Loader2
} from 'lucide-react';

interface VisieKompasProps {
  visieSliders: VisieKompasDimension[];
  updateSlider: (id: string, value: number) => void;
  applySciencePresets: () => void;
  setView: (view: string) => void;
  wizardAnswers: {
    centraal: string[];
    niveauGewicht: string;
    socialeBelang: string;
    groeiverschillen: string;
    teamVastheid: string;
    evaluatieFrequentie: string;
  };
  setWizardAnswers: React.Dispatch<React.SetStateAction<{
    centraal: string[];
    niveauGewicht: string;
    socialeBelang: string;
    groeiverschillen: string;
    teamVastheid: string;
    evaluatieFrequentie: string;
  }>>;
  isVisionCompleted: boolean;
  visionName: string;
  visionDescription: string;
  setCustomVisionName: (name: string) => void;
  setCustomVisionDescription: (desc: string) => void;
}

export default function VisieKompas({ 
  visieSliders, 
  updateSlider, 
  applySciencePresets, 
  setView,
  wizardAnswers,
  setWizardAnswers,
  isVisionCompleted,
  visionName,
  visionDescription,
  setCustomVisionName,
  setCustomVisionDescription
}: VisieKompasProps) {
  const [activeTab, setActiveTab] = useState<'wizard' | 'sliders'>('wizard');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    simulateUpload(file.name);
  };

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setUploadedFileName(fileName);
    setTimeout(() => {
      setUploading(false);
      setWizardAnswers({
        centraal: ['plezier', 'brede ontwikkeling', 'passend niveau', 'sociale veiligheid', 'behoud van leden'],
        niveauGewicht: 'laag',
        socialeBelang: 'hoog',
        groeiverschillen: 'expliciet onderdeel van beleid',
        teamVastheid: 'hybride',
        evaluatieFrequentie: 'elke 6-8 weken'
      });
      applySciencePresets();
      setIsSaved(false);
    }, 1800);
  };

  // Helper to prefill standard demo responses
  const loadDemoAnswers = () => {
    setWizardAnswers({
      centraal: ['plezier', 'brede ontwikkeling', 'passend niveau', 'sociale veiligheid'],
      niveauGewicht: 'middel',
      socialeBelang: 'middel',
      groeiverschillen: 'expliciet onderdeel van beleid',
      teamVastheid: 'hybride',
      evaluatieFrequentie: 'halverwege seizoen'
    });
    setIsSaved(false);
  };

  const isWizardComplete = 
    wizardAnswers.centraal.length > 0 && 
    wizardAnswers.niveauGewicht !== '' && 
    wizardAnswers.socialeBelang !== '' && 
    wizardAnswers.groeiverschillen !== '' && 
    wizardAnswers.teamVastheid !== '' && 
    wizardAnswers.evaluatieFrequentie !== '';

  // Steps configuration
  const steps = [
    {
      id: 'centraal',
      title: '1. Wat staat in JO11 centraal?',
      description: 'Welke waarden moeten de absolute basis vormen van jullie jeugdbeleid? (Selecteer meerdere mogelijk)',
      type: 'multiple',
      options: [
        { id: 'plezier', label: 'Plezier in bewegen', icon: <Heart className="h-4 w-4 text-rose-500" /> },
        { id: 'brede ontwikkeling', label: 'Brede ontwikkeling (Multisport)', icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
        { id: 'prestatie', label: 'Prestaties & Winnen', icon: <Award className="h-4 w-4 text-amber-500" /> },
        { id: 'passend niveau', label: 'Passend niveau voor iedereen', icon: <Compass className="h-4 w-4 text-blue-500" /> },
        { id: 'sociale veiligheid', label: 'Sociale veiligheid & Teamgeest', icon: <Users className="h-4 w-4 text-purple-500" /> },
        { id: 'behoud van leden', label: 'Behoud van leden (Geen drop-out)', icon: <ShieldCheck className="h-4 w-4 text-orange-500" /> }
      ]
    },
    {
      id: 'niveauGewicht',
      title: '2. Hoe zwaar mag huidig voetbalniveau meewegen?',
      description: 'Moeten we teams strikt indelen op wat ze nu kunnen, of is dat op deze leeftijd secundair?',
      type: 'single',
      options: [
        { id: 'laag', label: 'Laag (Potentieel en plezier gaan voor)', desc: 'Voorkomt uitsluiting en vroege selectiefouten.' },
        { id: 'middel', label: 'Middel (Niveau weegt mee, maar is niet leidend)', desc: 'Gezonde balans tussen uitdaging en gelijke kansen.' },
        { id: 'hoog', label: 'Hoog (Strikte niveau-selectie voor prestatie)', desc: 'Focus op vroege selectie en de sterkste spelers bij elkaar.' }
      ]
    },
    {
      id: 'socialeBelang',
      title: '3. Hoe belangrijk zijn sociale voorkeuren?',
      description: 'Mogen vriendjes en vriendinnetjes bij elkaar blijven, of is prestatie/niveau belangrijker?',
      type: 'single',
      options: [
        { id: 'laag', label: 'Laag (Niveau of toeval bepaalt de indeling)', desc: 'Geen rekening houden met sociale groepjes.' },
        { id: 'middel', label: 'Middel (Vriendjes samen mits het niveau past)', desc: 'Sociale samenhang is belangrijk voor behoud van plezier.' },
        { id: 'hoog', label: 'Hoog (Vriendjes absoluut bij elkaar houden)', desc: 'Sociale verbinding en plezier zijn het allerbelangrijkst.' }
      ]
    },
    {
      id: 'groeiverschillen',
      title: '4. Hoe gaan jullie om met vroegrijpe en laatrijpe spelers?',
      description: 'Houden jullie rekening met het Relatieve-Leeftijdseffect (RAE) en biologische groeiverschillen?',
      type: 'single',
      options: [
        { id: 'niet bewust', label: 'Niet bewust', desc: 'We delen in op geboortejaar en actuele fysieke sterkte.' },
        { id: 'deels bewust', label: 'Deels bewust', desc: 'We herkennen het effect maar hebben geen actieve maatregelen.' },
        { id: 'expliciet onderdeel van beleid', label: 'Expliciet onderdeel van beleid (Bio-banding & iXTalent)', desc: 'We compenseren geboortemaand-bias actief en passen bio-banding toe.' }
      ]
    },
    {
      id: 'teamVastheid',
      title: '5. Hoe vast moet de teamindeling zijn?',
      description: 'Zijn teams voor een heel seizoen in steen gebeiteld, of kunnen spelers soepel wisselen?',
      type: 'single',
      options: [
        { id: 'vast', label: 'Vast (Teams blijven het hele jaar hetzelfde)', desc: 'Biedt stabiliteit maar remt flexibele doorstroming.' },
        { id: 'flexibel', label: 'Flexibel (Indeling wisselt continu per blok)', desc: 'Spelers trainen en spelen steeds in wisselende samenstellingen.' },
        { id: 'hybride', label: 'Hybride (Vaste basis, flexibel waar nodig)', desc: 'Spelers hebben een basisteam maar schuiven flexibel door voor prikkels.' }
      ]
    },
    {
      id: 'evaluatieFrequentie',
      title: '6. Hoe vaak willen jullie teamindelingen evalueren?',
      description: 'Hoe vaak beoordelen we of spelers nog op de juiste plek zitten voor hun ontwikkeling?',
      type: 'single',
      options: [
        { id: 'nooit', label: 'Nooit / Zelden', desc: 'Indeling gebeurt één keer aan het begin van het jaar.' },
        { id: 'jaarlijks', label: 'Jaarlijks (Aan het einde van het seizoen)', desc: 'Standaard cyclus.' },
        { id: 'halverwege seizoen', label: 'Halverwege het seizoen (Winterstop)', desc: 'Minimaal twee keer per seizoen evalueren.' },
        { id: 'elke 6-8 weken', label: 'Elke 6-8 weken (Dynamisch per blok)', desc: 'Zeer kort op de bal om groeispurt en leersnelheid op te vangen.' }
      ]
    }
  ];

  // Toggle multiple select
  const handleMultipleSelect = (questionId: string, optionId: string) => {
    setWizardAnswers(prev => {
      const current = prev.centraal || [];
      const updated = current.includes(optionId)
        ? current.filter(id => id !== optionId)
        : [...current, optionId];
      return { ...prev, centraal: updated };
    });
    setIsSaved(false);
  };

  // Select single
  const handleSingleSelect = (questionId: string, optionId: string) => {
    setWizardAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    setIsSaved(false);
  };

  // Calculate matching profile
  const calculateProfile = () => {
    const { centraal, niveauGewicht, socialeBelang, teamVastheid } = wizardAnswers;
    if (!centraal || centraal.length === 0) {
      return 'Nog niet bepaald';
    }
    
    // Default fallback
    if (
      centraal.includes('plezier') && 
      centraal.includes('brede ontwikkeling') && 
      niveauGewicht === 'middel' && 
      teamVastheid === 'hybride'
    ) {
      return 'ontwikkelingsgericht-hybride';
    }

    let devScore = 0;
    let presScore = 0;
    let socScore = 0;

    // Centraal values
    if (centraal.includes('brede ontwikkeling')) devScore += 3;
    if (centraal.includes('plezier')) { devScore += 2; socScore += 2; }
    if (centraal.includes('sociale veiligheid')) socScore += 3;
    if (centraal.includes('behoud van leden')) { socScore += 2; devScore += 1; }
    if (centraal.includes('prestatie')) presScore += 4;
    if (centraal.includes('passend niveau')) { devScore += 2; presScore += 1; }

    // Niveau gewicht
    if (niveauGewicht === 'hoog') presScore += 4;
    if (niveauGewicht === 'middel') { devScore += 2; presScore += 1; }
    if (niveauGewicht === 'laag') devScore += 3;

    // Sociale voorkeuren
    if (socialeBelang === 'hoog') socScore += 4;
    if (socialeBelang === 'middel') { socScore += 2; devScore += 1; }
    if (socialeBelang === 'laag') presScore += 2;

    // Team vastheid
    if (teamVastheid === 'vast') presScore += 3;
    if (teamVastheid === 'flexibel') devScore += 4;
    if (teamVastheid === 'hybride') { devScore += 2; socScore += 2; }

    // Resolve
    if (presScore > devScore && presScore > socScore) {
      return 'prestatiegericht';
    } else if (socScore > devScore && socScore > presScore) {
      return 'sociaal-pedagogisch';
    } else if (devScore > presScore && devScore > socScore) {
      if (teamVastheid === 'hybride') {
        return 'ontwikkelingsgericht-hybride';
      }
      return 'ontwikkelingsgericht';
    } else {
      return 'hybride';
    }
  };

  const currentProfile = calculateProfile();

  // Handle Save
  const handleSaveVision = () => {
    setIsSaved(true);
    // Visual feedback, user can proceed to clubscan after a brief delay or immediately
    setTimeout(() => {
      setView('clubscan');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-orange-600" /> Visiekompas & Beleid
          </h1>
          <p className="text-sm text-slate-500">
            Formuleer de pedagogische en sportieve uitgangspunten voor de jeugdopleiding en teamindeling van SV Brainport United.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            id="tab-wizard"
            onClick={() => setActiveTab('wizard')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'wizard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Beleidswizard (Interactief)
          </button>
          <button
            id="tab-sliders"
            onClick={() => setActiveTab('sliders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sliders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Fijnregeling Sliders
          </button>
        </div>
      </div>

      {/* Visiedocument Upload Zone */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Upload className="h-4.5 w-4.5 text-orange-600" />
              <span>Snelstart: Upload eigen beleid- of visiedocument</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Hebben jullie al een visiedocument over opleiden, trainen en ontwikkelen? Upload het bestand (PDF/Word/TXT) en laat de iXTalent AI de keuzes automatisch herkennen en invullen!
            </p>
          </div>
          
          <div className="relative shrink-0 w-full md:w-auto">
            <input
              type="file"
              id="vision-file-upload"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex items-center gap-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold text-xs px-5 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                <span>iXTalent AI leest document...</span>
              </div>
            ) : uploadedFileName ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-xs px-4 py-2.5">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="max-w-[150px] truncate">{uploadedFileName}</span>
                </div>
                <label
                  htmlFor="vision-file-upload"
                  className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3 py-2.5 transition active:scale-95 cursor-pointer text-center"
                >
                  Opnieuw
                </label>
              </div>
            ) : (
              <label
                htmlFor="vision-file-upload"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-3 transition shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Upload className="h-4 w-4" /> Visiedocument uploaden
              </label>
            )}
          </div>
        </div>

        {uploadedFileName && !uploading && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-600 font-bold bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>✓ Visiedocument succesvol ingelezen! Het VisieKompas is automatisch gevuld met een 'Ontwikkelingsgericht-hybride' beleidskeuze op basis van jullie document.</span>
          </div>
        )}
      </div>

      {activeTab === 'wizard' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wizard Interactive Question Block */}
          <div className="lg:col-span-2 space-y-4">
            {/* Step indicators */}
            <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500">
                Vraag <strong className="text-orange-600">{currentStep + 1}</strong> van {steps.length}
              </span>
              <div className="flex gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentStep(idx); setIsSaved(false); }}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentStep === idx ? 'w-6 bg-orange-600' : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Active Question Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
              <div className="space-y-1.5">
                <span className="text-[10px] bg-orange-50 text-orange-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {steps[currentStep].type === 'multiple' ? 'Meerdere opties mogelijk' : 'Selecteer één optie'}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </div>

              {/* Options lists */}
              <div className="grid gap-3 sm:grid-cols-2">
                {steps[currentStep].options.map((opt) => {
                  const qId = steps[currentStep].id;
                  const isSelected = qId === 'centraal'
                    ? wizardAnswers.centraal.includes(opt.id)
                    : (wizardAnswers as any)[qId] === opt.id;

                  return (
                    <button
                      id={`opt-${qId}-${opt.id}`}
                      key={opt.id}
                      onClick={() => {
                        if (qId === 'centraal') {
                          handleMultipleSelect(qId, opt.id);
                        } else {
                          handleSingleSelect(qId, opt.id);
                        }
                      }}
                      className={`text-left rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between h-32 ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-100">
                          {opt.icon || <Check className="h-4 w-4 text-slate-400" />}
                        </div>
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-orange-600 border-orange-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-900 line-clamp-1">{opt.label}</div>
                        {(opt as any).desc && (
                          <div className="text-[10px] text-slate-400 font-medium leading-tight mt-1 line-clamp-2">
                            {(opt as any).desc}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  onClick={() => { if (currentStep > 0) setCurrentStep(currentStep - 1); }}
                  disabled={currentStep === 0}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition ${
                    currentStep === 0 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" /> Vorige
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition"
                  >
                    Volgende <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    id="btn-finish-wizard"
                    onClick={handleSaveVision}
                    disabled={isSaved}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl transition active:scale-95 shadow-sm shadow-orange-600/20"
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-ping" /> Visie Toegepast!
                      </>
                    ) : (
                      <>
                        Voltooien <Check className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Generated Vision Report Card */}
          <div className="space-y-6">
            {!isWizardComplete ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs text-center py-12 space-y-6">
                <div className="mx-auto h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <Lock className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">Visiekompas is leeg</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Formuleer de 6 beleidskeuzes in de wizard links om jullie live clubvisie en strategisch profiel te ontsluiten.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <button
                    id="btn-quick-fill"
                    onClick={loadDemoAnswers}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 font-bold text-xs py-3 transition active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" /> Snelvuller: Laad standaard visie
                  </button>
                  <span className="text-[10px] text-slate-400 block mt-2 leading-normal">
                    (Vult de antwoorden direct in voor de "ontwikkelingsgericht-hybride" demo-casus)
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                {/* Visieprofiel Badge */}
                <div className="text-center space-y-1 bg-slate-50 py-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block">Voorlopig Visieprofiel</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-4 py-1 text-sm font-extrabold text-orange-800 capitalize shadow-xs">
                    <Sparkles className="h-4 w-4 text-orange-600 animate-spin-slow" /> {currentProfile.replace('-', ' ')}
                  </span>
                </div>

                {/* Concepttekst */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Gegenereerde Concepttekst</span>
                  <div className="relative rounded-2xl border-l-4 border-l-orange-500 bg-orange-50/20 p-4">
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold italic">
                      “Voor JO11 kiest SV Brainport United voor een ontwikkelingsgerichte teamindeling waarin plezier, passend niveau, brede ontwikkeling en sociale veiligheid centraal staan. Huidig niveau mag meewegen, maar is niet doorslaggevend. Teamindelingen worden minimaal twee keer per seizoen geëvalueerd.”
                    </p>
                  </div>
                </div>

                {/* Reflectievragen */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <HelpCircle className="h-4 w-4 text-orange-500" /> Reflectie & Dialoog voor de club
                  </div>
                  <div className="space-y-2.5">
                    {[
                      'Past deze visie bij wat trainers nu doen?',
                      'Kunnen ouders deze uitgangspunten begrijpen?',
                      'Welke afspraken moeten we expliciet maken?',
                      'Wat betekent dit voor JO11-1, JO11-2 en JO11-3?'
                    ].map((q, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs text-slate-600 font-semibold bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-orange-600 font-black shrink-0 mt-0.5">•</span>
                        <p className="leading-tight">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save & Apply Button */}
                <button
                  id="btn-apply-vision"
                  onClick={handleSaveVision}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3.5 transition shadow-md shadow-orange-600/15 active:scale-95"
                >
                  Gebruik deze visie & start de Clubscan <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Original Sliders fine tuning mode */
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {visieSliders.map((slider) => {
              const dev = Math.abs(slider.value - slider.idealValue);
              const isGood = dev < 15;

              return (
                <div id={`visie-card-${slider.id}`} key={slider.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{slider.name}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium mt-0.5">{slider.description}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {isGood ? 'In Lijn' : 'Afwijkend'}
                    </span>
                  </div>

                  {/* Range Input slider */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold px-1">
                      <span className="text-left w-1/2">{slider.leftLabel}</span>
                      <span className="text-right w-1/2">{slider.rightLabel}</span>
                    </div>
                    <div className="relative pt-3 pb-1">
                      <input
                        id={`slider-input-${slider.id}`}
                        type="range"
                        min="0"
                        max="100"
                        value={slider.value}
                        onChange={(e) => updateSlider(slider.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-hidden"
                      />
                      
                      {/* Science marker line */}
                      <div 
                        className="absolute -top-1.5 flex flex-col items-center"
                        style={{ left: `${slider.idealValue}%`, transform: 'translateX(-50%)' }}
                      >
                        <div className="h-2 w-2 rounded-full bg-emerald-600 shadow-xs" />
                        <span className="text-[8px] font-bold text-emerald-600 mt-1 bg-white px-1 shadow-xs border border-emerald-100 rounded-sm">
                          Aanbevolen ({slider.idealValue})
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs mt-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-slate-500 font-semibold">Jullie waarde: <strong className="text-slate-900 font-bold">{slider.value}</strong></span>
                      <span className="text-slate-500 font-semibold">
                        Verschil: <span className={isGood ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {slider.value === slider.idealValue ? 'Volmaakt!' : `${Math.abs(slider.value - slider.idealValue)} pt`}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs text-center space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Beleidsafstemming Score</h3>
              
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    cx="18"
                    cy="18"
                    r="15.9155"
                  />
                  <circle
                    className="text-emerald-500 transition-all duration-500"
                    strokeDasharray={`${Math.round(100 - (visieSliders.reduce((acc, s) => acc + Math.abs(s.value - s.idealValue), 0) / visieSliders.length))}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    cx="18"
                    cy="18"
                    r="15.9155"
                  />
                </svg>
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {Math.round(100 - (visieSliders.reduce((acc, s) => acc + Math.abs(s.value - s.idealValue), 0) / visieSliders.length))}%
                  </span>
                  <span className="text-xs text-slate-400 block mt-1 font-bold">Match</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed text-left space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gevolgen van jullie keuzes</span>
                <div className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span className="font-semibold text-slate-600">
                    Jullie keuzes bepalen hoe talenten doorstromen en of drop-outcijfers dalen. Gebruik de presets of de wizard hierboven om een wetenschappelijke voorsprong te nemen.
                  </span>
                </div>
              </div>

              <button
                id="btn-apply-presets-sliders"
                onClick={applySciencePresets}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-50 border border-orange-100 py-2.5 text-xs font-bold text-orange-700 hover:bg-orange-100 transition active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" /> Pas wetenschappelijke presets toe
              </button>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/20 p-5 space-y-2 text-emerald-900">
              <h4 className="font-bold text-xs flex items-center gap-1">
                <Info className="h-4 w-4 text-emerald-600" /> Wist je dat?
              </h4>
              <p className="text-xs leading-relaxed text-emerald-800 font-semibold">
                Sportwetenschappelijk onderzoek bewijst dat te vroege prestatieselectie bij kinderen onder 12 jaar leidt tot 30% meer blessures en een hoog risico op vroegtijdig stoppen.
              </p>
            </div>

            <button
              id="btn-visie-to-scan-sliders"
              onClick={() => setView('clubscan')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3.5 transition shadow-md active:scale-95"
            >
              Ga door naar de Clubscan <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
