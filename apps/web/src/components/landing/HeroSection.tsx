import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const BOTTLE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-h0t99RJJwyDTUsALkiqSzEB6lH003fKBgH6pyjSfpk0Va1DbkBVZKHgcXEdj2Wd2adTNpUYKxRXUe_lmElt8Ay_1AS36pkbAzHyTQ5uC10tJ1PnigtJWcxVKj2vlOMIegBnOXYVvI88-WX6ceEFmEwJVellhCa5Q0AplnZn9gmAUs5T9Ap5Ue0b4k3RmDeWgHuDpChQ0aeaF58n6I0mcaNIUgzoBm0Ikth_Wk-TI2Ghc1xKDxuK_vySJQc9YgdE_4SbH8DMomoE";

export function HeroSection() {
  return (
    <section className="relative z-10 pt-24 px-4 pb-4 md:px-8 md:pb-8 lg:pt-12 lg:px-12 lg:pb-12 min-h-screen flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 border border-neutral-border bg-background-dark/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
        <div className="md:col-span-7 lg:col-span-8 p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-border flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                Urban Series V.03
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter font-display">
              PURE.
              <br />
              <span className="text-outline">FORM.</span>
              <br />
              <span className="text-gradient-grain">FLUID.</span>
            </h1>
          </div>
          <div className="mt-12 md:mt-0 flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <p className="max-w-xs text-sm text-gray-400 leading-relaxed font-light">
              Designed for the metropolitan nomad. Aerospace-grade aluminum meets
              high-fashion aesthetics. Hydration redefined for the concrete
              jungle.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-white hover:text-black text-white px-8 py-4 rounded font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group-hover:pl-10"
            >
              Pre-Order
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
        <div className="md:col-span-5 lg:col-span-4 relative min-h-[400px] md:min-h-full">
          <div className="absolute inset-0 bg-neutral-800">
            <img
              alt="Sleek metal water bottle on dark concrete surface"
              className="w-full h-full object-cover opacity-90 mix-blend-overlay hover:scale-105 transition-transform duration-700 ease-out"
              src={BOTTLE_IMAGE}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent" />
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-background-dark/80 backdrop-blur border border-neutral-border p-3 rounded">
              <p className="text-xs text-primary font-bold">MODEL X-200</p>
              <p className="text-[10px] text-gray-400">MATTE OBSIDIAN</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
