import React, { useCallback, useEffect, useRef, useState } from 'react';

const COLS = 20;
const ROWS = 20;
const CELL_MOBILE = 13;
const LS_KEY = 'snake-hiscore';

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pt  = { x: number; y: number };

const rand = () => ({ x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) });
const initSnake = (): Pt[] => [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];

// ── Shared game hook ────────────────────────────────────────────────────────
const useSnakeGame = (cellRef: React.MutableRefObject<number>) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const loopRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirRef      = useRef<Dir>('RIGHT');
  const nextDirRef  = useRef<Dir>('RIGHT');
  const snakeRef    = useRef<Pt[]>(initSnake());
  const foodRef     = useRef<Pt>(rand());
  const aliveRef    = useRef(false);
  const scoreRef    = useRef(0);

  const [score,  setScore]  = useState(0);
  const [hiscore, setHiscore] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_KEY) ?? '0', 10) || 0; } catch { return 0; }
  });
  const [phase, setPhase] = useState<'idle' | 'playing' | 'dead'>('idle');

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const c = cellRef.current;
    const cW = COLS * c;
    const cH = ROWS * c;

    ctx.fillStyle = '#05080f';
    ctx.fillRect(0, 0, cW, cH);

    ctx.strokeStyle = '#0d1f2d';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * c, 0); ctx.lineTo(x * c, cH); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * c); ctx.lineTo(cW, y * c); ctx.stroke();
    }

    const f = foodRef.current;
    const pad = Math.max(2, Math.floor(c * 0.17));
    ctx.shadowColor = '#ff2d78';
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = '#ff2d78';
    ctx.fillRect(f.x * c + pad, f.y * c + pad, c - pad * 2, c - pad * 2);
    ctx.shadowBlur = 0;

    snakeRef.current.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur  = isHead ? 18 : 8;
      ctx.fillStyle   = isHead ? '#00f0ff' : `rgba(0,240,255,${Math.max(0.35, 1 - i * 0.04)})`;
      ctx.fillRect(seg.x * c + 1, seg.y * c + 1, c - 2, c - 2);
    });
    ctx.shadowBlur = 0;
  }, [cellRef]);

  const tick = useCallback(() => {
    if (!aliveRef.current) return;
    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const d = dirRef.current;
    const next: Pt = {
      x: head.x + (d === 'RIGHT' ? 1 : d === 'LEFT' ? -1 : 0),
      y: head.y + (d === 'DOWN'  ? 1 : d === 'UP'   ? -1 : 0),
    };
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      aliveRef.current = false; setPhase('dead'); draw(); return;
    }
    if (snakeRef.current.some(s => s.x === next.x && s.y === next.y)) {
      aliveRef.current = false; setPhase('dead'); draw(); return;
    }
    const ate = next.x === foodRef.current.x && next.y === foodRef.current.y;
    const newSnake = [next, ...snakeRef.current];
    if (!ate) newSnake.pop();
    snakeRef.current = newSnake;
    if (ate) {
      foodRef.current = rand();
      scoreRef.current += 1;
      setScore(s => {
        const ns = s + 1;
        setHiscore(h => {
          const nh = Math.max(h, ns);
          try { localStorage.setItem(LS_KEY, String(nh)); } catch {}
          return nh;
        });
        return ns;
      });
    }
    draw();
    loopRef.current = setTimeout(tick, Math.max(80, 160 - scoreRef.current * 4));
  }, [draw]);

  const start = useCallback(() => {
    if (loopRef.current) clearTimeout(loopRef.current);
    snakeRef.current   = initSnake();
    foodRef.current    = rand();
    dirRef.current     = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    scoreRef.current   = 0;
    setScore(0);
    aliveRef.current   = true;
    setPhase('playing');
    loopRef.current    = setTimeout(tick, 160);
  }, [tick]);

  const press = useCallback((d: Dir) => {
    const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (d !== opp[dirRef.current]) nextDirRef.current = d;
  }, []);

  useEffect(() => () => { if (loopRef.current) clearTimeout(loopRef.current); }, []);

  return { canvasRef, score, hiscore, phase, start, press, draw };
};

// ── Desktop version ─────────────────────────────────────────────────────────
const SnakeDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRef      = useRef(18);
  const [canvasSize, setCanvasSize] = useState({ w: 360, h: 360 });
  const { canvasRef, score, hiscore, phase, start, press, draw } = useSnakeGame(cellRef);

  // Resize canvas to fill container, keeping square grid
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      const c = Math.floor(Math.min(width, height) / Math.max(COLS, ROWS));
      if (c < 1) return;
      cellRef.current = c;
      setCanvasSize({ w: c * COLS, h: c * ROWS });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Redraw whenever canvas size changes
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width  = canvasSize.w;
    cv.height = canvasSize.h;
    draw();
  }, [canvasSize, draw, canvasRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      };
      const d = map[e.key];
      if (!d) return;
      press(d);
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-[#05080f] flex items-center justify-center select-none font-mono">
      <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.h}
        className="block"
      />

      {/* Score overlay */}
      <div className="absolute top-2 left-0 right-0 flex justify-between px-3 pointer-events-none">
        <span className="text-xs" style={{ color: '#00f0ff', textShadow: '0 0 8px #00f0ff' }}>
          SCORE: <strong>{score}</strong>
        </span>
        <span className="text-xs" style={{ color: '#ff2d78', textShadow: '0 0 8px #ff2d78' }}>
          BEST: <strong>{hiscore}</strong>
        </span>
      </div>

      {/* Idle overlay */}
      {phase === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(5,8,15,0.85)' }}>
          <div className="text-3xl font-bold tracking-widest" style={{ color: '#00f0ff', textShadow: '0 0 20px #00f0ff' }}>SNAKE</div>
          <div className="text-xs" style={{ color: '#ffffff55' }}>Arrow keys or WASD to move</div>
          <button onClick={start} className="win98-btn px-6 py-1.5 text-sm font-bold mt-1">START GAME</button>
        </div>
      )}

      {/* Dead overlay */}
      {phase === 'dead' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: 'rgba(5,8,15,0.88)' }}>
          <div className="text-2xl font-bold tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 16px #ff2d78' }}>GAME OVER</div>
          <div className="text-sm" style={{ color: '#00f0ff' }}>Score: <strong>{score}</strong></div>
          {score === hiscore && score > 0 && (
            <div className="text-xs" style={{ color: '#ff2d78' }}>✦ NEW HIGH SCORE ✦</div>
          )}
          <button onClick={start} className="win98-btn px-6 py-1.5 text-sm font-bold mt-1">PLAY AGAIN</button>
        </div>
      )}
    </div>
  );
};

// ── Mobile version ──────────────────────────────────────────────────────────
const SnakeMobile: React.FC = () => {
  const cellRef = useRef(CELL_MOBILE);
  const W = COLS * CELL_MOBILE;
  const H = ROWS * CELL_MOBILE;
  const { canvasRef, score, hiscore, phase, start, press, draw } = useSnakeGame(cellRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      };
      const d = map[e.key];
      if (!d) return;
      press(d);
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="font-mono flex flex-col items-center gap-2 select-none">
      <div className="w-full flex items-center justify-between text-xs px-1">
        <span style={{ color: '#00f0ff' }}>SCORE: <strong>{score}</strong></span>
        <span style={{ color: '#ff2d78' }}>BEST: <strong>{hiscore}</strong></span>
      </div>

      <div className="relative" style={{ width: W, height: H }}>
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(5,8,15,0.85)' }}>
            <div className="text-2xl font-bold tracking-widest" style={{ color: '#00f0ff', textShadow: '0 0 16px #00f0ff' }}>SNAKE</div>
            <div className="text-xs" style={{ color: '#ffffff55' }}>Use D-pad to move</div>
            <button onClick={start} className="win98-btn px-4 py-1 text-xs font-bold mt-1">START GAME</button>
          </div>
        )}
        {phase === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(5,8,15,0.88)' }}>
            <div className="text-xl font-bold tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 14px #ff2d78' }}>GAME OVER</div>
            <div className="text-xs" style={{ color: '#00f0ff' }}>Score: <strong>{score}</strong></div>
            {score === hiscore && score > 0 && (
              <div className="text-xs" style={{ color: '#ff2d78' }}>✦ NEW HIGH SCORE ✦</div>
            )}
            <button onClick={start} className="win98-btn px-4 py-1 text-xs font-bold mt-1">PLAY AGAIN</button>
          </div>
        )}
      </div>

      <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(3, 28px)', gridTemplateRows: 'repeat(3, 28px)' }}>
        <div />
        <button className="win98-btn flex items-center justify-center text-xs font-bold p-0" onClick={() => press('UP')}>▲</button>
        <div />
        <button className="win98-btn flex items-center justify-center text-xs font-bold p-0" onClick={() => press('LEFT')}>◀</button>
        <div />
        <button className="win98-btn flex items-center justify-center text-xs font-bold p-0" onClick={() => press('RIGHT')}>▶</button>
        <div />
        <button className="win98-btn flex items-center justify-center text-xs font-bold p-0" onClick={() => press('DOWN')}>▼</button>
        <div />
      </div>
    </div>
  );
};

// ── Root — picks version based on screen width ───────────────────────────────
const SnakeWindow: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile ? <SnakeMobile /> : <SnakeDesktop />;
};

export default SnakeWindow;
