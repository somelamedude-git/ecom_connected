import React from 'react';

const ConcentricSquaresLoader = () => {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(55, 65, 81, 0.6) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(55, 65, 81, 0.6) 1px, transparent 1px)
               `,
               backgroundSize: '30px 30px',
               animation: 'gridMove 15s linear infinite'
             }}>
        </div>
      </div>
      
      {/* Diagonal moving lines */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 linear-gradient(45deg, transparent 30%, rgba(251, 191, 36, 0.1) 50%, transparent 70%),
                 linear-gradient(-45deg, transparent 30%, rgba(156, 163, 175, 0.1) 50%, transparent 70%)
               `,
               backgroundSize: '200px 200px',
               animation: 'diagonalMove 25s linear infinite'
             }}>
        </div>
      </div>
      
      {/* Floating particles - more visible */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-yellow-400' : i % 3 === 1 ? 'bg-gray-400' : 'bg-gray-500'}`}
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.2,
              animation: `float ${3 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Pulsing corner squares */}
      <div className="absolute top-10 left-10 w-4 h-4 border border-gray-600 animate-pulse opacity-30 rotate-45"></div>
      <div className="absolute top-16 right-12 w-3 h-3 border border-yellow-400 opacity-40" 
           style={{ animation: 'spin 8s linear infinite' }}></div>
      <div className="absolute bottom-20 left-16 w-5 h-5 border border-gray-500 opacity-25"
           style={{ animation: 'spin 12s linear infinite reverse' }}></div>
      <div className="absolute bottom-12 right-10 w-2 h-2 bg-yellow-400 opacity-30 animate-pulse"></div>
      
      {/* Radial gradient overlay - less intense */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/10 to-black/30"></div>
      <div className="relative w-32 h-32">
        {/* Outermost square */}
        <div className="absolute inset-0 border-2 border-gray-600 animate-spin rounded-sm"
             style={{ 
               animationDuration: '3s',
               animationTimingFunction: 'linear'
             }}>
        </div>
        
        {/* Second square */}
        <div className="absolute inset-2 border-2 border-gray-500 rounded-sm"
             style={{ 
               animation: 'spin 2.2s linear infinite reverse'
             }}>
        </div>
        
        {/* Third square */}
        <div className="absolute inset-4 border-2 border-gray-400 animate-spin rounded-sm"
             style={{ 
               animationDuration: '1.8s',
               animationTimingFunction: 'linear'
             }}>
        </div>
        
        {/* Fourth square */}
        <div className="absolute inset-6 border-2 border-gray-300 rounded-sm"
             style={{ 
               animation: 'spin 1.4s linear infinite reverse'
             }}>
        </div>
        
        {/* Innermost square with golden accent */}
        <div className="absolute inset-8 border-2 border-yellow-400 animate-spin rounded-sm"
             style={{ 
               animationDuration: '1s',
               animationTimingFunction: 'linear'
             }}>
        </div>
        
        {/* Central dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
        </div>
      </div>
      
      {/* Loading text */}
      <div className="absolute mt-48 text-gray-400 text-sm font-medium tracking-wider">
        Loading...
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.4;
          }
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%);
        }
      `}</style>
    </div>
  );
};

export default ConcentricSquaresLoader;