import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';
import { Sparkles, Mic, Volume2, Radio } from 'lucide-react';

interface VoiceSphereProps {
  state: AssistantState;
  analyser?: AnalyserNode | null;
  size?: 'sm' | 'md' | 'lg';
  isLiveActive?: boolean;
}

export const VoiceSphere: React.FC<VoiceSphereProps> = ({
  state,
  analyser,
  size = 'lg',
  isLiveActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(32);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let avgVolume = 0;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        avgVolume = sum / dataArray.length / 255;
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = canvas.width * 0.22;
      const dynamicRadius = baseRadius + avgVolume * 24;

      // Draw outer ambient glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.5,
        centerX,
        centerY,
        baseRadius * 1.9 + (state === 'speaking' ? 20 : 5)
      );
      if (state === 'speaking') {
        glowGrad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
        glowGrad.addColorStop(0.5, 'rgba(197, 168, 128, 0.18)');
        glowGrad.addColorStop(1, 'rgba(250, 247, 242, 0)');
      } else if (state === 'listening') {
        glowGrad.addColorStop(0, 'rgba(140, 122, 107, 0.3)');
        glowGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.12)');
        glowGrad.addColorStop(1, 'rgba(250, 247, 242, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(215, 203, 185, 0.25)');
        glowGrad.addColorStop(1, 'rgba(250, 247, 242, 0)');
      }

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Outer delicate orbital ring
      ctx.strokeStyle =
        state === 'speaking'
          ? 'rgba(197, 168, 128, 0.5)'
          : state === 'listening'
          ? 'rgba(140, 122, 107, 0.4)'
          : 'rgba(210, 198, 180, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius + 14, 0, Math.PI * 2);
      ctx.stroke();

      // Second pulsing dashed orbital ring
      ctx.setLineDash([4, 6]);
      ctx.strokeStyle = 'rgba(180, 165, 145, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius + 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Harmonic radial audio points around the core
      const barCount = 28;
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const val = dataArray[i % dataArray.length] / 255;
        const barLen = (state === 'speaking' || state === 'listening' ? val : 0.05) * 22;
        const x1 = centerX + Math.cos(angle) * (dynamicRadius + 4);
        const y1 = centerY + Math.sin(angle) * (dynamicRadius + 4);
        const x2 = centerX + Math.cos(angle) * (dynamicRadius + 4 + barLen);
        const y2 = centerY + Math.sin(angle) * (dynamicRadius + 4 + barLen);

        ctx.strokeStyle =
          state === 'speaking'
            ? 'rgba(197, 168, 128, 0.8)'
            : 'rgba(160, 145, 125, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Core sphere
      const coreGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.3,
        centerY - baseRadius * 0.3,
        2,
        centerX,
        centerY,
        dynamicRadius
      );
      coreGrad.addColorStop(0, '#FFFFFF');
      coreGrad.addColorStop(0.3, '#FAF5EC');
      coreGrad.addColorStop(0.8, '#E6DCCF');
      coreGrad.addColorStop(1, '#D8CBBA');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle metallic highlight stroke
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, 0, Math.PI * 2);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [state, analyser]);

  const dimension = size === 'lg' ? 240 : size === 'md' ? 180 : 120;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={dimension}
          height={dimension}
          className="relative z-10 transition-transform duration-500"
        />

        {/* Center overlay badge with icon */}
        <div className="absolute z-20 pointer-events-none flex items-center justify-center w-12 h-12 rounded-full bg-white/70 backdrop-blur-xs border border-[#C5A880]/30 shadow-xs">
          {state === 'speaking' ? (
            <Volume2 className="w-5 h-5 text-[#9C7844] animate-pulse" />
          ) : state === 'listening' ? (
            <Mic className="w-5 h-5 text-[#8C7A6B] animate-pulse" />
          ) : state === 'connecting' || state === 'processing' ? (
            <Radio className="w-5 h-5 text-[#C5A880] animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#B09B82]" />
          )}
        </div>
      </div>

      {/* State label */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            state === 'speaking'
              ? 'bg-[#C5A880] animate-ping'
              : state === 'listening'
              ? 'bg-[#8C7A6B] animate-pulse'
              : state === 'connecting' || state === 'processing'
              ? 'bg-amber-400'
              : isLiveActive
              ? 'bg-emerald-600'
              : 'bg-[#D0C6B8]'
          }`}
        />
        <span className="text-xs uppercase tracking-widest text-[#73685C] font-medium font-sans">
          {state === 'speaking'
            ? 'Inès is speaking…'
            : state === 'listening'
            ? 'Listening to you…'
            : state === 'processing'
            ? 'Reflecting…'
            : state === 'connecting'
            ? 'Connecting live voice…'
            : isLiveActive
            ? 'Live session active'
            : 'Voice assistant standby'}
        </span>
      </div>
    </div>
  );
};
