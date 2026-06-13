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
    operator: add | sub | mul | div
    example: node src/calculator.js add 2 3

  OR

  node src/calculator.js <a> <operator_symbol> <b>
    operator_symbol: + | - | * | /
    example: node src/calculator.js 10 / 2

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

  // Two supported styles:
  // 1) operator word first: add 2 3
  // 2) infix: 2 + 3

  if (argv.length === 3) {
    // Could be either style; detect if first arg is an operator word
    const first = argv[0].toLowerCase();
    const second = argv[1];
    const third = argv[2];

    const wordOps = new Set(['add', 'sub', 'mul', 'div', 'multiply']);
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
  } else {
    console.error('Invalid arguments. Use --help for usage.');
    process.exit(1);
  }

  const a = toNumber(aStr);
  const b = toNumber(bStr);

  if (!isNumeric(a) || !isNumeric(b)) {
    console.error('Both operands must be numeric.');
    process.exit(1);
  }

  // Division by zero guard
  if ((op === 'div' || op === '/') && b === 0) {
    console.error('Error: Division by zero is not allowed.');
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

if (require.main === module) {
  main(process.argv.slice(2));
}
