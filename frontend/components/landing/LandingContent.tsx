"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingSidebar } from "@/components/landing/LandingSidebar";
import { SidebarContext } from "@/components/landing/SidebarContext";

export function LandingContent({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);
  const pathname = usePathname();
  const isAbout = pathname === "/landing/about";

  // Sidebar is always open on home/packages; only toggleable on about
  const effectiveOpen = isAbout ? open : true;

  return (
    <SidebarContext.Provider value={{ open: effectiveOpen, toggle }}>
      <LandingSidebar open={effectiveOpen} />

      <div className="flex flex-1 flex-col pt-[calc(var(--landing-header-h)+var(--landing-sidebar-gap))]">
        <main
          className={`flex-1 pr-(--landing-outset) transition-[padding-left] duration-300 ease-in-out${isAbout ? "" : " pb-8"}`}
          style={{
            // About page: paddingLeft stays constant so content never shifts when sidebar toggles.
            // The about page uses negative margins to escape this padding and go full-width.
            // Home/packages: paddingLeft is always the full sidebar offset (sidebar can't be hidden).
            paddingLeft: "calc(var(--landing-outset) + var(--landing-sidebar-w) + var(--landing-rail-gap))",
          }}
        >
          <div className="px-1 sm:px-2 lg:px-3">{children}</div>
        </main>

        <div className="relative z-10 mt-auto w-full max-w-none shrink-0">
          <LandingFooter />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
