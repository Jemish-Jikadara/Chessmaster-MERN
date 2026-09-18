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
    gradient.addColorStop(0, 'rgba(129,182,76,0.4)');
    gradient.addColorStop(1, 'rgba(129,182,76,0.0)');

    if (!chartRef.current) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{
          label: 'Rating',
          data: [],
          borderColor: '#81b64c',
          backgroundColor: gradient,
          fill: true,
          borderWidth: 3,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#95c95e',
          pointBorderColor: '#0f1411',
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
              backgroundColor: '#1b241d',
              titleColor: '#aeb7aa',
              bodyColor: '#95c95e',
              borderColor: '#81b64c',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
            },
          },
          scales: {
            x: { ticks: { color: '#aeb7aa' }, grid: { color: 'rgba(255,255,255,0.03)' } },
            y: { ticks: { color: '#aeb7aa' }, grid: { color: 'rgba(255,255,255,0.03)' } },
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#95c95e', background: '#0f1411' }}>
        Loading stats...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff8585', background: '#0f1411' }}>
        {error || 'No stats yet — play a game first!'}
      </div>
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
        :root {
          --h-bg:#0f1411;
          --h-panel:#1b241d;
          --h-panel-2:#222d24;
          --h-line:rgba(255,255,255,0.09);
          --h-text:#f5f7f1;
          --h-muted:#aeb7aa;
          --h-soft:#d7ded0;
          --h-green:#81b64c;
          --h-green-2:#95c95e;
          --h-dark-green:#5d8b32;
          --h-gold:#f0c15b;
          --h-orange:#e58b42;
        }

        .status-page-body {
          background-color: var(--h-bg);
          background-image: radial-gradient(circle at 50% 20%, rgba(129,182,76,0.12) 0%, rgba(15,20,17,1) 75%);
          background-attachment: fixed;
          color: var(--h-text);
          font-family: Inter, sans-serif;
          min-height: 100vh;
        }

        .status-container { width: min(96vw, 1400px); margin: 24px auto; padding: 15px; }

        .status-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .status-title { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }

        .mode-tabs { display: flex; gap: 10px; background: rgba(255,255,255,0.045); padding: 5px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.09); width: fit-content; }
        .mode-btn { padding: 9px 24px; border: none; border-radius: 8px; cursor: pointer; background: transparent; color: var(--h-muted); transition: all 0.25s ease; font-size: 14px; font-weight: 600; }
        .mode-btn.active { background: linear-gradient(180deg,#9bd761,#7fb64a); color: #10180e; box-shadow: 0 4px 14px rgba(129,182,76,0.35); }
        .mode-btn:hover:not(.active) { color: var(--h-green-2); background: rgba(129,182,76,0.1); }

        .main-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
        .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }

        .stat-card { background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 18px 20px; transition: all 0.25s ease; position: relative; overflow: hidden; }
        .stat-card:hover { transform: translateY(-3px); border-color: rgba(129,182,76,0.35); box-shadow: 0 8px 20px rgba(129,182,76,0.15); }
        .stat-card.featured { grid-column: span 2; background: linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(129,182,76,0.08) 100%); border-color: rgba(129,182,76,0.35); }

        .stat-title { color: var(--h-muted); font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .stat-value { font-size: 26px; font-weight: 800; color: #ffffff; }
        .stat-card.featured .stat-value { color: var(--h-green-2); font-size: 32px; text-shadow: 0 0 10px rgba(129,182,76,0.2); }

        .graph-box { background: rgba(255,255,255,0.045); border-radius: 16px; border: 1px solid rgba(255,255,255,0.09); padding: 20px; min-height: 480px; display: flex; flex-direction: column; }
        .graph-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; color: var(--h-text); display: flex; align-items: center; gap: 8px; }
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
                  <div className="stat-value" style={{ color: 'var(--h-green-2)' }}>{current.rating}</div>
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
                  <div className="stat-value" style={{ color: '#ff8585' }}>{current.losses}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Draws</div>
                  <div className="stat-value" style={{ color: '#aeb7aa' }}>{current.draws}</div>
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