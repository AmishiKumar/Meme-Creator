
import { useRef } from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextElement } from '@/types/meme';
import { toast } from 'sonner';

interface ActionButtonsProps {
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  backgroundMedia: string | null;
  textElements: TextElement[];
}

export const ActionButtons = ({ backgroundMedia, textElements }: ActionButtonsProps) => {
  const downloadCanvasRef = useRef<HTMLCanvasElement>(null);

  const generateMemeCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      canvas.width = 800;
      canvas.height = 800;

      const drawMeme = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        if (backgroundMedia) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            drawTexts();
            resolve(canvas);
          };
          img.src = backgroundMedia;
        } else {
          // Default gradient background
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          drawTexts();
          resolve(canvas);
        }
      };

      const drawTexts = () => {
        textElements.forEach((textElement) => {
          const x = (textElement.x / 100) * canvas.width;
          const y = (textElement.y / 100) * canvas.height;

          ctx.font = `${textElement.fontSize * 2}px ${textElement.fontFamily}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          // Draw stroke
          if (textElement.strokeWidth > 0) {
            ctx.strokeStyle = textElement.strokeColor;
            ctx.lineWidth = textElement.strokeWidth * 4;
            ctx.strokeText(textElement.text, x, y);
          }

          // Draw fill
          ctx.fillStyle = textElement.color;
          ctx.fillText(textElement.text, x, y);
        });
      };

      drawMeme();
    });
  };

  const handleDownload = async () => {
    try {
      const canvas = await generateMemeCanvas();
      const link = document.createElement('a');
      link.download = 'my-awesome-meme.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success('🎉 Meme downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download meme');
    }
  };

  const handleShare = async () => {
    try {
      const canvas = await generateMemeCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Failed to create blob');

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'meme.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Check out my meme!',
              text: 'Made with Meme Creator',
              files: [file]
            });
            toast.success('🚀 Meme shared successfully!');
            return;
          }
        }

        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          toast.success('📋 Meme copied to clipboard!');
        } catch {
          // Final fallback: download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'meme.png';
          link.click();
          URL.revokeObjectURL(url);
          toast.success('📥 Meme downloaded as fallback!');
        }
      }, 'image/png');
    } catch (error) {
      toast.error('Failed to share meme');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Share Your Creation</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleDownload}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Meme
        </Button>

        <Button
          onClick={handleShare}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Share Now
        </Button>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border border-yellow-200">
        <p className="text-center text-sm text-yellow-800 font-medium">
          🔥 Your meme is ready to go viral!
        </p>
      </div>
    </div>
  );
};
