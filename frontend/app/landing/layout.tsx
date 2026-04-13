import { Footer } from "@/components/home/Footer";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingSidebar } from "@/components/landing/LandingSidebar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="isolate flex min-h-dvh flex-col bg-[#F8F9FF] text-dent-ink [--landing-footer-reserve:min(30rem,52vh)] [--landing-header-h:3.5rem] [--landing-outset:1rem] [--landing-rail-gap:0.75rem] [--landing-sidebar-w:176px] sm:[--landing-footer-reserve:min(28rem,48vh)] sm:[--landing-outset:1.25rem]"
    >
      <LandingHeader />
      <LandingSidebar />

      {/* Fills viewport below header; footer sits at bottom and is full width (not offset by sidebar). */}
      <div className="flex flex-1 flex-col pt-[calc(var(--landing-header-h)+var(--landing-outset))]">
        <main className="flex-1 pl-[calc(var(--landing-outset)+var(--landing-sidebar-w)+var(--landing-rail-gap))] pr-[var(--landing-outset)] pb-8">
          <div className="px-1 sm:px-2 lg:px-3">{children}</div>
        </main>

        <div className="relative z-10 mt-auto w-full max-w-none shrink-0">
          <Footer variant="compact" />
        </div>
      </div>
    </div>
  );
}
