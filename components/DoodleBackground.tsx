export default function DoodleBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated Medical Doodles */}
      <div className="absolute top-10 left-5 text-6xl opacity-15 animate-float">💊</div>
      <div className="absolute top-20 right-10 text-7xl opacity-20 animate-pulse">❤️</div>
      <div className="absolute bottom-20 left-10 text-5xl opacity-15 animate-bounce-slow">🏥</div>
      <div className="absolute bottom-10 right-5 text-6xl opacity-20 animate-spin-slow">🩺</div>
      <div className="absolute top-1/2 left-1/4 text-8xl opacity-10 animate-float">💉</div>
      <div className="absolute top-1/3 right-1/4 text-6xl opacity-15 animate-pulse">🌡️</div>
      <div className="absolute bottom-1/3 left-1/3 text-7xl opacity-20 animate-bounce">💪</div>
      <div className="absolute top-40 left-1/2 text-5xl opacity-15 animate-ping-slow">🫀</div>
      <div className="absolute bottom-40 right-1/3 text-6xl opacity-20 animate-float">🧠</div>
      
      {/* New Medical Doodles */}
      <div className="absolute top-1/4 left-1/5 text-4xl opacity-10 animate-bounce">🦴</div>
      <div className="absolute bottom-1/4 right-1/6 text-5xl opacity-15 animate-pulse">🧬</div>
      <div className="absolute top-3/4 left-3/4 text-6xl opacity-20 animate-spin-slow">🔬</div>
      <div className="absolute top-2/3 right-2/3 text-5xl opacity-15 animate-float">📋</div>
      <div className="absolute bottom-2/3 left-2/3 text-4xl opacity-10 animate-pulse">💊</div>
      
      {/* Floating animation containers */}
      <div className="absolute top-60 left-20 text-4xl opacity-25 animate-float-delayed">❤️</div>
      <div className="absolute bottom-60 right-40 text-5xl opacity-30 animate-pulse-slow">🏥</div>
    </div>
  );
}