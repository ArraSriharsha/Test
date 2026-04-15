"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    id: "01",
    label: "Home",
    href: "/landing",
    inactiveClass:
      "border border-[#E2E8F0]/90 bg-white text-dent-deep hover:border-dent-sky/25 hover:bg-dent-surface-bento",
    activeClass:
      "border border-dent-deep/20 bg-dent-deep text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 opacity-90" aria-hidden>
        <path
          d="M9 22V12h6v10M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "02",
    label: "Packages",
    href: "/landing/packages",
    inactiveClass:
      "border border-[#E2E8F0]/90 bg-white text-dent-ink hover:border-dent-sky/30 hover:bg-dent-badge-bg/60",
    activeClass:
      "border border-dent-sky/30 bg-dent-deep text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 opacity-90" aria-hidden>
        <path
          d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "03",
    label: "About",
    href: "/landing/about",
    inactiveClass:
      "border border-[#E2E8F0]/90 bg-white text-dent-ink hover:border-dent-sky/30 hover:bg-dent-badge-bg/60",
    activeClass:
      "border border-dent-sky/30 bg-dent-deep text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 opacity-90" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

type Props = { open: boolean };

export function LandingSidebar({ open }: Props) {
  const pathname = usePathname();
  const slideX = open
    ? "translateX(0)"
    : "translateX(calc(-100% - var(--landing-outset)))";

  return (
    <aside
      aria-label="Workspace navigation"
      aria-hidden={!open}
      className="fixed bottom-(--landing-sidebar-gap) left-(--landing-outset) z-40 flex w-(--landing-sidebar-w) flex-col gap-1 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white/95 p-1 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.14)] backdrop-blur-sm supports-backdrop-filter:bg-white/90 transition-transform duration-300 ease-in-out"
      style={{
        top: "calc(var(--landing-header-h) + var(--landing-sidebar-gap))",
        transform: slideX,
      }}
    >
      <nav className="flex min-h-0 min-w-0 flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              style={{ flexGrow: isActive ? 2 : 1 }}
              className={`flex min-h-0 min-w-0 basis-0 flex-col justify-between rounded-xl px-2 py-2 outline-none ring-dent-sky transition-[flex-grow,colors] duration-500 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                isActive ? item.activeClass : item.inactiveClass
              }`}
            >
              <div className="flex items-start justify-between gap-0.5">
                <span
                  className={`font-mono text-[8px] font-bold leading-none tracking-tight ${
                    isActive ? "text-white/80" : "opacity-70"
                  }`}
                >
                  {item.id}
                </span>
                <span className={isActive ? "text-white/95" : ""}>{item.icon}</span>
              </div>
              <span
                className={`block whitespace-nowrap text-center text-[9px] font-bold uppercase leading-tight tracking-[0.05em] ${
                  isActive ? "text-white" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
