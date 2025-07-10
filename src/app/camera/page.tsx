"use client";

import Camera from "@/components/Camera";

export default function CameraPage() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content px-4 py-5">
      <div className="w-full mx-auto ">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
            📸 Camera Booth
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Capture your photos with fun filters and create a strip!
          </p>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Camera Component */}
        <div className="bg-base-200 rounded-2xl shadow-md">
          <Camera />
        </div>
      </div>
    </div>
  );
}
