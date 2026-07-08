import React from 'react';
import { Player, VisieKompasDimension } from '../types';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, Activity, Sparkles, HelpCircle } from 'lucide-react';

interface QualityCheckProps {
  players: Player[];
  teamAllocations: Record<string, string[]>;
  visieSliders: VisieKompasDimension[];
  setView: (view: string) => void;
}

export default function QualityCheck({ players, teamAllocations, visieSliders, setView }: QualityCheckProps) {
  const allocatedIds = Object.values(teamAllocations).flat();
  const jo11_1 = teamAllocations['JO11-1'] || [];
  const jo11_2 = teamAllocations['JO11-2'] || [];
  const jo11_3 = teamAllocations['JO11-3'] || [];

  // 1. Team size check
  const teamSizesCorrect = jo11_1.length === 11 && jo11_2.length === 11 && jo11_3.length === 11;
  const teamSizeStatus = teamSizesCorrect ? 'green' : allocatedIds.length === 0 ? 'red' : 'amber';

  // 2. RAE check (Q1 & Q2 share in JO11-1 should be balanced, ideally < 60%)
  const t1Players = players.filter(p => jo11_1.includes(p.id));
  const t1Q1Q2 = t1Players.filter(p => p.birthQuarter <= 2).length;
  const raePercentage = jo11_1.length > 0 ? (t1Q1Q2 / jo11_1.length) * 100 : 0;
  
  let raeStatus: 'green' | 'amber' | 'red' = 'green';
  if (raePercentage > 75) raeStatus = 'red';
  else if (raePercentage > 55) raeStatus = 'amber';

  // 3. Late Developers inclusion check
  // Noah Kok (p14), Finn de Ruiter (p13) are late developers with high potential
  const highPotentialLateIds = ['p13', 'p14', 'p19', 'p21'];
  const lateInFirstOrSecond = highPotentialLateIds.filter(id => jo11_1.includes(id) || jo11_2.includes(id)).length;
  
  let lateStatus: 'green' | 'amber' | 'red' = 'green';
  if (lateInFirstOrSecond === 0) lateStatus = 'red';
  else if (lateInFirstOrSecond < 2) lateStatus = 'amber';

  // 4. Fixed Positions Check (from visie sliders, id = 'vk3')
  const positionSlider = visieSliders.find(s => s.id === 'vk3');
  const positionSliderValue = positionSlider ? positionSlider.value : 50;
  
  let positionStatus: 'green' | 'amber' | 'red' = 'green';
  if (positionSliderValue < 40) positionStatus = 'red'; // Left heavy (vroeg specialiseren / vaste posities)
  else if (positionSliderValue < 65) positionStatus = 'amber';

  // 5. Parent communication check (from club scan, pedagogics, id = 'cs3')
  const parentScore = 3; // Static default or dynamic
  let parentStatus: 'green' | 'amber' | 'red' = 'amber';

  // Render Status Badge helper
  const renderStatusBadge = (status: 'green' | 'amber' | 'red') => {
    if (status === 'green') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Goedgekeurd
        </span>
      );
    } else if (status === 'amber') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600" /> Waarschuwing
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
          <XCircle className="h-4 w-4 text-rose-600" /> Kritiek
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kwaliteitscheck & Audit</h1>
          <p className="text-sm text-gray-500">
            Wetenschappelijke en pedagogische audit van de huidige teamindeling voor SV Brainport United.
          </p>
        </div>
        <button
          id="btn-go-to-coach"
          onClick={() => setView('aicoach')}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-5 py-2.5 transition shadow-md hover:shadow-lg active:scale-95"
        >
          Raadpleeg de AI-Coach <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Grid of checks */}
      <div className="space-y-4">
        {/* Check 1: Team Sizes */}
        <div id="check-sizes" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              1. Kwantitatieve Verdeling (11 per team)
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Elk team (JO11-1, JO11-2, JO11-3) moet exact 11 spelers tellen om voldoende speeltijd, wisselbeurten en gelijke kansen te garanderen tijdens wedstrijden.
            </p>
            <div className="text-[11px] text-gray-500">
              Actueel ingedeeld: <strong className="text-gray-950">JO11-1: {jo11_1.length}</strong> | <strong className="text-gray-950">JO11-2: {jo11_2.length}</strong> | <strong className="text-gray-950">JO11-3: {jo11_3.length}</strong>.
            </div>
          </div>
          <div className="shrink-0">{renderStatusBadge(teamSizeStatus)}</div>
        </div>

        {/* Check 2: Birth Month Bias */}
        <div id="check-rae" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              2. Relatieve-Leeftijdseffect (RAE) Compensatie
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Het aandeel spelers geboren in kwartaal 1 & 2 in de JO11-1 moet bij voorkeur onder de 60% liggen. Als het team uitsluitend bestaat uit vroeggeborenen, is er sprake van geboortemaand-selectie.
            </p>
            <div className="text-[11px] text-gray-500">
              Actueel Q1/Q2 aandeel in JO11-1: <strong className={raePercentage > 60 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>{Math.round(raePercentage)}%</strong>.
            </div>
          </div>
          <div className="shrink-0">{renderStatusBadge(raeStatus)}</div>
        </div>

        {/* Check 3: Late Bloomers */}
        <div id="check-late" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              3. Inclusie van Laatbloeiers met Hoog Potentieel
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vier specifieke spelers (o.a. Noah Kok en Finn de Ruiter) hebben fysieke achterstand (Laatbloeier), maar extreem hoog ontwikkelpotentieel. Ze horen in de JO11-1 of JO11-2 om voldoende geprikkeld te worden.
            </p>
            <div className="text-[11px] text-gray-500">
              Aantal 'diamanten' in JO11-1 of JO11-2: <strong className="text-gray-950">{lateInFirstOrSecond} van de 4</strong>.
            </div>
          </div>
          <div className="shrink-0">{renderStatusBadge(lateStatus)}</div>
        </div>

        {/* Check 4: Position Rotation */}
        <div id="check-rotation" className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              4. Positierotatie vs. Vroege Specialisatie
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Onder de 12 jaar remt het vastpinnen van kinderen op één vaste positie (bijv. 'jij bent puur verdediger') hun ruimtelijk inzicht en algemene balvaardigheid. Er moet actief geroteerd worden.
            </p>
            <div className="text-[11px] text-gray-500">
              Instelling Visiekompas: <strong className="text-gray-950">{positionSliderValue}/100</strong> (Richtwaarde: &gt;65 voor rotatie).
            </div>
          </div>
          <div className="shrink-0">{renderStatusBadge(positionStatus)}</div>
        </div>
      </div>

      {/* Advisory Warning */}
      {raeStatus === 'red' && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-5 flex gap-3 text-rose-900">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold">Urgent: Fysieke bias gedetecteerd!</h4>
            <p className="leading-relaxed">
              Jullie JO11-1 selectie leunt zwaar op vroege geboortemaanden en fysieke rijpheid. Dit vergroot het risico op drop-out bij laatbloeiers enorm en remt de technische ontwikkeling van de hele lichting. Overweeg spelers te herverdelen op basis van hun Potentieel-index in plaats van actuele duelskracht.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
