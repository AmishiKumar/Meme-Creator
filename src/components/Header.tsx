
import { Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-6 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tight">Meme Creator</h1>
            <p className="text-purple-100 mt-1">Create amazing memes with custom fonts, colors, and media uploads</p>
          </div>
        </div>
      </div>
    </header>
  );
};
