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

  // ✅ Get Camera Function
  const getCamera = useCallback(async () => {
    try {
      stream?.getTracks().forEach((track) => track.stop());

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode === "front" ? "user" : "environment",
        },
        audio: false,
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
      const isFront = facingMode === "front";

      if (ctx) {
        ctx.filter = FILTERS.find((f) => f.name === currentFilter)?.css || "";
        ctx.save();
        if (isFront) {
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, -canvasRef.current.width, 0);
        } else {
          ctx.drawImage(videoRef.current, 0, 0);
        }
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

    // Fixed realistic dimensions (3:5 aspect ratio strip)
    const STRIP_WIDTH = 270;
    const PHOTO_HEIGHT = 300;
    const PHOTO_WIDTH = 230;
    const PHOTO_SPACING = 20;
    const MARGIN = 20;
    const STRIP_HEIGHT = MARGIN * 2 + PHOTO_HEIGHT * 3 + PHOTO_SPACING * 2;

    canvas.width = STRIP_WIDTH;
    canvas.height = STRIP_HEIGHT;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(1, "#f8f9fa");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Border
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, STRIP_WIDTH - 2, STRIP_HEIGHT - 2);

    // Draw all 3 photos after they finish loading
    let imagesLoaded = 0;
    const totalImages = capturedPhotos.length;

    capturedPhotos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = MARGIN + index * (PHOTO_HEIGHT + PHOTO_SPACING);

        // Draw white photo frame
        ctx.shadowColor = "rgba(0,0,0,0.08)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = "#fff";
        ctx.fillRect(MARGIN - 5, y - 5, PHOTO_WIDTH + 10, PHOTO_HEIGHT + 10);

        // Draw photo
        ctx.drawImage(img, MARGIN, y, PHOTO_WIDTH, PHOTO_HEIGHT);

        // Add border to photo
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = "#ced4da";
        ctx.lineWidth = 1;
        ctx.strokeRect(MARGIN, y, PHOTO_WIDTH, PHOTO_HEIGHT);

        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          // Footer text after all images are drawn
          ctx.fillStyle = "#495057";
          ctx.font = "italic bold 16px Georgia, serif";
          ctx.textAlign = "center";

          const currentDate = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });

          ctx.fillText(
            `📸 Photobooth • ${currentDate}`,
            STRIP_WIDTH / 2,
            STRIP_HEIGHT - 20
          );
        }
      };
      img.src = photo.dataUrl;
    });
  }, [capturedPhotos, showPhotoStrip]);

  const downloadStrip = () => {
    if (!stripCanvasRef.current) return;
    const link = document.createElement("a");
    link.href = stripCanvasRef.current.toDataURL("image/jpeg", 0.9);
    link.download = "photo-booth.jpg";
    link.click();
  };

  const reset = async () => {
    setCapturedPhotos([]);
    setShowPhotoStrip(false);
    await getCamera();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between px-2 py-4 sm:px-4 sm:py-6 bg-base-100">
      {!showPhotoStrip ? (
        <div className="w-full max-w-5xl flex flex-col sm:rounded-2xl sm:shadow-xl bg-white sm:p-4 space-y-4 rounded-xl">
          {/* 📸 Camera Preview */}
          <div className="relative w-full h-[calc(100vh-300px)] sm:h-[30rem] overflow-hidden rounded-xl bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              style={{
                filter: FILTERS.find((f) => f.name === currentFilter)?.css,
                transform: facingMode === "front" ? "scaleX(-1)" : "scaleX(1)",
              }}
            />
            {countdown && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-5xl font-bold animate-pulse z-10">
                {countdown}
              </div>
            )}
            {capturedPhotos.length > 0 && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold z-10">
                {capturedPhotos.length}/3
              </span>
            )}
          </div>

          {/* 🎨 Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide px-1 sm:px-2 pb-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setCurrentFilter(filter.name)}
                className={`px-4 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap transition ${
                  currentFilter === filter.name
                    ? "bg-yellow-500 text-black font-semibold"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* 📸 Capture + Switch Buttons */}
          <div className="flex justify-center items-center ml-10 gap-4">
            <button
              onClick={handleCapture}
              disabled={isCapturing || capturedPhotos.length >= 3}
              className="w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black shadow-md disabled:opacity-50 flex items-center justify-center"
              title="Click Photo"
            >
              <FaCamera className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setFacingMode((prev) => (prev === "front" ? "rear" : "front"))
              }
              className="w-10 h-10 rounded-full bg-gray-200 text-black shadow hover:bg-gray-300 flex items-center justify-center"
              title="Switch camera"
              aria-label="Switch camera"
            >
              <MdOutlineCameraswitch className="w-6 h-6" />
            </button>
          </div>

          {/* 📝 Status */}
          <p className="text-center text-sm text-gray-700">
            {capturedPhotos.length === 0 && "Ready to click your first snap!"}
            {capturedPhotos.length === 1 && "2 more to go!"}
            {capturedPhotos.length === 2 && "One last snap!"}
            {capturedPhotos.length === 3 && "All done! Generating collage..."}
          </p>
        </div>
      ) : (
        // 🎞️ Photo Strip Section
        <div className="flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-8 bg-gradient-to-br from-amber-950 to-amber-800 rounded-3xl p-4 sm:p-6 md:p-8 max-w-3xl w-full shadow-xl">
          {/* Buttons - appear below image on small screens, right side on md+ */}
          <div className="flex flex-col gap-4 w-full md:w-auto items-center">
            <button
              onClick={reset}
              className="w-full md:w-auto bg-white text-amber-900 hover:bg-gray-100 px-6 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all"
            >
              🔄 Re-Shoot
            </button>
            <button
              onClick={downloadStrip}
              className="w-full md:w-auto bg-yellow-500 text-black hover:bg-yellow-400 px-6 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all"
            >
              📥 Download Photo
            </button>
          </div>

          {/* Canvas strip - appears on top in mobile, left in md+ */}
          <div className="w-full max-w-[260px] sm:max-w-[300px] md:max-w-[330px] aspect-[3/5]">
            <canvas
              ref={stripCanvasRef}
              className="w-full h-auto rounded-xl shadow-lg border border-gray-300"
            />
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
