"use client";

import { useEffect, useRef } from "react";

interface Blob {
  x: number;
  y: number;
  baseRadius: number;
  color: { r: number; g: number; b: number; a: number };
  noiseOffset: number;
  driftSpeed: { x: number; y: number };
  morphSpeed: number;
  points: number;
}

export function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initBlobs(rect.width, rect.height);
    };

    const terracotta = { r: 224, g: 122, b: 61 }; // #E07A3D
    const warmGold = { r: 212, g: 165, b: 116 }; // #D4A574

    const initBlobs = (width: number, height: number) => {
      const blobs: Blob[] = [
        // Large terracotta blobs
        {
          x: width * 0.2,
          y: height * 0.3,
          baseRadius: Math.min(width, height) * 0.35,
          color: { ...terracotta, a: 0.18 },
          noiseOffset: 0,
          driftSpeed: { x: 0.015, y: 0.012 },
          morphSpeed: 0.0003,
          points: 8,
        },
        {
          x: width * 0.75,
          y: height * 0.6,
          baseRadius: Math.min(width, height) * 0.4,
          color: { ...terracotta, a: 0.14 },
          noiseOffset: 100,
          driftSpeed: { x: -0.01, y: 0.018 },
          morphSpeed: 0.00025,
          points: 7,
        },
        // Warm gold blobs
        {
          x: width * 0.6,
          y: height * 0.25,
          baseRadius: Math.min(width, height) * 0.3,
          color: { ...warmGold, a: 0.15 },
          noiseOffset: 200,
          driftSpeed: { x: 0.012, y: -0.008 },
          morphSpeed: 0.00035,
          points: 6,
        },
        {
          x: width * 0.35,
          y: height * 0.7,
          baseRadius: Math.min(width, height) * 0.32,
          color: { ...warmGold, a: 0.14 },
          noiseOffset: 300,
          driftSpeed: { x: -0.018, y: -0.01 },
          morphSpeed: 0.0004,
          points: 8,
        },
        // Additional layers
        {
          x: width * 0.5,
          y: height * 0.5,
          baseRadius: Math.min(width, height) * 0.5,
          color: { ...terracotta, a: 0.1 },
          noiseOffset: 400,
          driftSpeed: { x: 0.008, y: 0.006 },
          morphSpeed: 0.0002,
          points: 9,
        },
        {
          x: width * 0.15,
          y: height * 0.8,
          baseRadius: Math.min(width, height) * 0.25,
          color: { ...warmGold, a: 0.12 },
          noiseOffset: 500,
          driftSpeed: { x: 0.02, y: -0.015 },
          morphSpeed: 0.00045,
          points: 6,
        },
      ];
      blobsRef.current = blobs;
    };

    // Simple noise function for organic movement
    const noise = (x: number, y: number, t: number): number => {
      const nx = Math.sin(x * 0.5 + t) * Math.cos(y * 0.3 + t * 0.7);
      const ny = Math.sin(y * 0.4 + t * 0.8) * Math.cos(x * 0.6 + t * 0.5);
      return (nx + ny) * 0.5;
    };

    const drawBlob = (
      ctx: CanvasRenderingContext2D,
      blob: Blob,
      time: number,
      width: number,
      height: number
    ) => {
      const t = time * blob.morphSpeed + blob.noiseOffset;
      
      // Calculate drifting position (oscillates within bounds)
      const driftX = Math.sin(time * blob.driftSpeed.x * 3 + blob.noiseOffset) * width * 0.25;
      const driftY = Math.sin(time * blob.driftSpeed.y * 3 + blob.noiseOffset * 0.7) * height * 0.25;
      const centerX = blob.x + driftX;
      const centerY = blob.y + driftY;

      ctx.beginPath();

      const points: { x: number; y: number }[] = [];
      
      // Generate organic blob points
      for (let i = 0; i < blob.points; i++) {
        const angle = (i / blob.points) * Math.PI * 2;
        const noiseVal = noise(
          Math.cos(angle) * 2,
          Math.sin(angle) * 2,
          t * 2
        );
        const radiusVariation = 1 + noiseVal * 0.5;
        const radius = blob.baseRadius * radiusVariation;
        
        points.push({
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        });
      }

      // Draw smooth curve through points using bezier
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const nextNext = points[(i + 2) % points.length];
        
        const cp1x = current.x + (next.x - points[(i - 1 + points.length) % points.length].x) * 0.25;
        const cp1y = current.y + (next.y - points[(i - 1 + points.length) % points.length].y) * 0.25;
        const cp2x = next.x - (nextNext.x - current.x) * 0.25;
        const cp2y = next.y - (nextNext.y - current.y) * 0.25;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
      }

      ctx.closePath();

      // Create radial gradient for soft edges
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, blob.baseRadius * 1.2
      );
      
      const { r, g, b, a } = blob.color;
      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
      gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${a * 0.7})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = (timestamp: number) => {
      const rect = canvas.getBoundingClientRect();
      
      // Clear with base color
      ctx.fillStyle = "#FAFAF8";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw each blob with blur for soft edges
      ctx.filter = "blur(60px)";
      
      blobsRef.current.forEach((blob) => {
        drawBlob(ctx, blob, timestamp * 0.001, rect.width, rect.height);
      });

      ctx.filter = "none";

      // Add subtle noise texture overlay
      ctx.globalAlpha = 0.015;
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const size = Math.random() * 2 + 0.5;
        ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "#FAFAF8" }}
    />
  );
}
