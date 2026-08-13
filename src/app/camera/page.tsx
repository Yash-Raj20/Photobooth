"use client";
import Camera from "@/components/Camera";

export default function CameraPage() {
  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)] pt-12 pb-2">
      <div className="w-full mb-4 text-center md:text-left flex flex-col md:flex-row md:justify-between md:items-end gap-2 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Camera Studio
          </h1>

        </div>
      </div>

      <div className="w-full flex-1 flex flex-col">
        <Camera />
      </div>
    </div>
  );
}