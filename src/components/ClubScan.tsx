import React from 'react';
import { ClubScanQuestion } from '../types';
import { 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Compass, 
  Sparkles,
  Bookmark
} from 'lucide-react';

interface ClubScanProps {
  clubScan: ClubScanQuestion[];
  updateScore: (id: string, score: number) => void;
  resetScan: () => void;
  setView: (view: string) => void;
  isVisionCompleted: boolean;
  visionName: string;
  visionDescription: string;
  setCustomVisionName: (name: string) => void;
  setCustomVisionDescription: (desc: string) => void;
}

export default function ClubScan({ 
  clubScan, 
  updateScore, 
  resetScan, 
  setView,
  isVisionCompleted,
  visionName,
  visionDescription,
  setCustomVisionName,
  setCustomVisionDescription
}: ClubScanProps) {
  // Calculate average of answered questions (score > 0)
  const answeredQuestions = clubScan.filter(q => q.score > 0);
  const averageScore = answeredQuestions.length > 0 
    ? answeredQuestions.reduce((acc, q) => acc + q.score, 0) / answeredQuestions.length
    : 0;

  const getGeneralAdvice = (score: number) => {
    if (score === 0) {
      return {
        title: "Nog geen scan ingevuld",
        text: "Vul de vier pijlers hierboven in om direct sportwetenschappelijk feedback en advies te ontvangen over het talentklimaat binnen SV Brainport United.",
        color: "amber"
      };
    }
    if (score <= 2.0) {
      return {
        title: "Kritieke prestatie-fout!",
        text: "Jullie vereniging selecteert veel te vroeg en reageert op de waan van de dag. Ouders bepalen het beleid langs de lijn en laatbloeiers haken massaal af. Tijd voor een stevige tactische ingreep!",
        color: "rose"
      };
    } else if (score <= 3.5) {
      return {
        title: "Goede bedoelingen, matige uitvoering",
        text: "De visie staat op papier prima verwoord, maar in de praktijk (op zaterdagochtend) wint de drang naar winnen het nog van de individuele talentontwikkeling. Er is potentieel, maar we moeten doorpakken.",
        color: "amber"
      };
    } else {
      return {
        title: "Uitstekend opleidingsklimaat!",
        text: "Gefeliciteerd! Jullie club ademt ontwikkelingsgericht trainen en gelijke kansen. De AI-coach is trots. Laten we zorgen dat de teamindeling deze prachtige cijfers weerspiegelt.",
        color: "emerald"
      };
    }
  };

  const advice = getGeneralAdvice(averageScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubscan Talentklimaat</h1>
          <p className="text-sm text-gray-500">Breng de stand van zaken bij SV Brainport United objectief in kaart.</p>
        </div>
        <button
          id="btn-reset-scan"
          onClick={resetScan}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset scan
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: the questions */}
        <div className="space-y-6 lg:col-span-2">
          {clubScan.map((q) => (
            <div id={`question-card-${q.id}`} key={q.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition hover:shadow-md space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                    {q.category}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{q.questionText}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{q.description}</p>
                </div>
              </div>

              {/* Rating Scale (1 to 5) */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-gray-400 font-medium mb-2 px-1">
                  <span>{q.lowLabel}</span>
                  <span>{q.highLabel}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      id={`btn-score-${q.id}-${val}`}
                      key={val}
                      onClick={() => updateScore(q.id, val)}
                      className={`rounded-xl py-3 text-xs font-black transition-all border ${
                        q.score === val 
                          ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-600/10 scale-[1.03]' 
                          : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right column: results, advice, and next steps profile */}
        <div className="space-y-6">
          {/* Results summary widget */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4 text-center">
            <h3 className="font-extrabold text-gray-900 text-sm">Audit Scorekaart</h3>
            
            <div className="relative mx-auto h-28 w-28 flex items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${
                    averageScore <= 2.2 ? 'text-rose-500' :
                    averageScore <= 3.7 ? 'text-amber-500' : 'text-emerald-500'
                  } transition-all duration-500`}
                  strokeDasharray={`${(averageScore / 5) * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-gray-900">{averageScore.toFixed(1)}</span>
                <span className="text-xs text-gray-400 block mt-1">van 5.0</span>
              </div>
            </div>

            {/* Custom SVG Bar Chart showing Categories */}
            <div className="space-y-2 text-left pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Resultaten per Pijler</span>
              {clubScan.map(q => (
                <div key={q.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{q.category}</span>
                    <span>{q.score} / 5</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        q.score <= 2 ? 'bg-rose-500' : q.score <= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(q.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Feedback Card */}
          <div className={`rounded-2xl border p-5 ${
            advice.color === 'rose' ? 'border-rose-100 bg-rose-50/20 text-rose-900' :
            advice.color === 'amber' ? 'border-amber-100 bg-amber-50/20 text-amber-900' :
            'border-emerald-100 bg-emerald-50/20 text-emerald-900'
          }`}>
            <div className="flex gap-2">
              <MessageSquare className={`h-5 w-5 shrink-0 ${
                advice.color === 'rose' ? 'text-rose-600' :
                advice.color === 'amber' ? 'text-amber-600' : 'text-emerald-600'
              }`} />
              <div className="space-y-1.5">
                <h4 className="font-bold text-xs">{advice.title}</h4>
                <p className="text-xs leading-relaxed opacity-90">{advice.text}</p>
              </div>
            </div>
          </div>

          {/* VERVOLGSTAP: CLUB & OPLEIDINGSVISIE PROFIEL */}
          <div className="rounded-2xl border border-slate-200 bg-slate-55 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Vervolgstep: Opleidingsprofiel
              </h3>
            </div>

            {isVisionCompleted ? (
              <div className="space-y-4">
                <p className="text-[11px] text-slate-500 leading-normal">
                  Gefeliciteerd! Op basis van het ingevulde Visiekompas is dit jullie officiële opleidingsprofiel. Je kunt de naam en tekst hieronder eventueel aanpassen.
                </p>

                {/* Editable Vision Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Visienaam</label>
                  <input 
                    type="text" 
                    value={visionName} 
                    onChange={(e) => setCustomVisionName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-800 focus:bg-white focus:border-orange-500 focus:outline-hidden transition"
                    placeholder="Visienaam..."
                  />
                </div>

                {/* Editable Vision Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Opleidingsvisie Korte Tekst</label>
                  <textarea 
                    value={visionDescription} 
                    onChange={(e) => setCustomVisionDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 focus:bg-white focus:border-orange-500 focus:outline-hidden transition resize-none leading-relaxed"
                    placeholder="Korte beschrijving..."
                  />
                </div>

                {/* Action buttons inside Profile widget */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    id="btn-actualiseer-visie-scan"
                    onClick={() => setView('visiekompas')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 transition shadow-3xs cursor-pointer active:scale-95"
                  >
                    <Compass className="h-4 w-4 text-orange-600" />
                    <span>Actualiseer Opleidingsvisie</span>
                  </button>

                  <button
                    id="btn-profile-to-players"
                    onClick={() => setView('players')}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs py-3.5 transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  >
                    <span>Bekijk de Spelerspool</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-center py-6 space-y-4">
                <div className="mx-auto h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <Bookmark className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Visiekompas nog niet compleet</h4>
                  <p className="text-[10px] text-slate-400 leading-normal max-w-[200px] mx-auto">
                    Vul eerst het Visiekompas in om jullie live opleidingsprofiel hier te genereren en te bewerken.
                  </p>
                </div>
                <button
                  onClick={() => setView('visiekompas')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-3.5 py-2 transition"
                >
                  Start Visiekompas <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
