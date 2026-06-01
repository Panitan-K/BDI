'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  GraduationCap,
  Database,
  Users2,
  Coins,
  BarChart3,
  ListChecks,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  MousePointerClick,
} from 'lucide-react';

/**
 * Tutorial / "how it works" mode.
 *
 * A guided walkthrough that explains (a) how NLI-Thai turns real CCTV data into
 * decision-grade views and (b) which Khon Kaen LRT deadlock each view breaks.
 * Steps can drive the REAL app state ("Show me" actions) so the user learns
 * against the live features, not screenshots.
 */

interface TutorialStep {
  icon: React.ElementType;
  accent: string;
  en: { title: string; body: string; breaks?: string };
  th: { title: string; body: string; breaks?: string };
  action?: {
    en: string;
    th: string;
    run: () => void;
  };
}

const ui = {
  en: {
    title: 'How this works — and how it breaks the deadlock',
    step: 'Step',
    of: 'of',
    back: 'Back',
    next: 'Next',
    finish: 'Got it',
    skip: 'Skip tour',
    breaksLabel: 'Breaks the deadlock:',
  },
  th: {
    title: 'ระบบทำงานอย่างไร — และช่วยคลี่คลายข้อติดขัดได้อย่างไร',
    step: 'ขั้นตอนที่',
    of: 'จาก',
    back: 'ย้อนกลับ',
    next: 'ถัดไป',
    finish: 'รับทราบ',
    skip: 'ข้ามคำแนะนำ',
    breaksLabel: 'ช่วยคลี่คลายข้อติดขัด:',
  },
};

export function NliTutorialDialog({
  isOpen,
  onOpenChange,
  language,
  onSelectPlan,
  onToggleSila,
  onOpenPipeline,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  language: string;
  onSelectPlan: (planId: number | null) => void;
  onToggleSila: (excluded: boolean) => void;
  onOpenPipeline: () => void;
}) {
  const t = ui[language as keyof typeof ui] || ui.en;
  const [step, setStep] = useState(0);

  // Restart at the first step every time the tour is (re)opened.
  useEffect(() => {
    if (isOpen) setStep(0);
  }, [isOpen]);

  const steps: TutorialStep[] = [
    {
      icon: GraduationCap,
      accent: 'text-primary',
      en: {
        title: 'The deadlock is not engineering — it is legibility',
        body: 'The Khon Kaen LRT already has a vehicle, a route concept and local political will. What it lacks is a shared, credible picture that keeps the coalition aligned, lets money de-risk it, and lets the public watch it stay alive. This platform is that picture.',
      },
      th: {
        title: 'ข้อติดขัดมิใช่ปัญหาทางวิศวกรรม หากแต่คือการมองเห็นข้อมูลร่วมกัน',
        body: 'โครงการรถไฟฟ้า LRT ขอนแก่น มีความพร้อมทั้งด้านตัวรถ แนวเส้นทาง และเจตนารมณ์ของท้องถิ่นแล้ว สิ่งที่ยังขาดคือภาพข้อมูลร่วมที่น่าเชื่อถือ ซึ่งจะช่วยให้ทุกหน่วยงานที่เกี่ยวข้องเห็นภาพตรงกัน ช่วยให้แหล่งทุนประเมินความเสี่ยงได้ และเปิดให้ประชาชนร่วมติดตาม ระบบนี้จัดทำขึ้นเพื่อเป็นภาพข้อมูลร่วมดังกล่าว เพื่อประกอบการพิจารณาและขับเคลื่อนโครงการร่วมกัน',
      },
    },
    {
      icon: Database,
      accent: 'text-sky-500',
      en: {
        title: 'Built on real data, honest about estimates',
        body: 'Every number is derived from the real CCTV vehicle counts at 25 checkpoints (in lrt_plans.json) and published headline figures. Modeled values carry an "Estimate" badge, ridership is shown as a range, and gaps (e.g. Hospital, HSR) are flagged — never invented.',
      },
      th: {
        title: 'พัฒนาจากข้อมูลจริง และระบุค่าประมาณการอย่างตรงไปตรงมา',
        body: 'ข้อมูลทุกรายการอ้างอิงจากการนับปริมาณยานพาหนะจริงด้วยกล้อง CCTV จำนวน 25 จุด (ในไฟล์ lrt_plans.json) ประกอบกับตัวเลขที่ได้มีการเผยแพร่อย่างเป็นทางการ ค่าที่ได้จากการประมาณการจะมีป้ายกำกับ "ประมาณการ" จำนวนผู้โดยสารแสดงเป็นช่วง และรายการที่ยังไม่มีข้อมูล (เช่น โรงพยาบาล และจุดเชื่อมต่อรถไฟความเร็วสูง) จะระบุไว้อย่างชัดเจน โดยไม่มีการกำหนดตัวเลขขึ้นเอง',
      },
    },
    {
      icon: Users2,
      accent: 'text-primary',
      en: {
        title: 'View 1 — Coalition & Alignment',
        body: 'Pick any of the 10 plans to see which strategic anchors it captures (KKU, hospitals, malls…) and its ridership range. The Sila-corridor toggle instantly shows what the line loses now that Sila Municipality has withdrawn — turning a political crisis into a pick-a-plan decision.',
        breaks: 'Sila exit / coalition fracture',
      },
      th: {
        title: 'มุมมองที่ 1 — พันธมิตรและแนวเส้นทาง',
        body: 'ขอเชิญเลือกแผนใดก็ได้จากทั้ง 10 แผน เพื่อพิจารณาว่าครอบคลุมจุดยุทธศาสตร์ใดบ้าง (มหาวิทยาลัยขอนแก่น โรงพยาบาล ศูนย์การค้า ฯลฯ) พร้อมช่วงประมาณการผู้โดยสาร ทั้งนี้ สวิตช์ "ตัดแนวเขตเทศบาลเมืองศิลา" จะแสดงให้เห็นทันทีว่าเส้นทางจะสูญเสียศักยภาพด้านใดบ้าง ภายหลังเทศบาลเมืองศิลาได้ถอนตัว อันจะช่วยเปลี่ยนประเด็นความเห็นต่างให้เป็นการพิจารณาเลือกแผนร่วมกัน',
        breaks: 'การถอนตัวของเทศบาลเมืองศิลา / พันธมิตรไม่ครบถ้วน',
      },
      action: { en: 'Show me — select Plan 1', th: 'แสดงตัวอย่าง — เลือกแผนที่ 1', run: () => onSelectPlan(1) },
    },
    {
      icon: Coins,
      accent: 'text-amber-500',
      en: {
        title: 'View 2 — Financial Case',
        body: 'Each plan gets a parametric capex, annual O&M, farebox-recovery ratio, land-value/TOD upside and a sensitivity table (ridership ±20%, fare, cost overrun). This is the due-diligence surface that moves a lender from "negotiating" toward a term sheet.',
        breaks: 'Financing stuck in negotiation',
      },
      th: {
        title: 'มุมมองที่ 2 — ความเป็นไปได้ทางการเงิน',
        body: 'แต่ละแผนจะแสดงประมาณการต้นทุนการก่อสร้าง ค่าดำเนินงานและบำรุงรักษาต่อปี อัตราส่วนความคุ้มทุนจากค่าโดยสาร มูลค่าเพิ่มจากการพัฒนาพื้นที่รอบสถานี (TOD) และตารางวิเคราะห์ความอ่อนไหว (ผู้โดยสาร ±20% ค่าโดยสาร และกรณีต้นทุนบานปลาย) ข้อมูลชุดนี้จัดทำขึ้นเพื่อประกอบการตรวจสอบสถานะโครงการ อันจะช่วยให้สถาบันการเงินพิจารณาให้การสนับสนุนได้สะดวกยิ่งขึ้น',
        breaks: 'การจัดหาแหล่งเงินทุนที่ยังอยู่ระหว่างการเจรจา',
      },
      action: { en: 'Show me — open Plan 1 detail', th: 'แสดงตัวอย่าง — เปิดรายละเอียดแผนที่ 1', run: () => onSelectPlan(1) },
    },
    {
      icon: BarChart3,
      accent: 'text-purple-400',
      en: {
        title: 'View 3 — National Pipeline Ranking',
        body: 'Khon Kaen is currently OFF MRTA\'s list (Phuket, Chiang Mai, Korat, Phitsanulok). This view plots it on the exact axes the centre ranks on — cost/km, ridership/km, readiness — making the local-led project legible in the centre\'s own format.',
        breaks: 'Off the central pipeline',
      },
      th: {
        title: 'มุมมองที่ 3 — การจัดอันดับในแผนระดับชาติ',
        body: 'ปัจจุบันโครงการขอนแก่นยังมิได้อยู่ในบัญชีของ รฟม. (ภูเก็ต เชียงใหม่ นครราชสีมา พิษณุโลก) มุมมองนี้จึงนำเสนอโครงการตามตัวชี้วัดที่ส่วนกลางใช้พิจารณา ได้แก่ ต้นทุนต่อกิโลเมตร ผู้โดยสารต่อกิโลเมตร และระดับความพร้อม เพื่อให้โครงการที่ขับเคลื่อนโดยท้องถิ่นสามารถสื่อสารกับส่วนกลางได้ในรูปแบบเดียวกัน',
        breaks: 'การไม่อยู่ในแผนการลงทุนของส่วนกลาง',
      },
      action: { en: 'Show me — open the ranking', th: 'แสดงตัวอย่าง — เปิดการจัดอันดับ', run: onOpenPipeline },
    },
    {
      icon: ListChecks,
      accent: 'text-emerald-500',
      en: {
        title: 'View 4 — Honest Tracker',
        body: 'The left panel tracks every milestone with its owner, baseline→forecast slippage and blockers — including the new DRT licensing steps. Financing is shown as "Under review — NOT secured", never green. A project everyone can watch is harder to quietly let die.',
        breaks: 'Collapsing public trust',
      },
      th: {
        title: 'มุมมองที่ 4 — การติดตามความคืบหน้าอย่างโปร่งใส',
        body: 'แผงด้านซ้ายจะติดตามทุกขั้นตอนสำคัญ พร้อมระบุหน่วยงานผู้รับผิดชอบ การเลื่อนกำหนด (เป้าหมายเดิม → คาดการณ์ใหม่) และอุปสรรค รวมถึงขั้นตอนการขอใบอนุญาตจากกรมการขนส่งทางราง ทั้งนี้ สถานะการจัดหาเงินทุนจะแสดงเป็น "อยู่ระหว่างการพิจารณา — ยังไม่ได้รับอนุมัติ" โดยไม่แสดงเป็นสถานะเสร็จสิ้น เพื่อความโปร่งใส โครงการที่ทุกฝ่ายสามารถร่วมติดตามได้ ย่อมได้รับการสนับสนุนให้เดินหน้าอย่างต่อเนื่อง',
        breaks: 'ความเชื่อมั่นของประชาชนที่ลดลง',
      },
    },
    {
      icon: ShieldCheck,
      accent: 'text-primary',
      en: {
        title: 'What it does — and does not — do',
        body: 'This platform compresses the "soft" timeline: the months bled to fragmented information, re-planning after Sila, lender due diligence and public distrust. It cannot conjure the ฿26.96B or a DRT licence — but it gives the people who control money and licences the picture to move in months, not years.',
      },
      th: {
        title: 'ขอบเขตการใช้งาน — สิ่งที่ระบบทำได้และยังทำไม่ได้',
        body: 'ระบบนี้มุ่งย่นระยะเวลาในส่วนที่เกี่ยวข้องกับการประสานงานและข้อมูล อันได้แก่ ระยะเวลาที่สูญเสียไปกับข้อมูลที่กระจัดกระจาย การวางแผนใหม่ภายหลังการถอนตัวของเทศบาลเมืองศิลา การตรวจสอบของแหล่งทุน และความไม่เชื่อมั่นของประชาชน ทั้งนี้ ระบบไม่สามารถจัดหางบประมาณ 26.96 พันล้านบาท หรือใบอนุญาตประกอบกิจการแทนได้ หากแต่ช่วยจัดเตรียมข้อมูลเพื่อให้ผู้มีอำนาจตัดสินใจด้านงบประมาณและใบอนุญาตสามารถพิจารณาได้ภายในเวลาไม่กี่เดือน แทนที่จะใช้เวลาหลายปี',
      },
    },
  ];

  const total = steps.length;
  const current = steps[step];
  const c = current[language === 'th' ? 'th' : 'en'];
  const isLast = step === total - 1;

  const finish = () => onOpenChange(false);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t.title}
          </DialogTitle>
        </DialogHeader>

        {/* Step body */}
        <div className="min-h-[200px]">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/40 shrink-0', current.accent)}>
              <current.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground leading-tight">{c.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>

          {c.breaks && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[11px]">
              <span className="font-semibold text-red-400">{t.breaksLabel}</span>
              <span className="text-foreground">{c.breaks}</span>
            </div>
          )}

          {current.action && (
            <div className="mt-3">
              <Button
                variant="secondary"
                size="sm"
                className="gap-1.5"
                onClick={current.action.run}
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                {current.action[language === 'th' ? 'th' : 'en']}
              </Button>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`${t.step} ${i + 1}`}
              className={cn(
                'h-1.5 rounded-full transition-all',
                i === step ? 'w-5 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/50',
              )}
            />
          ))}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {t.step} {step + 1} {t.of} {total}
          </span>
          <div className="flex items-center gap-2">
            {step === 0 ? (
              <Button variant="ghost" size="sm" onClick={finish}>{t.skip}</Button>
            ) : (
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft className="h-3.5 w-3.5" />
                {t.back}
              </Button>
            )}
            {isLast ? (
              <Button size="sm" onClick={finish}>{t.finish}</Button>
            ) : (
              <Button size="sm" className="gap-1" onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>
                {t.next}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
