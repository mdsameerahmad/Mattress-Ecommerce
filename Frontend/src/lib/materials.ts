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
  { id: 'foam', name: 'Polyurethane Foam', density: 30, price_per_kg: 0.6, texture: '/textures/foam.png', color: '#f3e6d9' },
  { id: 'memory', name: 'Memory Foam', density: 55, price_per_kg: 1.4, texture: '/textures/memory.png', color: '#d9eef6' },
  { id: 'latex', name: 'Natural Latex', density: 65, price_per_kg: 2.2, texture: '/textures/latex.png', color: '#fbf1c7' },
  { id: 'coir', name: 'Coir', density: 100, price_per_kg: 0.4, texture: '/textures/coir.png', color: '#b07a3a' },
  { id: 'coir2', name: 'Premium Coir', density: 110, price_per_kg: 0.5, texture: '/textures/Coir2.png', color: '#a06a2a' },
  // for spring layers we approximate a metal slab visual (not actual springs)
  { id: 'spring', name: 'Pocket Spring (approx)', density: 7850, price_per_kg: 0.5, texture: '/textures/spring.png', color: '#cfcfcf' },
  { id: 'd1', name: 'Cloth Texture 1', density: 10, price_per_kg: 5.0, texture: '/textures/d1.png', color: '#f0f0f0' },
  { id: 'd2', name: 'Cloth Texture 2', density: 10, price_per_kg: 5.0, texture: '/textures/d2.png', color: '#f0f0f0' },
  { id: 'd3', name: 'Cloth Texture 3', density: 10, price_per_kg: 5.0, texture: '/textures/d3.png', color: '#f0f0f0' },
  { id: 'd4', name: 'Cloth Texture 4', density: 10, price_per_kg: 5.0, texture: '/textures/d4.png', color: '#f0f0f0' }
];

export default MATERIALS;