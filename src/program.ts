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
    title: 'Gym A · Dumbbells',
    subtitle: 'One bench + dumbbells',
    intent: 'October 4–10 · Full body in one strength zone. 8 min prep / 32 min strength / 12 min cardio / 8 min mobility. Time-saver pairs: 1+2, 3+4, 5+6. Two rounds to start. Brief transition between exercises; rest 60–90 sec after the pair or longer to preserve form. One transition to cardio only.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Thoracic rotations 8/side', 'Wall slides 10', 'Scap push-ups 10', 'Squat-to-stand 6'],
    exercises: [
      ex('db-press', 'DB Bench / Incline Press', 2, '8–12', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['DB Bench / Incline Press proper form'], '0f6-uCUKqgA'),
      ex('db-row', 'Supported One-arm DB Row', 2, '8–12/side', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Supported One-arm DB Row proper form'], '6gvmcqr226U'),
      ex('db-squat', 'DB Goblet Squat', 2, '8–12', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['DB Goblet Squat proper form'], '7pyxT5hqmQY'),
      ex('db-lateral', 'DB Lateral Raise', 2, '12–20', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['DB Lateral Raise proper form']),
      ex('db-rdl', 'DB Romanian Deadlift', 2, '8–12', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['DB Romanian Deadlift proper form'], 'ymL6b50Al6U'),
      ex('db-carry', 'DB Suitcase March / Carry', 2, '30–45 sec/side', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['DB Suitcase March / Carry proper form']),
      ex('gym-easy-cardio', 'Bike / Incline Walk', 1, '12 min', 'Conversational', 0, 'cardio', ['One transition after strength.', 'If needed: brisk walking in the same functional space.'], ['zone 2 training'], 'z82GCNXdLAA'),
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
    title: 'Gym B · Cables',
    subtitle: 'One adjustable cable station',
    intent: 'October 4–10 · Full body in one strength zone. 8 min prep / 32 min strength / 12 min cardio / 8 min mobility. Time-saver pairs: 1+2, 3+4, 5+6. Two rounds to start. Brief transition between exercises; rest 60–90 sec after the pair or longer to preserve form. One transition to cardio only.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Ankle rocks 15/side', 'Patrick step-downs 8/side', 'Supported split squats 6/side', 'Hip circles 3/side'],
    exercises: [
      ex('cable-press', 'Standing Cable Chest Press', 2, '8–12', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Standing Cable Chest Press proper form']),
      ex('cable-row', 'Cable Row', 2, '8–12', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Cable Row proper form'], 'NYok5zjbDcw'),
      ex('cable-squat', 'Cable-resisted Squat', 2, '10–15', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Cable-resisted Squat proper form']),
      ex('cable-lateral', 'Cable Lateral Raise', 2, '12–20/side', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Cable Lateral Raise proper form'], 'lq7eLC30b9w'),
      ex('cable-hinge', 'Cable Pull-through', 2, '10–15', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Cable Pull-through proper form'], 'pv8e6OSyETE'),
      ex('cable-facepull', 'Cable Face Pull', 2, '12–20', '2–3 RIR', 75, 'prehab', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Cable Face Pull proper form'], 'ljgqer1ZpXg'),
      ex('gym-easy-cardio', 'Bike / Incline Walk', 1, '12 min', 'Conversational', 0, 'cardio', ['One transition after strength.', 'If needed: brisk walking in the same functional space.'], ['zone 2 training'], 'z82GCNXdLAA'),
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
    title: 'Gym C · Kettlebells',
    subtitle: 'KB + functional floor space',
    intent: 'October 4–10 · Full body in one strength zone. 8 min prep / 32 min strength / 12 min cardio / 8 min mobility. Time-saver pairs: 1+2, 3+4, 5+6. Two rounds to start. Brief transition between exercises; rest 60–90 sec after the pair or longer to preserve form. One transition to cardio only.',
    totalMinutes: 60,
    warmup: ['8 min including light ramp-up sets', 'Hip hinges 10', 'Squat-to-stand 6', 'Wall slides 10', 'Ankle rocks 15/side'],
    exercises: [
      ex('kb-floorpress', 'Single-arm KB Floor Press', 2, '8–12/side', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Single-arm KB Floor Press proper form']),
      ex('kb-row', 'Supported KB Row', 2, '8–12/side', '2–3 RIR', 75, 'hypertrophy', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['Supported KB Row proper form']),
      ex('kb-squat', 'KB Goblet Squat', 2, '8–12', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['KB Goblet Squat proper form']),
      ex('kb-carry', 'KB Suitcase Carry / March', 2, '30–45 sec/side', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['KB Suitcase Carry / March proper form']),
      ex('kb-deadlift', 'KB Deadlift', 2, '8–12', '2–3 RIR', 75, 'strength', ['Leave 2–3 clean reps in reserve.', 'Use comfortable controlled range.', 'Rest 60–90 sec after each pair; longer if needed.'], ['KB Deadlift proper form'], 'hinonqqzatk'),
      ex('functional-crawl', 'Bear Crawl + Controlled Get-down/Get-up', 2, '45–60 sec', 'Easy', 75, 'mobility', ['Move slowly; stay controlled.', 'Use hands/support as needed.', 'No loaded Turkish get-up required.'], ['Bear Crawl + Controlled Get-down/Get-up proper form'], '14BjRxE7f1o'),
      ex('gym-easy-cardio', 'Bike / Incline Walk', 1, '2 min easy + 4 x (1 min hard / 1 min easy) + 2 min easy', 'Repeatable, not all-out', 0, 'cardio', ['One transition after strength.', 'If needed: brisk walking in the same functional space.'], ['zone 2 training'], 'z82GCNXdLAA'),
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
  'Gym days: Day 1 Sunday all dumbbells; Day 3 Tuesday cables; Day 5 Thursday kettlebells + functional. Stay in one strength zone, then one cardio transition.',
  'Home days are fixed: Monday, Wednesday, Friday. Saturday is recovery.',
  'October 4–10: daily mobility. Gym blocks: 8 prep / 32 strength / 12 cardio / 8 mobility. Home sessions are opportunities, not workout debt.',
  'Priorities covered: upper aesthetics, posture, full-body strength, KOT joints, mobility, Zone 2, VO₂, and elastic multiplanar fascia work.',
  'Inspired by Israetel’s Dwarkesh video (p8fBbQSDKQY), not an exact reproduction: three non-competing pairs, two rounds initially, controlled full range, mostly 1–3 reps in reserve. Add reps before load; no compulsory failure on hinges or squats. Rest enough for quality.',
  'Expert-informed coaching synthesis by Onsii—not designed or endorsed by the named experts.',
  'Daily 8-min fallback: ankle rocks/calves 1 min, supported squat 1 min, 90/90s 2 min, couch stretch 1 min/side, thoracic rotations/reaches 2 min.',
  'Fascia is trained through progressive loading, long ranges, hops, varied planes, carries, crawling, and rhythm—not magical release techniques.',
];
