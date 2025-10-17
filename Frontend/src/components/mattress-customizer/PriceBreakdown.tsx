import React from 'react';
import { PriceCalculationResponse } from '../../lib/api';

interface PriceBreakdownProps {
  data: PriceCalculationResponse | null;
}

export default function PriceBreakdown({ data }: PriceBreakdownProps) {
  if (!data) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Price</h3>
        <p className="text-gray-500">No quote yet — change layers to auto-calculate</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Price Breakdown</h3>
      
      <div className="flex justify-between py-1"><span>Materials</span><strong>₹{data.materialsCost}</strong></div>
      <div className="flex justify-between py-1"><span>Labor</span><strong>₹{data.labor}</strong></div>
      <div className="flex justify-between py-1"><span>Margin</span><strong>₹{data.margin}</strong></div>
      <div className="flex justify-between py-1"><span>Tax</span><strong>₹{data.tax}</strong></div>
      
      <div className="border-t border-gray-200 my-2"></div>
      
      <div className="flex justify-between py-2 font-bold">
        <span>Total</span>
        <strong>₹{data.total}</strong>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-blue-600">Layer details</summary>
        <div className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
          {data.layers.map((layer, idx) => (
            <div key={idx} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
              <div><strong>{layer.materialName}</strong> ({layer.thickness_mm}mm)</div>
              <div className="text-gray-500">Volume: {layer.volume_m3}m³ | Weight: {layer.mass_kg}kg</div>
              <div className="text-right">Cost: ₹{layer.cost}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}