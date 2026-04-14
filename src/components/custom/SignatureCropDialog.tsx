import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  image: string;
  onCropDone: (data: {
    original: File;
    resized: File;
  }) => void;
  onCancel: () => void;
}

export function SignatureCropDialog({ image, onCropDone, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async (
    width: number,
    height: number
  ): Promise<File | null> => {
    try {
      if (!croppedAreaPixels) return null;

      const img = new Image();
      img.src = image;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        width,
        height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) return resolve(null);
          resolve(new File([blob], "signature.png", { type: "image/png" }));
        }, "image/png");
      });
    } catch (err) {
      console.error("❌ Crop error:", err);
      return null;
    }
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels) {
      alert("Chưa chọn vùng crop");
      return;
    }

    try {
      setLoading(true);

      const original = await createCroppedImage(
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const resized = await createCroppedImage(300, 200);

      if (!original || !resized) {
        alert("Crop thất bại");
        return;
      }

      // 👉 GỌI CALLBACK NGAY (không await gì thêm)
      onCropDone({ original, resized });
    } catch (err) {
      console.error("❌ Crop error:", err);
      alert("Lỗi khi crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
      <div className="bg-white p-4 rounded-lg w-[400px]">
        <div className="relative w-full h-[300px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3 / 2}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={onCancel} variant="outline" disabled={loading}>
            Hủy
          </Button>
          <Button
            onClick={handleCrop}
            disabled={!croppedAreaPixels || loading}
          >
            {loading ? "Đang crop..." : "Crop"}
          </Button>
        </div>
      </div>
    </div>
  );
}