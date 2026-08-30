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
    intent: 'Gym day 1 of 3. Build the upper body you want while reinforcing shoulders, upper back, and posture.',
    totalMinutes: 60,
    warmup: ['8 min total', 'Dead hang 2 x 30–45s', 'Scap push-ups 2 x 10', 'Band pull-aparts 2 x 20', 'Thoracic rotations 8/side'],
    exercises: [
      ex('pullup', 'Pull-up / Lat Pulldown', 3, '6–10', '1–3 RIR', 120, 'strength', ['Chest tall; ribs down.', 'Drive elbows toward pockets.', 'Stop before shoulders roll forward.'], ['weighted pull up technique Renaissance Periodization', 'lat pulldown technique Renaissance Periodization'], '07TusZktXZw'),
      ex('incline-db', 'Incline DB Press', 3, '6–10', '1–2 RIR', 120, 'hypertrophy', ['Scaps slightly tucked.', 'Elbows 30–60° from body.', 'Control the stretched position.'], ['incline dumbbell press technique Renaissance Periodization'], '0f6-uCUKqgA'),
      ex('chest-row', 'Chest-supported Row', 3, '8–12', '1–2 RIR', 90, 'hypertrophy', ['Pull with elbows.', 'Pause with shoulder blades squeezed.', 'Keep chest on pad.'], ['chest supported row technique Renaissance Periodization'], '0UBRfiO4zDs'),
      ex('lat-raise', 'Cable Lateral Raise', 3, '12–20', '0–2 RIR', 60, 'hypertrophy', ['Lead with elbow.', 'Keep traps quiet.', 'Control the negative.'], ['cable lateral raise technique Renaissance Periodization'], 'lq7eLC30b9w'),
      ex('face-pull', 'Face Pull / Rear-delt Fly', 2, '15–25', '0–2 RIR', 45, 'prehab', ['Pull toward forehead.', 'Rotate thumbs back.', 'Rear delts and cuff—not traps.'], ['face pull perfect form ATHLEAN X'], 'ljgqer1ZpXg'),
      ex('arms', 'Cable Curl + Rope Pressdown', 2, '10–15 each', '0–2 RIR', 60, 'hypertrophy', ['Superset.', 'Keep elbows fixed.', 'Use full controlled range.'], ['cable curl and rope pressdown technique'], '8ZSKQ68VeMc'),
    ],
    finisher: ['8 min: farmer carries + deep squat breathing', '2 min slow breathing', '20-min minimum: prep + first two supersets'],
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
      ex('fascia-flow', 'Foot-to-Spine Fascial Flow', 1, '13 min', 'Easy and elastic', 0, 'mobility', ['Toe waves and calf raises.', 'Gentle pogos and Cossacks.', '90/90s, spinal waves, long reaches.'], ['multiplanar mobility flow feet ankles hips spine'], '3CtTOpYqeQ0'),
    ],
    finisher: ['2 min slow nasal breathing', '20-min minimum: 15 min brisk walk + 5 min flow'],
  },
  {
    key: 'tue',
    title: 'Gym B · Lower',
    subtitle: 'Strength + joint armour',
    intent: 'Gym day 2 of 3. Build useful lower-body strength while protecting knees, ankles, hips, hamstrings, and connective tissue.',
    totalMinutes: 60,
    warmup: ['8 min total', 'Tibialis raises 2 x 20', 'Patrick step-down 2 x 10/side', 'Ankle rocks 15/side', 'Couch stretch 45s/side', 'Light pogos 2 x 20'],
    exercises: [
      ex('trap-dead', 'Trap-bar Deadlift', 3, '3–6', '2–3 RIR', 150, 'strength', ['Brace before pulling.', 'Push the floor away.', 'No grinding or ugly reps.'], ['trap bar deadlift technique'], 'EsqwERaSTMI'),
      ex('front-squat', 'Front Squat / Goblet Squat', 3, '5–8', '1–3 RIR', 120, 'strength', ['Tall torso.', 'Knees track toes.', 'Own the bottom position.'], ['front squat technique Squat University'], '7pyxT5hqmQY'),
      ex('atg-split', 'ATG Split Squat', 3, '6–10/side', '2 RIR', 90, 'mobility', ['Knee tracks over toes.', 'Back glute squeezed.', 'Use support until range is owned.'], ['ATG split squat tutorial knees over toes guy'], '4qPJUSczLcM'),
      ex('ham-curl', 'Hamstring Curl / Nordic Regression', 2, '6–12', '1–3 RIR', 90, 'strength', ['Slow eccentric.', 'Keep hips extended.', 'Progress without cramping heroics.'], ['hamstring curl technique Renaissance Periodization'], 'jobEeklwrrs'),
      ex('calf-tib', 'Calf Raise + Tibialis Raise', 2, '12–20 each', '0–2 RIR', 45, 'prehab', ['Use a full calf stretch.', 'Pull toes high.', 'Control both directions.'], ['tibialis raise calf raise knees over toes'], 'gpa73t5B5gA'),
      ex('reverse-sled', 'Reverse Sled / Backward Treadmill', 1, '8 min', 'Smooth burn', 30, 'prehab', ['Stay tall.', 'Push through toes.', 'Keep continuous knee-friendly tension.'], ['reverse sled drag knees over toes tutorial'], '-xmtgMrZrqU'),
    ],
    finisher: ['2 min hip/ankle downshift', '20-min minimum: prep + trap-bar deadlift + ATG split squat'],
  },
  {
    key: 'wed',
    title: 'Home B · Strength',
    subtitle: 'Bodyweight + elastic tissue',
    intent: 'Home day 2 of 3. Keep full-body strength and joint capacity moving forward without equipment.',
    totalMinutes: 60,
    warmup: ['8 min joint flow', 'Shoulder and hip CARs', 'Deep squat breathing', 'Spinal waves', 'Easy bear crawl'],
    exercises: [
      ex('pushup', 'Push-up', 3, 'Near technical failure', '1–2 RIR', 60, 'hypertrophy', ['Body moves as one piece.', 'Hands screw into floor.', 'Stop before form collapses.'], ['push up perfect form ATHLEAN X'], 'iIa2-uVHzM0'),
      ex('split-squat-home', 'Bodyweight Split Squat', 3, '10–20/side', '1–2 RIR', 60, 'strength', ['Stay balanced.', 'Front foot remains rooted.', 'Use slow lowering to progress.'], ['bodyweight split squat technique'], 'Ms7aIhDm0uc'),
      ex('pike-pushup', 'Pike Push-up', 3, '6–15', '1–2 RIR', 60, 'hypertrophy', ['Hips high.', 'Head travels forward and down.', 'Press the floor away.'], ['pike push up technique'], 'fXgou2W10ok'),
      ex('sliding-ham', 'Sliding Hamstring Curl', 3, '8–15', '1–3 RIR', 60, 'strength', ['Keep hips lifted.', 'Move slowly.', 'Shorten range if hamstrings cramp.'], ['sliding hamstring curl technique'], 'UaecXxAgsKA'),
      ex('prone-ytw', 'Prone Y-T-W', 2, '8–12 each', 'Controlled', 30, 'prehab', ['Keep neck long.', 'Move from shoulder blades.', 'Use no momentum.'], ['prone Y T W posture exercise'], 'QdGTI4Lshg4'),
      ex('copenhagen', 'Copenhagen Plank + Reverse Crunch', 2, '20–40s + 10–20', 'Controlled', 45, 'prehab', ['Keep a straight line.', 'Regress the lever if needed.', 'Curl the pelvis—not the neck.'], ['copenhagen plank technique'], 'kD1t1hWzIDE'),
      ex('elastic-flow', 'Pogos + Lateral Hops + Crawl', 1, '8 min', 'Light and springy', 0, 'mobility', ['Start with low contacts.', 'Stay quiet and elastic.', 'Stop if Achilles or knees complain.'], ['pogo hops beginner technique'], 'j0nl5dWuqN4'),
    ],
    finisher: ['2 min breathing', '20-min minimum: warm-up + push-up/split-squat superset'],
  },
  {
    key: 'thu',
    title: 'Gym C · Mixed',
    subtitle: 'Full body + pump + VO₂',
    intent: 'Gym day 3 of 3. Complete the strength week, add upper-body volume, and train your cardiovascular ceiling.',
    totalMinutes: 60,
    warmup: ['8 min total', 'Band external rotations 2 x 15', 'Wall slides 2 x 10', 'Glute bridges 2 x 12', 'Deep squat pry 60s'],
    exercises: [
      ex('flat-db', 'Flat DB / Machine Press', 3, '8–12', '1–2 RIR', 75, 'hypertrophy', ['Control the eccentric.', 'Keep shoulders stable.', 'Press through mid-hand.'], ['flat dumbbell bench press technique Renaissance Periodization'], 'YQ2s_Y7g5Qk'),
      ex('cable-row', 'One-arm Cable Row', 3, '8–12/side', '1–2 RIR', 75, 'hypertrophy', ['Reach long.', 'Pull elbow toward hip.', 'Avoid excessive torso rotation.'], ['one arm cable row proper form'], 'NYok5zjbDcw'),
      ex('rdl', 'Romanian Deadlift', 3, '6–10', '2 RIR', 90, 'strength', ['Push hips back.', 'Keep the weight close.', 'Stop at your controlled hamstring range.'], ['Romanian deadlift technique Renaissance Periodization'], 'ymL6b50Al6U'),
      ex('lat-pulldown', 'Lat Pulldown', 3, '8–12', '1–2 RIR', 75, 'hypertrophy', ['Set shoulders first.', 'Drive elbows down.', 'Do not turn it into a row.'], ['lat pulldown technique Renaissance Periodization'], '3PmWIGn0dwU'),
      ex('delt-pump', 'Cable Lateral + Rear-delt Fly', 3, '12–20 each', '0–2 RIR', 45, 'hypertrophy', ['Superset.', 'Keep traps quiet.', 'Own the stretched position.'], ['rear delt cable fly proper form'], 'JENKmsEZQO8'),
      ex('vo2', 'VO₂ Intervals', 1, '4 x 3 min hard / 2 min easy', '8–9/10', 120, 'cardio', ['Hard but repeatable.', 'Do not sprint the first interval.', 'Bike or rower is joint-friendly.'], ['4x4 VO2 max intervals protocol'], '3r0Kd3G4kek'),
    ],
    finisher: ['2 min easy cooldown', '20-min minimum: prep + first two supersets'],
  },
  {
    key: 'fri',
    title: 'Home C · Movement',
    subtitle: 'Aerobic + fascia flow',
    intent: 'Home day 3 of 3. Move through multiple planes, practice elastic rhythm, and finish the week better than you started it.',
    totalMinutes: 60,
    warmup: ['5 min easy walk', 'Ankle circles', 'Gentle marching and reaches'],
    exercises: [
      ex('easy-cardio-fri', 'Easy Walk / Run', 1, '30 min', 'Conversational', 0, 'cardio', ['Keep it easy.', 'Walk/run is allowed.', 'Finish with energy left.'], ['easy running and walking technique'], '3Hobt4Pb4iA'),
      ex('movement-flow', 'Multiplanar Movement Flow', 1, '23 min', 'Playful and smooth', 0, 'mobility', ['March, skip, and shuffle.', 'Cossack, bear crawl, crab reach.', '90/90s and spinal waves.'], ['beginner movement flow bear crawl crab reach cossack'], '14BjRxE7f1o'),
    ],
    finisher: ['2 min relaxed breathing', '20-min minimum: 15 min walk/run + 5 min movement flow'],
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
  'Every main session is 60 minutes with a 20-minute minimum-dose fallback.',
  'Priorities covered: upper aesthetics, posture, full-body strength, KOT joints, mobility, Zone 2, VO₂, and elastic multiplanar fascia work.',
  'Fascia is trained through progressive loading, long ranges, hops, varied planes, carries, crawling, and rhythm—not magical release techniques.',
];
