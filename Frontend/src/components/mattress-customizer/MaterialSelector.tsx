import React from 'react';
import MATERIALS from '../../lib/materials';

interface MaterialSelectorProps {
  value: string;
  onChange: (materialId: string) => void;
}

export default function MaterialSelector({ value, onChange }: MaterialSelectorProps) {
  const selectedMaterial = MATERIALS.find(m => m.id === value);

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-2">
        {selectedMaterial && (
          <img 
            src={selectedMaterial.texture} 
            alt={selectedMaterial.name}
            className="w-6 h-6 object-cover rounded-sm border border-gray-300"
          />
        )}
        <select 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="p-2 border rounded-md w-full"
        >
          {MATERIALS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}