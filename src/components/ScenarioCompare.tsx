import React from 'react';
import { presetScenarios } from '../data';
import { Shield, Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle, Info, Flame, ThumbsUp } from 'lucide-react';

interface ScenarioCompareProps {
  onSelectScenario: (allocations: Record<string, string[]>) => void;
  setView: (view: string) => void;
}

export default function ScenarioCompare({ onSelectScenario, setView }: ScenarioCompareProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenariovergelijking</h1>
          <p className="text-sm text-gray-500">
            Houd verschillende indelingsfilosofieën tegen het licht en analyseer de lange-termijn effecten.
          </p>
        </div>
        <button
          id="btn-go-to-qualitycheck"
          onClick={() => setView('qualitycheck')}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-5 py-2.5 transition shadow-md hover:shadow-lg active:scale-95"
        >
          Naar Kwaliteitscheck <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Summary Box */}
      <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 text-xs text-gray-600 space-y-2">
        <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
          <Info className="h-4 w-4 text-orange-600" /> Waarom scenario-analyse cruciaal is voor de HJO
        </h4>
        <p className="leading-relaxed">
          Als jeugdopleiding moet je verantwoording kunnen afleggen over keuzes. Dit scherm toont het verschil tussen 'winnen op de korte termijn' (Scenario A) en 'breed opleiden voor de lange termijn' (Scenario B & C). De sportwetenschap bewijst dat clubs die selecteren uitstellen en laatbloeiers stimuleren, uiteindelijk 3x meer spelers naar de senioren brengen.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {presetScenarios.map((scen) => {
          const isDev = scen.id === 'scen_development';
          const isTrad = scen.id === 'scen_traditional';

          return (
            <div 
              id={`scenario-card-${scen.id}`}
              key={scen.id} 
              className={`rounded-2xl border p-6 shadow-xs flex flex-col justify-between space-y-6 transition hover:shadow-md ${
                isDev ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-100 bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    isDev ? 'bg-emerald-100 text-emerald-800' : isTrad ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {isDev ? 'Aanbevolen door AI-Coach' : isTrad ? 'Traditioneel Model' : 'Gelijke Kansen Model'}
                  </span>
                  {isDev && <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />}
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-950 leading-tight">{scen.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">{scen.description}</p>
                </div>

                {/* Stat meters */}
                <div className="border-t border-gray-100/80 pt-4 space-y-3.5">
                  {/* RAE Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-700">
                      <span>Geboortemaand-bias (Q1/Q2 in JO11-1)</span>
                      <strong className={scen.stats.raePercentageJO11_1 > 60 ? 'text-rose-600' : 'text-emerald-600'}>
                        {scen.stats.raePercentageJO11_1}%
                      </strong>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${scen.stats.raePercentageJO11_1 > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${scen.stats.raePercentageJO11_1}%` }}
                      />
                    </div>
                  </div>

                  {/* Avg Potential */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-700">
                      <span>Lange-termijn Potentieel JO11-1</span>
                      <strong className="text-emerald-600">{scen.stats.averagePotentialJO11_1} / 100</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scen.stats.averagePotentialJO11_1}%` }} />
                    </div>
                  </div>

                  {/* Avg Performance */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-gray-700">
                      <span>Actuele Prestatie JO11-1 (Fysiek/Skill)</span>
                      <strong className="text-orange-600">{scen.stats.averagePerformanceJO11_1} / 100</strong>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${scen.stats.averagePerformanceJO11_1}%` }} />
                    </div>
                  </div>

                  {/* Late Developer inclusion */}
                  <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50 text-gray-600 font-medium">
                    <span>Laatbloeiers in de JO11-1</span>
                    <strong className="text-gray-900">{scen.stats.lateDevelopersInFirstTeam} spelers</strong>
                  </div>

                  {/* Dropout risk */}
                  <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50 text-gray-600 font-medium">
                    <span>Risico op Drop-outs (Afhakers)</span>
                    <strong className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      scen.stats.dropoutRiskOverall === 'Hoog' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {scen.stats.dropoutRiskOverall}
                    </strong>
                  </div>

                  {/* Parent satisfaction risk */}
                  <div className="flex justify-between items-center text-xs py-1 border-b border-gray-50 text-gray-600 font-medium">
                    <span>Kans op Ouderdrukte/Klagen</span>
                    <strong className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      scen.stats.parentClashRisk === 'Hoog' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {scen.stats.parentClashRisk}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Button to apply to Workspace */}
              <button
                id={`btn-apply-scenario-${scen.id}`}
                onClick={() => {
                  onSelectScenario(scen.teamAllocations);
                  alert(`Scenario "${scen.name}" is geladen in je actieve werkblad! Ga naar de Teamindeling module om spelers aan te passen.`);
                }}
                className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold text-xs py-2.5 transition active:scale-95 ${
                  isDev 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-slate-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" /> Selecteer scenario als basis
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
