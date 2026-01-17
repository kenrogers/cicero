"use client";

import { useEffect, useRef } from "react";

interface Ring {
  radius: number;
  opacity: number;
  hasTickMarks: boolean;
  tickCount: number;
  lineWidth: number;
  dashPattern: number[] | null;
}

export function BroadcastWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

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
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Ring configuration - classical precision style with irregular spacing
    const rings: Ring[] = [
      // Inner cluster - tight grouping
      { radius: 60, opacity: 0.12, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: [2, 3] },
      { radius: 72, opacity: 0.18, hasTickMarks: false, tickCount: 0, lineWidth: 1.5, dashPattern: null },
      { radius: 85, opacity: 0.1, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: null },
      
      // Gap, then prominent ring with ticks
      { radius: 140, opacity: 0.25, hasTickMarks: true, tickCount: 60, lineWidth: 1.5, dashPattern: null },
      { radius: 155, opacity: 0.08, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: [3, 4] },
      
      // Another gap
      { radius: 220, opacity: 0.15, hasTickMarks: false, tickCount: 0, lineWidth: 2, dashPattern: null },
      { radius: 235, opacity: 0.1, hasTickMarks: false, tickCount: 0, lineWidth: 0.75, dashPattern: null },
      { radius: 248, opacity: 0.06, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: [2, 6] },
      
      // Mid section - varied cluster
      { radius: 320, opacity: 0.2, hasTickMarks: true, tickCount: 120, lineWidth: 1, dashPattern: null },
      { radius: 340, opacity: 0.12, hasTickMarks: false, tickCount: 0, lineWidth: 1.5, dashPattern: null },
      
      // Large gap to outer rings
      { radius: 450, opacity: 0.18, hasTickMarks: false, tickCount: 0, lineWidth: 2.5, dashPattern: null },
      { radius: 465, opacity: 0.08, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: null },
      { radius: 478, opacity: 0.1, hasTickMarks: false, tickCount: 0, lineWidth: 0.75, dashPattern: [4, 3] },
      
      // Outer band with ticks
      { radius: 560, opacity: 0.22, hasTickMarks: true, tickCount: 180, lineWidth: 1, dashPattern: null },
      { radius: 580, opacity: 0.14, hasTickMarks: false, tickCount: 0, lineWidth: 1.5, dashPattern: null },
      { radius: 595, opacity: 0.06, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: [2, 5] },
      
      // Far outer - sparse
      { radius: 720, opacity: 0.16, hasTickMarks: false, tickCount: 0, lineWidth: 2, dashPattern: null },
      { radius: 740, opacity: 0.08, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: null },
      
      // Edge rings
      { radius: 880, opacity: 0.12, hasTickMarks: true, tickCount: 240, lineWidth: 0.75, dashPattern: null },
      { radius: 900, opacity: 0.18, hasTickMarks: false, tickCount: 0, lineWidth: 1.5, dashPattern: null },
      { radius: 920, opacity: 0.06, hasTickMarks: false, tickCount: 0, lineWidth: 0.5, dashPattern: [3, 6] },
      
      // Very outer edge
      { radius: 1050, opacity: 0.1, hasTickMarks: false, tickCount: 0, lineWidth: 1.5, dashPattern: null },
      { radius: 1080, opacity: 0.14, hasTickMarks: false, tickCount: 0, lineWidth: 2, dashPattern: null },
    ];

    const terracotta = { r: 224, g: 122, b: 61 }; // #E07A3D

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const rect = canvas.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Slow rotation for subtle animation
      const rotationSpeed = 0.00002;
      const baseRotation = timestamp * rotationSpeed;

      // Pulse effect - very subtle
      const pulsePhase = timestamp * 0.0005;

      rings.forEach((ring, index) => {
        const pulseOffset = Math.sin(pulsePhase + index * 0.3) * 0.015;
        const currentOpacity = ring.opacity + pulseOffset;
        const rotation = baseRotation * (index % 2 === 0 ? 1 : -0.5);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);

        // Draw main ring
        ctx.beginPath();
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${terracotta.r}, ${terracotta.g}, ${terracotta.b}, ${currentOpacity})`;
        ctx.lineWidth = ring.lineWidth;
        
        if (ring.dashPattern) {
          ctx.setLineDash(ring.dashPattern);
        } else {
          ctx.setLineDash([]);
        }
        
        ctx.stroke();

        // Draw tick marks if applicable
        if (ring.hasTickMarks) {
          ctx.setLineDash([]);
          const tickLength = ring.tickCount > 100 ? 4 : 6;
          
          for (let i = 0; i < ring.tickCount; i++) {
            const angle = (i / ring.tickCount) * Math.PI * 2;
            const innerRadius = ring.radius - tickLength;
            const outerRadius = ring.radius;
            
            // Make every 12th tick slightly longer (like clock hours)
            const isHourMark = ring.tickCount >= 60 && i % (ring.tickCount / 12) === 0;
            const actualInner = isHourMark ? innerRadius - 4 : innerRadius;
            const tickOpacity = isHourMark ? currentOpacity * 1.5 : currentOpacity * 0.7;

            ctx.beginPath();
            ctx.moveTo(
              Math.cos(angle) * actualInner,
              Math.sin(angle) * actualInner
            );
            ctx.lineTo(
              Math.cos(angle) * outerRadius,
              Math.sin(angle) * outerRadius
            );
            ctx.strokeStyle = `rgba(${terracotta.r}, ${terracotta.g}, ${terracotta.b}, ${tickOpacity})`;
            ctx.lineWidth = isHourMark ? 1 : 0.5;
            ctx.stroke();
          }
        }

        ctx.restore();
      });

      // Draw center glow - subtle to keep rings visible
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 150
      );
      gradient.addColorStop(0, "rgba(250, 250, 248, 0.7)");
      gradient.addColorStop(0.6, "rgba(250, 250, 248, 0.2)");
      gradient.addColorStop(1, "rgba(250, 250, 248, 0)");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

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
      style={{ background: "transparent" }}
    />
  );
}
