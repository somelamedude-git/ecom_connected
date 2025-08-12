import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    sessions: '0',
    newUsers: '0',
    activeUsers: '0',
    screenPageViews: '0',
    engagedSessions: '0',
    ecommercePurchases: '0',
    transactions: '0',
    itemsPurchased: '0',
    averageSessionDuration: '0',
    bounceRate: '0',
    engagementRate: '0',
  });

  const [chartData, setChartData] = useState({
    sessions: [],
    users: [],
    purchases: [],
    pageViews: [],
    engagementRate: [],
    bounceRate: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Fetch data from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('/api/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized - Please log in again');
          } else if (response.status === 403) {
            throw new Error('Access denied - Admin privileges required');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        
        // Set current stats
        setStats(data);
        
        // Generate chart data based on current values
        // Since GA4 API typically returns single period data, we'll simulate trend data
        // You can modify this to call additional endpoints for historical data
        const generateTrendData = (currentValue) => {
          const numValue = parseInt(currentValue.toString().replace(/[,%]/g, '')) || 0;
          const baseValue = numValue * 0.7; // Start at 70% of current value
          const increment = (numValue - baseValue) / 6;
          
          return Array.from({ length: 7 }, (_, i) => 
            Math.round(baseValue + (increment * i))
          );
        };

        const generatePercentageTrend = (currentPercentage) => {
          const numValue = parseFloat(currentPercentage.toString().replace('%', '')) || 0;
          const baseValue = numValue * 0.9; // Start at 90% of current value
          const increment = (numValue - baseValue) / 6;
          
          return Array.from({ length: 7 }, (_, i) => 
            parseFloat((baseValue + (increment * i)).toFixed(1))
          );
        };

        setChartData({
          sessions: generateTrendData(data.sessions),
          users: generateTrendData(data.newUsers),
          purchases: generateTrendData(data.ecommercePurchases),
          pageViews: generateTrendData(data.screenPageViews),
          engagementRate: generatePercentageTrend(data.engagementRate),
          bounceRate: generatePercentageTrend(data.bounceRate)
        });

      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num) => {
    if (typeof num === 'string' && (num.includes('%') || num.includes('m') || num.includes('s'))) {
      return num;
    }
    const cleanNum = num.toString().replace(/[,%]/g, '');
    return parseInt(cleanNum).toLocaleString();
  };

  // Chart Components
  const LineChart = ({ data, color, height = 200, showArea = false }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 300;
      const y = height - ((value - minValue) / range) * (height - 40) - 20;
      return `${x},${y}`;
    }).join(' ');

    const areaPath = showArea ? `M 0,${height} L ${points.split(' ').map(p => p.split(',')[0] + ',' + p.split(',')[1]).join(' L ')} L 300,${height} Z` : '';

    return (
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`} style={{ overflow: 'visible' }}>
        {showArea && (
          <path
            d={areaPath}
            fill={`url(#gradient-${color.replace('#', '')})`}
            opacity="0.2"
          />
        )}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
            animation: 'drawLine 2s ease-out forwards'
          }}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 300;
          const y = height - ((value - minValue) / range) * (height - 40) - 20;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`,
                opacity: 0
              }}
            />
          );
        })}
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const BarChart = ({ data, color, height = 200 }) => {
    const maxValue = Math.max(...data);
    const barWidth = 35;
    const spacing = 8;
    
    return (
      <svg width="100%" height={height} viewBox={`0 0 300 ${height}`}>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 40);
          const x = index * (barWidth + spacing) + 10;
          const y = height - barHeight - 20;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={height - 20}
                width={barWidth}
                height={barHeight}
                fill={`url(#barGradient-${color.replace('#', '')})`}
                rx="4"
                style={{
                  animation: `growBar 1.5s ease-out forwards ${index * 0.1}s`,
                  transformOrigin: `${x + barWidth/2}px ${height - 20}px`
                }}
              />
              <text
                x={x + barWidth/2}
                y={height - 5}
                textAnchor="middle"
                fill="#888"
                fontSize="10"
                fontWeight="500"
              >
                {weekLabels[index]}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id={`barGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={`${color}80`} />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const DonutChart = ({ percentage, color, size = 120 }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 10px ${color}40)`,
              animation: 'drawCircle 2s ease-out forwards'
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: color
          }}>
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  const metricCards = [
    { key: 'sessions', label: 'Sessions', icon: '👥', color: '#ffd700' },
    { key: 'newUsers', label: 'New Users', icon: '✨', color: '#ffed4a' },
    { key: 'activeUsers', label: 'Active Users', icon: '🔥', color: '#ffd700' },
    { key: 'screenPageViews', label: 'Page Views', icon: '👁️', color: '#ffed4a' },
    { key: 'engagedSessions', label: 'Engaged Sessions', icon: '💫', color: '#ffd700' },
    { key: 'ecommercePurchases', label: 'Purchases', icon: '🛒', color: '#ffed4a' },
    { key: 'transactions', label: 'Transactions', icon: '💳', color: '#ffd700' },
    { key: 'itemsPurchased', label: 'Items Sold', icon: '📦', color: '#ffed4a' },
    { key: 'averageSessionDuration', label: 'Avg. Duration', icon: '⏱️', color: '#ffd700' },
    { key: 'bounceRate', label: 'Bounce Rate', icon: '📈', color: '#ffed4a' },
    { key: 'engagementRate', label: 'Engagement', icon: '❤️', color: '#ffd700' },
  ];

  const LoadingSkeleton = () => (
    <div style={{
      background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.2) 50%, rgba(255,215,0,0.1) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      height: '60px',
      borderRadius: '8px',
      marginBottom: '8px'
    }} />
  );

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: '#ffd700',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes glow {
          from { textShadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          to { textShadow: 0 0 30px rgba(255, 215, 0, 0.6); }
        }
        @keyframes shimmer {
          0% { backgroundPosition: -200% 0; }
          100% { backgroundPosition: 200% 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes drawLine {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 0; }
        }
        @keyframes drawCircle {
          from { stroke-dashoffset: ${2 * Math.PI * 45}; }
          to { stroke-dashoffset: ${2 * Math.PI * 45 / 4}; }
        }
        @keyframes growBar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: -1
          }} />
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            background: 'linear-gradient(45deg, #ffd700, #ffed4a, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            Analytics Dashboard
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            color: '#cccccc',
            fontWeight: '300',
            letterSpacing: '0.5px'
          }}>
            E-commerce Performance Metrics
          </p>
          
          <div style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            padding: '0.8rem 1.5rem',
            borderRadius: '25px',
            display: 'inline-block',
            margin: '2rem 0',
            color: '#ffd700',
            fontWeight: '500',
            backdropFilter: 'blur(10px)'
          }}>
            📅 Last 7 Days
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            background: 'linear-gradient(145deg, rgba(139, 0, 0, 0.2), rgba(139, 0, 0, 0.1))',
            border: '1px solid rgba(255, 69, 0, 0.3)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h3 style={{ color: '#ff4444', marginBottom: '0.5rem' }}>Failed to Load Analytics Data</h3>
            <p style={{ color: '#ffaaaa', marginBottom: '1rem' }}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'linear-gradient(45deg, #ffd700, #ffed4a)',
                border: 'none',
                borderRadius: '25px',
                padding: '0.8rem 2rem',
                color: '#000',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔄 Retry
            </button>
          </div>
        )}

        {/* Main Charts Section */}
        {!loading && !error && chartData.sessions.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {/* Sessions Chart */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffd700',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                👥 Sessions Trend
              </h3>
              <LineChart data={chartData.sessions} color="#ffd700" showArea={true} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#888'
              }}>
                {weekLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>

            {/* Users Chart */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
              border: '1px solid rgba(255, 237, 74, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffed4a',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                ✨ New Users
              </h3>
              <BarChart data={chartData.users} color="#ffed4a" />
            </div>

            {/* Purchases Chart */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#ffd700',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🛒 E-commerce Purchases
              </h3>
              <LineChart data={chartData.purchases} color="#ffd700" />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#888'
              }}>
                {weekLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>

            {/* Engagement Metrics */}
            <div style={{
              background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
              border: '1px solid rgba(255, 237, 74, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#ffed4a',
                  marginBottom: '1rem'
                }}>
                  Engagement Rate
                </h3>
                <DonutChart percentage={68.3} color="#ffed4a" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#ffd700',
                  marginBottom: '1rem'
                }}>
                  Bounce Rate
                </h3>
                <DonutChart percentage={42.5} color="#ffd700" />
              </div>
            </div>
          </div>
        )}

        {/* Loading State for Charts */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '16px',
                padding: '2rem',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.2) 50%, rgba(255,215,0,0.1) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  height: '200px',
                  borderRadius: '8px'
                }} />
              </div>
            ))}
          </div>
        )}

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {metricCards.map((metric, index) => (
            <div
              key={metric.key}
              style={{
                background: 'linear-gradient(145deg, rgba(20, 20, 20, 0.8), rgba(30, 30, 30, 0.6))',
                border: '1px solid rgba(255, 215, 0, 0.2)',
                borderRadius: '16px',
                padding: '1.5rem',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                animation: `slideUp 0.6s ease forwards ${index * 0.1}s`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                e.currentTarget.style.borderColor = metric.color;
                e.currentTarget.style.boxShadow = `0 10px 30px rgba(255, 215, 0, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${metric.color}, transparent)`
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  filter: 'grayscale(0.3)'
                }}>
                  {metric.icon}
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                  border: `1px solid ${metric.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: metric.color,
                    boxShadow: `0 0 10px ${metric.color}`
                  }} />
                </div>
              </div>
              
              <h3 style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#aaaaaa',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {metric.label}
              </h3>
              
              {loading ? (
                <LoadingSkeleton />
              ) : (
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: metric.color,
                  textShadow: `0 0 20px ${metric.color}40`
                }}>
                  {formatNumber(stats[metric.key])}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem',
          padding: '2rem',
          borderTop: '1px solid rgba(255, 215, 0, 0.2)',
          color: '#888888'
        }}>
          <p style={{ fontSize: '0.9rem' }}>
            🚀 Powered by Google Analytics 4 | Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;