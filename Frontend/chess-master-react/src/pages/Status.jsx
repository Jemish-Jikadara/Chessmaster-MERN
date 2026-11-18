import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import api from '../api/axios';

const Status = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('rapid');

  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.get('/profile/status')
      .then((res) => mounted && setStats(res.data))
      .catch(() => mounted && setError('Could not load your stats.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // Build the chart once stats are in, then update it whenever the mode changes.
  useEffect(() => {
    if (!stats || !canvasRef.current) return undefined;

    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0,229,255,0.4)');
    gradient.addColorStop(1, 'rgba(0,229,255,0.0)');

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{
          label: 'Rating',
          data: [],
          borderColor: '#00e5ff',
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#a8f8ff',
          pointBorderColor: '#050510',
          pointBorderWidth: 2,
        }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800 },
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#08081a',
              titleColor: '#7d8ba8',
              bodyColor: '#a8f8ff',
              borderColor: '#00e5ff',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 4,
              displayColors: false,
            },
          },
          scales: {
            x: {
              ticks: { color: '#7d8ba8', font: { family: "'Chakra Petch', sans-serif" } },
              grid: { color: 'rgba(0,229,255,0.06)' },
            },
            y: {
              ticks: { color: '#7d8ba8', font: { family: "'Chakra Petch', sans-serif" } },
              grid: { color: 'rgba(0,229,255,0.06)' },
            },
          },
        },
      });
    }

    let history = stats[`${mode}History`];
    if (!history || history.length === 0) history = [1200];

    const chart = chartRef.current;
    chart.data.labels = history.map((_, i) => `G${i + 1}`);
    chart.data.datasets[0].data = history;
    chart.data.datasets[0].label = `${mode.toUpperCase()} Rating`;
    const min = Math.min(...history);
    const max = Math.max(...history);
    chart.options.scales.y.min = Math.max(0, min - 10);
    chart.options.scales.y.max = max + 10;
    chart.update();

    return () => {};
  }, [stats, mode]);

  useEffect(() => () => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00e5ff',
          background: '#050510',
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textShadow: '0 0 16px rgba(0,229,255,.6)',
        }}>
          Loading stats...
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        `}</style>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6bb0',
          background: '#050510',
          fontFamily: "'Chakra Petch', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          textShadow: '0 0 16px rgba(255,45,149,.6)',
        }}>
          {error || 'No stats yet — play a game first!'}
        </div>
      </>
    );
  }

  const data = {
    rapid: { rating: stats.rapidRating, peak: stats.rapidPeak, games: stats.rapidGames, wins: stats.rapidWins, losses: stats.rapidLosses, draws: stats.rapidDraws, win: `${stats.rapidWinRate}%` },
    blitz: { rating: stats.blitzRating, peak: stats.blitzPeak, games: stats.blitzGames, wins: stats.blitzWins, losses: stats.blitzLosses, draws: stats.blitzDraws, win: `${stats.blitzWinRate}%` },
    bullet: { rating: stats.bulletRating, peak: stats.bulletPeak, games: stats.bulletGames, wins: stats.bulletWins, losses: stats.bulletLosses, draws: stats.bulletDraws, win: `${stats.bulletWinRate}%` },
  };
  const current = data[mode];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --h-bg:#050510;
          --h-bg-2:#0a0a1e;
          --h-panel:#08081a;
          --h-line:rgba(0,229,255,0.14);
          --h-line-soft:rgba(255,255,255,0.06);
          --h-text:#e8f4ff;
          --h-muted:#7d8ba8;
          --h-soft:#b8c6dd;
          --h-cyan:#00e5ff;
          --h-cyan-2:#5cf0ff;
          --h-cyan-3:#a8f8ff;
          --h-pink:#ff2d95;
          --h-pink-2:#ff6bb0;
          --h-acid:#b6ff3c;
          --h-purple:#8b5cf6;
          --h-font-display:'Orbitron', system-ui, sans-serif;
          --h-font-tech:'Chakra Petch', system-ui, sans-serif;
          --h-font-body:'Inter', system-ui, sans-serif;
        }

        .status-page-body {
          position:relative;
          background:#050510;
          color:var(--h-text);
          font-family:var(--h-font-body);
          min-height:100vh;
          overflow-x:hidden;
        }

        /* Animated grid backdrop */
        .status-page-body::before{
          content:'';
          position:fixed;
          inset:0;
          background-image:
            linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
          background-size:52px 52px;
          mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
          pointer-events:none;
          z-index:0;
          animation:h-grid 24s linear infinite;
        }

        .status-page-body::after{
          content:'';
          position:fixed;
          inset:0;
          background:
            radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
            radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
            radial-gradient(800px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%);
          pointer-events:none;
          z-index:0;
        }

        @keyframes h-grid{
          0%{ background-position:0 0, 0 0; }
          100%{ background-position:52px 52px, 52px 52px; }
        }

        .status-page-body > *{ position:relative; z-index:1; }

        .status-container { width:min(96vw, 1400px); margin:24px auto; padding:15px; }

        /* =========================================================
           HEADER
           ========================================================= */
        .status-header {
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:24px;
          flex-wrap:wrap;
          gap:12px;
        }

        .status-title {
          font-family:var(--h-font-display);
          font-size:clamp(1.6rem, 3vw, 2.1rem);
          font-weight:800;
          letter-spacing:0.02em;
          color:#ffffff;
          text-transform:uppercase;
          text-shadow:0 0 22px rgba(0,229,255,0.35);
          position:relative;
          padding-left:20px;
        }

        .status-title::before {
          content:'';
          position:absolute;
          left:0;
          top:50%;
          transform:translateY(-50%);
          width:8px;
          height:8px;
          background:var(--h-cyan);
          box-shadow:
            0 0 0 5px rgba(0,229,255,.15),
            0 0 14px rgba(0,229,255,.7);
        }

        /* =========================================================
           MODE TABS
           ========================================================= */
        .mode-tabs {
          display:flex;
          gap:4px;
          background:rgba(0,229,255,.04);
          padding:5px;
          border-radius:6px;
          border:1px solid rgba(0,229,255,.22);
          width:fit-content;
          box-shadow:inset 0 0 14px rgba(0,229,255,.06);
        }

        .mode-btn {
          padding:10px 26px;
          border:none;
          border-radius:4px;
          cursor:pointer;
          background:transparent;
          color:var(--h-muted);
          transition:all 0.25s ease;
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
        }

        .mode-btn.active {
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          color:#050510;
          box-shadow:
            0 0 20px rgba(0,229,255,.55),
            inset 0 0 10px rgba(255,255,255,.4);
        }

        .mode-btn:hover:not(.active) {
          color:var(--h-cyan);
          background:rgba(0,229,255,.1);
          text-shadow:0 0 10px rgba(0,229,255,.6);
        }

        /* =========================================================
           LAYOUT
           ========================================================= */
        .main-layout {
          display:grid;
          grid-template-columns:400px 1fr;
          gap:22px;
          align-items:start;
        }

        .stats-grid {
          display:grid;
          grid-template-columns:repeat(2, 1fr);
          gap:14px;
        }

        /* =========================================================
           STAT CARDS
           ========================================================= */
        .stat-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.22);
          border-radius:6px;
          padding:20px 22px;
          transition:transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          overflow:hidden;
        }

        .stat-card::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg, #00e5ff, #ff2d95);
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .3s ease;
        }

        .stat-card:hover {
          transform:translateY(-4px);
          border-color:rgba(0,229,255,.6);
          box-shadow:
            0 0 28px rgba(0,229,255,.28),
            0 0 60px rgba(139,92,246,.15),
            0 12px 30px rgba(0,0,0,.4);
        }

        .stat-card:hover::before {
          transform:scaleX(1);
        }

        .stat-card.featured {
          grid-column:span 2;
          background:
            linear-gradient(135deg, rgba(0,229,255,.1) 0%, rgba(139,92,246,.08) 100%),
            #08081a;
          border-color:rgba(0,229,255,.45);
          box-shadow:
            0 0 24px rgba(0,229,255,.2),
            inset 0 0 24px rgba(0,229,255,.06);
        }

        .stat-title {
          font-family:var(--h-font-tech);
          color:var(--h-cyan);
          font-size:11px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:0.22em;
          margin-bottom:10px;
          text-shadow:0 0 10px rgba(0,229,255,.5);
        }

        .stat-value {
          font-family:var(--h-font-display);
          font-size:26px;
          font-weight:800;
          color:#ffffff;
          line-height:1;
          letter-spacing:0.02em;
        }

        .stat-card.featured .stat-value {
          font-size:34px;
          text-shadow:0 0 20px rgba(0,229,255,.6);
        }

        /* =========================================================
           GRAPH BOX
           ========================================================= */
        .graph-box {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border-radius:8px;
          border:1px solid rgba(0,229,255,.28);
          padding:22px;
          min-height:500px;
          display:flex;
          flex-direction:column;
          box-shadow:
            0 0 40px rgba(0,229,255,.15),
            inset 0 0 40px rgba(0,229,255,.04);
        }

        .graph-title {
          font-family:var(--h-font-display);
          font-size:15px;
          font-weight:800;
          margin-bottom:18px;
          color:#ffffff;
          display:flex;
          align-items:center;
          gap:10px;
          text-transform:uppercase;
          letter-spacing:0.08em;
          text-shadow:0 0 14px rgba(0,229,255,.35);
        }

        .graph-title::before {
          content:'◆';
          color:var(--h-cyan);
          font-size:11px;
          text-shadow:0 0 10px rgba(0,229,255,.8);
        }

        .chart-wrapper {
          position:relative;
          flex-grow:1;
          width:100%;
        }

        .graph-box canvas {
          width:100% !important;
          height:420px !important;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:1100px) {
          .main-layout { grid-template-columns:1fr; }
          .graph-box canvas { height:320px !important; }
        }

        @media (max-width:700px) {
          .status-container { width:100%; padding:12px; }
          .status-header { flex-direction:column; align-items:flex-start; }
          .mode-tabs { width:100%; }
          .mode-btn { flex:1; text-align:center; padding:10px 0; font-size:11px; }
          .stats-grid { grid-template-columns:repeat(2, 1fr); }
          .graph-box canvas { height:260px !important; }
          .graph-box { min-height:400px; padding:18px; }
        }

        @media (max-width:420px) {
          .stats-grid { grid-template-columns:1fr; }
          .stat-card.featured { grid-column:span 1; }
        }
      `}</style>

      <div className="status-page-body">
        <div className="status-container">
          <div className="status-header">
            <div className="status-title">Rating Status</div>
            <div className="mode-tabs">
              <button type="button" className={`mode-btn ${mode === 'rapid' ? 'active' : ''}`} onClick={() => setMode('rapid')}>Rapid</button>
              <button type="button" className={`mode-btn ${mode === 'blitz' ? 'active' : ''}`} onClick={() => setMode('blitz')}>Blitz</button>
              <button type="button" className={`mode-btn ${mode === 'bullet' ? 'active' : ''}`} onClick={() => setMode('bullet')}>Bullet</button>
            </div>
          </div>

          <div className="dashboard">
            <div className="main-layout">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-title">Current Rating</div>
                  <div className="stat-value" style={{ color: '#00e5ff', textShadow: '0 0 16px rgba(0,229,255,.55)' }}>{current.rating}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Peak Rating</div>
                  <div className="stat-value">{current.peak}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Games</div>
                  <div className="stat-value">{current.games}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Wins</div>
                  <div className="stat-value" style={{ color: '#b6ff3c', textShadow: '0 0 14px rgba(182,255,60,.5)' }}>{current.wins}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Losses</div>
                  <div className="stat-value" style={{ color: '#ff6bb0', textShadow: '0 0 14px rgba(255,45,149,.5)' }}>{current.losses}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Draws</div>
                  <div className="stat-value" style={{ color: '#7d8ba8' }}>{current.draws}</div>
                </div>
                <div className="stat-card featured">
                  <div className="stat-title">Win Rate</div>
                  <div className="stat-value" style={{ color: '#a8f8ff' }}>{current.win}</div>
                </div>
              </div>

              <div className="graph-box">
                <div className="graph-title">Rating History</div>
                <div className="chart-wrapper">
                  <canvas ref={canvasRef} id="ratingChart" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Status;