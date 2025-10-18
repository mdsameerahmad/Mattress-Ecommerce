// density in kg/m^3, price_per_kg in currency units
export interface Material {
  id: string;
  name: string;
  density: number;
  price_per_kg: number;
  texture: string;
  color: string;
}

export const MATERIALS: Material[] = [
  { id: 'foam', name: 'Polyurethane Foam', density: 30, price_per_kg: 120, texture: '/textures/foam.png', color: '#f3e6d9' },
  { id: 'memory', name: 'Memory Foam', density: 55, price_per_kg: 140, texture: '/textures/memory.png', color: '#d9eef6' },
  { id: 'latex', name: 'Natural Latex', density: 65, price_per_kg: 220, texture: '/textures/latex.png', color: '#fbf1c7' },
  { id: 'coir', name: 'Coir', density: 100, price_per_kg: 130, texture: '/textures/coir.png', color: '#b07a3a' },
  { id: 'coir2', name: 'Premium Coir', density: 110, price_per_kg: 500, texture: '/textures/Coir2.png', color: '#a06a2a' },
  { id: 'spring', name: 'Pocket Spring (approx)', density: 7850, price_per_kg: 500, texture: '/textures/spring.png', color: '#cfcfcf' },
  // for spring layers we approximate a metal slab visual (not actual springs)
  { id: 'd1', name: 'Cloth Texture 1', density: 10, price_per_kg: 50.0, texture: '/textures/d1.png', color: '#f0f0f0' },
  { id: 'd2', name: 'Cloth Texture 2', density: 10, price_per_kg: 50.0, texture: '/textures/d2.png', color: '#f0f0f0' },
  { id: 'd3', name: 'Cloth Texture 3', density: 10, price_per_kg: 50.0, texture: '/textures/d3.png', color: '#f0f0f0' },
  { id: 'd4', name: 'Cloth Texture 4', density: 10, price_per_kg: 50.0, texture: '/textures/d4.png', color: '#f0f0f0' },
  { id: 'd5', name: 'Cloth Texture 5', density: 10, price_per_kg: 50.0, texture: '/textures/d5.png', color: '#f0f0f0' },
  { id: 'd6', name: 'Cloth Texture 6', density: 10, price_per_kg: 100.0, texture: '/textures/d6.jpg', color: '#f0f0f0' },
  { id: 'd7', name: 'Cloth Texture 7', density: 10, price_per_kg: 100.0, texture: '/textures/d7.avif', color: '#f0f0f0' },
];
  
export default MATERIALS;