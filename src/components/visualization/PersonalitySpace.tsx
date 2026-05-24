"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Stars } from "@react-three/drei";
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
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-[2rem] border border-sky-400/15 bg-[#020617] shadow-2xl shadow-cyan-950/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.14),_transparent_28%)] pointer-events-none" />
      <div className="absolute left-5 top-5 z-10 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[11px] uppercase tracking-[0.36em] text-cyan-200/90 backdrop-blur">
        3D Boundary Map
      </div>
      <div className="absolute right-4 top-4 z-20 hidden w-[220px] rounded-2xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-xl md:block">
        <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-slate-400">Legend</div>
        <div className="space-y-2">
          <LegendRow swatch="bg-gradient-to-r from-orange-300 via-rose-400 to-fuchsia-400" label="圆球：每日样本" />
          <LegendRow swatch="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" label="立方体：坐标框架" />
          <LegendRow swatch="bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500" label="椭球：动态边界" />
          <LegendRow swatch="bg-gradient-to-r from-emerald-300 via-lime-300 to-cyan-300" label="中心点：平均位置" />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 z-20 w-[250px] rounded-2xl border border-white/10 bg-slate-950/75 p-3 backdrop-blur-xl">
        <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-slate-400">Axis Guide</div>
        <div className="grid gap-2 text-xs text-slate-100">
          <AxisLegendRow colorClass="bg-[#ff9aa2]" axis="X 轴" meaning="N / S" description="左右方向" />
          <AxisLegendRow colorClass="bg-[#8bf1c7]" axis="Y 轴" meaning="T / F" description="上下方向" />
          <AxisLegendRow colorClass="bg-[#8ecbff]" axis="Z 轴" meaning="J / P" description="前后方向" />
        </div>
      </div>
      <Canvas
        camera={{ position: [3.35, 2.35, 3.35], fov: 42 }}
        dpr={1}
        frameloop="demand"
        gl={{ antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false }}
      >
        <color attach="background" args={["#020617"]} />
        <fog attach="fog" args={["#020617", 5.5, 15]} />
        <ambientLight intensity={0.72} />
        <hemisphereLight color="#bae6fd" groundColor="#0f172a" intensity={0.9} />
        <directionalLight position={[4, 6, 5]} intensity={0.95} color="#f8fafc" />
        <pointLight position={[-4, -2, 5]} intensity={0.5} color="#22d3ee" />
        <pointLight position={[4, 2, -4]} intensity={0.4} color="#a78bfa" />
        <Stars radius={28} depth={12} count={450} factor={2} saturation={0} fade speed={0.25} />
        <Scene
          points={points}
          convexHull={convexHull}
          ellipsoid={ellipsoid}
          centroid={centroid}
          showHull={showHull}
          showEllipsoid={showEllipsoid}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={2.2}
          maxDistance={7}
          autoRotate={false}
        />
      </Canvas>
      <Legend showHull={showHull} showEllipsoid={showEllipsoid} />
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
        color="#ff9aa2"
        lineWidth={2.2}
      />
      {/* Y axis: T-F */}
      <Line
        points={[[0, -axisLength, 0], [0, axisLength, 0]]}
        color="#8bf1c7"
        lineWidth={2.2}
      />
      {/* Z axis: J-P */}
      <Line
        points={[[0, 0, -axisLength], [0, 0, axisLength]]}
        color="#8ecbff"
        lineWidth={2.2}
      />

      {/* Grid lines */}
      {[-1, -0.5, 0, 0.5, 1].map((v) => (
        <group key={v}>
          <Line points={[[v, 0, -1], [v, 0, 1]]} color="#8ecbff" lineWidth={0.35} opacity={0.18} transparent />
          <Line points={[[-1, 0, v], [1, 0, v]]} color="#8ecbff" lineWidth={0.35} opacity={0.18} transparent />
        </group>
      ))}

      {/* Bounding box / 立方体坐标框 */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(2, 2, 2)]} />
        <lineBasicMaterial color="#d6f3ff" opacity={0.85} transparent />
      </lineSegments>
    </group>
  );
}

function DataPoints({ points }: { points: DailyPoint[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || points.length === 0) return;
    const tempMatrix = new THREE.Matrix4();
    const tempColor = new THREE.Color();

    points.forEach((point, i) => {
      tempMatrix.setPosition(point.ns, point.tf, point.jp);
      tempMatrix.multiply(new THREE.Matrix4().makeScale(1.16, 1.16, 1.16));
      mesh.setMatrixAt(i, tempMatrix);

      const t = points.length > 1 ? i / (points.length - 1) : 0;
      tempColor.setHSL(0.03 + t * 0.08, 0.95, 0.68);
      mesh.setColorAt(i, tempColor);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [points]);

  if (points.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[0.045, 20, 20]} />
      <meshStandardMaterial vertexColors roughness={0.22} metalness={0.1} emissive="#4b1d12" emissiveIntensity={0.18} />
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
      <octahedronGeometry args={[0.07]} />
      <meshStandardMaterial color="#fff2a8" emissive="#ffb703" emissiveIntensity={0.9} roughness={0.12} metalness={0.45} />
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
        color="#55e7ff"
        opacity={0.42}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        roughness={0.35}
        metalness={0.05}
        emissive="#38bdf8"
        emissiveIntensity={0.34}
      />
    </mesh>
  );
}

function ConfidenceEllipsoid({ params }: { params: EllipsoidParams }) {
  const matrix = useMemo(() => {
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

    return new THREE.Matrix4()
      .multiply(translateMatrix)
      .multiply(rotMatrix)
      .multiply(scaleMatrix);
  }, [params]);

  return (
    <mesh matrix={matrix} matrixAutoUpdate={false}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#ff4fd8"
        opacity={0.42}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        wireframe={false}
        roughness={0.32}
        metalness={0.08}
        emissive="#ff79c6"
        emissiveIntensity={0.34}
      />
    </mesh>
  );
}

function Legend({
  showHull,
  showEllipsoid,
}: {
  showHull: boolean;
  showEllipsoid: boolean;
}) {
  return (
    <div className="relative border-t border-white/10 bg-slate-950/85 px-5 py-4 backdrop-blur-xl">
      <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 xl:grid-cols-4">
        <LegendItem
          swatch="bg-gradient-to-br from-orange-300 via-rose-400 to-fuchsia-400"
          title="圆球 = 每日样本点"
          description="每个圆球代表一次具体测量，颜色更暖、更亮，方便和边界形状区分开。"
        />
        <LegendItem
          swatch="bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-500"
          title="立方体 = 坐标框架"
          description="外层立方体是 3D 坐标边界，帮助你看清 N-S、T-F、J-P 的空间位置。"
        />
        <LegendItem
          swatch="bg-gradient-to-br from-violet-300 via-fuchsia-400 to-purple-500"
          title="椭球 = 动态边界"
          description="紫色椭球是根据当前数据拟合出来的性格范围，越贴近数据中心越稳定。"
        />
        <LegendItem
          swatch="bg-gradient-to-br from-emerald-300 via-lime-300 to-cyan-300"
          title="中心点 = 平均位置"
          description="金色中心点表示整体平均值，用来快速判断当前人格分布的重心。"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-400">
        <span className={`rounded-full border px-3 py-1 ${showEllipsoid ? "border-violet-400/30 bg-violet-400/10 text-violet-100" : "border-white/10 bg-white/5"}`}>
          椭球可见
        </span>
        <span className={`rounded-full border px-3 py-1 ${showHull ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100" : "border-white/10 bg-white/5"}`}>
          凸包可见
        </span>
        <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-100">
          圆球为每日点位
        </span>
      </div>
    </div>
  );
}

function LegendItem({
  swatch,
  title,
  description,
}: {
  swatch: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full shadow-lg ${swatch}`} />
        <div className="space-y-1">
          <div className="font-medium text-slate-50">{title}</div>
          <p className="text-xs leading-6 text-slate-300">{description}</p>
        </div>
      </div>
    </div>
  );
}

function LegendRow({
  swatch,
  label,
}: {
  swatch: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2">
      <span className={`h-2.5 w-8 shrink-0 rounded-full ${swatch}`} />
      <span className="text-[11px] leading-5 text-slate-200">{label}</span>
    </div>
  );
}

function AxisLegendRow({
  colorClass,
  axis,
  meaning,
  description,
}: {
  colorClass: string;
  axis: string;
  meaning: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.03] px-2.5 py-2">
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorClass}`} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-50">{axis}</span>
          <span className="text-slate-300">{meaning}</span>
        </div>
        <div className="text-[11px] leading-5 text-slate-400">{description}</div>
      </div>
    </div>
  );
}
