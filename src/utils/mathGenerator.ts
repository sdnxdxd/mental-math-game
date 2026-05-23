import type { Difficulty, GameMode, Question } from './gameTypes';

type Operation = {
  text: string;
  result: number;
};

export function createQuestion(
  mode: GameMode,
  difficulty: Difficulty,
  timeLimitMs: number,
): Question {
  const operation = generateOperation(difficulty);

  if (mode === 'trueFalse') {
    const statementIsTrue = Math.random() >= 0.5;
    const proposedAnswer = statementIsTrue
      ? operation.result
      : createWrongAnswer(operation.result, difficulty);

    return {
      id: createId(),
      prompt: `${operation.text} = ${proposedAnswer}`,
      operationText: operation.text,
      correctAnswer: operation.result,
      proposedAnswer,
      statementIsTrue,
      timeLimitMs,
    };
  }

  if (mode === 'multipleChoice') {
    return {
      id: createId(),
      prompt: operation.text,
      operationText: operation.text,
      correctAnswer: operation.result,
      options: createOptions(operation.result, difficulty),
      timeLimitMs,
    };
  }

  return {
    id: createId(),
    prompt: operation.text,
    operationText: operation.text,
    correctAnswer: operation.result,
    timeLimitMs,
  };
}

function generateOperation(difficulty: Difficulty): Operation {
  const operatorsByDifficulty = {
    easy: ['+', '-'],
    medium: ['+', '-', '*'],
    hard: ['+', '-', '*', '/'],
  } as const;

  const operators = operatorsByDifficulty[difficulty];
  const operator = operators[randomInt(0, operators.length - 1)] ?? '+';

  if (operator === '+') {
    const max = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 80 : 200;
    const a = randomInt(1, max);
    const b = randomInt(1, max);

    return { text: `${a} + ${b}`, result: a + b };
  }

  if (operator === '-') {
    const max = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 90 : 250;
    const a = randomInt(1, max);
    const b = randomInt(1, max);
    const left = Math.max(a, b);
    const right = Math.min(a, b);

    return { text: `${left} - ${right}`, result: left - right };
  }

  if (operator === '*') {
    const a = difficulty === 'medium' ? randomInt(2, 12) : randomInt(6, 25);
    const b = difficulty === 'medium' ? randomInt(2, 15) : randomInt(4, 20);

    return { text: `${a} * ${b}`, result: a * b };
  }

  const divisor = randomInt(2, 20);
  const result = randomInt(2, 25);
  const dividend = divisor * result;

  return { text: `${dividend} / ${divisor}`, result };
}

function createOptions(correctAnswer: number, difficulty: Difficulty) {
  const maxDelta = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 12 : 25;
  const options = new Set<number>([correctAnswer]);

  while (options.size < 4) {
    const delta = randomInt(1, maxDelta) * (Math.random() >= 0.5 ? 1 : -1);
    options.add(correctAnswer + delta);
  }

  return shuffle([...options]);
}

function createWrongAnswer(correctAnswer: number, difficulty: Difficulty) {
  return createOptions(correctAnswer, difficulty).find(option => option !== correctAnswer)!;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
