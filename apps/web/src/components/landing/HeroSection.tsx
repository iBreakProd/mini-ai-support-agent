import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { useChatWidget } from "@/contexts/ChatWidgetContext";

const BOTTLE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-h0t99RJJwyDTUsALkiqSzEB6lH003fKBgH6pyjSfpk0Va1DbkBVZKHgcXEdj2Wd2adTNpUYKxRXUe_lmElt8Ay_1AS36pkbAzHyTQ5uC10tJ1PnigtJWcxVKj2vlOMIegBnOXYVvI88-WX6ceEFmEwJVellhCa5Q0AplnZn9gmAUs5T9Ap5Ue0b4k3RmDeWgHuDpChQ0aeaF58n6I0mcaNIUgzoBm0Ikth_Wk-TI2Ghc1xKDxuK_vySJQc9YgdE_4SbH8DMomoE";

export function HeroSection() {
  const { openChat } = useChatWidget();
  return (
    <section className="relative z-10 pt-24 px-4 pb-4 md:px-8 md:pb-8 lg:pt-12 lg:px-12 lg:pb-12 min-h-screen flex flex-col justify-center">
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-6 text-xs tracking-widest text-gray-400 font-medium">
        <a 
          href="https://github.com/iBreakProd/Arctic-Support-Agent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors flex items-center gap-2 group"
        >
          <img src="https://github.com/favicon.ico" alt="GitHub" className="w-4 h-4 opacity-50 group-hover:opacity-100 grayscale invert transition-opacity" />
          SOURCE CODE
        </a>
        <a 
          href="https://hrsht.me" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-white transition-colors border border-gray-800 hover:border-gray-500 px-3 py-1.5 rounded"
        >
          BY HARSHIT
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 border border-neutral-border bg-background-dark/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl">
        <div className="md:col-span-7 lg:col-span-8 p-8 md:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-neutral-border flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] text-primary">
                AI Support Agent
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter font-display">
              AI SUPPORT.
              <br />
              <span className="text-outline">ALWAYS</span>
              <br />
              <span className="text-gradient-grain">ON.</span>
            </h1>
          </div>
          <div className="mt-12 md:mt-0 flex flex-col md:flex-row gap-6 md:items-end justify-between">
            <p className="max-w-xs text-sm text-gray-400 leading-relaxed font-light">
              Instant, intelligent support for orders, products, shipping, and
              hydration. Ask anything—get grounded answers from real data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={openChat}
                className="bg-primary text-white! hover:bg-white hover:text-black! px-8 py-4 rounded font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 group-hover:pl-10"
              >
                Try the AI
                <ArrowRight className="size-4" />
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-neutral-border text-gray-300 hover:bg-white/5"
              >
                <Link to="/docs" className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  How it works
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="md:col-span-5 lg:col-span-4 relative min-h-[400px] md:min-h-full">
          <div className="absolute inset-0 bg-neutral-800">
            <img
              alt="Arctic product catalog—ask the AI about our bottles"
              className="w-full h-full object-cover opacity-90 mix-blend-overlay hover:scale-105 transition-transform duration-700 ease-out"
              src={BOTTLE_IMAGE}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background-dark via-transparent to-transparent" />
          </div>
          <button
            type="button"
            onClick={openChat}
            className="absolute bottom-6 left-6 flex items-center gap-2 text-left hover:opacity-80 transition-opacity"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
            <span className="text-[11px] text-primary font-medium tracking-wider">
              Ask the AI · Our catalog
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
