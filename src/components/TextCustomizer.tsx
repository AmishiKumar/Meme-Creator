
import { useState } from 'react';
import { Type, Plus, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TextElement } from '@/types/meme';

interface TextCustomizerProps {
  textElements: TextElement[];
  selectedTextId: string;
  onSelectText: (id: string) => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  onAddText: () => void;
  onDeleteText: (id: string) => void;
}

const FONT_FAMILIES = [
  'Arial Black',
  'Impact',
  'Times New Roman',
  'Helvetica',
  'Comic Sans MS',
  'Courier New'
];

const COLORS = [
  '#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', 
  '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3',
  '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
];

export const TextCustomizer = ({
  textElements,
  selectedTextId,
  onSelectText,
  onUpdateText,
  onAddText,
  onDeleteText
}: TextCustomizerProps) => {
  const selectedText = textElements.find(el => el.id === selectedTextId);

  if (!selectedText) return null;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
          <Type className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Customize Text</h3>
      </div>

      {/* Text Element Selector */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Text Elements</Label>
        <div className="flex gap-2 mb-3">
          {textElements.map((element) => (
            <Button
              key={element.id}
              variant={selectedTextId === element.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelectText(element.id)}
              className="text-xs"
            >
              Text {textElements.indexOf(element) + 1}
            </Button>
          ))}
          <Button
            onClick={onAddText}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <Plus className="w-3 h-3" />
          </Button>
          {textElements.length > 1 && (
            <Button
              onClick={() => onDeleteText(selectedTextId)}
              size="sm"
              variant="outline"
              className="text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Text Content</Label>
        <Input
          value={selectedText.text}
          onChange={(e) => onUpdateText(selectedTextId, { text: e.target.value })}
          placeholder="Enter your meme text..."
          className="w-full"
        />
      </div>

      {/* Font Family */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Font Style</Label>
        <Select
          value={selectedText.fontFamily}
          onValueChange={(value) => onUpdateText(selectedTextId, { fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Font Size: {selectedText.fontSize}px
        </Label>
        <Slider
          value={[selectedText.fontSize]}
          onValueChange={([value]) => onUpdateText(selectedTextId, { fontSize: value })}
          min={12}
          max={72}
          step={2}
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Text Color</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                selectedText.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onUpdateText(selectedTextId, { color })}
            />
          ))}
        </div>
      </div>

      {/* Stroke Color */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">Stroke Color</Label>
        <div className="grid grid-cols-6 gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                selectedText.strokeColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onUpdateText(selectedTextId, { strokeColor: color })}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width */}
      <div className="mb-4">
        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
          Stroke Width: {selectedText.strokeWidth}px
        </Label>
        <Slider
          value={[selectedText.strokeWidth]}
          onValueChange={([value]) => onUpdateText(selectedTextId, { strokeWidth: value })}
          min={0}
          max={8}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
