import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Line, OrbitControls, Text, useTexture } from '@react-three/drei';
import { Material } from '../../lib/api';

interface LayerBoxProps {
  textureUrl: string | null;
  color: string;
  width: number;
  depth: number;
  height: number;
  positionY: number;
}

function LayerBox({ textureUrl, color, width, depth, height, positionY }: LayerBoxProps) {
  const textures = useTexture(textureUrl ? textureUrl : '');
  const materialProps = textureUrl ? { map: textures } : { color };

  return (
    <mesh position={[0, positionY, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial {...materialProps} />
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
}

export default function Mattress3DView({ lengthCm, widthCm, layers, materials }: Mattress3DViewProps) {
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
    const withPos = list.map((r) => {
      const centerY = y + r.height_m / 2;
      y += r.height_m;
      return { ...r, centerY };
    });
    return { withPos, totalHeight };
  }, [layers, materials]);

  const { withPos, totalHeight } = layersWithMeta;

  // Determine if a cloth texture is selected
  const selectedClothTexture = useMemo(() => {
    const clothLayer = layers.find(layer => layer.materialId && layer.materialId.startsWith('d'));
    return clothLayer ? materials.find(m => m.id === clothLayer.materialId)?.texture : null;
  }, [layers, materials]);

  // scale factor to keep model nicely visible
  const cameraDistance = Math.max(lengthM, widthM, totalHeight) * 2.5;

  return (
    <Canvas shadows camera={{ position: [cameraDistance, cameraDistance / 2, cameraDistance], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <Suspense fallback={<Html>Loading textures...</Html>}>
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
            />
          ) : (
            // Base mattress container — thin shell for visual
            withPos.map((layer, idx) => (
              <LayerBox
                key={idx}
                textureUrl={layer.texture}
                color={layer.color}
                width={lengthM}
                depth={widthM}
                height={layer.height_m}
                positionY={layer.centerY}
              />
            ))
          )}

          {/* optional mattress outline: a transparent box slightly bigger */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[lengthM + 0.01, totalHeight + 0.02, widthM + 0.01]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.06} />
          </mesh>

          {/* Dimension Lines and Labels */}
          {/* Height */}
          <Line
            points={[[lengthM / 2 + 0.1, -totalHeight / 2, widthM / 2 + 0.1], [lengthM / 2 + 0.1, totalHeight / 2, widthM / 2 + 0.1]]}
            color="#ffffff"
            lineWidth={2}
          />
          <Text
            position={[lengthM / 2 + 0.15, 0, widthM / 2 + 0.1]}
            fontSize={0.08}
            color="white"
            anchorX="left"
            anchorY="middle"
          >
            Height: {totalHeight.toFixed(2)} m
          </Text>

          {/* Length */}
          <Line
            points={[[lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1], [-lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1]]}
            color="#ffffff"
            lineWidth={2}
          />
          <Text
            position={[0, totalHeight / 2 + 0.15, widthM / 2 + 0.1]}
            fontSize={0.08}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            Length: {lengthM.toFixed(2)} m
          </Text>

          {/* Width */}
          <Line
            points={[[lengthM / 2 + 0.1, totalHeight / 2 + 0.1, widthM / 2], [lengthM / 2 + 0.1, totalHeight / 2 + 0.1, -widthM / 2]]}
            color="#ffffff"
            lineWidth={2}
          />
          <Text
            position={[lengthM / 2 + 0.15, totalHeight / 2 + 0.1, 0]}
            fontSize={0.08}
            color="white"
            anchorX="left"
            anchorY="middle"
          >
            Width: {widthM.toFixed(2)} m
          </Text>
        </group>
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
}