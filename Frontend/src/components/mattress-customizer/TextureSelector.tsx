import React from 'react';
import { CLOTH_TEXTURES } from '../../lib/materials';

interface TextureSelectorProps {
  selectedTextureId: string;
  onSelectTexture: (textureId: string) => void;
}

export default function TextureSelector({ selectedTextureId, onSelectTexture }: TextureSelectorProps) {
  const selectedTexture = CLOTH_TEXTURES.find(t => t.id === selectedTextureId);

  return (
    <div className="w-full">
      <div className="mb-2">
        {selectedTexture && (
          <div className="flex items-center space-x-2">
            <img 
              src={selectedTexture.texture} 
              alt={selectedTexture.name}
              className="w-8 h-8 object-cover rounded-sm border border-gray-300"
            />
            <span className="text-sm font-medium">{selectedTexture.name}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-2">
        {CLOTH_TEXTURES.map((texture) => (
          <div 
            key={texture.id}
            onClick={() => onSelectTexture(texture.id)}
            className={`cursor-pointer p-2 rounded-md transition-all ${
              selectedTextureId === texture.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <div className="flex flex-col items-center">
              <img 
                src={texture.texture} 
                alt={texture.name}
                className="w-5 h-5 object-cover rounded-md border border-gray-300 mb-1"
              />
              <span className="text-xs text-center line-clamp-1">{texture.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}