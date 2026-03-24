"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Line } from "@react-three/drei";
import * as THREE from "three";
import { DailyPoint, EllipsoidParams } from "@/types";

interface PersonalitySpaceProps {
  points: DailyPoint[];
  convexHull?: number[][];
  ellipsoid?: EllipsoidParams;
  centroid?: { ns: number; tf: number; jp: number };
  showHull?: boolean;
  showEllipsoid?: boolean;
  height?: string;
}

export default function PersonalitySpace({
  points,
  convexHull,
  ellipsoid,
  centroid,
  showHull = true,
  showEllipsoid = true,
  height = "500px",
}: PersonalitySpaceProps) {
  return (
    <div style={{ height }} className="w-full rounded-xl overflow-hidden border bg-slate-950">
      <Canvas camera={{ position: [2.5, 2, 2.5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Scene
          points={points}
          convexHull={convexHull}
          ellipsoid={ellipsoid}
          centroid={centroid}
          showHull={showHull}
          showEllipsoid={showEllipsoid}
        />
        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
}

function Scene({
  points,
  convexHull,
  ellipsoid,
  centroid,
  showHull,
  showEllipsoid,
}: {
  points: DailyPoint[];
  convexHull?: number[][];
  ellipsoid?: EllipsoidParams;
  centroid?: { ns: number; tf: number; jp: number };
  showHull: boolean;
  showEllipsoid: boolean;
}) {
  return (
    <group>
      <AxisLines />
      <DataPoints points={points} />
      {centroid && <CentroidMarker position={[centroid.ns, centroid.tf, centroid.jp]} />}
      {showHull && convexHull && points.length >= 4 && (
        <ConvexHullMesh points={points} faces={convexHull} />
      )}
      {showEllipsoid && ellipsoid && (
        <ConfidenceEllipsoid params={ellipsoid} />
      )}
    </group>
  );
}

function AxisLines() {
  const axisLength = 1.2;
  return (
    <group>
      {/* X axis: N-S */}
      <Line
        points={[[-axisLength, 0, 0], [axisLength, 0, 0]]}
        color="#ef4444"
        lineWidth={1.5}
      />
      <Text position={[-axisLength - 0.15, 0, 0]} fontSize={0.08} color="#ef4444">N</Text>
      <Text position={[axisLength + 0.15, 0, 0]} fontSize={0.08} color="#ef4444">S</Text>

      {/* Y axis: T-F */}
      <Line
        points={[[0, -axisLength, 0], [0, axisLength, 0]]}
        color="#22c55e"
        lineWidth={1.5}
      />
      <Text position={[0, -axisLength - 0.15, 0]} fontSize={0.08} color="#22c55e">T</Text>
      <Text position={[0, axisLength + 0.15, 0]} fontSize={0.08} color="#22c55e">F</Text>

      {/* Z axis: J-P */}
      <Line
        points={[[0, 0, -axisLength], [0, 0, axisLength]]}
        color="#3b82f6"
        lineWidth={1.5}
      />
      <Text position={[0, 0, -axisLength - 0.15]} fontSize={0.08} color="#3b82f6">J</Text>
      <Text position={[0, 0, axisLength + 0.15]} fontSize={0.08} color="#3b82f6">P</Text>

      {/* Grid lines */}
      {[-1, -0.5, 0, 0.5, 1].map((v) => (
        <group key={v}>
          <Line points={[[v, 0, -1], [v, 0, 1]]} color="#ffffff" lineWidth={0.3} opacity={0.1} transparent />
          <Line points={[[-1, 0, v], [1, 0, v]]} color="#ffffff" lineWidth={0.3} opacity={0.1} transparent />
        </group>
      ))}

      {/* Bounding box */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color="#ffffff" opacity={0.08} transparent />
      </lineSegments>
    </group>
  );
}

function DataPoints({ points }: { points: DailyPoint[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useMemo(() => {
    if (!meshRef.current || points.length === 0) return;
    const mesh = meshRef.current;
    const tempMatrix = new THREE.Matrix4();
    const tempColor = new THREE.Color();

    points.forEach((point, i) => {
      tempMatrix.setPosition(point.ns, point.tf, point.jp);
      mesh.setMatrixAt(i, tempMatrix);

      const t = points.length > 1 ? i / (points.length - 1) : 0;
      tempColor.setHSL(0.6 - t * 0.6, 0.8, 0.6);
      mesh.setColorAt(i, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points]);

  if (points.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[0.03, 16, 16]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}

function CentroidMarker({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.15);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.05]} />
      <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
    </mesh>
  );
}

function ConvexHullMesh({
  points,
  faces,
}: {
  points: DailyPoint[];
  faces: number[][];
}) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];

    points.forEach((p) => {
      vertices.push(p.ns, p.tf, p.jp);
    });

    faces.forEach((face) => {
      if (face.length >= 3) {
        indices.push(face[0], face[1], face[2]);
      }
    });

    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [points, faces]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#60a5fa"
        opacity={0.12}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function ConfidenceEllipsoid({ params }: { params: EllipsoidParams }) {
  const matrixRef = useRef(new THREE.Matrix4());

  useMemo(() => {
    const { center, radii, rotation } = params;

    const rotMatrix = new THREE.Matrix4();
    if (rotation && rotation.length === 3) {
      rotMatrix.set(
        rotation[0][0], rotation[1][0], rotation[2][0], 0,
        rotation[0][1], rotation[1][1], rotation[2][1], 0,
        rotation[0][2], rotation[1][2], rotation[2][2], 0,
        0, 0, 0, 1
      );
    }

    const scaleMatrix = new THREE.Matrix4().makeScale(
      Math.min(radii[0], 1.5),
      Math.min(radii[1], 1.5),
      Math.min(radii[2], 1.5)
    );
    const translateMatrix = new THREE.Matrix4().makeTranslation(center[0], center[1], center[2]);

    matrixRef.current.identity()
      .multiply(translateMatrix)
      .multiply(rotMatrix)
      .multiply(scaleMatrix);
  }, [params]);

  return (
    <mesh matrix={matrixRef.current} matrixAutoUpdate={false}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#a78bfa"
        opacity={0.08}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        wireframe
      />
    </mesh>
  );
}
