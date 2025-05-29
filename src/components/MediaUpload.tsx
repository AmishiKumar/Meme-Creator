
import { useState, useRef } from 'react';
import { Upload, Image, Film, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaUploadProps {
  onMediaUpload: (url: string) => void;
}

export const MediaUpload = ({ onMediaUpload }: MediaUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      const url = URL.createObjectURL(file);
      onMediaUpload(url);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Upload Media</h3>
      </div>

      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-purple-500 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Film className="w-6 h-6 text-green-600" />
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <FileImage className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Drop your image, GIF, or video here
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Supports JPG, PNG, GIF, MP4, WebM
            </p>
          </div>

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Browse Files
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,.gif"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};
