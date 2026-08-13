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

// 🎵 Real Camera Shutter Sound
const playCameraSound = () => {
  try {
    const audio = new Audio('/shutter.mp3');
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  } catch (e) {
    console.error("Audio API not supported", e);
  }
};

export default function PhotoBoothApp() {
  // stream state removed
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterType>("2000s");
  const [showPhotoStrip, setShowPhotoStrip] = useState(false);
  const [facingMode, setFacingMode] = useState<"front" | "rear">("front");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [totalPhotosCount, setTotalPhotosCount] = useState<number>(3);
  const [layoutStyle, setLayoutStyle] = useState<"strip" | "grid">("strip");

  const handleCountChange = (num: number) => {
    setTotalPhotosCount(num);
    if (num === 1 || num === 3) setLayoutStyle("strip");
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stripCanvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ Get Camera Function
  const getCamera = useCallback(async () => {
    try {
      setCameraError(null);
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode === "front" ? "user" : "environment",
        },
        audio: false,
      });

      // setStream(mediaStream); removed

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access error:", err);
      let errorMsg = "Please allow camera permission in your browser to use the PhotoBooth.";
      if (err instanceof Error || (err && typeof err === 'object' && 'name' in err)) {
        const errName = (err as Error).name;
        if (errName === 'NotAllowedError') {
          errorMsg = "Permission denied. Please click the 🔒 lock icon in your browser's address bar to allow camera access.";
        } else if (errName === 'NotFoundError') {
          errorMsg = "No camera device found on your system. Please connect a camera.";
        } else if (errName === 'NotReadableError') {
          errorMsg = "Camera is already in use by another app or browser tab. Please close it first.";
        }
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  }, [facingMode]);

  useEffect(() => {
    const videoElement = videoRef.current;
    return () => {
      if (videoElement && videoElement.srcObject) {
        const oldStream = videoElement.srcObject as MediaStream;
        oldStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    if (isCapturing || capturedPhotos.length >= totalPhotosCount) return;
    setIsCapturing(true);

    const steps = [
      { text: "Ready?", delay: 1000 },
      { text: "Smile!", delay: 800 }
    ];
    
    for (const step of steps) {
      setCountdown(step.text);
      await new Promise((r) => setTimeout(r, step.delay));
    }
    
    // Play shutter sound & hide text right before capturing
    playCameraSound();
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

        const dataUrl = canvasRef.current.toDataURL("image/png");
        setCapturedPhotos((prev) => [
          ...prev,
          { dataUrl, timestamp: Date.now() },
        ]);

        if (capturedPhotos.length + 1 === totalPhotosCount) {
          setTimeout(() => setShowPhotoStrip(true), 500);
        }
      }
    }

    setIsCapturing(false);
  };

  // 🎞️ Render final strip
  useEffect(() => {
    if (
      !showPhotoStrip ||
      capturedPhotos.length !== totalPhotosCount ||
      !stripCanvasRef.current
    )
      return;

    const canvas = stripCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw photos properly without stretching
    const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      const imgRatio = img.width / img.height;
      const targetRatio = w / h;
      let sx, sy, sw, sh;
      
      if (imgRatio > targetRatio) {
        sh = img.height;
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
        sy = 0;
      } else {
        sw = img.width;
        sh = img.width / targetRatio;
        sx = 0;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
    };

    // High resolution constants (Match standard 4:3 camera aspect ratio to avoid aggressive cropping)
    const scale = layoutStyle === "strip" ? 2 : 1; // Double resolution for strip to prevent small download appearance
    const MARGIN = 40 * scale;
    const SPACING = 30 * scale;
    const PHOTO_W = 800 * scale;
    const PHOTO_H = 600 * scale; // 4:3 aspect ratio
    const FOOTER_HEIGHT = 120 * scale;
    
    let STRIP_WIDTH = 0;
    let STRIP_HEIGHT = 0;
    const photoPositions: {x: number, y: number}[] = [];

    if (layoutStyle === "grid" && (totalPhotosCount === 4 || totalPhotosCount === 2)) {
      if (totalPhotosCount === 4) {
        // 2x2 Grid
        STRIP_WIDTH = MARGIN * 2 + PHOTO_W * 2 + SPACING;
        STRIP_HEIGHT = MARGIN * 2 + PHOTO_H * 2 + SPACING + FOOTER_HEIGHT;
        photoPositions.push({x: MARGIN, y: MARGIN});
        photoPositions.push({x: MARGIN + PHOTO_W + SPACING, y: MARGIN});
        photoPositions.push({x: MARGIN, y: MARGIN + PHOTO_H + SPACING});
        photoPositions.push({x: MARGIN + PHOTO_W + SPACING, y: MARGIN + PHOTO_H + SPACING});
      } else {
        // 2x1 Horizontal Grid
        STRIP_WIDTH = MARGIN * 2 + PHOTO_W * 2 + SPACING;
        STRIP_HEIGHT = MARGIN * 2 + PHOTO_H + FOOTER_HEIGHT;
        photoPositions.push({x: MARGIN, y: MARGIN});
        photoPositions.push({x: MARGIN + PHOTO_W + SPACING, y: MARGIN});
      }
    } else {
      // Vertical Strip
      STRIP_WIDTH = MARGIN * 2 + PHOTO_W;
      STRIP_HEIGHT = MARGIN * 2 + (PHOTO_H * totalPhotosCount) + (SPACING * Math.max(0, totalPhotosCount - 1)) + FOOTER_HEIGHT;
      for (let i = 0; i < totalPhotosCount; i++) {
        photoPositions.push({ x: MARGIN, y: MARGIN + i * (PHOTO_H + SPACING) });
      }
    }

    canvas.width = STRIP_WIDTH;
    canvas.height = STRIP_HEIGHT;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, STRIP_HEIGHT);
    bg.addColorStop(0, "#ffffff");
    bg.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

    // Border
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 4 * scale;
    ctx.strokeRect(2 * scale, 2 * scale, STRIP_WIDTH - (4 * scale), STRIP_HEIGHT - (4 * scale));

    // Draw all photos
    let imagesLoaded = 0;
    const totalImages = capturedPhotos.length;

    capturedPhotos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const pos = photoPositions[index];
        if (!pos) return;

        // Draw white photo frame
        ctx.shadowColor = "rgba(0,0,0,0.12)";
        ctx.shadowBlur = 15 * scale;
        ctx.shadowOffsetX = 4 * scale;
        ctx.shadowOffsetY = 8 * scale;
        ctx.fillStyle = "#fff";
        ctx.fillRect(pos.x - (10 * scale), pos.y - (10 * scale), PHOTO_W + (20 * scale), PHOTO_H + (20 * scale));

        // Draw photo with object-cover scaling (NO STRETCHING)
        ctx.shadowColor = "transparent";
        drawImageCover(ctx, img, pos.x, pos.y, PHOTO_W, PHOTO_H);

        // Add inner border to photo
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2 * scale;
        ctx.strokeRect(pos.x, pos.y, PHOTO_W, PHOTO_H);

        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          // Footer text
          ctx.fillStyle = "#334155";
          ctx.font = `italic bold ${42 * scale}px Georgia, serif`;
          ctx.textAlign = "center";
          
          const currentDate = new Date().toLocaleDateString("en-US", {
            day: "numeric", month: "long", year: "numeric",
          });

          ctx.fillText(
            `📸 Photobooth • ${currentDate}`,
            STRIP_WIDTH / 2,
            STRIP_HEIGHT - (45 * scale)
          );
        }
      };
      img.src = photo.dataUrl;
    });
  }, [capturedPhotos, showPhotoStrip, layoutStyle, totalPhotosCount]);

  const downloadStrip = () => {
    if (!stripCanvasRef.current) return;
    const link = document.createElement("a");
    link.href = stripCanvasRef.current.toDataURL("image/png");
    link.download = "photo-booth.png";
    link.click();
  };

  const reset = async () => {
    setCapturedPhotos([]);
    setShowPhotoStrip(false);
    setIsCameraActive(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center pb-0 min-h-0">
      {!showPhotoStrip ? (
        <div className="w-full flex-1 flex flex-col gap-2 md:gap-4 justify-between min-h-0 max-w-6xl mx-auto px-2 md:px-8">
          {/* 📸 Camera Preview (Responsive constraints) */}
          <div className="relative w-full shrink min-h-0 h-full max-h-[55vh] md:max-h-[65vh] mx-auto overflow-hidden rounded-2xl bg-black border border-base-200 shadow-lg flex items-center justify-center group">
            {!isCameraActive && !cameraError ? (
              <div className="absolute inset-0 bg-base-300 flex flex-col items-center justify-center p-6 text-center z-30">
                <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
                  <FaCamera className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2 tracking-tight">Ready to Snap?</h3>
                <p className="text-base-content/70 mb-8 max-w-sm">
                  We need your permission to use the camera for the PhotoBooth.
                </p>
                <button 
                  onClick={() => {
                    setIsCameraActive(true);
                    getCamera();
                  }} 
                  className="btn btn-primary rounded-full px-10 h-12 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  Enable Camera
                </button>
              </div>
            ) : cameraError ? (
              <div className="absolute inset-0 bg-base-300 flex flex-col items-center justify-center p-6 text-center z-30">
                <div className="w-16 h-16 rounded-full bg-error/20 text-error flex items-center justify-center mb-4">
                  <FaCamera className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
                <p className="text-base-content/70">{cameraError}</p>
                <button 
                  onClick={getCamera} 
                  className="btn btn-outline btn-sm mt-6 rounded-full px-6"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
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
                  <div className="absolute inset-0 bg-base-100/30 backdrop-blur-sm flex items-center justify-center z-10 transition-all duration-300">
                    <span className="text-base-content text-5xl md:text-6xl font-bold tracking-tight drop-shadow-xl animate-pulse">
                      {countdown}
                    </span>
                  </div>
                )}
                {capturedPhotos.length > 0 && (
                  <span className="absolute top-4 right-4 bg-base-content text-base-100 px-3 py-1 rounded-full text-xs font-semibold tracking-widest z-10 shadow-lg">
                    {capturedPhotos.length} / {totalPhotosCount}
                  </span>
                )}



                {/* 📸 Capture + Switch Buttons Overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 z-20">
                  <button
                    onClick={handleCapture}
                    disabled={isCapturing || capturedPhotos.length >= totalPhotosCount}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/90 backdrop-blur-md hover:bg-primary text-primary-content shadow-[0_0_15px_rgba(0,0,0,0.3)] disabled:opacity-50 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border-2 border-white/20"
                    title="Click Photo"
                  >
                    <FaCamera className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setFacingMode((prev) => (prev === "front" ? "rear" : "front"))
                    }
                    className="w-10 h-10 rounded-full bg-base-300/60 backdrop-blur-md hover:bg-base-300/90 text-white shadow-[0_0_10px_rgba(0,0,0,0.2)] flex items-center justify-center transition-colors border border-white/10"
                    title="Switch camera"
                    aria-label="Switch camera"
                  >
                    <MdOutlineCameraswitch className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ⚙️ Options & 🎨 Filters */}
          <div className="flex flex-col gap-3 w-full shrink-0">
            {/* Number of Photos & Layout Selector */}
            <div className="flex items-center justify-center sm:justify-start gap-4 px-2 flex-wrap">
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-base-content/80">Grid size:</span>
                <div className="flex gap-1 bg-base-200/60 p-1 rounded-full border border-base-200">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleCountChange(num)}
                      disabled={capturedPhotos.length > 0}
                      className={`w-8 h-8 rounded-full text-sm font-bold transition-all flex items-center justify-center ${
                        totalPhotosCount === num
                          ? "bg-base-content text-base-100 shadow-md"
                          : "text-base-content/70 hover:bg-base-300"
                      } ${capturedPhotos.length > 0 ? "opacity-30 cursor-not-allowed" : ""}`}
                      title={`${num} Photos`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 🎨 Filters (Fixed height) */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1 w-full">
              {FILTERS.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => setCurrentFilter(filter.name)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    currentFilter === filter.name
                      ? "bg-base-content text-base-100 shadow-md scale-105"
                      : "bg-base-200 hover:bg-base-300 text-base-content/70"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // 🎞️ Photo Strip Section
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 w-full max-w-6xl flex-1 px-2 md:px-8 py-2 min-h-0">
          
          {/* Canvas container constrained by height to prevent scroll */}
          <div className="w-full flex-1 flex justify-center items-center min-h-0 h-full max-h-[55vh] md:max-h-full">
            <canvas
              ref={stripCanvasRef}
              className="max-w-full max-h-full object-contain rounded-md shadow-2xl border-4 border-white bg-white transition-transform duration-500 ease-in-out hover:scale-[1.01]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full md:w-80 shrink-0 z-10 bg-base-100/80 backdrop-blur-sm md:bg-transparent p-2 md:p-0 rounded-2xl md:rounded-none">
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-0 text-center md:text-left text-primary">Looking good!</h3>
            <p className="text-sm text-base-content/70 font-light mb-2 md:mb-4 text-center md:text-left">Your photo is ready to be saved and shared.</p>
            
            {/* Layout Style Toggle (Show on final screen for dynamic changing) */}
            {(totalPhotosCount === 2 || totalPhotosCount === 4) && (
              <div className="mb-2 w-full bg-base-200/50 p-2 md:p-3 rounded-2xl border border-base-300 shadow-sm">
                <p className="text-xs font-semibold text-base-content/80 mb-2 text-center">Choose Layout Style</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setLayoutStyle("strip")}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      layoutStyle === "strip"
                        ? "bg-primary text-primary-content shadow-md scale-105"
                        : "bg-base-100 text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    <div className="w-4 h-6 flex flex-col gap-0.5">
                      <div className="flex-1 bg-current rounded-[2px] opacity-50"></div>
                      <div className="flex-1 bg-current rounded-[2px] opacity-50"></div>
                    </div>
                    Vertical Strip
                  </button>
                  <button
                    onClick={() => setLayoutStyle("grid")}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                      layoutStyle === "grid"
                        ? "bg-primary text-primary-content shadow-md scale-105"
                        : "bg-base-100 text-base-content/70 hover:bg-base-200"
                    }`}
                  >
                    <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                      <div className="bg-current rounded-[2px] opacity-50"></div>
                      <div className="bg-current rounded-[2px] opacity-50"></div>
                      <div className="bg-current rounded-[2px] opacity-50"></div>
                      <div className="bg-current rounded-[2px] opacity-50"></div>
                    </div>
                    Grid Style
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={downloadStrip}
              className="btn btn-primary rounded-full w-full h-12 md:h-14 text-base md:text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Download Photo
            </button>
            <button
              onClick={reset}
              className="btn btn-outline rounded-full w-full h-12 md:h-14 text-base md:text-lg font-medium hover:bg-base-content hover:text-base-100 transition-all"
            >
              Retake Photos
            </button>
          </div>

        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
