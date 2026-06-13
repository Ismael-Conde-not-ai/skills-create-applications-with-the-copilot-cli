#!/usr/bin/env node

// CLI Calculator
// Supported operations:
// - Addition:       +  or add
// - Subtraction:    -  or sub
// - Multiplication: *  or mul (also accepts x or multiply)
// - Division:       /  or div

function printHelp() {
  console.log(`Usage:
  node src/calculator.js <operator> <a> <b>
    operator: add | sub | mul | div | mod | pow
    example: node src/calculator.js add 2 3

  OR

  node src/calculator.js <a> <operator_symbol> <b>
    operator_symbol: + | - | * | / | % | ^ | **
    example: node src/calculator.js 10 / 2

  Unary operators:
    node src/calculator.js sqrt <a>
    example: node src/calculator.js sqrt 9

  Flags:
    -h, --help   Show this help message
`);
}

function isNumeric(n) {
  return !isNaN(n) && isFinite(n);
}

function toNumber(s) {
  const n = Number(s);
  return n;
}

function modulo(a, b) {
  if (b === 0) throw new Error('Modulo by zero is not allowed.');
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) throw new Error('Square root of negative number is not allowed.');
  return Math.sqrt(n);
}

function compute(op, a, b) {
  switch (op) {
    case 'add':
    case '+':
      return a + b;
    case 'sub':
    case '-':
      return a - b;
    case 'mul':
    case '*':
    case 'x':
    case 'multiply':
      return a * b;
    case 'div':
    case '/':
      return a / b;
    case 'mod':
    case '%':
      return modulo(a, b);
    case 'pow':
    case '**':
    case '^':
      return power(a, b);
    case 'sqrt':
      // unary operator: ignore b
      return squareRoot(a);
    default:
      throw new Error(`Unsupported operator: ${op}`);
  }
}

function main(argv) {
  if (argv.length === 0) {
    console.error('No arguments provided. Use --help for usage.');
    process.exit(1);
  }

  if (argv.includes('-h') || argv.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  let op;
  let aStr;
  let bStr;

  // Supported styles:
  // 1) operator word first: add 2 3
  // 2) infix: 2 + 3
  // 3) unary operator: sqrt 9

  if (argv.length === 3) {
    // Could be either style; detect if first arg is an operator word
    const first = argv[0].toLowerCase();
    const second = argv[1];
    const third = argv[2];

    const wordOps = new Set(['add', 'sub', 'mul', 'div', 'multiply', 'mod', 'pow']);
    if (wordOps.has(first)) {
      op = first;
      aStr = second;
      bStr = third;
    } else {
      // assume infix: a op b
      aStr = first;
      op = second;
      bStr = third;
    }
  } else if (argv.length === 2) {
    // unary operator support (e.g., sqrt 9) or reversed (9 sqrt)
    const first = argv[0].toLowerCase();
    const second = argv[1].toLowerCase();
    const unaryOps = new Set(['sqrt']);

    if (unaryOps.has(first)) {
      op = first;
      aStr = second;
      bStr = undefined;
    } else if (unaryOps.has(second)) {
      op = second;
      aStr = first;
      bStr = undefined;
    } else {
      console.error('Invalid arguments. Use --help for usage.');
      process.exit(1);
    }
  } else {
    console.error('Invalid arguments. Use --help for usage.');
    process.exit(1);
  }

  const a = toNumber(aStr);
  const b = bStr !== undefined ? toNumber(bStr) : undefined;

  if (!isNumeric(a) || (bStr !== undefined && !isNumeric(b))) {
    console.error('Both operands must be numeric.');
    process.exit(1);
  }

  // Division by zero guard
  if ((op === 'div' || op === '/') && b === 0) {
    console.error('Error: Division by zero is not allowed.');
    process.exit(1);
  }

  // Modulo by zero guard (different message)
  if ((op === 'mod' || op === '%') && b === 0) {
    console.error('Modulo by zero is not allowed.');
    process.exit(1);
  }

  try {
    const result = compute(op, a, b);
    // Print result to stdout
    console.log(result);
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

// Export functions for testing and reuse
module.exports = {
  compute,
  isNumeric,
  toNumber,
  printHelp,
  main,
  modulo,
  power,
  squareRoot
};

if (require.main === module) {
  main(process.argv.slice(2));
}
