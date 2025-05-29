
import { useState } from 'react';
import { Header } from '@/components/Header';
import { TemplateSelector } from '@/components/TemplateSelector';
import { MediaUpload } from '@/components/MediaUpload';
import { TextCustomizer } from '@/components/TextCustomizer';
import { MemeCanvas } from '@/components/MemeCanvas';
import { ActionButtons } from '@/components/ActionButtons';
import { TextElement } from '@/types/meme';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      text: 'TOP TEXT',
      x: 50,
      y: 20,
      fontSize: 32,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 2
    },
    {
      id: '2',
      text: 'BOTTOM TEXT',
      x: 50,
      y: 80,
      fontSize: 32,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 2
    }
  ]);
  const [selectedTextId, setSelectedTextId] = useState<string>('1');

  const addTextElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'NEW TEXT',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 2
    };
    setTextElements([...textElements, newElement]);
    setSelectedTextId(newElement.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteTextElement = (id: string) => {
    if (textElements.length > 1) {
      setTextElements(textElements.filter(el => el.id !== id));
      if (selectedTextId === id) {
        setSelectedTextId(textElements.find(el => el.id !== id)?.id || '');
      }
    }
  };

  const selectedText = textElements.find(el => el.id === selectedTextId);
  const backgroundMedia = uploadedMedia || selectedTemplate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onTemplateSelect={setSelectedTemplate}
            />
            
            <MediaUpload 
              onMediaUpload={setUploadedMedia}
            />
            
            <TextCustomizer
              textElements={textElements}
              selectedTextId={selectedTextId}
              onSelectText={setSelectedTextId}
              onUpdateText={updateTextElement}
              onAddText={addTextElement}
              onDeleteText={deleteTextElement}
            />
          </div>

          {/* Right Panel - Preview and Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                <h3 className="text-lg font-bold text-gray-700 ml-2">🎭 Live Preview</h3>
              </div>
              
              <MemeCanvas
                backgroundMedia={backgroundMedia}
                textElements={textElements}
                selectedTextId={selectedTextId}
                onSelectText={setSelectedTextId}
                onUpdateTextPosition={updateTextElement}
              />
            </div>

            <ActionButtons 
              canvasRef={null}
              backgroundMedia={backgroundMedia}
              textElements={textElements}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
