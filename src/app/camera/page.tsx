"use client";
import Camera from "@/components/Camera";

export default function CameraPage() {
  return (
    <div className="flex flex-col w-full h-[100dvh] pt-20 pb-4 overflow-hidden">
      <div className="w-full mb-2 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-2 shrink-0 px-4 md:px-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-0">
            Camera Studio
          </h1>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col min-h-0">
        <Camera />
      </div>
    </div>
  );
}