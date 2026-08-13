"use client"

import { useRouter } from "next/navigation"
import { FaCamera, FaMagic, FaImages, FaArrowRight } from "react-icons/fa"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center w-full bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-base-300 text-sm tracking-widest uppercase text-base-content/70">
          Photobooth Experience
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl leading-[1.1]">
          Capture moments with <br className="hidden md:block"/> effortless style.
        </h1>
        <p className="text-lg md:text-xl text-base-content/60 mb-12 max-w-2xl font-light leading-relaxed">
          A minimalist photobooth right in your browser. 
          Snap, apply subtle filters, and create stunning collages instantly.
        </p>
        <button
          onClick={() => router.push("/camera")}
          className="btn btn-primary rounded-full px-10 py-3 h-auto min-h-0 text-lg font-medium flex items-center gap-3 hover:scale-105 transition-transform"
        >
          Open Camera <FaArrowRight className="text-sm" />
        </button>
      </section>

      {/* Features Section - Minimal Grid */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 border-t border-base-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          <div className="flex flex-col items-start">
            <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-6">
              <FaCamera className="text-2xl text-base-content" />
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-wide">Instant Capture</h3>
            <p className="text-base-content/60 leading-relaxed font-light">
              High-quality snapshots directly from your device. No plugins or downloads required.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-6">
              <FaMagic className="text-2xl text-base-content" />
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-wide">Curated Filters</h3>
            <p className="text-base-content/60 leading-relaxed font-light">
              Apply beautiful, film-inspired filters that enhance your photos without overpowering them.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center mb-6">
              <FaImages className="text-2xl text-base-content" />
            </div>
            <h3 className="text-xl font-semibold mb-3 tracking-wide">Seamless Collages</h3>
            <p className="text-base-content/60 leading-relaxed font-light">
              Automatically stitch your favorite moments together into perfect, shareable layouts.
            </p>
          </div>

        </div>
      </section>

      {/* How it Works - Minimal List */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 border-t border-base-200/50">
        <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between items-start">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-base-content/60 font-light leading-relaxed">
              Three simple steps to create lasting memories. It’s that easy.
            </p>
          </div>
          
          <div className="md:w-2/3 flex flex-col gap-12">
            <div className="flex gap-6 items-start">
              <span className="text-5xl font-light text-base-content/20 leading-none font-mono">01</span>
              <div>
                <h4 className="text-xl font-semibold mb-2">Strike a pose</h4>
                <p className="text-base-content/60 font-light leading-relaxed">Allow camera access and take a series of photos. Get creative with your expressions.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-5xl font-light text-base-content/20 leading-none font-mono">02</span>
              <div>
                <h4 className="text-xl font-semibold mb-2">Refine and filter</h4>
                <p className="text-base-content/60 font-light leading-relaxed">Select from our minimalist aesthetic filters to set the perfect mood.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <span className="text-5xl font-light text-base-content/20 leading-none font-mono">03</span>
              <div>
                <h4 className="text-xl font-semibold mb-2">Save and share</h4>
                <p className="text-base-content/60 font-light leading-relaxed">Download your high-resolution collage instantly to your device.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Final CTA */}
      <section className="w-full max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-10">Ready to start?</h2>
        <button
          onClick={() => router.push("/camera")}
          className="btn btn-outline rounded-full px-10 py-3 h-auto min-h-0 text-lg font-medium hover:bg-base-content hover:text-base-100 transition-colors"
        >
          Launch Photobooth
        </button>
      </section>

    </div>
  )
}