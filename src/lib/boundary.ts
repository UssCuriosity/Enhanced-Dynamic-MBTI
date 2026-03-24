import { DailyPoint, EllipsoidParams, BoundaryStats, Point3D } from "@/types";

/**
 * Compute the centroid (mean point) of all daily measurements.
 */
export function computeCentroid(points: DailyPoint[]): Point3D {
  const n = points.length;
  if (n === 0) return { ns: 0, tf: 0, jp: 0 };

  const sum = points.reduce(
    (acc, p) => ({ ns: acc.ns + p.ns, tf: acc.tf + p.tf, jp: acc.jp + p.jp }),
    { ns: 0, tf: 0, jp: 0 }
  );

  return { ns: sum.ns / n, tf: sum.tf / n, jp: sum.jp / n };
}

/**
 * Compute the 3x3 covariance matrix for the 3D point cloud.
 */
function computeCovarianceMatrix(points: DailyPoint[], centroid: Point3D): number[][] {
  const n = points.length;
  if (n < 2) {
    return [
      [0.01, 0, 0],
      [0, 0.01, 0],
      [0, 0, 0.01],
    ];
  }

  const dims: Array<(p: DailyPoint) => number> = [
    (p) => p.ns - centroid.ns,
    (p) => p.tf - centroid.tf,
    (p) => p.jp - centroid.jp,
  ];

  const cov: number[][] = Array.from({ length: 3 }, () => Array(3).fill(0));

  for (const p of points) {
    const d = dims.map((fn) => fn(p));
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cov[i][j] += d[i] * d[j];
      }
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      cov[i][j] /= n - 1;
    }
  }

  return cov;
}

/**
 * Simple eigenvalue decomposition for 3x3 symmetric matrix using Jacobi iteration.
 */
function eigenDecomposition(matrix: number[][]): {
  eigenvalues: number[];
  eigenvectors: number[][];
} {
  const n = 3;
  const a = matrix.map((row) => [...row]);
  const v: number[][] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  for (let iter = 0; iter < 100; iter++) {
    let maxOff = 0;
    let p = 0;
    let q = 1;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(a[i][j]) > maxOff) {
          maxOff = Math.abs(a[i][j]);
          p = i;
          q = j;
        }
      }
    }

    if (maxOff < 1e-12) break;

    const theta =
      Math.abs(a[p][p] - a[q][q]) < 1e-12
        ? Math.PI / 4
        : 0.5 * Math.atan2(2 * a[p][q], a[p][p] - a[q][q]);

    const c = Math.cos(theta);
    const s = Math.sin(theta);

    const newA = a.map((row) => [...row]);
    for (let i = 0; i < n; i++) {
      newA[i][p] = c * a[i][p] + s * a[i][q];
      newA[i][q] = -s * a[i][p] + c * a[i][q];
    }
    for (let j = 0; j < n; j++) {
      a[p][j] = c * newA[p][j] + s * newA[q][j];
      a[q][j] = -s * newA[p][j] + c * newA[q][j];
    }

    for (let i = 0; i < n; i++) {
      const vip = v[i][p];
      const viq = v[i][q];
      v[i][p] = c * vip + s * viq;
      v[i][q] = -s * vip + c * viq;
    }
  }

  return {
    eigenvalues: [a[0][0], a[1][1], a[2][2]],
    eigenvectors: [
      [v[0][0], v[1][0], v[2][0]],
      [v[0][1], v[1][1], v[2][1]],
      [v[0][2], v[1][2], v[2][2]],
    ],
  };
}

/**
 * Compute the 95% confidence ellipsoid parameters.
 * Uses chi-squared critical value for 3 DOF at 95% = 7.815.
 */
export function computeConfidenceEllipsoid(points: DailyPoint[]): EllipsoidParams {
  const centroid = computeCentroid(points);
  const cov = computeCovarianceMatrix(points, centroid);
  const { eigenvalues, eigenvectors } = eigenDecomposition(cov);

  const chi2_95_3 = 7.815;
  const radii = eigenvalues.map((ev) =>
    Math.sqrt(Math.max(ev, 0.001) * chi2_95_3)
  ) as [number, number, number];

  return {
    center: [centroid.ns, centroid.tf, centroid.jp],
    radii,
    rotation: eigenvectors,
  };
}

/**
 * Compute 3D convex hull using gift wrapping approach.
 * Returns indices of points forming the hull faces.
 * For small point sets (<4), returns all points.
 */
export function computeConvexHull(points: DailyPoint[]): number[][] {
  if (points.length < 4) {
    return points.map((_, i) => [i]);
  }

  const pts = points.map((p) => [p.ns, p.tf, p.jp]);
  const faces: number[][] = [];
  const n = pts.length;

  // Find initial tetrahedron
  let [a, b, c, d] = [0, 1, 2, 3];

  // Ensure non-degenerate: find 4 non-coplanar points
  for (let i = 1; i < n; i++) {
    if (dist(pts[a], pts[i]) > 1e-8) { b = i; break; }
  }
  for (let i = 1; i < n; i++) {
    if (i !== b && crossMag(sub(pts[b], pts[a]), sub(pts[i], pts[a])) > 1e-8) {
      c = i; break;
    }
  }
  for (let i = 1; i < n; i++) {
    if (i !== b && i !== c) {
      const normal = cross(sub(pts[b], pts[a]), sub(pts[c], pts[a]));
      if (Math.abs(dot(normal, sub(pts[i], pts[a]))) > 1e-8) {
        d = i; break;
      }
    }
  }

  // Orient the initial tetrahedron
  const normal0 = cross(sub(pts[b], pts[a]), sub(pts[c], pts[a]));
  if (dot(normal0, sub(pts[d], pts[a])) > 0) {
    [b, c] = [c, b];
  }

  faces.push([a, b, c], [a, c, d], [a, d, b], [b, d, c]);

  // Incremental convex hull
  for (let i = 0; i < n; i++) {
    if (i === a || i === b || i === c || i === d) continue;

    const visible: number[] = [];
    for (let f = 0; f < faces.length; f++) {
      const [p0, p1, p2] = faces[f];
      const fn = cross(sub(pts[p1], pts[p0]), sub(pts[p2], pts[p0]));
      if (dot(fn, sub(pts[i], pts[p0])) > 1e-10) {
        visible.push(f);
      }
    }

    if (visible.length === 0) continue;

    // Find horizon edges
    const edges: [number, number][] = [];
    for (const fi of visible) {
      const face = faces[fi];
      for (let e = 0; e < 3; e++) {
        const e0 = face[e];
        const e1 = face[(e + 1) % 3];
        const reverseExists = visible.some((vf) => {
          if (vf === fi) return false;
          const vface = faces[vf];
          for (let ve = 0; ve < 3; ve++) {
            if (vface[ve] === e1 && vface[(ve + 1) % 3] === e0) return true;
          }
          return false;
        });
        if (!reverseExists) {
          edges.push([e0, e1]);
        }
      }
    }

    // Remove visible faces (in reverse order to preserve indices)
    visible.sort((x, y) => y - x);
    for (const fi of visible) {
      faces.splice(fi, 1);
    }

    // Add new faces
    for (const [e0, e1] of edges) {
      faces.push([e0, e1, i]);
    }
  }

  return faces;
}

/**
 * Compute linear regression trend for a time series.
 * Returns slope per day.
 */
function linearTrend(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (Math.abs(denom) < 1e-12) return 0;
  return (n * sumXY - sumX * sumY) / denom;
}

function stdDev(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance = values.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1);
  return Math.sqrt(variance);
}

/**
 * Compute comprehensive boundary statistics.
 */
export function computeBoundaryStats(points: DailyPoint[]): BoundaryStats {
  if (points.length === 0) {
    return {
      nsMean: 0, nsStd: 0, nsTrend: 0,
      tfMean: 0, tfStd: 0, tfTrend: 0,
      jpMean: 0, jpStd: 0, jpTrend: 0,
      eiMean: 0, eiStd: 0,
      volume: 0, stability: 0.5,
    };
  }

  const nsVals = points.map((p) => p.ns);
  const tfVals = points.map((p) => p.tf);
  const jpVals = points.map((p) => p.jp);
  const eiVals = points.map((p) => p.ei);

  const nsS = stdDev(nsVals);
  const tfS = stdDev(tfVals);
  const jpS = stdDev(jpVals);

  // Volume approximation using standard deviations
  const volume = (4 / 3) * Math.PI * (nsS || 0.01) * (tfS || 0.01) * (jpS || 0.01);

  // Stability: inverse of average standard deviation, normalized to [0, 1]
  const avgStd = (nsS + tfS + jpS) / 3;
  const stability = Math.max(0, Math.min(1, 1 - avgStd));

  return {
    nsMean: mean(nsVals),
    nsStd: nsS,
    nsTrend: linearTrend(nsVals),
    tfMean: mean(tfVals),
    tfStd: tfS,
    tfTrend: linearTrend(tfVals),
    jpMean: mean(jpVals),
    jpStd: jpS,
    jpTrend: linearTrend(jpVals),
    eiMean: mean(eiVals),
    eiStd: stdDev(eiVals),
    volume,
    stability,
  };
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

// Vector helpers
function sub(a: number[], b: number[]): number[] {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: number[], b: number[]): number[] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function crossMag(a: number[], b: number[]): number {
  const c = cross(a, b);
  return Math.sqrt(c[0] ** 2 + c[1] ** 2 + c[2] ** 2);
}
function dist(a: number[], b: number[]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}
