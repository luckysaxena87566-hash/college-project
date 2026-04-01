let display = document.getElementById('display');
let currentInput = '';
let operator = null;
let previousInput = '';

function appendToDisplay(value) {
    if (display.value === '0' || display.value === 'Error') {
        display.value = value;
    } else {
        display.value += value;
    }
    currentInput += value;
}

function clearDisplay() {
    display.value = '0';
    currentInput = '';
    operator = null;
    previousInput = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1) || '0';
    currentInput = currentInput.slice(0, -1);
}

function calculate() {
    try {
        if (operator && previousInput !== '') {
            let result;
            const prev = parseFloat(previousInput);
            const curr = parseFloat(currentInput);

            switch (operator) {
                case '+':
                    result = prev + curr;
                    break;
                case '-':
                    result = prev - curr;
                    break;
                case '*':
                    result = prev * curr;
                    break;
                case '/':
                    if (curr === 0) {
                        display.value = 'Error';
                        return;
                    }
                    result = prev / curr;
                    break;
                default:
                    return;
            }

            display.value = result.toString().slice(0, 12);
            currentInput = result.toString();
            operator = null;
            previousInput = '';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

function setOperator(newOperator) {
    if (currentInput === '') return;

    previousInput = currentInput;
    operator = newOperator;
    currentInput = '';
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if ('0123456789.'.includes(key)) {
        appendToDisplay(key);
    } else if ('+-*/'.includes(key)) {
        setOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});


document.querySelectorAll('.operator').forEach(btn => {
    btn.addEventListener('click', function() {
        setOperator(this.textContent === '×' ? '*' : this.textContent);
    });
});
