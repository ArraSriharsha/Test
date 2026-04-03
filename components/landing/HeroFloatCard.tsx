import type { ReactNode } from "react";

const floatAccent = {
  teal: {
    shell:
      "border border-teal-100/90 bg-gradient-to-br from-teal-50/95 via-white/90 to-cyan-50/40 shadow-[0_12px_28px_-8px_rgba(13,148,136,0.18)] backdrop-blur-sm",
    bar: "bg-teal-500",
    eyebrow: "text-teal-800/90",
    tag: "bg-teal-100/80 text-teal-900",
    iconBox: "bg-teal-100/70 text-teal-700",
    bottomIcon: "bg-teal-50/90 text-teal-600 border border-teal-100/80",
    middleIconBox:
      "bg-gradient-to-br from-teal-50/95 to-cyan-50/60 text-teal-600 ring-1 ring-teal-100/90 shadow-sm",
  },
  sky: {
    shell:
      "border border-sky-100/90 bg-gradient-to-br from-sky-50/95 via-white/90 to-sky-50/30 shadow-[0_12px_28px_-8px_rgba(14,165,233,0.2)] backdrop-blur-sm",
    bar: "bg-sky-500",
    eyebrow: "text-sky-800/90",
    tag: "bg-sky-100/80 text-sky-900",
    iconBox: "bg-sky-100/80 text-sky-600",
    bottomIcon: "bg-sky-50/90 text-sky-600 border border-sky-100/80",
    middleIconBox:
      "bg-gradient-to-br from-sky-50/95 to-white text-sky-600 ring-1 ring-sky-100/90 shadow-sm",
  },
  violet: {
    shell:
      "border border-violet-100/90 bg-gradient-to-br from-violet-50/95 via-white/90 to-fuchsia-50/35 shadow-[0_12px_28px_-8px_rgba(124,58,237,0.15)] backdrop-blur-sm",
    bar: "bg-violet-500",
    eyebrow: "text-violet-900/85",
    tag: "bg-violet-100/80 text-violet-900",
    iconBox: "bg-violet-100/75 text-violet-700",
    bottomIcon: "bg-violet-50/90 text-violet-600 border border-violet-100/80",
    middleIconBox:
      "bg-gradient-to-br from-violet-50/95 to-fuchsia-50/50 text-violet-600 ring-1 ring-violet-100/90 shadow-sm",
  },
  amber: {
    shell:
      "border border-amber-100/90 bg-gradient-to-br from-amber-50/95 via-white/90 to-orange-50/35 shadow-[0_12px_28px_-8px_rgba(217,119,6,0.16)] backdrop-blur-sm",
    bar: "bg-amber-500",
    eyebrow: "text-amber-900/85",
    tag: "bg-amber-100/85 text-amber-950",
    iconBox: "bg-amber-100/80 text-amber-800",
    bottomIcon: "bg-amber-50/90 text-amber-700 border border-amber-100/80",
    middleIconBox:
      "bg-gradient-to-br from-amber-50/95 to-orange-50/50 text-amber-700 ring-1 ring-amber-100/90 shadow-sm",
  },
  emerald: {
    shell:
      "border border-emerald-100/90 bg-gradient-to-br from-emerald-50/95 via-white/90 to-teal-50/30 shadow-[0_12px_28px_-8px_rgba(5,150,105,0.16)] backdrop-blur-sm",
    bar: "bg-emerald-500",
    eyebrow: "text-emerald-900/85",
    tag: "bg-emerald-100/80 text-emerald-950",
    iconBox: "bg-emerald-100/75 text-emerald-700",
    bottomIcon: "bg-emerald-50/90 text-emerald-600 border border-emerald-100/80",
    middleIconBox:
      "bg-gradient-to-br from-emerald-50/95 to-teal-50/50 text-emerald-600 ring-1 ring-emerald-100/90 shadow-sm",
  },
} as const;

export type FloatAccent = keyof typeof floatAccent;

export function HeroFloatCard({
  eyebrow,
  title,
  description,
  tags,
  align = "left",
  accent = "sky",
  className,
  icon,
  footnote,
  middleIcon,
  bottomIcons,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tags?: string[];
  align?: "left" | "right" | "center";
  accent?: FloatAccent;
  className?: string;
  /** Decorative icon — sits opposite the text block to balance the card */
  icon?: ReactNode;
  /** Short supporting line under tags (timeline, tip, or “what’s next”) */
  footnote?: string;
  /** Medium icon between footnote and bottom strip — fills vertical space when card is tall */
  middleIcon?: ReactNode;
  /** Small icons in the bottom strip (fills space on tall cards) */
  bottomIcons?: ReactNode[];
}) {
  const a = floatAccent[accent];
  const alignCls =
    align === "right" ? "text-right" : align === "center" ? "text-center" : "";
  const tagRowCls =
    align === "right"
      ? "mt-2 flex flex-wrap justify-end gap-1"
      : align === "center"
        ? "mt-2 flex flex-wrap justify-center gap-1"
        : "mt-2 flex flex-wrap gap-1";

  return (
    <div
      className={`flex h-full min-h-0 max-w-[min(280px,100%)] flex-row gap-3 rounded-2xl px-3 py-2.5 ${a.shell} ${alignCls} ${className ?? ""}`}
    >
      <span
        className={`mt-0.5 w-1 shrink-0 self-stretch rounded-full ${a.bar}`}
        aria-hidden
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
        <div className="flex min-w-0 shrink-0 gap-2.5 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={`font-display text-[10px] font-bold uppercase leading-4 tracking-[0.45px] ${a.eyebrow}`}
            >
              {eyebrow}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold leading-snug text-dent-ink">{title}</p>
            {description ? (
              <p className="mt-1 text-xs font-normal leading-relaxed text-[#475569]">{description}</p>
            ) : null}
            {tags && tags.length > 0 ? (
              <div className={tagRowCls}>
                {tags.map((t) => (
                  <span
                    key={t}
                    className={`rounded-full px-2 py-0.5 font-display text-[10px] font-semibold leading-[15px] ${a.tag}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {icon ? (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5 ${a.iconBox}`}
              aria-hidden
            >
              {icon}
            </div>
          ) : null}
        </div>
        {footnote ? (
          <p className="shrink-0 border-t border-slate-200/70 pt-2 text-[10px] font-medium leading-snug text-[#64748b]">
            {footnote}
          </p>
        ) : null}
        {middleIcon ? (
          <div
            className="flex min-h-[3rem] flex-1 flex-col items-center justify-center py-2 sm:min-h-[3.5rem] sm:py-3"
            aria-hidden
          >
            <div
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl [&>svg]:h-8 [&>svg]:w-8 ${a.middleIconBox}`}
            >
              {middleIcon}
            </div>
          </div>
        ) : null}
        {bottomIcons && bottomIcons.length > 0 ? (
          <div
            className={`flex min-h-[2.25rem] flex-wrap items-center gap-1.5 border-t border-dashed border-slate-200/70 pt-2.5 ${middleIcon ? "shrink-0" : "mt-auto"}`}
            aria-hidden
          >
            {bottomIcons.map((node, i) => (
              <span
                key={i}
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md [&>svg]:h-3.5 [&>svg]:w-3.5 ${a.bottomIcon}`}
              >
                {node}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
