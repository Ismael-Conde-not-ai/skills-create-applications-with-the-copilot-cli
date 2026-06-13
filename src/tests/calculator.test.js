const { compute } = require('../calculator');
const { spawnSync } = require('child_process');

describe('compute function (unit tests)', () => {
  test('addition', () => {
    expect(compute('+', 2, 3)).toBe(5);
    expect(compute('add', 10, 5)).toBe(15);
  });

  test('subtraction', () => {
    expect(compute('-', 10, 4)).toBe(6);
    expect(compute('sub', 5, 2)).toBe(3);
  });

  test('multiplication', () => {
    expect(compute('*', 7, 8)).toBe(56);
    expect(compute('mul', 9, 9)).toBe(81);
  });

  test('division', () => {
    expect(compute('/', 20, 5)).toBe(4);
    expect(compute('div', 45, 9)).toBe(5);
  });

  test('compute returns Infinity for division by zero', () => {
    expect(compute('/', 1, 0)).toBe(Infinity);
  });
});

function runCLI(args) {
  return spawnSync('node', ['src/calculator.js', ...args], { encoding: 'utf8' });
}

describe('CLI integration tests', () => {
  test('2 + 3 => 5 (infix)', () => {
    const res = runCLI(['2', '+', '3']);
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('5');
  });

  test('add 2 3 => 5 (word op)', () => {
    const res = runCLI(['add', '2', '3']);
    expect(res.status).toBe(0);
    expect(res.stdout.trim()).toBe('5');
  });

  test('division by zero should exit with error', () => {
    const res = runCLI(['1', '/', '0']);
    // Non-zero exit code
    expect(res.status).not.toBe(0);
    expect(res.stderr).toMatch(/Division by zero/);
  });

  test('non-numeric operands produce error', () => {
    const res = runCLI(['a', '+', '2']);
    expect(res.status).not.toBe(0);
    expect(res.stderr).toMatch(/Both operands must be numeric/);
  });
});
