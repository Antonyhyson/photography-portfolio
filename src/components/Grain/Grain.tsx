import React, { useEffect, useRef } from 'react';

const Grain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;

    let raf: number;
    const draw = () => {
      const imageData = ctx.createImageData(size, size);
      const buf = imageData.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 255;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      setTimeout(() => { raf = requestAnimationFrame(draw); }, 90);
    };
    draw();

    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="grain" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }} />;
};

export default Grain;
