export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rir?: string;
  restSec: number;
  category: 'strength' | 'hypertrophy' | 'mobility' | 'cardio' | 'prehab';
  cues: string[];
  videoQueries: string[];
  videoId?: string;
};

export type WorkoutDay = {
  key: string;
  title: string;
  subtitle: string;
  intent: string;
  totalMinutes: number;
  warmup: string[];
  exercises: Exercise[];
  finisher: string[];
};

function ex(
  id: string,
  name: string,
  sets: number,
  reps: string,
  rir: string,
  restSec: number,
  category: Exercise['category'],
  cues: string[],
  videoQueries: string[],
  videoId?: string,
): Exercise {
  return { id, name, sets, reps, rir, restSec, category, cues, videoQueries, videoId };
}

export const DAYS: WorkoutDay[] = [
  {
    key: 'sun',
    title: 'Gym A · Upper',
    subtitle: 'Aesthetics, posture, V-taper',
    intent: 'October 4–10 · Full body, upper emphasis. 8 min prep + 32 min strength + 12 min cardio + 8 min mobility. Leave 2–3 reps in reserve; stop accessories when the block ends.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Thoracic rotations 8/side', 'Wall slides 10', 'Scap push-ups 10', 'Squat-to-stand 6'],
    exercises: [
      ex('incline-db', 'Incline DB Press', 3, '6–10', '1–2 RIR', 120, 'hypertrophy', ['Scaps slightly tucked.', 'Elbows 30–60° from body.', 'Control the stretched position.'], ['incline dumbbell press technique Renaissance Periodization'], '0f6-uCUKqgA'),
      ex('pullup', 'Pull-up / Lat Pulldown', 3, '6–10', '1–3 RIR', 120, 'strength', ['Chest tall; ribs down.', 'Drive elbows toward pockets.', 'Stop before shoulders roll forward.'], ['weighted pull up technique Renaissance Periodization', 'lat pulldown technique Renaissance Periodization'], '07TusZktXZw'),
      ex('front-squat', 'Goblet Squat / Leg Press', 2, '5–8', '1–3 RIR', 120, 'strength', ['Tall torso.', 'Knees track toes.', 'Own the bottom position.'], ['front squat technique Squat University'], '7pyxT5hqmQY'),
      ex('chest-row', 'Chest-supported Row', 2, '8–12', '1–2 RIR', 90, 'hypertrophy', ['Pull with elbows.', 'Pause with shoulder blades squeezed.', 'Keep chest on pad.'], ['chest supported row technique Renaissance Periodization'], '0UBRfiO4zDs'),
      ex('lat-raise', 'Cable Lateral Raise', 2, '12–20', '0–2 RIR', 60, 'hypertrophy', ['Lead with elbow.', 'Keep traps quiet.', 'Control the negative.'], ['cable lateral raise technique Renaissance Periodization'], 'lq7eLC30b9w'),
      ex('face-pull', 'Face Pull / Rear-delt Fly', 2, '15–25', '0–2 RIR', 45, 'prehab', ['Pull toward forehead.', 'Rotate thumbs back.', 'Rear delts and cuff—not traps.'], ['face pull perfect form ATHLEAN X'], 'ljgqer1ZpXg'),
      ex('gym-easy-cardio', 'Conversational Bike / Incline Walk', 1, '12 min', 'Easy-moderate', 0, 'cardio', ['Talk in sentences.', 'No hard finish.'], ['zone 2 training'], 'z82GCNXdLAA'),
    ],
    finisher: ['8 min mobility: supported hang, chest stretch, 90/90 switches, couch stretch', '20-min fallback: 4 min prep, 10 min squat/press/pull (one set each), 3 min cardio, 3 min mobility'],
  },
  {
    key: 'mon',
    title: 'Home A · Aerobic',
    subtitle: 'Zone 2 + fascial mobility',
    intent: 'Home day 1 of 3. Build your aerobic base and give feet, calves, hips, and spine varied rhythmic movement.',
    totalMinutes: 60,
    warmup: ['5 min easy walk', 'Foot tripod and toe waves', 'Easy ankle circles'],
    exercises: [
      ex('zone2-home', 'Zone 2 Walk / Easy Run', 1, '40 min', 'Conversational', 0, 'cardio', ['Speak in short sentences.', 'Start slower than you want.', 'Finish refreshed—not emptied.'], ['Peter Attia zone 2 training explained'], 'z82GCNXdLAA'),
      ex('fascia-flow', 'Foot-to-Spine Fascial Flow', 1, '15 min', 'Easy and elastic', 0, 'mobility', ['Toe waves and calf raises.', 'Gentle pogos and Cossacks.', '90/90s, spinal waves, long reaches.'], ['multiplanar mobility flow feet ankles hips spine'], '3CtTOpYqeQ0'),
    ],
    finisher: ['20-min minimum: 15 min brisk walk + 5 min flow'],
  },
  {
    key: 'tue',
    title: 'Gym B · Lower',
    subtitle: 'Strength + joint armour',
    intent: 'October 4–10 · Full body, lower emphasis. 8 min prep + 32 min strength + 12 min cardio + 8 min mobility. Keep push, pull, legs and cardio even on a busy day.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Ankle rocks 15/side', 'Patrick step-downs 8/side', 'Supported split squats 6/side', 'Hip circles 3/side'],
    exercises: [
      ex('trap-dead', 'Trap-bar Deadlift', 2, '3–6', '2–3 RIR', 150, 'strength', ['Brace before pulling.', 'Push the floor away.', 'No grinding or ugly reps.'], ['trap bar deadlift technique'], 'EsqwERaSTMI'),
      ex('atg-split', 'ATG Split Squat', 2, '6–10/side', '2 RIR', 90, 'mobility', ['Knee tracks over toes.', 'Back glute squeezed.', 'Use support until range is owned.'], ['ATG split squat tutorial knees over toes guy'], '4qPJUSczLcM'),
      ex('flat-db', 'Flat DB / Machine Press', 2, '8–12', '1–2 RIR', 75, 'hypertrophy', ['Control the eccentric.', 'Keep shoulders stable.', 'Press through mid-hand.'], ['flat dumbbell bench press technique Renaissance Periodization'], 'YQ2s_Y7g5Qk'),
      ex('cable-row', 'One-arm Cable Row', 2, '8–12/side', '1–2 RIR', 75, 'hypertrophy', ['Reach long.', 'Pull elbow toward hip.', 'Avoid excessive torso rotation.'], ['one arm cable row proper form'], 'NYok5zjbDcw'),
      ex('ham-curl', 'Hamstring Curl / Nordic Regression', 2, '6–12', '1–3 RIR', 90, 'strength', ['Slow eccentric.', 'Keep hips extended.', 'Progress without cramping heroics.'], ['hamstring curl technique Renaissance Periodization'], 'jobEeklwrrs'),
      ex('calf-tib', 'Calf Raise + Tibialis Raise', 2, '12–20 each', '0–2 RIR', 45, 'prehab', ['Use a full calf stretch.', 'Pull toes high.', 'Control both directions.'], ['tibialis raise calf raise knees over toes'], 'gpa73t5B5gA'),
      ex('gym-easy-cardio', 'Conversational Bike / Incline Walk', 1, '12 min', 'Easy-moderate', 0, 'cardio', ['Talk in sentences.', 'No hard finish.'], ['zone 2 training'], 'z82GCNXdLAA'),
    ],
    finisher: ['8 min mobility: couch stretch, adductor rock-backs, 90/90s, thoracic rotations', '20-min fallback: 4 min prep, 10 min hinge/press/pull (one set each), 3 min cardio, 3 min mobility'],
  },
  {
    key: 'wed',
    title: 'Home B · Mobility',
    subtitle: 'Movement quality + balance',
    intent: 'Movement practice and recovery—not another hard strength workout.',
    totalMinutes: 60,
    warmup: ['Start with the joint-circle block below; it is included in the 60 minutes.'],
    exercises: [
      ex('joint-circles', 'Joint Circles + Spine Flow', 1, '10 min', 'Comfortable range', 0, 'mobility', ['Slow shoulder and hip circles.', 'No sharp pain or forcing.'], ['joint mobility flow'], '3CtTOpYqeQ0'),
      ex('movement-practice', 'Crawl + Cossack + Balance Practice', 1, '20 min', 'Easy practice', 0, 'mobility', ['Bear crawl, crab reach, supported Cossack.', 'Squat transitions and single-leg balance.', 'Quality over fatigue.'], ['beginner animal movement'], '14BjRxE7f1o'),
      ex('wed-walk', 'Easy Walk', 1, '20 min', 'Very easy', 0, 'cardio', ['Recovery pace.'], ['walking'], '3Hobt4Pb4iA'),
      ex('wed-stretch', 'Relaxed Mobility + Breathing', 1, '10 min', 'Gentle', 0, 'mobility', ['90/90, couch stretch, thoracic rotation.', 'No forcing.'], ['hip mobility'], 'WUKHM6-ekJM'),
    ],
    finisher: ['20-min fallback: 5 min joint circles, 10 min easy movement, 5 min relaxed mobility'],
  },
  {
    key: 'thu',
    title: 'Gym C · Mixed',
    subtitle: 'Full body + pump + VO₂',
    intent: 'October 4–10 · Balanced full body. 8 min prep + 32 min strength + 12 min cardio + 8 min mobility. Brief intervals are optional; steady cardio if returning after a gap.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Hip hinges 10', 'Squat-to-stand 6', 'Wall slides 10', 'Ankle rocks 15/side'],
    exercises: [
      ex('front-squat', 'Front Squat / Goblet Squat', 2, '5–8', '1–3 RIR', 120, 'strength', ['Tall torso.', 'Knees track toes.', 'Own the bottom position.'], ['front squat technique Squat University'], '7pyxT5hqmQY'),
      ex('flat-db', 'Flat DB / Machine Press', 2, '8–12', '1–2 RIR', 75, 'hypertrophy', ['Control the eccentric.', 'Keep shoulders stable.', 'Press through mid-hand.'], ['flat dumbbell bench press technique Renaissance Periodization'], 'YQ2s_Y7g5Qk'),
      ex('cable-row', 'One-arm Cable Row', 2, '8–12/side', '1–2 RIR', 75, 'hypertrophy', ['Reach long.', 'Pull elbow toward hip.', 'Avoid excessive torso rotation.'], ['one arm cable row proper form'], 'NYok5zjbDcw'),
      ex('rdl', 'Romanian Deadlift', 2, '6–10', '2 RIR', 90, 'strength', ['Push hips back.', 'Keep the weight close.', 'Stop at your controlled hamstring range.'], ['Romanian deadlift technique Renaissance Periodization'], 'ymL6b50Al6U'),
      ex('delt-pump', 'Cable Lateral + Rear-delt Fly', 2, '12–20 each', '0–2 RIR', 45, 'hypertrophy', ['Superset.', 'Keep traps quiet.', 'Own the stretched position.'], ['rear delt cable fly proper form'], 'JENKmsEZQO8'),
      ex('vo2', 'VO₂ Intervals', 1, '2 min easy + 4 x (1 min hard / 1 min easy) + 2 min easy', '8–9/10', 120, 'cardio', ['Hard but repeatable.', 'Do not sprint the first interval.', 'Bike or rower is joint-friendly.'], ['4x4 VO2 max intervals protocol'], '3r0Kd3G4kek'),
    ],
    finisher: ['8 min mobility: hip-flexor stretch, calf stretch, overhead reaches, spinal rotations', 'Intervals: repeatable effort, never all-out; steady cardio if returning after a gap', '20-min fallback: 4 min prep, 10 min squat/press/pull (one set each), 3 min cardio, 3 min mobility'],
  },
  {
    key: 'fri',
    title: 'Home C · Movement',
    subtitle: 'Aerobic + fascia flow',
    intent: 'Home day 3 of 3. Move through multiple planes, practice elastic rhythm, and finish the week better than you started it.',
    totalMinutes: 60,
    warmup: ['5 min easy walk', 'Ankle circles', 'Gentle marching and reaches'],
    exercises: [
      ex('easy-cardio-fri', 'Easy Walk / Run', 1, '35 min', 'Conversational', 0, 'cardio', ['Keep it easy.', 'Walk/run is allowed.', 'Finish with energy left.'], ['easy running and walking technique'], '3Hobt4Pb4iA'),
      ex('movement-flow', 'Multiplanar Movement Flow', 1, '20 min', 'Playful and smooth', 0, 'mobility', ['March, skip, and shuffle.', 'Cossack, bear crawl, crab reach.', '90/90s and spinal waves.'], ['beginner movement flow bear crawl crab reach cossack'], '14BjRxE7f1o'),
    ],
    finisher: ['20-min minimum: 15 min walk/run + 5 min movement flow'],
  },
  {
    key: 'sat',
    title: 'Recovery',
    subtitle: 'Walk, mobility, sauna, reset',
    intent: 'Adaptation day. Recover on purpose; do not turn this into a hidden seventh workout.',
    totalMinutes: 30,
    warmup: ['Easy outdoor walk if possible'],
    exercises: [
      ex('walk', 'Recovery Walk', 1, '30–60 min', 'Very easy', 0, 'cardio', ['Nasal breathing.', 'Sunlight if practical.', 'Leave refreshed.'], ['walking exercise recovery benefits'], '3Hobt4Pb4iA'),
      ex('mobility-min', 'Eight-minute Mobility Minimum', 1, '8 min', 'Easy', 0, 'mobility', ['Deep squat.', 'Couch stretch.', '90/90 switches and thoracic rotations.'], ['daily mobility routine deep squat 90 90'], 'WUKHM6-ekJM'),
    ],
    finisher: ['Optional sauna', 'Sleep early—adaptation is the work today'],
  },
];

export const FAVORITE_WORK = [
  'Gym days are fixed: Sunday, Tuesday, Thursday.',
  'Home days are fixed: Monday, Wednesday, Friday. Saturday is recovery.',
  'October 4–10: daily mobility. Gym blocks: 8 prep / 32 strength / 12 cardio / 8 mobility. Home sessions are opportunities, not workout debt.',
  'Priorities covered: upper aesthetics, posture, full-body strength, KOT joints, mobility, Zone 2, VO₂, and elastic multiplanar fascia work.',
  'Expert-informed coaching synthesis by Onsii—not designed or endorsed by the named experts.',
  'Daily 8-min fallback: ankle rocks/calves 1 min, supported squat 1 min, 90/90s 2 min, couch stretch 1 min/side, thoracic rotations/reaches 2 min.',
  'Fascia is trained through progressive loading, long ranges, hops, varied planes, carries, crawling, and rhythm—not magical release techniques.',
];
