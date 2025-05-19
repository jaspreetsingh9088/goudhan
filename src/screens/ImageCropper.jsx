import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
// import Slider from "@mui/material/Slider";
import { getCroppedImg } from "./cropImageUtils"; // utility to get the blob

export default function ImageCropper({ image, onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="relative w-[90vw] h-[60vh] bg-white rounded-lg shadow-lg p-4">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onCropComplete={handleCropComplete}
          onZoomChange={setZoom}
        />
        <div className="mt-4">
          {/* <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, z) => setZoom(z)} /> */}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          <button onClick={handleDone} className="bg-green-600 text-white px-4 py-2 rounded">Crop</button>
        </div>
      </div>
    </div>
  );
}
