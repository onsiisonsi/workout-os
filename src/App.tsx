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

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rir?: string;
  restSec: number;
  category: 'strength' | 'hypertrophy' | 'mobility' | 'cardio' | 'prehab';
  cues: string[];
  videoQueries: string[];
};

type WorkoutDay = {
  key: string;
  title: string;
  subtitle: string;
  intent: string;
  totalMinutes: number;
  warmup: string[];
  exercises: Exercise[];
  finisher: string[];
};

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

const DAYS: WorkoutDay[] = [
  {
    key: 'sun',
    title: 'Day 1 Upper A',
    subtitle: 'Pull, posture, V-taper',
    intent: 'Build lats, upper back, rear delts, and posture while still pressing enough for aesthetics.',
    totalMinutes: 60,
    warmup: ['Dead hang 2 x 30–45s', 'Band pull-aparts 2 x 20', 'Scap push-ups 2 x 10', 'Thoracic extensions 1–2 min'],
    exercises: [
      ex('pullup', 'Weighted Pull-up / Lat Pulldown', 3, '6–10', '1–3 RIR', 120, 'strength', ['Chest tall, ribs down.', 'Drive elbows toward pockets.', 'Stop before shoulder rolls forward.'], ['weighted pull up technique athlean x', 'lat pulldown perfect form jeff cavaliere']),
      ex('incline-db', 'Incline DB Press', 3, '6–10', '1–2 RIR', 120, 'hypertrophy', ['Scaps slightly tucked.', 'Elbows 30–60° from body.', 'Control the bottom.'], ['incline dumbbell press perfect form', 'athlean x incline dumbbell press']),
      ex('chest-row', 'Chest-supported Row', 3, '8–12', '1–2 RIR', 90, 'hypertrophy', ['Pull with elbows, not hands.', 'Pause squeezed shoulder blades.', 'Keep chest on pad.'], ['chest supported row proper form', 'renaissance periodization row technique']),
      ex('lat-raise-a', 'Cable Lateral Raise', 3, '12–20', '0–2 RIR', 60, 'hypertrophy', ['Lead with elbow.', 'Stop just above shoulder height.', 'Keep traps quiet.'], ['cable lateral raise technique renaissance periodization']),
      ex('face-pull-a', 'Face Pull', 3, '15–25', '0–2 RIR', 45, 'prehab', ['Pull to forehead.', 'Rotate thumbs back.', 'Feel rear delts / external rotators.'], ['athlean x face pull perfect form']),
      ex('incline-curl', 'Incline DB Curl', 2, '10–15', '0–2 RIR', 60, 'hypertrophy', ['Shoulders back.', 'Full stretch.', 'No swinging.'], ['incline dumbbell curl technique']),
    ],
    finisher: ['Farmer carry 3 x 40–60m', 'Optional deep squat hold 2 min'],
  },
  {
    key: 'mon',
    title: 'Day 2 Run + Lower',
    subtitle: 'Easy run, KOT knees, ankles, hips',
    intent: 'Lock in Talal’s Day 2 run while keeping the lower-body work joint-friendly, resilient, and not so heavy that it ruins consistency.',
    totalMinutes: 60,
    warmup: ['Tibialis raises 2 x 20', 'Patrick step-down 2 x 10/side', 'Couch stretch 1 min/side', 'Deep squat pry 1–2 min'],
    exercises: [
      ex('day2-run', 'Day 2 Easy Run', 1, '25–35 min', 'Zone 2 / conversational', 0, 'cardio', ['Start slower than you want.', 'Nasal breathing or short-sentence pace.', 'Stop with legs feeling better, not destroyed.'], ['easy zone 2 running technique', 'peter attia zone 2 running']),
      ex('atg-split', 'ATG Split Squat Progression', 3, '6–10/side', '2 RIR', 90, 'mobility', ['Front knee tracks over toes.', 'Back glute squeezed.', 'Use support until range is owned.'], ['knees over toes atg split squat tutorial', 'ben patrick atg split squat form']),
      ex('reverse-sled', 'Reverse Sled Drag / Backward Treadmill', 1, '5–8 min', 'Smooth burn', 30, 'prehab', ['Upright torso.', 'Push through toes.', 'Continuous knee-friendly burn.'], ['knees over toes reverse sled drag tutorial']),
      ex('calf-tib', 'Calf + Tibialis Superset', 3, '12–20 each', '0–2 RIR', 45, 'prehab', ['Full calf stretch.', 'Pull toes high on tib raises.', 'Control both ends.'], ['knees over toes tibialis raise', 'calf raise proper form']),
      ex('ham-curl', 'Nordic Regression / Hamstring Curl', 2, '6–12', '1–3 RIR', 90, 'strength', ['Slow eccentric.', 'Hips extended if Nordic.', 'No cramping heroics after the run.'], ['nordic hamstring curl progression', 'hamstring curl technique']),
      ex('copenhagen', 'Copenhagen Plank / Adductor', 2, '20–40s/side', 'Controlled', 60, 'prehab', ['Straight line.', 'Adductor pulls you up.', 'Regress lever if needed.'], ['copenhagen plank progression technique']),
    ],
    finisher: ['Hip CARS 3 slow reps/side', '90/90 switches 2 x 8/side', 'Optional couch stretch 60s/side if run felt tight'],
  },
  {
    key: 'tue',
    title: 'Zone 2 + Flow',
    subtitle: 'Heart base + mobility',
    intent: 'Build aerobic base and recover while improving full-body positions.',
    totalMinutes: 60,
    warmup: ['5 min easy ramp on bike / incline walk / rower'],
    exercises: [
      ex('zone2', 'Zone 2 Cardio', 1, '40–45 min', 'Talk test', 0, 'cardio', ['Speak in short sentences.', 'Nose breathing if possible.', 'Do not drift into HIIT.'], ['peter attia zone 2 training explained']),
      ex('hang-flow', 'Hang + Squat + Spine Flow', 1, '10–15 min', 'Easy', 0, 'mobility', ['Dead hang.', 'Deep squat breathing.', 'Thoracic rotations.', 'Light Jefferson curl only if pain-free.'], ['ido portal squat mobility routine', 'full body mobility flow ido portal']),
    ],
    finisher: ['Walk 5 min easy if time remains'],
  },
  {
    key: 'wed',
    title: 'Day 4 Run + Upper Pump',
    subtitle: 'Run, shoulders, chest, arms',
    intent: 'Keep Talal’s Day 4 run, then hit the aesthetic work he likes without turning the session into a two-hour monster.',
    totalMinutes: 60,
    warmup: ['Band external rotations 2 x 15/side', 'Wall slides 2 x 10', 'Push-up plus 2 x 10', 'Light lateral raises 1 x 20'],
    exercises: [
      ex('day4-run', 'Day 4 Run', 1, '20–30 min', 'Easy-moderate / conversational', 0, 'cardio', ['Stay smooth and springy.', 'Leave one more gear in reserve.', 'If legs feel heavy, incline walk instead.'], ['easy run technique posture cadence', 'zone 2 running form']),
      ex('db-press', 'Flat DB / Machine Chest Press', 3, '8–12', '1–2 RIR', 90, 'hypertrophy', ['Controlled eccentric.', 'Stable shoulder.', 'Press through mid-hand.'], ['dumbbell bench press proper form renaissance periodization']),
      ex('one-arm-row', 'One-arm Cable Row', 3, '8–12/side', '1–2 RIR', 75, 'hypertrophy', ['Reach long.', 'Pull elbow back.', 'Do not twist excessively.'], ['one arm cable row technique']),
      ex('lat-raise-b', 'Cable Lateral Raise', 3, '15–25', '0–2 RIR', 45, 'hypertrophy', ['Constant tension.', 'No trap shrug.', 'Own the negative.'], ['cable lateral raise technique mike israetel']),
      ex('rear-delt-fly', 'Rear Delt Fly / Face Pull', 3, '15–25', '0–2 RIR', 45, 'prehab', ['Elbows wide.', 'Thumbs slightly out.', 'Rear delts and rotator cuff, not traps.'], ['rear delt fly technique', 'athlean x face pull perfect form']),
      ex('arms', 'Rope Pressdown + Cable Curl', 3, '10–15 each', '0–2 RIR', 60, 'hypertrophy', ['Superset.', 'Elbows stay fixed.', 'Full range.'], ['rope tricep pressdown technique', 'cable curl proper form']),
    ],
    finisher: ['Suitcase carry 2 x 40m/side', 'Optional dead hang 60s total'],
  },
  {
    key: 'thu',
    title: 'Full Body Strength',
    subtitle: 'Posterior chain + carries',
    intent: 'Become strong, robust, and athletic without grinding your joints down.',
    totalMinutes: 60,
    warmup: ['McGill curl-up 1 x 8/side', 'Side plank 1 x 30s/side', 'Glute bridge 2 x 12', 'Ankle rocks 1 x 15/side'],
    exercises: [
      ex('trap-dead', 'Trap-bar Deadlift / Deadlift', 3, '3–6', '2–3 RIR', 150, 'strength', ['No ugly reps.', 'Brace before pulling.', 'Stop when speed/form breaks.'], ['trap bar deadlift technique', 'deadlift form athlean x']),
      ex('front-squat', 'Front Squat / Goblet Squat', 3, '5–8', '1–3 RIR', 120, 'strength', ['Tall torso.', 'Knees track toes.', 'Own the bottom.'], ['front squat proper form squat university', 'goblet squat technique']),
      ex('dip', 'Weighted Dip / Push-up', 3, '6–12', '1–2 RIR', 90, 'hypertrophy', ['Shoulders down.', 'Controlled depth.', 'Use push-up if dips irritate shoulders.'], ['weighted dips proper form athlean x']),
      ex('rear-row', 'Rear-delt Row', 3, '10–15', '0–2 RIR', 60, 'prehab', ['Elbows out.', 'Pull to upper chest.', 'Rear delts, not low back.'], ['rear delt row technique']),
      ex('reverse-hyper', 'Reverse Hyper / Back Extension', 3, '10–15', '1–3 RIR', 60, 'prehab', ['Glutes finish.', 'No lumbar whipping.', 'Smooth tempo.'], ['reverse hyper technique', 'back extension glute focus technique']),
      ex('carry', 'Farmer Carry / Sled Push', 1, '5–8 min', 'Strong', 30, 'strength', ['Tall posture.', 'Quiet ribs.', 'Walk with control.'], ['farmer carry technique', 'sled push technique']),
    ],
    finisher: ['If energy is low, skip extra conditioning. Strength quality wins.'],
  },
  {
    key: 'fri',
    title: 'VO2 + Movement',
    subtitle: 'Heart ceiling + athletic flow',
    intent: 'One weekly high-intensity cardio dose plus Ido-style movement capacity.',
    totalMinutes: 60,
    warmup: ['10 min easy ramp', '2–3 short pickups before hard intervals'],
    exercises: [
      ex('vo2', 'VO2 Intervals', 1, '4 x 4 min hard / 3 min easy', '8–9/10', 180, 'cardio', ['Hard but repeatable.', 'Do not sprint the first interval.', 'Use bike/rower to protect joints.'], ['peter attia vo2 max intervals 4x4']),
      ex('movement-flow', 'Movement Flow', 1, '15–20 min', 'Playful', 0, 'mobility', ['Bear crawl.', 'Crab reach.', 'Cossack squat.', 'Hanging scap shrugs.', 'Spinal waves.'], ['ido portal movement flow beginner', 'nisma inyang mobility routine']),
    ],
    finisher: ['Cooldown 5 min easy', 'Optional sauna later if available'],
  },
  {
    key: 'sat',
    title: 'Recovery',
    subtitle: 'Walk, sauna, reset',
    intent: 'Adaptation day. Minimum dose only; do not turn this into a secret workout.',
    totalMinutes: 30,
    warmup: ['Easy walk outside if possible'],
    exercises: [
      ex('walk', 'Easy Walk', 1, '30–60 min', 'Very easy', 0, 'cardio', ['Nasal breathing.', 'Sunlight if possible.', 'Leave refreshed.'], ['zone 1 walking recovery benefits']),
      ex('minimum-dose', 'Daily Mobility Minimum', 1, '8 min', 'Easy', 0, 'mobility', ['Dead hang.', 'Deep squat.', 'Couch stretch.', 'Band pull-aparts.', 'Tibialis.'], ['daily mobility routine deep squat dead hang']),
    ],
    finisher: ['Sleep early. This is where gains consolidate.'],
  },
];

const FAVORITE_WORK = [
  'Day 1 is always Sunday; the weekly order runs Sunday → Saturday.',
  'Runs are fixed on Day 2 and Day 4.',
  'Keep the KOT staples: ATG split squat, reverse sled/backward treadmill, tibialis, Patrick step-down, couch stretch.',
  'Keep the posture/aesthetics staples: pull-ups or pulldowns, cable laterals, face pulls/rear delts, incline/DB pressing, curls/pressdowns.',
  'Keep the movement/prehab staples Talal has been doing: dead hangs, deep squat, 90/90 switches, CARS, carries, reverse hyper/back extension.',
];

function ex(id: string, name: string, sets: number, reps: string, rir: string, restSec: number, category: Exercise['category'], cues: string[], videoQueries: string[]): Exercise {
  return { id, name, sets, reps, rir, restSec, category, cues, videoQueries };
}

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
    return existing ?? createEmptyLog(day);
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
    const base = logs.find((log) => log.id === currentLog.id) ?? currentLog;
    const entries = base.exerciseLog[exerciseId] ?? [];
    const nextEntries = entries.map((entry, idx) => (idx === setIndex ? { ...entry, ...patch } : entry));
    upsertLog({ ...base, exerciseLog: { ...base.exerciseLog, [exerciseId]: nextEntries } });
  }

  function updateMetric(key: 'readiness' | 'pain' | 'energy', value: number) {
    const base = logs.find((log) => log.id === currentLog.id) ?? currentLog;
    upsertLog({ ...base, [key]: value });
  }

  function updateNotes(notes: string) {
    const base = logs.find((log) => log.id === currentLog.id) ?? currentLog;
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
    const base = logs.find((log) => log.id === currentLog.id) ?? currentLog;
    const completed = { ...base, completedAt: new Date().toISOString() };
    upsertLog(completed);
    syncLog(completed);
  }

  function startRest(sec: number) {
    setTimerSec(sec || 90);
    setTimerRunning(true);
  }

  const completedSets = Object.values(currentLog.exerciseLog).flat().filter((s) => s.done).length;
  const totalSets = day.exercises.reduce((sum, exercise) => sum + exercise.sets, 0);
  const completionPct = totalSets ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-topline">
          <span className="pill"><HeartPulse size={14} /> Workout OS</span>
          <span className={`pill sync ${syncStatus}`}>{CLOUD_ENABLED ? syncStatus : 'local-first'}</span>
        </div>
        <h1>Talal's Hybrid Longevity Program</h1>
        <p>Day 1 starts Sunday. Upper-body aesthetics, posture, KOT joints, mobility, and fixed Day 2 + Day 4 runs — one hour, minimal moving parts.</p>
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
                <p>{['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][selectedDayIndex]}</p>
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
        <div className="video-links">
          {exercise.videoQueries.map((query) => (
            <a key={query} href={youtubeSearchUrl(query)} target="_blank" rel="noreferrer">
              <Video size={18} /> {query} <ExternalLink size={14} />
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
