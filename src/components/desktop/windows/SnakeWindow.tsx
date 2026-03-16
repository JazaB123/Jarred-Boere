import React, { useCallback, useEffect, useRef, useState } from 'react';

const COLS = 20;
const ROWS = 20;
const CELL = 18;
const W = COLS * CELL;
const H = ROWS * CELL;

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Pt  = { x: number; y: number };

const rand = () => ({ x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) });

const initSnake = (): Pt[] => [
  { x: 10, y: 10 },
  { x: 9,  y: 10 },
  { x: 8,  y: 10 },
];

const SnakeWindow: React.FC = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const loopRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirRef     = useRef<Dir>('RIGHT');
  const nextDirRef = useRef<Dir>('RIGHT');
  const snakeRef   = useRef<Pt[]>(initSnake());
  const foodRef    = useRef<Pt>(rand());
  const aliveRef   = useRef(false);

  const [score,    setScore]    = useState(0);
  const [hiscore,  setHiscore]  = useState(0);
  const [phase,    setPhase]    = useState<'idle' | 'playing' | 'dead'>('idle');
  const scoreRef   = useRef(0);

  // ── Drawing ────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d')!;

    // Background
    ctx.fillStyle = '#05080f';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = '#0d1f2d';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, H); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(W, y * CELL); ctx.stroke();
    }

    // Food glow
    const f = foodRef.current;
    ctx.shadowColor = '#ff2d78';
    ctx.shadowBlur  = 14;
    ctx.fillStyle   = '#ff2d78';
    ctx.fillRect(f.x * CELL + 3, f.y * CELL + 3, CELL - 6, CELL - 6);
    ctx.shadowBlur = 0;

    // Snake
    snakeRef.current.forEach((seg, i) => {
      const isHead = i === 0;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur  = isHead ? 18 : 8;
      ctx.fillStyle   = isHead ? '#00f0ff' : `rgba(0,240,255,${Math.max(0.35, 1 - i * 0.04)})`;
      ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
    });
    ctx.shadowBlur = 0;
  }, []);

  // ── Game tick ──────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    if (!aliveRef.current) return;

    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const d = dirRef.current;
    const next: Pt = {
      x: head.x + (d === 'RIGHT' ? 1 : d === 'LEFT' ? -1 : 0),
      y: head.y + (d === 'DOWN'  ? 1 : d === 'UP'   ? -1 : 0),
    };

    // Wall collision
    if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
      aliveRef.current = false;
      setPhase('dead');
      draw();
      return;
    }
    // Self collision
    if (snakeRef.current.some(s => s.x === next.x && s.y === next.y)) {
      aliveRef.current = false;
      setPhase('dead');
      draw();
      return;
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
        setHiscore(h => Math.max(h, ns));
        return ns;
      });
    }

    draw();

    const speed = Math.max(80, 160 - scoreRef.current * 4);
    loopRef.current = setTimeout(tick, speed);
  }, [draw]);

  // ── Start / Restart ────────────────────────────────────────────────────────
  const start = useCallback(() => {
    if (loopRef.current) clearTimeout(loopRef.current);
    snakeRef.current  = initSnake();
    foodRef.current   = rand();
    dirRef.current    = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    scoreRef.current  = 0;
    setScore(0);
    aliveRef.current  = true;
    setPhase('playing');
    loopRef.current   = setTimeout(tick, 160);
  }, [tick]);

  // ── Keyboard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      };
      const d = map[e.key];
      if (!d) return;
      const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
      if (d !== opp[dirRef.current]) nextDirRef.current = d;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Initial draw on mount
  useEffect(() => { draw(); }, [draw]);

  // Cleanup on unmount
  useEffect(() => () => { if (loopRef.current) clearTimeout(loopRef.current); }, []);

  // ── D-pad helper ───────────────────────────────────────────────────────────
  const press = (d: Dir) => {
    const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (d !== opp[dirRef.current]) nextDirRef.current = d;
  };

  return (
    <div className="font-mono flex flex-col items-center gap-2 select-none">
      {/* Score bar */}
      <div className="w-full flex items-center justify-between text-xs px-1">
        <span style={{ color: '#00f0ff' }}>SCORE: <strong>{score}</strong></span>
        <span style={{ color: '#ff2d78' }}>BEST: <strong>{hiscore}</strong></span>
      </div>

      {/* Canvas */}
      <div className="relative" style={{ width: W, height: H }}>
        <canvas ref={canvasRef} width={W} height={H} className="block" />

        {/* Overlay — idle */}
        {phase === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(5,8,15,0.85)' }}>
            <div className="text-2xl font-bold tracking-widest" style={{ color: '#00f0ff', textShadow: '0 0 16px #00f0ff' }}>
              SNAKE
            </div>
            <div className="text-xs" style={{ color: '#ffffff55' }}>Arrow keys or WASD to move</div>
            <button onClick={start}
              className="win98-btn px-4 py-1 text-xs font-bold mt-1">
              START GAME
            </button>
          </div>
        )}

        {/* Overlay — dead */}
        {phase === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background: 'rgba(5,8,15,0.88)' }}>
            <div className="text-xl font-bold tracking-widest" style={{ color: '#ff2d78', textShadow: '0 0 14px #ff2d78' }}>
              GAME OVER
            </div>
            <div className="text-xs" style={{ color: '#00f0ff' }}>Score: <strong>{score}</strong></div>
            {score === hiscore && score > 0 && (
              <div className="text-xs" style={{ color: '#ff2d78' }}>✦ NEW HIGH SCORE ✦</div>
            )}
            <button onClick={start}
              className="win98-btn px-4 py-1 text-xs font-bold mt-1">
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* D-pad */}
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

export default SnakeWindow;
