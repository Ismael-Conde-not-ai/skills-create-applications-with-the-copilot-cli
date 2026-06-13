const { compute, modulo, power, squareRoot } = require('../calculator');
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

  test('modulo', () => {
    expect(modulo(5, 2)).toBe(1);
    expect(compute('%', 10, 3)).toBe(1);
    expect(compute('mod', 10, 3)).toBe(1);
  });

  test('power', () => {
    expect(power(2, 3)).toBe(8);
    expect(compute('^', 2, 8)).toBe(256);
    expect(compute('pow', 2, 8)).toBe(256);
  });

  test('squareRoot', () => {
    expect(squareRoot(16)).toBe(4);
    expect(compute('sqrt', 16)).toBe(4);
  });

  test('squareRoot of negative throws', () => {
    expect(() => squareRoot(-1)).toThrow(/negative/);
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

  test('CLI modulo and mod', () => {
    const res1 = runCLI(['5', '%', '2']);
    expect(res1.status).toBe(0);
    expect(res1.stdout.trim()).toBe('1');

    const res2 = runCLI(['mod', '5', '2']);
    expect(res2.status).toBe(0);
    expect(res2.stdout.trim()).toBe('1');
  });

  test('CLI power and pow', () => {
    const r1 = runCLI(['2', '^', '3']);
    expect(r1.status).toBe(0);
    expect(r1.stdout.trim()).toBe('8');

    const r2 = runCLI(['pow', '2', '8']);
    expect(r2.status).toBe(0);
    expect(r2.stdout.trim()).toBe('256');
  });

  test('CLI sqrt unary operator', () => {
    const r = runCLI(['sqrt', '16']);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe('4');

    const r2 = runCLI(['16', 'sqrt']);
    expect(r2.status).toBe(0);
    expect(r2.stdout.trim()).toBe('4');
  });

  test('CLI sqrt negative should error', () => {
    const r = runCLI(['sqrt', '-9']);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/negative/);
  });

  test('CLI modulo by zero should error', () => {
    const r = runCLI(['5', '%', '0']);
    expect(r.status).not.toBe(0);
    expect(r.stderr).toMatch(/Modulo by zero/);
  });
});
