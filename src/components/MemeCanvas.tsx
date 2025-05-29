
import { useRef, useEffect, useState } from 'react';
import { TextElement } from '@/types/meme';

interface MemeCanvasProps {
  backgroundMedia: string | null;
  textElements: TextElement[];
  selectedTextId: string;
  onSelectText: (id: string) => void;
  onUpdateTextPosition: (id: string, updates: Partial<TextElement>) => void;
}

export const MemeCanvas = ({
  backgroundMedia,
  textElements,
  selectedTextId,
  onSelectText,
  onUpdateTextPosition
}: MemeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 500 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const size = Math.min(containerWidth, 500);
        setCanvasSize({ width: size, height: size });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (backgroundMedia) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTexts();
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
    }

    function drawTexts() {
      textElements.forEach((textElement) => {
        const x = (textElement.x / 100) * canvas.width;
        const y = (textElement.y / 100) * canvas.height;

        ctx.font = `${textElement.fontSize}px ${textElement.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw stroke
        if (textElement.strokeWidth > 0) {
          ctx.strokeStyle = textElement.strokeColor;
          ctx.lineWidth = textElement.strokeWidth * 2;
          ctx.strokeText(textElement.text, x, y);
        }

        // Draw fill
        ctx.fillStyle = textElement.color;
        ctx.fillText(textElement.text, x, y);

        // Draw selection indicator
        if (textElement.id === selectedTextId) {
          const metrics = ctx.measureText(textElement.text);
          const textWidth = metrics.width;
          const textHeight = textElement.fontSize;
          
          ctx.strokeStyle = '#FF6B6B';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.strokeRect(
            x - textWidth / 2 - 10,
            y - textHeight / 2 - 5,
            textWidth + 20,
            textHeight + 10
          );
          ctx.setLineDash([]);
        }
      });
    }
  }, [backgroundMedia, textElements, selectedTextId, canvasSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.offsetWidth) * 100;
    const y = ((e.clientY - rect.top) / canvas.offsetHeight) * 100;

    // Find clicked text element
    const clickedElement = textElements.find(element => {
      const elementX = element.x;
      const elementY = element.y;
      const distance = Math.sqrt((x - elementX) ** 2 + (y - elementY) ** 2);
      return distance < 10; // 10% tolerance
    });

    if (clickedElement) {
      onSelectText(clickedElement.id);
      setIsDragging(true);
      setDragStart({ x: x - clickedElement.x, y: y - clickedElement.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / canvas.offsetWidth) * 100;
    const y = ((e.clientY - rect.top) / canvas.offsetHeight) * 100;

    const newX = Math.max(5, Math.min(95, x - dragStart.x));
    const newY = Math.max(10, Math.min(90, y - dragStart.y));

    onUpdateTextPosition(selectedTextId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        className="w-full border-2 border-gray-200 rounded-2xl shadow-lg cursor-pointer bg-white"
        style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <p className="text-center text-sm text-gray-600 mt-3">
        🎯 Click and drag text to reposition • Click to select different text elements
      </p>
    </div>
  );
};
