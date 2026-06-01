'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

/**
 * Small provenance chip stamped on every DERIVED figure in the LRT decision
 * views. The honesty contract (CLAUDE.md): no number that comes out of the
 * parametric model may appear without one of these telling the user it is an
 * estimate / scenario / illustrative benchmark — and the tooltip names the
 * assumption it rests on.
 */

const labels = {
  estimate: { en: 'Estimate', th: 'ประมาณการ' },
  scenario: { en: 'Scenario', th: 'สถานการณ์จำลอง' },
  illustrative: { en: 'Illustrative', th: 'ตัวอย่างอ้างอิง' },
  dataGap: { en: 'Data gap', th: 'ไม่มีข้อมูล' },
} as const;

const tones = {
  estimate: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  scenario: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
  illustrative: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  dataGap: 'bg-muted/40 text-muted-foreground border-border/50',
} as const;

export type EstimateKind = keyof typeof labels;

export function EstimateBadge({
  kind = 'estimate',
  language = 'en',
  tooltip,
  className,
}: {
  kind?: EstimateKind;
  language?: string;
  /** The assumption / source this figure rests on (shown on hover). */
  tooltip?: string;
  className?: string;
}) {
  const label = labels[kind][language === 'th' ? 'th' : 'en'];
  const chip = (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0 text-[9px] font-semibold leading-4 align-middle',
        tones[kind],
        className,
      )}
    >
      <Info className="h-2.5 w-2.5" />
      {label}
    </span>
  );

  if (!tooltip) return chip;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">{chip}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[260px] text-left">
          <p className="text-xs">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
