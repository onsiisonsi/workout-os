import { useEffect, useMemo, useRef, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Activity,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  ExternalLink,
  HeartPulse,
  Library,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Save,
  Settings,
  TimerReset,
  Trash2,
  Video,
} from 'lucide-react';
import './App.css';
import { DAYS, FAVORITE_WORK, type Exercise, type WorkoutDay } from './program';

type SetEntry = {
  reps: string;
  weight: string;
  rir: string;
  done: boolean;
};

type ExerciseLog = Record<string, SetEntry[]>;

type SessionLog = {
  id: string;
  date: string;
  dayKey: string;
  dayTitle: string;
  exerciseLog: ExerciseLog;
  notes: string;
  readiness: number;
  pain: number;
  energy: number;
  completedAt?: string;
};

type Tab = 'today' | 'log' | 'library' | 'progress' | 'settings';

const STORAGE_KEY = 'onsii-workout-os-v1';
const DEVICE_KEY = 'onsii-workout-device-id';
const CLOUD_ENABLED = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

function todayIndex() {
  // Workout OS Day 1 is always Sunday. JS getDay() is already Sunday=0.
  return new Date().getDay();
}

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function uid() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = uid();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

function createEmptyLog(day: WorkoutDay, date = isoToday()): SessionLog {
  const exerciseLog: ExerciseLog = {};
  day.exercises.forEach((exercise) => {
    exerciseLog[exercise.id] = Array.from({ length: exercise.sets }, () => ({ reps: '', weight: '', rir: '', done: false }));
  });
  return {
    id: `${date}-${day.key}`,
    date,
    dayKey: day.key,
    dayTitle: day.title,
    exerciseLog,
    notes: '',
    readiness: 4,
    pain: 1,
    energy: 4,
  };
}

function loadLogs(): SessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLogs(logs: SessionLog[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function App() {
  const [tab, setTab] = useState<Tab>('today');
  const [selectedDayIndex, setSelectedDayIndex] = useState(todayIndex());
  const [logs, setLogs] = useState<SessionLog[]>(() => loadLogs());
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [timerSec, setTimerSec] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'local' | 'syncing' | 'synced' | 'error'>('local');
  const supabaseRef = useRef<SupabaseClient | null>(null);

  const day = DAYS[selectedDayIndex];
  const currentLog = useMemo(() => {
    const existing = logs.find((log) => log.date === isoToday() && log.dayKey === day.key);
    if (!existing) return createEmptyLog(day);
    const exerciseLog = { ...existing.exerciseLog };
    day.exercises.forEach((exercise) => {
      exerciseLog[exercise.id] = Array.from({ length: exercise.sets }, (_, i) =>
        existing.exerciseLog[exercise.id]?.[i] ?? { reps: '', weight: '', rir: '', done: false });
    });
    return { ...existing, dayTitle: day.title, exerciseLog };
  }, [logs, day]);

  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    supabaseRef.current = getSupabase();
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const int = window.setInterval(() => {
      setTimerSec((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          if ('vibrate' in navigator) navigator.vibrate([120, 80, 120]);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(int);
  }, [timerRunning]);

  function upsertLog(next: SessionLog) {
    setLogs((prev) => {
      const without = prev.filter((log) => log.id !== next.id);
      return [next, ...without].sort((a, b) => b.date.localeCompare(a.date));
    });
  }

  function updateSet(exerciseId: string, setIndex: number, patch: Partial<SetEntry>) {
    const base = currentLog;
    const entries = base.exerciseLog[exerciseId] ?? [];
    const nextEntries = entries.map((entry, idx) => (idx === setIndex ? { ...entry, ...patch } : entry));
    upsertLog({ ...base, exerciseLog: { ...base.exerciseLog, [exerciseId]: nextEntries } });
  }

  function updateMetric(key: 'readiness' | 'pain' | 'energy', value: number) {
    const base = currentLog;
    upsertLog({ ...base, [key]: value });
  }

  function updateNotes(notes: string) {
    const base = currentLog;
    upsertLog({ ...base, notes });
  }

  async function syncLog(log = currentLog) {
    const supabase = supabaseRef.current;
    if (!supabase) {
      setSyncStatus('local');
      return;
    }
    setSyncStatus('syncing');
    const { error } = await supabase.from('workout_logs').upsert({
      id: log.id,
      device_id: getDeviceId(),
      date: log.date,
      day_key: log.dayKey,
      day_title: log.dayTitle,
      payload: log,
      updated_at: new Date().toISOString(),
    });
    setSyncStatus(error ? 'error' : 'synced');
  }

  function completeWorkout() {
    const base = currentLog;
    const completed = { ...base, completedAt: new Date().toISOString() };
    upsertLog(completed);
    syncLog(completed);
  }

  function startRest(sec: number) {
    setTimerSec(sec || 90);
    setTimerRunning(true);
  }

  const completedSets = day.exercises.flatMap((exercise) => currentLog.exerciseLog[exercise.id] ?? []).filter((s) => s.done).length;
  const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completionPct = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-topline">
          <span className="pill"><HeartPulse size={14} /> Workout OS</span>
          <span className={`pill sync ${syncStatus}`}>{CLOUD_ENABLED ? syncStatus : 'local-first'}</span>
        </div>
        <h1>Talal's 3 Gym + 3 Home Program</h1>
        <p>Fixed gym days Sunday, Tuesday, and Thursday. Home movement Monday, Wednesday, and Friday. Strength, aesthetics, posture, heart health, mobility, joints, and fascia — 60 minutes with a 20-minute fallback.</p>
        <div className="hero-stats">
          <div><strong>{completionPct}%</strong><span>today</span></div>
          <div><strong>{day.totalMinutes}</strong><span>min</span></div>
          <div><strong>{logs.filter((l) => l.completedAt).length}</strong><span>done</span></div>
        </div>
      </header>

      <main>
        {tab === 'today' && (
          <section className="panel workout-panel">
            <div className="day-switcher">
              <button onClick={() => setSelectedDayIndex((i) => (i + 6) % 7)} aria-label="Previous day"><ChevronLeft /></button>
              <div>
                <p>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][selectedDayIndex]}</p>
                <h2>{day.title}</h2>
                <span>{day.subtitle}</span>
              </div>
              <button onClick={() => setSelectedDayIndex((i) => (i + 1) % 7)} aria-label="Next day"><ChevronRight /></button>
            </div>

            <div className="intent-card">
              <Activity size={18} />
              <p>{day.intent}</p>
            </div>

            <Readiness currentLog={currentLog} updateMetric={updateMetric} />

            <WorkoutBlock title="Daily mobility · 8-minute fallback" items={["Ankle rocks + calf raises 1 min; supported squat 1 min", "90/90 switches 2 min; couch stretch 1 min each side", "Thoracic rotations + overhead reaches 2 min", "Comfortable range only. No forcing or sharp pain."]} />
            <WorkoutBlock title="Prep" items={day.warmup} />

            <div className="exercise-list">
              {day.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  entries={currentLog.exerciseLog[exercise.id] ?? []}
                  updateSet={updateSet}
                  openVideo={setActiveExercise}
                  startRest={startRest}
                />
              ))}
            </div>

            <WorkoutBlock title="Finisher" items={day.finisher} />

            <label className="notes-label">Session notes</label>
            <textarea
              className="notes"
              value={currentLog.notes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Sleep, pain, pumps, exercises to adjust, anything Onsii should use next time…"
            />

            <button className="primary-action" onClick={completeWorkout}><Check /> Complete + save session</button>
          </section>
        )}

        {tab === 'log' && <LogView logs={logs} setLogs={setLogs} />}
        {tab === 'library' && <LibraryView openVideo={setActiveExercise} />}
        {tab === 'progress' && <ProgressView logs={logs} />}
        {tab === 'settings' && <SettingsView syncStatus={syncStatus} syncNow={() => syncLog()} />}
      </main>

      <TimerDock timerSec={timerSec} running={timerRunning} setRunning={setTimerRunning} reset={() => setTimerSec(activeExercise?.restSec ?? 90)} />
      <BottomNav tab={tab} setTab={setTab} />
      {activeExercise && <VideoSheet exercise={activeExercise} close={() => setActiveExercise(null)} />}
    </div>
  );
}

function Readiness({ currentLog, updateMetric }: { currentLog: SessionLog; updateMetric: (key: 'readiness' | 'pain' | 'energy', value: number) => void }) {
  return (
    <div className="readiness-grid">
      <Metric label="Readiness" value={currentLog.readiness} onChange={(v) => updateMetric('readiness', v)} />
      <Metric label="Pain" value={currentLog.pain} onChange={(v) => updateMetric('pain', v)} />
      <Metric label="Energy" value={currentLog.energy} onChange={(v) => updateMetric('energy', v)} />
    </div>
  );
}

function Metric({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="metric">
      <span>{label}</span>
      <strong>{value}/5</strong>
      <input type="range" min="1" max="5" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function WorkoutBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="workout-block">
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

function ExerciseCard({ exercise, entries, updateSet, openVideo, startRest }: {
  exercise: Exercise;
  entries: SetEntry[];
  updateSet: (exerciseId: string, setIndex: number, patch: Partial<SetEntry>) => void;
  openVideo: (exercise: Exercise) => void;
  startRest: (sec: number) => void;
}) {
  return (
    <article className={`exercise-card ${exercise.category}`}>
      <div className="exercise-head">
        <div>
          <span className="category">{exercise.category}</span>
          <h3>{exercise.name}</h3>
          <p>{exercise.sets} sets · {exercise.reps} · {exercise.rir}</p>
        </div>
        <button className="icon-button" onClick={() => openVideo(exercise)} aria-label="Technique videos"><Video /></button>
      </div>

      <div className="cue-list">
        {exercise.cues.map((cue) => <span key={cue}>{cue}</span>)}
      </div>

      <div className="set-table">
        {entries.map((entry, idx) => (
          <div className={`set-row ${entry.done ? 'done' : ''}`} key={idx}>
            <button className="set-number" onClick={() => updateSet(exercise.id, idx, { done: !entry.done })}>{entry.done ? <Check size={16} /> : idx + 1}</button>
            <input inputMode="decimal" placeholder="kg" value={entry.weight} onChange={(e) => updateSet(exercise.id, idx, { weight: e.target.value })} />
            <input inputMode="numeric" placeholder="reps" value={entry.reps} onChange={(e) => updateSet(exercise.id, idx, { reps: e.target.value })} />
            <input inputMode="numeric" placeholder="RIR" value={entry.rir} onChange={(e) => updateSet(exercise.id, idx, { rir: e.target.value })} />
            <button className="rest-button" onClick={() => startRest(exercise.restSec)}><Clock3 size={15} /> {exercise.restSec ? Math.round(exercise.restSec / 60 * 10) / 10 : 0}m</button>
          </div>
        ))}
      </div>
    </article>
  );
}

function TimerDock({ timerSec, running, setRunning, reset }: { timerSec: number; running: boolean; setRunning: (running: boolean) => void; reset: () => void }) {
  const mm = String(Math.floor(timerSec / 60)).padStart(2, '0');
  const ss = String(timerSec % 60).padStart(2, '0');
  return (
    <aside className="timer-dock">
      <TimerReset size={18} />
      <div><span>Rest</span><strong>{mm}:{ss}</strong></div>
      <button onClick={() => setRunning(!running)}>{running ? <Pause /> : <Play />}</button>
      <button onClick={reset}><RotateCcw /></button>
    </aside>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (tab: Tab) => void }) {
  const items: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'today', label: 'Today', icon: <Dumbbell /> },
    { key: 'log', label: 'Log', icon: <Save /> },
    { key: 'library', label: 'Library', icon: <Library /> },
    { key: 'progress', label: 'Progress', icon: <BarChart3 /> },
    { key: 'settings', label: 'Setup', icon: <Settings /> },
  ];
  return <nav className="bottom-nav">{items.map((item) => <button key={item.key} className={tab === item.key ? 'active' : ''} onClick={() => setTab(item.key)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}

function VideoSheet({ exercise, close }: { exercise: Exercise; close: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={close}>
      <section className="video-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grabber" />
        <div className="sheet-header">
          <div>
            <h2>{exercise.name}</h2>
            <p>Technique references. Use these to confirm setup and cues before heavy sets.</p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close technique sheet">×</button>
        </div>
        {exercise.videoId && (
          <div className="video-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${exercise.videoId}?rel=0`}
              title={`${exercise.name} technique video`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        )}
        <div className="video-links">
          {exercise.videoQueries.map((query) => (
            <a key={query} href={youtubeSearchUrl(query)} target="_blank" rel="noreferrer">
              <Video size={18} /> More: {query} <ExternalLink size={14} />
            </a>
          ))}
        </div>
        <div className="cue-list large">{exercise.cues.map((cue) => <span key={cue}>{cue}</span>)}</div>
        <button className="primary-action" onClick={close}>Back to workout</button>
      </section>
    </div>
  );
}

function LogView({ logs, setLogs }: { logs: SessionLog[]; setLogs: React.Dispatch<React.SetStateAction<SessionLog[]>> }) {
  return (
    <section className="panel">
      <h2>Training log</h2>
      <p className="muted">Local-first history. This is the longitudinal data I can use to optimize your plan.</p>
      <div className="log-list">
        {logs.length === 0 && <EmptyState text="No sessions yet. Complete today's workout to start the trend." />}
        {logs.map((log) => {
          const done = Object.values(log.exerciseLog).flat().filter((s) => s.done).length;
          return (
            <article className="log-card" key={log.id}>
              <div><strong>{log.date}</strong><span>{log.dayTitle} · {done} sets logged</span></div>
              <p>Readiness {log.readiness}/5 · Pain {log.pain}/5 · Energy {log.energy}/5</p>
              {log.notes && <blockquote>{log.notes}</blockquote>}
              <button className="danger" onClick={() => setLogs((prev) => prev.filter((l) => l.id !== log.id))}><Trash2 size={15} /> Delete</button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LibraryView({ openVideo }: { openVideo: (exercise: Exercise) => void }) {
  const all = DAYS.flatMap((d) => d.exercises).filter((exercise, idx, arr) => arr.findIndex((e) => e.id === exercise.id) === idx);
  return (
    <section className="panel">
      <h2>Exercise library</h2>
      <p className="muted">Tap any exercise for technique videos and cues.</p>
      <div className="favorites-note">
        <h3>Work OS notes baked in</h3>
        <ul>{FAVORITE_WORK.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="library-grid">
        {all.map((exercise) => <button className={`library-item ${exercise.category}`} key={exercise.id} onClick={() => openVideo(exercise)}><span>{exercise.category}</span><strong>{exercise.name}</strong><small>{exercise.reps}</small></button>)}
      </div>
    </section>
  );
}

function ProgressView({ logs }: { logs: SessionLog[] }) {
  const completed = logs.filter((l) => l.completedAt).length;
  const avgPain = logs.length ? (logs.reduce((s, l) => s + l.pain, 0) / logs.length).toFixed(1) : '—';
  const avgEnergy = logs.length ? (logs.reduce((s, l) => s + l.energy, 0) / logs.length).toFixed(1) : '—';
  const byDay = DAYS.map((day) => ({ day, count: logs.filter((l) => l.dayKey === day.key && l.completedAt).length }));
  return (
    <section className="panel">
      <h2>Progress dashboard</h2>
      <div className="progress-grid">
        <div><strong>{completed}</strong><span>completed sessions</span></div>
        <div><strong>{avgPain}</strong><span>avg pain</span></div>
        <div><strong>{avgEnergy}</strong><span>avg energy</span></div>
      </div>
      <h3>Consistency by day</h3>
      <div className="bar-list">
        {byDay.map(({ day, count }) => <div key={day.key}><span>{day.title}</span><div><i style={{ width: `${Math.min(count * 18, 100)}%` }} /></div><b>{count}</b></div>)}
      </div>
      <div className="insight-card">
        <h3>How this helps optimization</h3>
        <p>After 2–4 weeks, patterns in pain, energy, skipped sets, and load/reps will show whether to add upper volume, reduce lower fatigue, swap exercises, or adjust cardio placement.</p>
      </div>
    </section>
  );
}

function SettingsView({ syncStatus, syncNow }: { syncStatus: string; syncNow: () => void }) {
  const hasSupabase = CLOUD_ENABLED;
  return (
    <section className="panel">
      <h2>Setup</h2>
      <div className="setup-card">
        <h3>Storage</h3>
        <p>{hasSupabase ? 'Supabase environment variables detected. Logs can sync to the workout_logs table.' : 'Using local phone/browser storage now. Add Supabase env vars to enable cloud sync.'}</p>
        <button className="secondary-action" onClick={syncNow}><Save /> Sync current session</button>
        <span className={`pill sync ${syncStatus}`}>Status: {syncStatus}</span>
      </div>
      <div className="setup-card">
        <h3>Supabase schema</h3>
        <pre>{`create table if not exists public.workout_logs (\n  id text primary key,\n  device_id text not null,\n  date date not null,\n  day_key text not null,\n  day_title text not null,\n  payload jsonb not null,\n  updated_at timestamptz default now()\n);\n\nalter table public.workout_logs enable row level security;\n\ncreate policy "device insert" on public.workout_logs\nfor insert with check (true);\ncreate policy "device update" on public.workout_logs\nfor update using (true);\ncreate policy "device read" on public.workout_logs\nfor select using (true);`}</pre>
      </div>
      <div className="setup-card">
        <h3>Home screen</h3>
        <p>On iPhone: Share → Add to Home Screen. It behaves like a tiny workout app.</p>
      </div>
    </section>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty"><Plus /> <p>{text}</p></div>;
}

export default App;
