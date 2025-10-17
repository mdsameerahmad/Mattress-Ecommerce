import React from 'react';
import MattressBuilder from '../components/mattress-customizer/MattressBuilder';

export default function CustomizeMattressPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Customize Your Mattress</h1>
      <p className="text-gray-600 mb-8">
        Design your perfect mattress by selecting materials and adjusting dimensions.
        Our 3D preview will show you exactly what you're creating.
      </p>
      
      <MattressBuilder />
    </div>
  );
}