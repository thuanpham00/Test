import { MAX_DATA_POINTS } from '../theme/colors';

export function createEmptyBuffer(): number[] {
  return Array(MAX_DATA_POINTS).fill(0);
}

export function pushChartValue(data: number[], value: number): number[] {
  const next = [...data];
  next.shift();
  next.push(value);
  return next;
}

export function pushDualChartValues(
  actual: number[],
  command: number[],
  actualValue: number,
  commandValue: number,
): [number[], number[]] {
  return [pushChartValue(actual, actualValue), pushChartValue(command, commandValue)];
}
