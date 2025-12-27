import React from "react";
import { Bot, Sparkles } from "lucide-react";

interface SmartIALoaderProps {
  message: string;
  submessage?: string;
  variant?: "light" | "dark";
  className?: string;
}

const SmartIALoader: React.FC<SmartIALoaderProps> = ({
  message,
  submessage = "Sincronizando em tempo real...",
  variant = "light",
  className = "h-[60vh]",
}) => {
  const isDark = variant === "dark";

  return (
    <div
      className={`${className} w-full flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 ${
        isDark
          ? "bg-slate-950 min-h-screen"
          : "bg-slate-50/50 rounded-[3rem] border border-slate-100/50"
      }`}
    >
      {/* Atmosfera de Glow */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${
          isDark ? "bg-indigo-600/10" : "bg-indigo-500/5"
        } rounded-full blur-[100px] animate-pulse`}
      />

      <div className="relative mb-10 flex items-center justify-center">
        {/* Anéis Orbitais Dinâmicos */}
        <div
          className={`absolute w-44 h-44 border-2 ${
            isDark ? "border-indigo-500/30" : "border-indigo-200"
          } border-dashed rounded-full animate-[spin_10s_linear_infinite]`}
        />
        <div
          className={`absolute w-36 h-36 border-2 ${
            isDark ? "border-violet-500/20" : "border-indigo-400/10"
          } rounded-full animate-[spin_6s_linear_infinite_reverse]`}
        />
        <div
          className={`absolute w-52 h-52 border ${
            isDark ? "border-white/5" : "border-violet-500/5"
          } rounded-full animate-pulse`}
        />

        {/* Núcleo SmartIA Dashboard */}
        <div
          className={`relative z-10 w-20 h-20 bg-gradient-to-br from-indigo-600 to-violet-600 ${
            isDark ? "rounded-3xl" : "rounded-[2rem]"
          } flex items-center justify-center text-white shadow-[0_0_40px_rgba(99,102,241,0.25)] animate-bounce`}
        >
          <Bot size={40} className="animate-pulse" />

          {/* Partículas flutuantes */}
          <Sparkles
            className="absolute -top-4 -right-4 text-indigo-400 animate-ping"
            size={20}
          />
          <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-violet-400 rounded-full animate-ping delay-300" />
        </div>

        {/* Efeito Scan Line */}
        <div
          className={`absolute w-full h-[2px] bg-gradient-to-r from-transparent ${
            isDark ? "via-indigo-400" : "via-indigo-400/40"
          } to-transparent top-1/2 -translate-y-1/2 animate-[dash_2s_ease-in-out_infinite]`}
        />
      </div>

      {/* Status Tecnológico */}
      <div className="text-center space-y-3 z-20 px-6">
        <h3
          className={`text-xl font-black ${
            isDark
              ? "text-indigo-400 tracking-[0.3em] uppercase"
              : "text-slate-800 tracking-tight uppercase"
          } flex items-center gap-3 justify-center`}
        >
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          {message}
        </h3>
        <p
          className={`${
            isDark ? "text-slate-500" : "text-slate-400"
          } text-sm font-bold animate-pulse`}
        >
          {submessage}
        </p>
      </div>

      <style>{`
          @keyframes dash {
            0% { transform: translateY(-60px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(60px); opacity: 0; }
          }
       `}</style>
    </div>
  );
};

export default SmartIALoader;
