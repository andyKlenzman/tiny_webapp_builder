//////////////////////////////////////////////////////
// Constants
//////////////////////////////////////////////////////
export const DAY_MS = 24 * 60 * 60 * 1000;

//////////////////////////////////////////////////////
// Internal Functions
//////////////////////////////////////////////////////

export const getIntervalMap = (valueA, valueB, interval) => {
  let currentInterval;
  let endValue;

  // find the lowest value
  if (valueA < valueB) {
    currentInterval = valueA;
    endValue = valueB;
  } else {
    currentInterval = valueB;
    endValue = valueA;
  }

  let intervalMap = [];

  while (endValue >= currentInterval) {
    intervalMap.push(currentInterval);
    currentInterval = currentInterval + interval;
  }

  return intervalMap;
};

// returns true if any value in a list
// exists between a and b
const existsBetween = (values, a, b) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return values.some((v) => v > lower && v < upper);
};

// Utility: Returns start and end of local day for a given timestamp
export const getDayBoundsLocal = (timestamp) => {
  const date = new Date(timestamp);

  const startOfDayLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const endOfDayLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );

  return { startOfDayLocal, endOfDayLocal };
};

//////////////////////////////////////////////////////
// Public API
//////////////////////////////////////////////////////
export const runStreaks = (msDateArray, intervalMap) => {
  let currentStreak = 0;
  let largestStreak = 0;
  let totalCompletions = 0;
  let totalIntervals = intervalMap.length;

  for (let i = 0; i < msDateArray.length - 1; i++) {
    let result = existsBetween(msDateArray, intervalMap[i], intervalMap[i + 1]);
    console.log("testTime: ", result);
    if (result) {
      currentStreak++;
      totalCompletions++;
    } else {
      largestStreak = currentStreak;
      currentStreak = 0;
    }
  }

  if (largestStreak === 0) {
    largestStreak = currentStreak;
  }

  return { currentStreak, largestStreak, totalCompletions, totalIntervals };
};

//////////////////////////////////////////////////////
// Testing Utilities
//////////////////////////////////////////////////////
const getRandomDateIso = (amount = 10) => {
  let testISO = [];
  // Generate 10 random ISO timestamps within the last 10 days
  const now = Date.now();
  const tenDaysAgo = now - 10 * 24 * 60 * 60 * 1000;
  for (let i = 0; i < amount; i++) {
    const randomTime = tenDaysAgo + Math.random() * (now - tenDaysAgo);
    testISO.push(new Date(randomTime).toISOString());
  }

  return testISO;
};

const testTimeAnalyzers = () => {
  // generate random test data
  const testISO = getRandomDateIso();

  // convert to increment time
  const testMs = testISO.map((iso) => Date.parse(iso));

  // get lower and max limit (start of first day end of current day)
  const firstEntry = Math.min(...testMs);
  const lastEntry = Math.max(...testMs);

  const { startOfDayLocal } = getDayBoundsLocal(firstEntry);
  const intervalMap = getIntervalMap(
    new Date(startOfDayLocal).getTime(),
    lastEntry,
    DAY_MS
  );
  console.log("intervalMap :", intervalMap);

  const { currentStreak, totalCompletions, totalIntervals } = runStreaks(
    testMs,
    intervalMap
  );

  console.log("results:", { currentStreak, totalCompletions, totalIntervals });
};
