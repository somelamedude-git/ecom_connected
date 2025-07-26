import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const SalesHeatmap = () => {
  const [salesData, setSalesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredDate, setHoveredDate] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    bestDay: null,
    currentStreak: 0,
    longestStreak: 0
  });

 
  const mockSalesData = {
    '2024-01-15': 3,
    '2024-01-16': 1,
    '2024-01-17': 7,
    '2024-01-18': 2,
    '2024-01-20': 5,
    '2024-01-22': 1,
    '2024-01-25': 4,
    '2024-01-28': 8,
    '2024-01-30': 2,
    '2024-02-01': 6,
    '2024-02-03': 3,
    '2024-02-05': 9,
    '2024-02-07': 1,
    '2024-02-10': 4,
    '2024-02-12': 7,
    '2024-02-15': 2,
    '2024-02-18': 5,
    '2024-02-20': 3,
    '2024-02-22': 8,
    '2024-02-25': 1,
    '2024-02-28': 6,
    '2024-03-02': 4,
    '2024-03-05': 2,
    '2024-03-08': 7,
    '2024-03-10': 3,
    '2024-03-12': 5,
    '2024-03-15': 9,
    '2024-03-18': 1,
    '2024-03-20': 6,
    '2024-03-22': 4,
    '2024-03-25': 8,
    '2024-03-28': 2,
    '2024-03-30': 5,
    '2024-04-02': 3,
    '2024-04-05': 7,
    '2024-04-08': 1,
    '2024-04-10': 4,
    '2024-04-12': 9,
    '2024-04-15': 2,
    '2024-04-18': 6,
    '2024-04-20': 5,
    '2024-04-22': 3,
    '2024-04-25': 8,
    '2024-04-28': 1,
    '2024-04-30': 4,
    '2024-05-03': 7,
    '2024-05-05': 2,
    '2024-05-08': 5,
    '2024-05-10': 9,
    '2024-05-12': 3,
    '2024-05-15': 6,
    '2024-05-18': 1,
    '2024-05-20': 8,
    '2024-05-22': 4,
    '2024-05-25': 2,
    '2024-05-28': 7,
    '2024-05-30': 5,
    '2024-06-02': 3,
    '2024-06-05': 9,
    '2024-06-08': 1,
    '2024-06-10': 6,
    '2024-06-12': 4,
    '2024-06-15': 8,
    '2024-06-18': 2,
    '2024-06-20': 5,
    '2024-06-22': 7,
    '2024-06-25': 3,
    '2024-06-28': 1,
    '2024-06-30': 4,
    '2024-07-03': 6,
    '2024-07-05': 9,
    '2024-07-08': 2,
    '2024-07-10': 5,
    '2024-07-12': 8,
    '2024-07-15': 1,
    '2024-07-18': 7,
    '2024-07-20': 3,
    '2024-07-22': 4,
    '2024-07-25': 2
  };

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {

        // const response = await axios.get('http://localhost:3000/seller/heatmap', {
        //     withCredentials: true
        // });

        // setSalesData(response.data.salesByDate);
        // calculateStats(response.data.salesByDate);
        
        setSalesData(mockSalesData);
        calculateStats(mockSalesData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch sales data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear]);

  const calculateStats = (data) => {
    const dates = Object.keys(data);
    const totalSales = Object.values(data).reduce((sum, count) => sum + count, 0);
    
    const bestDay = dates.reduce((best, date) => 
      data[date] > (data[best] || 0) ? date : best, dates[0]);
    
    const sortedDates = dates.sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (data[today] || data[yesterday]) {
      let checkDate = new Date();
      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (data[dateStr]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
      
      if (prevDate && (currentDate - prevDate) === 86400000) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    setStats({
      totalSales,
      bestDay: bestDay ? { date: bestDay, count: data[bestDay] } : null,
      currentStreak,
      longestStreak
    });
  };

  const getMonthlyMaxSales = (month, year) => {
    const monthData = Object.entries(salesData).filter(([date, count]) => {
      const dateObj = new Date(date);
      return dateObj.getMonth() === month && dateObj.getFullYear() === year;
    });
    
    if (monthData.length === 0) return 1; 
    return Math.max(...monthData.map(([date, count]) => count));
  };

  const getIntensityOpacity = (count, month, year) => {
    if (!count) return 0;
    const monthMax = getMonthlyMaxSales(month, year);
    const opacity = (count / monthMax);
    return Math.max(0.2, opacity); 
  };

  const getIntensityColor = (count, month, year) => {
    if (!count) {
      return 'rgba(55, 65, 81, 0.3)'; 
    }
    
    const opacity = getIntensityOpacity(count, month, year);
    return `rgba(250, 204, 21, ${opacity})`; // Yellow with dynamic opacity
  };

  const generateCalendarData = () => {
    const startDate = new Date(selectedYear, 0, 1);
    const endDate = new Date(selectedYear, 11, 31);
    const weeks = [];
    
    const firstDay = new Date(startDate);
    firstDay.setDate(firstDay.getDate() - firstDay.getDay());
    
    let currentDate = new Date(firstDay);
    
    while (currentDate <= endDate || weeks.length === 0 || weeks[weeks.length - 1].length < 7) {
      if (weeks.length === 0 || weeks[weeks.length - 1].length === 7) {
        weeks.push([]);
      }
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = salesData[dateStr] || 0;
      const isCurrentYear = currentDate.getFullYear() === selectedYear;
      
      weeks[weeks.length - 1].push({
        date: new Date(currentDate),
        dateStr,
        count,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isCurrentYear
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return weeks;
  };

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calendarData = generateCalendarData();

  return (
    <div className="heatmap-container">
      <div className="heatmap-main">
        <button className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="heatmap-hero">
          <h1 className="heatmap-title">
            Sales <span className="heatmap-highlight">Activity</span>
          </h1>
          <p className="heatmap-subtitle">
            Track your daily sales performance and identify patterns in your business activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalSales}</div>
              <div className="stat-label">Total Sales</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.bestDay?.count || 0}</div>
              <div className="stat-label">Best Day</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.longestStreak}</div>
              <div className="stat-label">Longest Streak</div>
            </div>
          </div>
        </div>

        {/* Year Selector */}
        <div className="year-selector">
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="year-select"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>

        {loading && (
          <div className="heatmap-status-msg">
            <div className="loading-spinner"></div>
            Loading sales data...
          </div>
        )}

        {error && (
          <div className="heatmap-error-msg">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="calendar-container">
            {/* Month labels */}
            <div className="month-labels">
              {months.map((month, index) => (
                <div key={month} className="month-label">
                  {month}
                </div>
              ))}
            </div>

            <div className="calendar-wrapper">
              {/* Weekday labels */}
              <div className="weekday-labels">
                {weekdays.map((day, index) => (
                  <div key={day} className="weekday-label" style={{
                    visibility: index % 2 === 1 ? 'visible' : 'hidden'
                  }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="calendar-grid">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`calendar-day ${!day.isCurrentYear ? 'other-year' : ''}`}
                        style={{
                          backgroundColor: day.isCurrentYear ? getIntensityColor(day.count, day.month, day.year) : 'transparent'
                        }}
                        onMouseEnter={() => setHoveredDate(day)}
                        onMouseLeave={() => setHoveredDate(null)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <span className="legend-label">Less</span>
              {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((opacity, index) => (
                <div
                  key={index}
                  className="legend-square"
                  style={{ 
                    backgroundColor: opacity === 0 ? 'rgba(55, 65, 81, 0.3)' : `rgba(250, 204, 21, ${opacity})` 
                  }}
                />
              ))}
              <span className="legend-label">More</span>
            </div>

            {/* Tooltip */}
            {hoveredDate && (
              <div className="tooltip">
                <div className="tooltip-date">{formatDate(hoveredDate.date)}</div>
                <div className="tooltip-count">
                  {hoveredDate.count} {hoveredDate.count === 1 ? 'sale' : 'sales'}
                </div>
                <div className="tooltip-intensity">
                  {hoveredDate.count > 0 && (
                    <span>
                      {Math.round(getIntensityOpacity(hoveredDate.count, hoveredDate.month, hoveredDate.year) * 100)}% of month's peak
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .heatmap-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
        }

        .heatmap-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          background: none;
          border: none;
          font-size: 16px;
          margin-bottom: 32px;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .back-btn:hover {
          color: #facc15;
        }

        .heatmap-hero {
          text-align: center;
          margin-bottom: 48px;
        }

        .heatmap-title {
          font-size: 64px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .heatmap-highlight {
          background: linear-gradient(135deg, hsl(45, 100%, 85%) 0%, hsl(35, 90%, 68%) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .heatmap-subtitle {
          color: #9ca3af;
          font-size: 18px;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }

        .stat-card {
          background-color: #111827;
          border: 1px solid #374151;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: #facc15;
          transform: translateY(-2px);
        }

        .stat-icon {
          background: linear-gradient(135deg, hsl(45, 100%, 85%), hsl(35, 90%, 68%));
          color: #000;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #facc15;
          line-height: 1;
        }

        .stat-label {
          color: #9ca3af;
          font-size: 14px;
          margin-top: 4px;
        }

        .year-selector {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
        }

        .year-select {
          background-color: #1f2937;
          color: #fff;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 16px;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .year-select:focus {
          outline: none;
          border-color: #facc15;
        }

        .heatmap-status-msg,
        .heatmap-error-msg {
          text-align: center;
          margin-top: 64px;
          font-size: 16px;
          color: #9ca3af;
        }

        .heatmap-error-msg {
          color: #f87171;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #374151;
          border-top: 3px solid #facc15;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .calendar-container {
          background-color: #111827;
          border: 1px solid #374151;
          border-radius: 12px;
          padding: 24px;
          position: relative;
        }

        .month-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-left: 24px;
        }

        .month-label {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 500;
          width: calc(100% / 12);
          text-align: left;
        }

        .calendar-wrapper {
          display: flex;
          gap: 8px;
        }

        .weekday-labels {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-right: 8px;
        }

        .weekday-label {
          color: #9ca3af;
          font-size: 11px;
          height: 12px;
          display: flex;
          align-items: center;
          margin-bottom: 2px;
        }

        .calendar-grid {
          display: flex;
          gap: 2px;
          flex: 1;
        }

        .calendar-week {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .calendar-day {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          border: 1px solid #374151;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .calendar-day:hover {
          border-color: #facc15;
          transform: scale(1.1);
        }

        .calendar-day.other-year {
          border-color: transparent;
        }

        .calendar-legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 16px;
        }

        .legend-label {
          color: #9ca3af;
          font-size: 11px;
        }

        .legend-square {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          border: 1px solid #374151;
        }

        .tooltip {
          position: fixed;
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          pointer-events: none;
          z-index: 1000;
          transform: translate(-50%, -100%);
          margin-top: -8px;
          left: 50%;
          top: 50%;
        }

        .tooltip-date {
          font-weight: 600;
          margin-bottom: 2px;
        }

        .tooltip-count {
          color: #9ca3af;
          margin-bottom: 2px;
        }

        .tooltip-intensity {
          color: #facc15;
          font-size: 11px;
        }

        @media (max-width: 768px) {
          .heatmap-title {
            font-size: 48px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 24px;
          }

          .calendar-container {
            padding: 16px;
            overflow-x: auto;
          }

          .calendar-grid {
            min-width: 600px;
          }

          .month-labels {
            min-width: 600px;
          }
        }

        @media (max-width: 480px) {
          .heatmap-title {
            font-size: 36px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .heatmap-main {
            padding: 16px 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SalesHeatmap;