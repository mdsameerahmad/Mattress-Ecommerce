import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Text, useTexture, RoundedBox, Environment, useHelper } from '@react-three/drei';
import { Material } from '../../lib/api';
import * as THREE from 'three';

// DimensionLines component for showing measurements in 3D view
interface DimensionLinesProps {
  length: number;
  width: number;
  height: number;
  displayLength: { value: number, unitLabel: string };
  displayWidth: { value: number, unitLabel: string };
}

function DimensionLines({ length, width, height, displayLength, displayWidth }: DimensionLinesProps) {
  const color = "#ffffff"; // Brighter color for better visibility
  const lineWidth = 2; // Thicker lines
  const offset = 0.15; // Increased offset from the mattress
  
  return (
    <>
      {/* Length dimension line */}
      <Line
        points={[
          [length/2 + offset, -height/2, 0],
          [length/2 + offset, -height/2, width]
        ]}
        color={color}
        lineWidth={lineWidth}
      />
      <Text
        position={[length/2 + offset, -height/2, width/2]}
        rotation={[0, 0, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        backgroundColor="#00000080"
        padding={0.05}
      >
        {`Length: ${displayLength.value.toFixed(0)} ${displayLength.unitLabel}`}
      </Text>
      
      {/* Width dimension line */}
      <Line
        points={[
          [0, -height/2, width/2 + offset],
          [length, -height/2, width/2 + offset]
        ]}
        color={color}
        lineWidth={lineWidth}
      />
      <Text
        position={[length/2, -height/2, width/2 + offset]}
        rotation={[0, Math.PI/2, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        backgroundColor="#00000080"
        padding={0.05}
      >
        {`Width: ${displayWidth.value.toFixed(0)} ${displayWidth.unitLabel}`}
      </Text>
      
      {/* Height dimension line */}
      <Line
        points={[
          [0 - offset, -height/2, 0],
          [0 - offset, height/2, 0]
        ]}
        color={color}
        lineWidth={lineWidth}
      />
      <Text
        position={[0 - offset, 0, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        backgroundColor="#00000080"
        padding={0.05}
      >
        {`Height: ${(displayLength.value * (height/length)).toFixed(0)} ${displayLength.unitLabel}`}
      </Text>
    </>
  );
}

interface LayerBoxProps {
  textureUrl: string | null;
  color: string;
  width: number;
  depth: number;
  height: number;
  positionY: number;
  isTopLayer?: boolean;
  isBottomLayer?: boolean;
}

function LayerBox({ textureUrl, color, width, depth, height, positionY, isTopLayer = false, isBottomLayer = false }: LayerBoxProps) {
  // Only try to load texture if we have a valid URL
  const hasValidTexture = textureUrl && textureUrl.trim() !== '';
  
  // Load texture conditionally to prevent errors
  const textures = hasValidTexture ? useTexture(textureUrl) : null;
  
  // Configure texture to repeat properly and prevent stretching
  React.useEffect(() => {
    if (hasValidTexture && textures && textures.image) {
      // Set texture to repeat
      textures.wrapS = textures.wrapT = THREE.RepeatWrapping;
      
      // Calculate repeat values based on dimensions to maintain aspect ratio
      // This ensures the texture pattern size remains consistent regardless of mattress dimensions
      const aspectRatio = width / depth;
      const repeatX = Math.max(1, Math.round(width * 2)); // Scale based on width
      const repeatY = Math.max(1, Math.round(depth * 2)); // Scale based on depth
      
      textures.repeat.set(repeatX, repeatY);
      
      // Ensure texture is properly loaded and updated
      textures.needsUpdate = true;
    }
  }, [textures, width, depth, hasValidTexture]);
  
  const materialProps = hasValidTexture && textures
    ? { 
        map: textures, 
        roughness: 0.7, 
        metalness: 0.1,
        // Add normal map for more texture detail
        normalScale: new THREE.Vector2(0.5, 0.5)
      } 
    : { color, roughness: 0.7, metalness: 0.1 };
  
  // Add subtle animation for a soft, fluffy appearance
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isTopLayer) {
      meshRef.current.position.y = positionY + Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
      
      // Add subtle breathing effect for top layer
      const breatheFactor = Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
      meshRef.current.scale.y = 1 + breatheFactor;
    }
  });

  // Use RoundedBox for a more realistic mattress appearance
  const radius = Math.min(width, depth, height) * 0.35; // 35% of smallest dimension for rounded corners
  
  return (
    <mesh ref={meshRef} position={[0, positionY, 0]} castShadow receiveShadow>
      <RoundedBox args={[width, height, depth]} radius={radius} smoothness={4}>
        <meshStandardMaterial 
          {...materialProps} 
          map-encoding={THREE.sRGBEncoding}
          side={THREE.DoubleSide} // Apply texture to both sides
          roughness={0.7}
          metalness={0.1}
        />
      </RoundedBox>
    </mesh>
  );
}

interface Layer {
  materialId: string;
  thickness_mm: number;
}

interface Mattress3DViewProps {
  lengthCm: number;
  widthCm: number;
  layers: Layer[];
  materials: Material[];
  unit?: 'cm' | 'inches' | 'feet';
  zoomLevel?: number; // 0-1 value for camera zoom
}

// Unit conversion functions
const convertToDisplayUnit = (valueInMeters: number, unit: string): { value: number, unitLabel: string } => {
  switch (unit) {
    case 'inches':
      return { value: valueInMeters * 39.37, unitLabel: 'in' };
    case 'feet':
      return { value: valueInMeters * 3.281, unitLabel: 'ft' };
    case 'cm':
    default:
      return { value: valueInMeters * 100, unitLabel: 'cm' };
  }
};

export default function Mattress3DView({ lengthCm, widthCm, layers, materials, unit = 'cm', zoomLevel = 0.5 }: Mattress3DViewProps) {
  // convert dimensions to meters
  const lengthM = Math.max(0.2, lengthCm / 100); // ensure not zero
  const widthM = Math.max(0.2, widthCm / 100);
  
  // Calculate camera distance based on zoom level (inverse relationship)
  // Maps 0-1 to 6.5-1.5
  const zoomCameraDistance = 5 * (1 - zoomLevel * 0.7) + 1.5; 

  // compute total height (meters) and per-layer heights
  const layersWithMeta = useMemo(() => {
    const list = layers.map((l) => {
      const mat = materials.find(m => m.id === l.materialId) || {};
      return {
        ...l,
        mat,
        height_m: Math.max(0.001, (l.thickness_mm || 1) / 1000),
        texture: (mat && mat.texture) || null,
        color: (mat && mat.color) || '#ddd'
      };
    });
    // compute cumulative Y positions (centered)
    const totalHeight = list.reduce((s, r) => s + r.height_m, 0);
    let y = -totalHeight / 2;
    const withPos = list.map((r, index) => {
      const centerY = y + r.height_m / 2;
      y += r.height_m;
      return { 
        ...r, 
        centerY,
        isTopLayer: index === list.length - 1,
        isBottomLayer: index === 0
      };
    });
    return { withPos, totalHeight };
  }, [layers, materials]);

  const { withPos, totalHeight } = layersWithMeta;

  // Determine if a cloth texture is selected
  const selectedClothTexture = useMemo(() => {
    const clothLayer = layers.find(layer => layer.materialId && layer.materialId.startsWith('d'));
    return clothLayer ? materials.find(m => m.id === clothLayer.materialId)?.texture : null;
  }, [layers, materials]);

  // Convert dimensions for display
  const displayLength = convertToDisplayUnit(lengthM, unit);
  const displayWidth = convertToDisplayUnit(widthM, unit);
  const displayHeight = convertToDisplayUnit(totalHeight, unit);

  // scale factor to keep model nicely visible
  const cameraDistance = Math.max(lengthM, widthM, totalHeight) * 2.5;

  return (
    <div className="w-full h-[500px] relative">
      <Canvas shadows camera={{ position: [0, 0.5, cameraDistance], fov: 50 }} gl={{ alpha: false }} style={{ background: '#111' }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        
        <Suspense fallback={<Html center>Loading 3D view...</Html>}>
          {/* Render each layer */}
          {withPos.map((layer, i) => (
            <LayerBox 
              key={i}
              textureUrl={layer.texture || selectedClothTexture}
              color={layer.color}
              width={lengthM}
              depth={widthM}
              height={layer.height_m}
              positionY={layer.centerY}
              isTopLayer={layer.isTopLayer}
              isBottomLayer={layer.isBottomLayer}
            />
          ))}
          
          {/* Dimension lines and labels */}
          <DimensionLines 
            length={lengthM} 
            width={widthM} 
            height={totalHeight} 
            displayLength={displayLength}
            displayWidth={displayWidth}
          />
          
          <Environment preset="night" />
        </Suspense>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={6}
          // Remove angle restrictions to allow viewing all parts
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}