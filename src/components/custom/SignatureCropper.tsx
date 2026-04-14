import React, { useState, useRef, useEffect, useCallback } from "react";
import { Crop, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SignatureCropperProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export default function SignatureCropper({
  imageSrc,
  open,
  onClose,
  onCropComplete,
}: SignatureCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const CANVAS_SIZE = 300;

  // 👇 vùng crop chữ ký (rectangle)
  const CROP_WIDTH = 240;
  const CROP_HEIGHT = 100;

  /* ================= CLAMP ================= */
  const clampOffset = useCallback(
    (newOffset: { x: number; y: number }, currentScale: number) => {
      const img = imageRef.current;
      if (!img) return newOffset;

      const drawW = img.width * currentScale;
      const drawH = img.height * currentScale;

      const maxOffsetX = Math.max(0, (drawW - CROP_WIDTH) / 2);
      const maxOffsetY = Math.max(0, (drawH - CROP_HEIGHT) / 2);

      return {
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newOffset.x)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newOffset.y)),
      };
    },
    [],
  );

  /* ================= LOAD IMAGE ================= */
  useEffect(() => {
    if (!imageSrc || !open) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);

      const scaleX = CROP_WIDTH / img.width;
      const scaleY = CROP_HEIGHT / img.height;

      setScale(Math.max(scaleX, scaleY));
      setOffset({ x: 0, y: 0 });
    };
    img.src = imageSrc;

    return () => setImageLoaded(false);
  }, [imageSrc, open]);

  /* ================= DRAW ================= */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = CANVAS_SIZE;
    const h = CANVAS_SIZE;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = cx - drawW / 2 + offset.x;
    const drawY = cy - drawH / 2 + offset.y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // overlay
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, h);

    // clear vùng crop
    ctx.clearRect(
      cx - CROP_WIDTH / 2,
      cy - CROP_HEIGHT / 2,
      CROP_WIDTH,
      CROP_HEIGHT,
    );

    // border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(
      cx - CROP_WIDTH / 2,
      cy - CROP_HEIGHT / 2,
      CROP_WIDTH,
      CROP_HEIGHT,
    );
  }, [scale, offset]);

  useEffect(() => {
    if (imageLoaded) draw();
  }, [imageLoaded, draw]);

  /* ================= DRAG ================= */
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = offset;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    setOffset(
      clampOffset(
        {
          x: offsetStart.current.x + dx,
          y: offsetStart.current.y + dy,
        },
        scale,
      ),
    );
  };

  const handlePointerUp = () => setDragging(false);

  /* ================= ZOOM ================= */
  const handleZoom = (delta: number) => {
    const img = imageRef.current;
    if (!img) return;

    const minScale = Math.max(CROP_WIDTH / img.width, CROP_HEIGHT / img.height);

    setScale((prev) => {
      const next = Math.max(minScale, Math.min(5, prev + delta));
      setOffset((o) => clampOffset(o, next));
      return next;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? -0.05 : 0.05);
  };

  const handleReset = () => {
    const img = imageRef.current;
    if (!img) return;

    setScale(Math.max(CROP_WIDTH / img.width, CROP_HEIGHT / img.height));
    setOffset({ x: 0, y: 0 });
  };

  /* ================= CROP ================= */
  const handleCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const outputWidth = 300;
    const outputHeight = 100;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = cx - drawW / 2 + offset.x;
    const drawY = cy - drawH / 2 + offset.y;

    const cropLeft = cx - CROP_WIDTH / 2;
    const cropTop = cy - CROP_HEIGHT / 2;

    const ratioX = outputWidth / CROP_WIDTH;
    const ratioY = outputHeight / CROP_HEIGHT;

    ctx.drawImage(
      img,
      (cropLeft - drawX) / scale,
      (cropTop - drawY) / scale,
      CROP_WIDTH / scale,
      CROP_HEIGHT / scale,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    canvas.toBlob((blob) => {
      if (!blob) return;
      onCropComplete(new File([blob], "signature.png", { type: "image/png" }));
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5" />
            Cắt chữ ký
          </DialogTitle>
          <DialogDescription>Kéo và zoom để căn chỉnh chữ ký</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="cursor-grab"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
          />
        </div>

        <div className="flex justify-center gap-2 py-2">
          <button onClick={() => handleZoom(-0.1)}>
            <ZoomOut />
          </button>
          <button onClick={() => handleZoom(0.1)}>
            <ZoomIn />
          </button>
          <button onClick={handleReset}>
            <RotateCcw />
          </button>
        </div>

        <DialogFooter className="p-4 flex gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-1 h-4 w-4" />
            Huỷ
          </Button>
          <Button onClick={handleCrop}>
            <Crop className="mr-1 h-4 w-4" />
            Cắt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
