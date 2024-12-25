// Get display element
const display = document.getElementById('display');
        
// Variables to store calculator state
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

// Function to update display
function updateDisplay() {
    display.textContent = currentInput;
}

// Function to append number
function appendNumber(number) {
    if (currentInput === '0' || shouldResetDisplay) {
        currentInput = number.toString();
        shouldResetDisplay = false;
    } else {
        currentInput += number.toString();
    }
    updateDisplay();
}

// Function to append decimal
function appendDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Function to append operator
function appendOperator(op) {
    if (operation !== null) {
        calculate();
    }
    previousInput = currentInput;
    operation = op;
    shouldResetDisplay = true;
}

// Function to clear display
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Function to calculate result
function calculate() {
    if (operation === null || shouldResetDisplay) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = prev / current;
            break;
        default:
            return;
    }

    // Handle division by zero
    if (!isFinite(result)) {
        currentInput = 'Error';
    } else {
        // Round to avoid floating point precision issues
        currentInput = Math.round(result * 1000000) / 1000000;
    }
    
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(parseInt(event.key));
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key);
    } else if (event.key === 'Enter') {
        calculate();
    } else if (event.key === 'Escape') {
        clearDisplay();
    }
});