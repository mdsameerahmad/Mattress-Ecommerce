import React, { useState, useEffect, useRef } from 'react';
import { PriceCalculationResponse } from '../../lib/api';

interface PriceBreakdownProps {
  data: PriceCalculationResponse | null;
}

// Format number with thousands separator
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

// Calculate percentage of total
const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value / total) * 100);
};

export default function PriceBreakdown({ data }: PriceBreakdownProps) {
  const [showLayerDetails, setShowLayerDetails] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [animateIn, setAnimateIn] = useState(false);
  const prevTotalRef = useRef(0);
  
  // Animate the total price when it changes
  useEffect(() => {
    if (!data) return;
    
    const targetTotal = data.total;
    const startTotal = prevTotalRef.current;
    const difference = targetTotal - startTotal;
    const duration = 800; // ms
    const startTime = performance.now();
    
    const animateTotal = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
      
      const currentTotal = startTotal + difference * easeProgress;
      setAnimatedTotal(Math.floor(currentTotal));
      
      if (progress < 1) {
        requestAnimationFrame(animateTotal);
      } else {
        prevTotalRef.current = targetTotal;
      }
    };
    
    requestAnimationFrame(animateTotal);
  }, [data?.total]);
  
  // Trigger animation when component mounts
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  if (!data) {
    return (
      <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-center p-6 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <p className="font-medium">No price data available on Demo Mode</p>
            <p className="text-sm">Customize your mattress to see pricing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Total price highlight */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Total Price</span>
          <span className="text-2xl font-bold">₹{formatNumber(animatedTotal)}</span>
        </div>
        <div className="text-xs mt-1 opacity-80">Includes all taxes and charges</div>
      </div>
      
      {/* Price components list */}
      <div className="p-4">
        <div className="space-y-3 mb-4">
          {[
            { label: 'Materials', value: data.materialsCost, color: '#4f46e5' },
            { label: 'Labor', value: data.labor, color: '#8b5cf6' },
            { label: 'Margin', value: data.margin, color: '#ec4899' },
            { label: 'Tax', value: data.tax, color: '#f59e0b' }
          ].map((item, idx) => {
            const percentage = calculatePercentage(item.value, data.total);
            return (
              <div key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <span className="font-medium">₹{formatNumber(item.value)}</span>
              </div>
            );
          })}
        </div>
        
        {/* Visual price breakdown */}
        <div className="flex h-6 rounded-full overflow-hidden mb-4">
          {[
            { value: data.materialsCost, color: '#4f46e5' },
            { value: data.labor, color: '#8b5cf6' },
            { value: data.margin, color: '#ec4899' },
            { value: data.tax, color: '#f59e0b' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="transition-all duration-500" 
              style={{ 
                width: `${calculatePercentage(item.value, data.total)}%`,
                backgroundColor: item.color
              }}
            />
          ))}
        </div>
      
        {/* Layer details section */}
        <div className="mt-2">
          <button
            onClick={() => setShowLayerDetails(!showLayerDetails)}
            className="flex items-center justify-between w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <span className="font-medium text-gray-700">Selected Materials</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transform transition-transform ${showLayerDetails ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showLayerDetails && (
            <div className="mt-3 space-y-3 bg-white border border-gray-100 p-3 rounded-md shadow-sm">
              {data.layers.map((layer, idx) => {
                const layerPercentage = calculatePercentage(layer.cost, data.materialsCost);
                return (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800">{layer.materialName}</span>
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Layer {idx + 1}
                        </span>
                      </div>
                      <span className="font-medium text-blue-600">₹{formatNumber(layer.cost)}</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{layer.thickness_mm}mm</span>
                      <span>{layerPercentage}% of materials cost</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${layerPercentage}%`,
                          backgroundColor: idx % 2 === 0 ? '#4f46e5' : '#8b5cf6'
                        }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        <span>Volume: {layer.volume_m3}m³</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        <span>Weight: {layer.mass_kg}kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}