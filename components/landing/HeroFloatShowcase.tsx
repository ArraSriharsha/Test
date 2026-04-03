"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { HeroFloatCard, type FloatAccent } from "./HeroFloatCard";

type Align = "left" | "right" | "center";

const CARD_SURFACE =
  "h-full w-full max-w-none min-h-0 px-4 py-3.5 sm:min-h-[168px] lg:min-h-[176px] lg:px-4 lg:py-4";

function IconApplications() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      <path d="M14 2v6h6M8 13h8M8 17h6M8 9h2" />
    </svg>
  );
}

function IconVisa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" />
    </svg>
  );
}

function IconEducation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function IconExams() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6 4h6m-6-8h.01" />
    </svg>
  );
}

/** Medium icon between footnote and bottom strip (52px tile, 32px artwork) */
function MediumApplications() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </svg>
  );
}

function MediumVisa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V13.5l8 2.5z" />
    </svg>
  );
}

function MediumEducation() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function MediumExams() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* —— Bottom strip: small contextual icons —— */
function S({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

const BOTTOM_APPLICATIONS = [
  <S key="a"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></S>,
  <S key="b"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="m22 6-10 7L2 6" /></S>,
  <S key="c"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></S>,
  <S key="d"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></S>,
];

const BOTTOM_VISA = [
  <S key="a"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 19.2c-.4.5-.4 1.2 0 1.6l1.8 1.8c.5.4 1.2.4 1.6 0L17.8 19.2z" /><path d="m9 15 3 3" /></S>,
  <S key="b"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></S>,
  <S key="c"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></S>,
  <S key="d"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></S>,
];

const BOTTOM_EDUCATION = [
  <S key="a"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></S>,
  <S key="b"><path d="M22 12h-4l-3 9L9 3v0h4l3 9zM9 3v0L4 12H2" /></S>,
  <S key="c"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></S>,
  <S key="d"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></S>,
];

const BOTTOM_EXAMS = [
  <S key="a"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></S>,
  <S key="b"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></S>,
  <S key="c"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4 12 14.01l-3-3" /></S>,
  <S key="d"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></S>,
];

const FLOAT_ITEMS: ReadonlyArray<{
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  accent: FloatAccent;
  align: Align;
  cardClassName: string;
  footnote: string;
  icon: ReactNode;
  middleIcon: ReactNode;
  bottomIcons: ReactNode[];
}> = [
  {
    eyebrow: "Application cycle",
    title: "CAAPID & programs",
    description: "Strong files, timelines, and school fit.",
    tags: ["CAAPID", "Personal statement", "LORs"],
    accent: "sky",
    align: "left",
    cardClassName: CARD_SURFACE,
    footnote: "Tip: align your story with each program’s mission and timeline.",
    icon: <IconApplications />,
    middleIcon: <MediumApplications />,
    bottomIcons: BOTTOM_APPLICATIONS,
  },
  {
    eyebrow: "Visa & status",
    title: "Immigration pathways",
    description: "Common dentist-relevant routes.",
    tags: ["EB1", "O1", "H1B", "F1", "J1"],
    accent: "teal",
    align: "left",
    cardClassName: CARD_SURFACE,
    footnote: "Plan visa strategy early—it shapes interviews and start dates.",
    icon: <IconVisa />,
    middleIcon: <MediumVisa />,
    bottomIcons: BOTTOM_VISA,
  },
  {
    eyebrow: "Education tracks",
    title: "Advanced Standing DDS",
    description: "GPR, AEGD, and bridge planning.",
    tags: ["AS-DDS", "GPR", "AEGD"],
    accent: "violet",
    align: "left",
    cardClassName: CARD_SURFACE,
    footnote: "Compare clinical hours, cohort size, and state license outcomes.",
    icon: <IconEducation />,
    middleIcon: <MediumEducation />,
    bottomIcons: BOTTOM_EDUCATION,
  },
  {
    eyebrow: "Exams & licensure",
    title: "INBDE → state license",
    description: "High-stakes tests and what comes next.",
    tags: ["INBDE", "Bench tests", "State boards"],
    accent: "amber",
    align: "left",
    cardClassName: CARD_SURFACE,
    footnote: "INBDE first, then state rules, ethics, and any bench requirements.",
    icon: <IconExams />,
    middleIcon: <MediumExams />,
    bottomIcons: BOTTOM_EXAMS,
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function TiltWrap({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState("perspective(720px) rotateX(0deg) rotateY(0deg)");

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const k = 9;
      setT(
        `perspective(720px) rotateX(${(-y * k * 2).toFixed(2)}deg) rotateY(${(x * k * 2).toFixed(2)}deg)`,
      );
    },
    [disabled],
  );

  const onLeave = useCallback(() => {
    if (!disabled) setT("perspective(720px) rotateX(0deg) rotateY(0deg)");
  }, [disabled]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="h-full min-h-0 w-full rounded-2xl transition-[transform,box-shadow] duration-200 ease-out will-change-transform hover:shadow-[0_22px_44px_-16px_rgba(14,165,233,0.22)]"
      style={{ transform: disabled ? undefined : t }}
    >
      {children}
    </div>
  );
}

/**
 * Interactive hero column: cursor spotlight + 3D tilt on each HeroFloatCard (disabled when reduced motion).
 */
export function HeroFloatShowcase() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: 50, y: 42 });
  const reduced = usePrefersReducedMotion();

  const moveGlow = useCallback(
    (clientX: number, clientY: number) => {
      const r = panelRef.current?.getBoundingClientRect();
      if (!r) return;
      setGlow({
        x: ((clientX - r.left) / r.width) * 100,
        y: ((clientY - r.top) / r.height) * 100,
      });
    },
    [],
  );

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    moveGlow(e.clientX, e.clientY);
  };

  const onPointerLeave = () => {
    if (!reduced) setGlow({ x: 50, y: 42 });
  };

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Pathway topics you can explore"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex h-full min-h-[min(420px,65vh)] w-full min-w-0 flex-1 flex-col rounded-[28px] border border-slate-200/70 bg-gradient-to-br from-white/90 via-slate-50/40 to-sky-50/25 p-5 shadow-[0_24px_60px_-28px_rgba(13,28,46,0.12)] backdrop-blur-[2px] sm:min-h-[min(480px,70vh)] sm:p-6 lg:min-h-0 lg:flex-1 lg:p-7 xl:p-8"
    >
      {!reduced && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          <div
            className="absolute inset-0 transition-[background-position] duration-300 ease-out"
            style={{
              background: `radial-gradient(520px circle at ${glow.x}% ${glow.y}%, rgba(14,165,233,0.16), transparent 52%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40 mix-blend-soft-light"
            style={{
              background: `radial-gradient(280px circle at ${100 - glow.x * 0.4}% ${100 - glow.y * 0.35}%, rgba(0,101,145,0.08), transparent 45%)`,
            }}
          />
        </div>
      )}

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col gap-4 sm:gap-5">
        <p className="shrink-0 text-center font-display text-[11px] font-bold uppercase tracking-[0.35em] text-slate-400 sm:text-xs">
          Explore your pathway
        </p>

        <div className="grid min-h-0 h-full flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-2 sm:auto-rows-fr sm:gap-4 lg:gap-5">
          {FLOAT_ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex min-h-0 items-stretch justify-stretch sm:h-full sm:min-h-0"
            >
              <TiltWrap disabled={reduced}>
                <HeroFloatCard
                  eyebrow={item.eyebrow}
                  title={item.title}
                  description={item.description}
                  tags={[...item.tags]}
                  align={item.align}
                  accent={item.accent}
                  icon={item.icon}
                  footnote={item.footnote}
                  middleIcon={item.middleIcon}
                  bottomIcons={item.bottomIcons}
                  className={item.cardClassName}
                />
              </TiltWrap>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
