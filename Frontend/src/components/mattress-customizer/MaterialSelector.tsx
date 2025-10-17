import React from 'react';
import MATERIALS from '../../lib/materials';

interface MaterialSelectorProps {
  value: string;
  onChange: (materialId: string) => void;
  type?: 'all' | 'cloth' | 'layer';
}

export default function MaterialSelector({ value, onChange, type = 'all' }: MaterialSelectorProps) {
  const filteredMaterials = MATERIALS.filter(m => {
    if (type === 'all') return true;
    if (type === 'cloth') return m.id.startsWith('d');
    if (type === 'layer') return !m.id.startsWith('d');
    return true;
  });

  return (
    <div className="flex flex-col space-y-2">
      <p className="font-medium text-gray-700">Select {type === 'cloth' ? 'Cloth' : type === 'layer' ? 'Layer' : 'Material'}:</p>
      {/* adding a hidden scroll bar here */}
      <div className="flex flex-nowrap gap-3 overflow-x-auto overflow-y-hidden p-2">
        {filteredMaterials.map(material => (
          <button
            key={material.id}
            className={`flex flex-col items-center p-2 rounded-lg border transition-all duration-200 focus:outline-none ${
              value === material.id
                ? 'border-blue-500 ring-2 ring-blue-300'
                : 'border-gray-300 hover:ring-1 hover:ring-gray-400'
            }`}
            onClick={() => onChange(material.id)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden mb-1 shadow-sm"
              style={{ backgroundColor: material.color || '#fff' }}
            >
              <img
                src={material.texture}
                alt={material.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center w-16 truncate">{material.name}</span>
            <span className="text-xs font-medium text-gray-700 text-center w-16 truncate">{material.price_per_kg} $</span>
          </button>
        ))}

        {/* Optional "See more" tile */}
        <button className="flex flex-col items-center p-2 rounded-lg border border-dashed border-gray-400 text-gray-500 cursor-pointer">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1 bg-gray-100">
            ...
          </div>
          <span className="text-xs text-center w-16">More</span>
        </button>
      </div>
    </div>
  );
}
