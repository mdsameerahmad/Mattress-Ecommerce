// Mattress3DView.tsx
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line, OrbitControls, Text, useTexture, RoundedBox, Environment } from '@react-three/drei';
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

function LayerBox({ textureUrl, color, width, depth, height, positionY, isTopLayer = false }: LayerBoxProps) {
  const textures = useTexture(textureUrl ? textureUrl : '');
  React.useEffect(() => {
    if (textures && (textures as any).image) {
      textures.wrapS = textures.wrapT = THREE.RepeatWrapping;
      const repeatX = Math.max(1, Math.round(width * 0.1));
      const repeatY = Math.max(1, Math.round(depth * 0.1));
      textures.repeat.set(1, 1);
      textures.needsUpdate = true;
    }
  }, [textures, width, depth]);

  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current && isTopLayer) {
      meshRef.current.position.y = positionY + Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
      const breatheFactor = Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
      // clamp a bit so scale doesn't go negative
      meshRef.current.scale.y = 1 + breatheFactor;
    }
  });

  const radius = Math.min(width, depth, height) * 0.25;

  return (
    <mesh ref={meshRef} position={[0, positionY, 0]} castShadow receiveShadow>
      <RoundedBox args={[width, height, depth]} radius={radius} smoothness={4}>
        <meshPhysicalMaterial
          map={textureUrl ? textures : undefined}
          color={!textureUrl ? color : undefined}
          roughness={0.7}
          metalness={0}
          clearcoat={isTopLayer ? 0.3 : 0.1}
          clearcoatRoughness={0.4}
          transmission={0.05}
          envMapIntensity={1.2}
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

const convertToDisplayUnit = (valueInMeters: number, unit: string): { value: number; unitLabel: string } => {
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
  const lengthM = Math.max(0.2, lengthCm / 100);
  const widthM = Math.max(0.2, widthCm / 100);

  const layersWithMeta = useMemo(() => {
    const list = layers.map((l) => {
      const mat = materials.find((m) => m.id === l.materialId) || ({} as any);
      return {
        ...l,
        mat,
        height_m: Math.max(0.001, (l.thickness_mm || 1) / 1000),
        texture: (mat && (mat as any).texture) || null,
        color: (mat && (mat as any).color) || '#ddd',
      };
    });
    const totalHeight = list.reduce((s, r) => s + r.height_m, 0);
    let y = -totalHeight / 2;
    const withPos = list.map((r, index) => {
      const centerY = y + r.height_m / 2;
      y += r.height_m;
      return {
        ...r,
        centerY,
        isTopLayer: index === list.length - 1,
        isBottomLayer: index === 0,
      };
    });
    return { withPos, totalHeight };
  }, [layers, materials]);

  const { withPos, totalHeight } = layersWithMeta;

  const selectedClothTexture = useMemo(() => {
    const clothLayer = layers.find((layer) => layer.materialId && layer.materialId.startsWith('d'));
    return clothLayer ? materials.find((m) => m.id === clothLayer.materialId)?.texture : null;
  }, [layers, materials]);

  const displayLength = convertToDisplayUnit(lengthM, unit);
  const displayWidth = convertToDisplayUnit(widthM, unit);
  const displayHeight = convertToDisplayUnit(totalHeight, unit);

  const cameraDistance = Math.max(lengthM, widthM, totalHeight) * 2.5;

  // IMPORTANT: wrapper div must be 100% height; Canvas is forced to fill with style.
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Canvas
        shadows
        camera={{ position: [cameraDistance, cameraDistance / 2, cameraDistance], fov: 45 }}
        style={{ height: '100%', width: '100%', display: 'block' }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <fog attach="fog" args={['#1a1a2e', 8, 30]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} castShadow shadow-mapSize={[2048, 2048]} />
        <spotLight position={[-5, 5, 5]} intensity={0.5} castShadow angle={0.5} penumbra={0.8} />

        <Suspense fallback={<Html center>Loading textures...</Html>}>
          <group>
            {selectedClothTexture ? (
              <LayerBox
                textureUrl={selectedClothTexture}
                color="#ffffff"
                width={lengthM}
                depth={widthM}
                height={totalHeight}
                positionY={0}
                isTopLayer={true}
                isBottomLayer={true}
              />
            ) : (
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

            <mesh position={[0, 0, 0]}>
              <RoundedBox args={[lengthM + 0.03, totalHeight + 0.04, widthM + 0.03]} radius={0.05} smoothness={4}>
                <meshStandardMaterial color="#ffffff" transparent opacity={0.04} />
              </RoundedBox>
            </mesh>

            {/* Labels */}
            <Line points={[[lengthM / 2 + 0.1, -totalHeight / 2, widthM / 2 + 0.1], [lengthM / 2 + 0.1, totalHeight / 2, widthM / 2 + 0.1]]} color="#4da6ff" lineWidth={2} />
            <Text position={[lengthM / 2 + 0.15, 0, widthM / 2 + 0.1]} fontSize={0.06} color="white" anchorX="left" anchorY="middle" backgroundColor="#00000066" padding={0.02} borderRadius={0.01}>
              Height: {displayHeight.value.toFixed(1)} {displayHeight.unitLabel}
            </Text>

            <Line points={[[lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1], [-lengthM / 2, totalHeight / 2 + 0.1, widthM / 2 + 0.1]]} color="#4da6ff" lineWidth={2} />
            <Text position={[0, totalHeight / 2 + 0.15, widthM / 2 + 0.1]} fontSize={0.06} color="white" anchorX="center" anchorY="bottom" backgroundColor="#00000066" padding={0.02} borderRadius={0.01}>
              Length: {displayLength.value.toFixed(1)} {displayLength.unitLabel}
            </Text>

            <Line points={[[lengthM / 2 + 0.1, totalHeight / 2 + 0.1, widthM / 2], [lengthM / 2 + 0.1, totalHeight / 2 + 0.1, -widthM / 2]]} color="#4da6ff" lineWidth={2} />
            <Text position={[lengthM / 2 + 0.15, totalHeight / 2 + 0.1, 0]} fontSize={0.06} color="white" anchorX="left" anchorY="middle" backgroundColor="#00000066" padding={0.02} borderRadius={0.01}>
              Width: {displayWidth.value.toFixed(1)} {displayWidth.unitLabel}
            </Text>
          </group>

          <Environment preset="sunset" />
        </Suspense>

        <OrbitControls enableDamping dampingFactor={0.1} rotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
