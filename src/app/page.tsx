"use client"

import { useRouter } from "next/navigation"
import { FaCameraRetro, FaPalette, FaRobot } from "react-icons/fa"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-base-content">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">📸 Photobooth Friendly</h1>
      <p className="text-center max-w-md mb-10 text-lg">Snap stylish photos with filters, collage maker, and dark mode — all in your browser.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
          <div className="card-body items-center text-center">
            <FaCameraRetro className="text-3xl text-primary mb-2" />
            <h2 className="card-title">Take Photos</h2>
            <p>Capture selfies and snapshots with real-time filters.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
          <div className="card-body items-center text-center">
            <FaPalette className="text-3xl text-secondary mb-2" />
            <h2 className="card-title">Apply Filters</h2>
            <p>Choose from retro, noir, rainbow, and more filters.</p>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
          <div className="card-body items-center text-center">
            <FaRobot className="text-3xl text-accent mb-2" />
            <h2 className="card-title">Generate Collages</h2>
            <p>Combine photos into stylish, downloadable collages.</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/camera")}
        className="btn btn-primary btn-lg px-10"
      >
        Start Camera
      </button>
    </div>
  )
}