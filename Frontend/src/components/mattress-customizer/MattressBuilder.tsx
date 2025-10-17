import React, { useEffect, useState } from 'react';
import { MATERIALS } from '../../lib/materials';
import Mattress3DView from './Mattress3DView';
import MaterialSelector from './MaterialSelector';
import PriceBreakdown from './PriceBreakdown';
import { calculateMattressPrice, MattressLayer, PriceCalculationResponse } from '../../lib/api';

const defaultLayer = (id = 'foam', thickness_mm = 50): MattressLayer => ({ materialId: id, thickness_mm });

export default function MattressBuilder() {
  const [lengthCm, setLengthCm] = useState<number>(200);
  const [widthCm, setWidthCm] = useState<number>(150);
  const [layers, setLayers] = useState<MattressLayer[]>([
    defaultLayer('memory', 40), 
    defaultLayer('foam', 60)
  ]);
  const [priceData, setPriceData] = useState<PriceCalculationResponse | null>(null);
  const [loadingPrice, setLoadingPrice] = useState<boolean>(false);

  // Add layer
  const addLayer = () => setLayers(prev => [...prev, defaultLayer('foam', 50)]);

  // Remove a layer by index
  const removeLayer = (idx: number) => setLayers(prev => prev.filter((_, i) => i !== idx));

  // Update layer
  const updateLayer = (idx: number, patch: Partial<MattressLayer>) => {
    setLayers(prev => prev.map((l, i) => i === idx ? { ...l, ...patch } : l));
  };

  const calculatePrice = async () => {
    setLoadingPrice(true);
    try {
      const data = await calculateMattressPrice({
        length_cm: lengthCm,
        width_cm: widthCm,
        layers,
      });
      setPriceData(data);
    } catch (err) {
      console.error(err);
      alert('Price calculation failed. Is the server running?');
    } finally {
      setLoadingPrice(false);
    }
  };

  // auto calculate when layers change (with debounce)
  useEffect(() => {
    const t = setTimeout(() => calculatePrice(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers, lengthCm, widthCm]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Dimensions Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
              <input 
                type="number" 
                value={lengthCm} 
                onChange={e => setLengthCm(Number(e.target.value))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
              <input 
                type="number" 
                value={widthCm} 
                onChange={e => setWidthCm(Number(e.target.value))} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Layers Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Layers</h3>
          <div className="space-y-3">
            {layers.map((layer, idx) => {
              const mat = MATERIALS.find(m => m.id === layer.materialId);
              return (
                <div className="flex items-center space-x-2" key={idx}>
                  <div 
                    className="w-6 h-6 rounded-full" 
                    style={{ background: mat ? mat.color : '#999' }} 
                    title={mat ? mat.name : ''} 
                  />
                  <div className="flex-grow">
                    <MaterialSelector
                      value={layer.materialId}
                      onChange={(matId) => updateLayer(idx, { materialId: matId })}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={layer.thickness_mm}
                      onChange={e => updateLayer(idx, { thickness_mm: Number(e.target.value) })}
                      className="w-16 px-2 py-1 border border-gray-300 rounded-md"
                    />
                    <span className="ml-1 text-sm text-gray-500">mm</span>
                  </div>
                  <button 
                    onClick={() => removeLayer(idx)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 mt-4">
              <button 
                onClick={addLayer}
                className="flex-1 px-4 py-3 bg-green-600 text-blue font-bold rounded-md bg-green-700 transition-colors duration-200 text-sm shadow-lg"
              >
                + Add Layer
              </button>
              <button 
                onClick={calculatePrice} 
                disabled={loadingPrice}
                className="flex-1 px-4 py-2 bg-blue text-black font-bold rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm disabled:opacity-50 shadow-lg"
              >
                {loadingPrice ? 'Calculating...' : 'Recalculate'}
              </button>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <PriceBreakdown data={priceData} />
      </div>

      {/* 3D View Section */}
      <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-md overflow-hidden" style={{ height: '500px' }}>
        <Mattress3DView
          lengthCm={lengthCm}
          widthCm={widthCm}
          layers={layers}
          materials={MATERIALS}
        />
      </div>
    </div>
  );
}
