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

  // find the lowerr value
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

export const getTimeProperties = (timestamp) => {
  const date = new Date(timestamp);

  let startOfDayLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  let startOfTomorrowLocal = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );

  startOfDayLocal = startOfDayLocal.getTime();
  startOfTomorrowLocal = startOfTomorrowLocal.getTime();

  return { startOfDayLocal, startOfTomorrowLocal };
};

const getStreaks = (msDateArray, intervalMap) => {
  let currentStreak = 0;
  let largestStreak = 0;
  let totalCompletions = 0;
  let totalIntervals = intervalMap.length;

  for (let i = 0; i < intervalMap.length - 1; i++) {
    let result = existsBetween(msDateArray, intervalMap[i], intervalMap[i + 1]);
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
// Public API
//////////////////////////////////////////////////////
export const runStreaks = (timestamps) => {
  const incrementTime = timestamps.map((iso) => Date.parse(iso));

  const newestEntry = Math.min(...incrementTime);
  const today = new Date();

  const { startOfDayLocal } = getTimeProperties(newestEntry);
  const { startOfTomorrowLocal } = getTimeProperties(today);

  const intervalMap = getIntervalMap(
    startOfDayLocal,
    startOfTomorrowLocal,
    DAY_MS
  );

  const { currentStreak, totalCompletions, totalIntervals, largestStreak } =
    getStreaks(incrementTime, intervalMap);

  return { currentStreak, largestStreak, totalCompletions, totalIntervals };
};
