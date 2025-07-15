"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaCamera } from "react-icons/fa";
import { MdOutlineCameraswitch } from "react-icons/md";

type FilterType =
  | "90s"
  | "2000s"
  | "Noir"
  | "clarendon"
  | "gingham"
  | "moon"
  | "lark"
  | "reyes"
  | "juno"
  | "valencia"
  | "slumber"
  | "noir"
  | "sunset"
  | "vintage"
  | "cooltone"
  | "warmglow"
  | "bwfilm";

interface CapturedPhoto {
  dataUrl: string;
  timestamp: number;
}

const FILTERS: { name: FilterType; label: string; css: string }[] = [
  {
    name: "90s",
    label: "90s",
    css: "sepia(0.8) saturate(1.4) hue-rotate(315deg) brightness(1.1)",
  },
  {
    name: "2000s",
    label: "2000s",
    css: "saturate(1.6) contrast(1.2) brightness(1.1) hue-rotate(10deg)",
  },
  {
    name: "clarendon",
    label: "Clarendon",
    css: "contrast(1.2) saturate(1.35) brightness(1.05)",
  },
  {
    name: "gingham",
    label: "Gingham",
    css: "brightness(1.1) contrast(0.95) sepia(0.04)",
  },
  {
    name: "moon",
    label: "Moon",
    css: "grayscale(1) contrast(1.1) brightness(1.1)",
  },
  {
    name: "lark",
    label: "Lark",
    css: "brightness(1.2) contrast(1.05) saturate(1.15)",
  },
  {
    name: "reyes",
    label: "Reyes",
    css: "brightness(1.1) sepia(0.22) contrast(0.85)",
  },
  {
    name: "juno",
    label: "Juno",
    css: "saturate(1.4) contrast(1.15) brightness(1.05)",
  },
  {
    name: "valencia",
    label: "Valencia",
    css: "sepia(0.2) contrast(1.1) brightness(1.08)",
  },
  {
    name: "slumber",
    label: "Slumber",
    css: "brightness(1.05) saturate(0.85) sepia(0.1)",
  },
  {
    name: "noir",
    label: "Noir",
    css: "grayscale(1) contrast(1.3) brightness(0.9)",
  },
  {
    name: "sunset",
    label: "Sunset",
    css: "hue-rotate(-15deg) saturate(1.3) brightness(1.1)",
  },
  {
    name: "vintage",
    label: "Vintage",
    css: "sepia(0.6) saturate(0.8) contrast(1.05)",
  },
  {
    name: "cooltone",
    label: "Cool Tone",
    css: "hue-rotate(200deg) saturate(1.1) brightness(1.1)",
  },
  {
    name: "warmglow",
    label: "Warm Glow",
    css: "hue-rotate(-20deg) saturate(1.2) brightness(1.05)",
  },
  {
    name: "bwfilm",
    label: "B&W Film",
    css: "grayscale(1) contrast(1.2) brightness(1.05)",
  },
];

export default function PhotoBoothApp() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("2000s");
  const [showPhotoStrip, setShowPhotoStrip] = useState(false);
  const [facingMode, setFacingMode] = useState<"front" | "rear">("front");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripCanvasRef = useRef<HTMLCanvasElement>(null);

  const getCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("📸 Please allow camera permission to use the PhotoBooth.");
    }
  }, [facingMode]);

  useEffect(() => {
    getCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [getCamera]);

  const handleCapture = async () => {
    if (isCapturing || capturedPhotos.length >= 5) return;
    setIsCapturing(true);

    const steps = ["3", "2", "1", "Smile!"];
    for (const step of steps) {
      setCountdown(step);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);

    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      if (ctx) {
        ctx.filter = FILTERS.find((f) => f.name === currentFilter)?.css || "";
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvasRef.current.width, 0);
        ctx.restore();

        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
        setCapturedPhotos((prev) => [
          ...prev,
          { dataUrl, timestamp: Date.now() },
        ]);

        if (capturedPhotos.length + 1 === 3) {
          setTimeout(() => setShowPhotoStrip(true), 500);
        }
      }
    }

    setIsCapturing(false);
  };

  // 🎞️ Render final strip with 3 photos
  useEffect(() => {
    if (
      !showPhotoStrip ||
      capturedPhotos.length !== 3 ||
      !stripCanvasRef.current
    )
      return;

    const canvas = stripCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STRIP_WIDTH = 320;
    const STRIP_HEIGHT = 700;
    const PHOTO_WIDTH = 270;
    const PHOTO_HEIGHT = 200;
    const MARGIN = 25;
    const PHOTO_SPACING = 20;

    canvas.width = STRIP_WIDTH;
    canvas.height = STRIP_HEIGHT;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(1, "#f8f9fa");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, STRIP_WIDTH - 2, STRIP_HEIGHT - 2);

    // Photos
    capturedPhotos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = MARGIN + index * (PHOTO_HEIGHT + PHOTO_SPACING);

        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = "#fff";
        ctx.fillRect(MARGIN - 5, y - 5, PHOTO_WIDTH + 10, PHOTO_HEIGHT + 10);
        ctx.drawImage(img, MARGIN, y, PHOTO_WIDTH, PHOTO_HEIGHT);

        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#ced4da";
        ctx.lineWidth = 1;
        ctx.strokeRect(MARGIN, y, PHOTO_WIDTH, PHOTO_HEIGHT);
      };
      img.src = photo.dataUrl;
    });

    // Bottom title
    ctx.fillStyle = "#495057";
    ctx.font = "italic bold 18px Georgia, serif";
    ctx.textAlign = "center";
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    ctx.fillText(
      `📸Photobooth • ${currentDate}`,
      STRIP_WIDTH / 2,
      STRIP_HEIGHT - 10
    );
  }, [capturedPhotos, showPhotoStrip]);

  const downloadStrip = () => {
    if (!stripCanvasRef.current) return;
    const link = document.createElement("a");
    link.href = stripCanvasRef.current.toDataURL("image/jpeg", 0.9);
    link.download = "photo-strip.jpg";
    link.click();
  };

  const reset = async () => {
    setCapturedPhotos([]);
    setShowPhotoStrip(false);
    await getCamera();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      {!showPhotoStrip ? (
        <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-3xl space-y-4">
          {/* Video Preview */}
          <div className="w-full h-64 sm:h-80 md:h-[26rem] lg:h-[30rem] relative overflow-hidden rounded-lg mx-auto">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              style={{
                filter: FILTERS.find((f) => f.name === currentFilter)?.css,
                transform: "scaleX(-1)",
              }}
            />
            {countdown && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-5xl font-bold animate-pulse">
                {countdown}
              </div>
            )}
            {capturedPhotos.length > 0 && (
              <span className="absolute top-2 right-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                {capturedPhotos.length}/3
              </span>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setCurrentFilter(filter.name)}
                className={`px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                  currentFilter === filter.name
                    ? "bg-yellow-500 text-black font-semibold"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Capture Button */}
          <div className="flex justify-center gap-10 items-center">
            <button
              onClick={handleCapture}
              disabled={isCapturing || capturedPhotos.length >= 5}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black shadow-md disabled:opacity-50 flex items-center justify-center"
            >
              <FaCamera className="w-6 h-6" />
              <span className="sr-only">Take Photo</span>
            </button>
            <button
              onClick={() =>
                setFacingMode((prev) => (prev === "front" ? "rear" : "front"))
              }
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 text-black text-sm shadow hover:bg-gray-400 flex items-center justify-center transition"
              title="Switch Camera"
            >
              <MdOutlineCameraswitch className="w-6 h-6" />
              <span className="sr-only">Switch Camera</span>
            </button>
          </div>

          {/* Status Text */}
          <p className="text-center text-sm text-gray-700">
            {capturedPhotos.length === 0 && "Ready to click your first snap!"}
            {capturedPhotos.length === 1 && "Great! Click 3 more photos"}
            {capturedPhotos.length === 2 && "One last snap!"}
            {capturedPhotos.length === 3 && "All done! Generating collage..."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center bg-gradient-to-br from-amber-900 to-amber-800 rounded-3xl p-6 md:p-8 w-full max-w-3xl shadow-2xl border-0">
          {/* Canvas Strip */}
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <div className="bg-white p-3 md:p-4 rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <canvas
                ref={stripCanvasRef}
                className="w-full max-w-[260px] md:max-w-[300px] h-auto aspect-[2/3] rounded-lg shadow-inner"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full md:w-auto items-center">
            <button
              onClick={reset}
              className="bg-amber-700 hover:bg-amber-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-amber-600 w-full md:w-auto"
            >
              Re-Shoot
            </button>
            <button
              onClick={downloadStrip}
              className="bg-amber-700 hover:bg-amber-600 text-white px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-amber-600 w-full md:w-auto"
            >
              Download Photo
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
