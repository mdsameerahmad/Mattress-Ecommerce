import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Text, useTexture, RoundedBox, Environment, useHelper } from '@react-three/drei';
import { Material } from '../../lib/api';
import * as THREE from 'three';

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
  // Load texture with proper settings to prevent stretching
  const textures = useTexture(textureUrl ? textureUrl : '');
  
  // Configure texture to repeat properly and prevent stretching
  React.useEffect(() => {
    if (textures && textures.image) {
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
  }, [textures, width, depth]);
  
  const materialProps = textureUrl 
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
        <meshPhysicalMaterial 
          {...materialProps} 
          clearcoat={isTopLayer ? 0.3 : 0.1} 
          clearcoatRoughness={0.4}
          transmission={0.05} // Slight transparency for realism
          envMapIntensity={1.2} // Enhance reflections
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

export default function Mattress3DView({ lengthCm, widthCm, layers, materials, unit = 'cm' }: Mattress3DViewProps) {
  // convert dimensions to meters
  const lengthM = Math.max(0.2, lengthCm / 100); // ensure not zero
  const widthM = Math.max(0.2, widthCm / 100);

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
    <Canvas shadows camera={{ position: [cameraDistance, cameraDistance / 2, cameraDistance], fov: 45 }}>
      <color attach="background" args={['#1a1a2e']} />
      <fog attach="fog" args={['#1a1a2e', 8, 30]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.0} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-5, 5, 5]} intensity={0.5} castShadow angle={0.5} penumbra={0.8} />
      
      <Suspense fallback={<Html center>Loading textures...</Html>}>
        <group>
          {selectedClothTexture ? (
            // Render single mattress with cloth texture
            <LayerBox
              textureUrl={selectedClothTexture}
              color="#ffffff" // Color won't be used if texture is present
              width={lengthM}
              depth={widthM}
              height={totalHeight}
              positionY={0} // Center the single mattress
              isTopLayer={true}
              isBottomLayer={true}
            />
          ) : (
            // Render each layer with proper stacking
            withPos.map((layer, idx) => (
              <LayerBox
                key={idx}
                textureUrl={layer.texture}
                color={layer.color}
                width={lengthM}
                depth={widthM}
                height={layer.height_m}
                positionY={layer.centerY}
                isTopLayer={layer.isTopLayer}
                isBottomLayer={layer.isBottomLayer}
              />
            ))
          )}

          {/* Soft glow effect around mattress */}
          <mesh position={[0, 0, 0]}>
            <RoundedBox args={[lengthM + 0.03, totalHeight + 0.04, widthM + 0.03]} radius={0.05} smoothness={4}>
              <meshStandardMaterial color="#ffffff" transparent opacity={0.04} />
            </RoundedBox>
          </mesh>

          {/* Dimension Lines and Labels with unit conversion */}
          {/* Height */}
          <Line
            points={[[lengthM / 2 + 0.1, -totalHeight / 2, widthM / 2 + 0.1], [lengthM / 2 + 0.1, totalHeight / 2, widthM / 2 + 0.1]]}
            color="#4da6ff"
            lineWidth={2}
          />
          <Text
            position={[lengthM / 2 + 0.15, 0, widthM / 2 + 0.1]}
            fontSize={0.06}
            color="white"
            anchorX="left"
            anchorY="middle"
            backgroundColor="#00000066"
            padding={0.02}
            borderRadius={0.01}
          >
            Height: {displayHeight.value.toFixed(1)} {displayHeight.unitLabel}
          </Text>

          {/* Length */}
          <Line
            points={[[lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1], [-lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1]]}
            color="#4da6ff"
            lineWidth={2}
          />
          <Text
            position={[0, totalHeight / 2 + 0.15, widthM / 2 + 0.1]}
            fontSize={0.06}
            color="white"
            anchorX="center"
            anchorY="bottom"
            backgroundColor="#00000066"
            padding={0.02}
            borderRadius={0.01}
          >
            Length: {displayLength.value.toFixed(1)} {displayLength.unitLabel}
          </Text>

          {/* Width */}
          <Line
            points={[[lengthM / 2 + 0.1, totalHeight / 2 + 0.1, widthM / 2], [lengthM / 2 + 0.1, totalHeight / 2 + 0.1, -widthM / 2]]}
            color="#4da6ff"
            lineWidth={2}
          />
          <Text
            position={[lengthM / 2 + 0.15, totalHeight / 2 + 0.1, 0]}
            fontSize={0.06}
            color="white"
            anchorX="left"
            anchorY="middle"
            backgroundColor="#00000066"
            padding={0.02}
            borderRadius={0.01}
          >
            Width: {displayWidth.value.toFixed(1)} {displayWidth.unitLabel}
          </Text>
        </group>
        
        {/* Add environment for better reflections */}
        <Environment preset="sunset" />
      </Suspense>

      <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
    </Canvas>
  );
}