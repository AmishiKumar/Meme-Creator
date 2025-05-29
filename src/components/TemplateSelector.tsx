
import { useState } from 'react';
import { Grid3X3, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  selectedTemplate: string | null;
  onTemplateSelect: (template: string) => void;
}

const MEME_TEMPLATES = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop'
  },
  {
    id: 'distracted',
    name: 'Distracted Boyfriend',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop'
  },
  {
    id: 'cat',
    name: 'Cute Cat',
    url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop'
  },
  {
    id: 'nature',
    name: 'Epic Mountain',
    url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop'
  },
  {
    id: 'matrix',
    name: 'Matrix Vibes',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop'
  }
];

export const TemplateSelector = ({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
          <Grid3X3 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Choose Template</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {MEME_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
              selectedTemplate === template.url 
                ? 'ring-4 ring-purple-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onTemplateSelect(template.url)}
          >
            <img
              src={template.url}
              alt={template.name}
              className="w-full h-24 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <span className="text-white text-xs font-semibold p-2">{template.name}</span>
            </div>
            {selectedTemplate === template.url && (
              <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
