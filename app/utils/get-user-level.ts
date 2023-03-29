interface Level {
  level: number;
  xp: number;
}

export function getUserLevel(
  levels: Level[],
  userExp: number,
): {
  level: number;
  expToNextLevel: number;
} {
  let currentLevel: Level = levels[0];
  let nextLevel: Level = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (userExp >= levels[i].xp) {
      currentLevel = levels[i];
      nextLevel = levels[i + 1];
    } else {
      break;
    }
  }

  if (!currentLevel) {
    return {
      level: 0,
      expToNextLevel: 0,
    };
  }

  if (!nextLevel) {
    return { level: currentLevel.level, expToNextLevel: 0 };
  }

  const expToNextLevel = nextLevel.xp - currentLevel.xp;
  return { level: currentLevel.level, expToNextLevel };
}
