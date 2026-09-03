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
    gradient.addColorStop(0, 'rgba(201, 162, 39, 0.4)');
    gradient.addColorStop(1, 'rgba(201, 162, 39, 0.0)');

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{
          label: 'Rating',
          data: [],
          borderColor: '#C9A227',
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#F0D265',
          pointBorderColor: '#080810',
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
              backgroundColor: '#13131d',
              titleColor: '#9ca3af',
              bodyColor: '#F0D265',
              borderColor: '#C9A227',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
            },
          },
          scales: {
            x: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.03)' } },
            y: { ticks: { color: '#6b7280' }, grid: { color: 'rgba(255,255,255,0.03)' } },
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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', background: '#080810' }}>Loading stats...</div>;
  }

  if (error || !stats) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171', background: '#080810' }}>{error || 'No stats yet — play a game first!'}</div>;
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
        :root {
            --status-gold: #C9A227;
            --status-gold-light: #F0D265;
            --status-gold-dark: #8F6B18;
            --status-bg-dark: #080810;
            --status-card-bg: #13131d;
            --status-bg-gold-glow: radial-gradient(circle at 50% 20%, rgba(201, 162, 39, 0.12) 0%, rgba(8, 8, 16, 1) 75%);
        }
        .status-page-body {
            background-color: var(--status-bg-dark);
            background-image: var(--status-bg-gold-glow);
            background-attachment: fixed;
            color: #f3f4f6;
            font-family: Inter, sans-serif;
            min-height: 100vh;
        }
        .status-container { width: min(96vw, 1400px); margin: 24px auto; padding: 15px; }
        .status-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .status-title { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }
        .mode-tabs { display: flex; gap: 10px; background: var(--status-card-bg); padding: 5px; border-radius: 12px; border: 1px solid rgba(201, 162, 39, 0.15); width: fit-content; }
        .mode-btn { padding: 9px 24px; border: none; border-radius: 8px; cursor: pointer; background: transparent; color: #9ca3af; transition: all 0.25s ease; font-size: 14px; font-weight: 600; }
        .mode-btn.active { background: linear-gradient(135deg, var(--status-gold-dark) 0%, var(--status-gold) 100%); color: #ffffff; box-shadow: 0 4px 14px rgba(201, 162, 39, 0.35); }
        .mode-btn:hover:not(.active) { color: var(--status-gold-light); background: rgba(201, 162, 39, 0.08); }
        .main-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .stat-card { background: var(--status-card-bg); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 18px 20px; transition: all 0.25s ease; position: relative; overflow: hidden; }
        .stat-card:hover { transform: translateY(-3px); border-color: var(--status-gold); box-shadow: 0 8px 20px rgba(201, 162, 39, 0.15); }
        .stat-card.featured { grid-column: span 2; background: linear-gradient(135deg, #13131d 0%, #1c1810 100%); border-color: rgba(201, 162, 39, 0.3); }
        .stat-title { color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #ffffff; }
        .stat-card.featured .stat-value { color: var(--status-gold-light); font-size: 32px; text-shadow: 0 0 10px rgba(240, 210, 101, 0.2); }
        .graph-box { background: var(--status-card-bg); border-radius: 16px; border: 1px solid rgba(201, 162, 39, 0.15); padding: 20px; min-height: 480px; display: flex; flex-direction: column; }
        .graph-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: #f3f4f6; display: flex; align-items: center; gap: 8px; }
        .chart-wrapper { position: relative; flex-grow: 1; width: 100%; }
        .graph-box canvas { width: 100% !important; height: 400px !important; }
        @media (max-width: 1100px) {
            .main-layout { grid-template-columns: 1fr; }
            .graph-box canvas { height: 320px !important; }
        }
        @media (max-width: 700px) {
            .status-container { width: 100%; padding: 12px; }
            .status-header { flex-direction: column; align-items: flex-start; }
            .mode-tabs { width: 100%; }
            .mode-btn { flex: 1; text-align: center; padding: 10px 0; }
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .graph-box canvas { height: 260px !important; }
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
                  <div className="stat-value" style={{ color: 'var(--status-gold-light)' }}>{current.rating}</div>
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
                  <div className="stat-value" style={{ color: '#4ade80' }}>{current.wins}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Losses</div>
                  <div className="stat-value" style={{ color: '#f87171' }}>{current.losses}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Draws</div>
                  <div className="stat-value" style={{ color: '#9ca3af' }}>{current.draws}</div>
                </div>
                <div className="stat-card featured">
                  <div className="stat-title">Win Rate</div>
                  <div className="stat-value">{current.win}</div>
                </div>
              </div>

              <div className="graph-box">
                <div className="graph-title">📈 Rating History</div>
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
