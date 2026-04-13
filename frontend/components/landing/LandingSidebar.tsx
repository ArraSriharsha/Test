"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    href: "/landing",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
        <path
          d="M9 22V12h6v10M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Packages",
    href: "/landing/packages",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden>
        <path
          d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function LandingSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-[var(--landing-outset)] top-[calc(var(--landing-header-h)+var(--landing-outset))] z-40 flex w-[var(--landing-sidebar-w)] flex-col rounded-2xl border border-[#E2E8F0] bg-white/90 shadow-[0_10px_40px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md supports-[backdrop-filter]:bg-white/80 bottom-[calc(var(--landing-footer-reserve)+var(--landing-outset))]"
    >
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2.5 pb-4 pt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-dent-badge-bg text-dent-ink shadow-[inset_0_0_0_1px_rgba(14,165,233,0.12)]"
                  : "text-[#3E4850] hover:bg-slate-50 hover:text-dent-ink"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-dent-sky" />
              )}
              <span
                className={`transition-colors duration-200 ${isActive ? "text-dent-deep" : "text-slate-400 group-hover:text-dent-deep"}`}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
