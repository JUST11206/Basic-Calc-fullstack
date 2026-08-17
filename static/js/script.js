let currentValue = "";
let previousValue = "";
let operator = null;


// Display elements
const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const equalsBtn =
    document.getElementById("equalsBtn");

const themeBtn =
    document.getElementById("themeBtn");


/* -------------------------
   Display
------------------------- */

function updateDisplay() {

    currentDisplay.textContent =
        currentValue || "0";

    if (previousValue && operator) {

        previousDisplay.textContent =
            `${previousValue} ${getOperatorSymbol(operator)}`;

    } else {

        previousDisplay.textContent = "0";

    }
}


/* -------------------------
   Operator Symbol
------------------------- */

function getOperatorSymbol(op) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[op] || op;
}


/* -------------------------
   Number
------------------------- */

function addNumber(number) {

    // Prevent multiple decimal points
    if (number === ".") {

        if (currentValue.includes(".")) {
            return;
        }

        // If user starts with decimal
        if (currentValue === "") {
            currentValue = "0";
        }
    }

    currentValue += number;

    updateDisplay();
}


/* -------------------------
   Operator
------------------------- */

function chooseOperator(selectedOperator) {

    if (currentValue === "") {
        return;
    }


    // Calculate previous operation first
    if (previousValue !== "") {

        calculate();

    }


    previousValue = currentValue;

    currentValue = "";

    operator = selectedOperator;

    updateDisplay();
}


/* -------------------------
   Calculate
------------------------- */

async function calculate() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        operator === null
    ) {
        return;
    }


    const num1 =
        parseFloat(previousValue);

    const num2 =
        parseFloat(currentValue);


    try {

        // Send calculation to Flask backend
        const response = await fetch(
            "/calculate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    num1: num1,

                    num2: num2,

                    operator: operator

                })
            }
        );


        // Get Flask response
        const data =
            await response.json();


        // Handle backend error
        if (!response.ok || !data.success) {

            alert(
                data.error ||
                "Calculation error"
            );

            return;
        }


        // Get result from Flask
        const result =
            data.result;


        // Show result
        currentValue =
            formatResult(result);

        previousValue = "";

        operator = null;

        updateDisplay();


    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to Flask backend."
        );

    }
}


/* -------------------------
   Format Result
------------------------- */

function formatResult(result) {

    // Check invalid result
    if (!Number.isFinite(result)) {

        return "Error";

    }


    // Remove unnecessary decimal
    if (Number.isInteger(result)) {

        return result.toString();

    }


    // Limit decimal places
    return parseFloat(
        result.toFixed(10)
    ).toString();
}


/* -------------------------
   Clear
------------------------- */

function clearCalculator() {

    currentValue = "";

    previousValue = "";

    operator = null;

    updateDisplay();
}


/* -------------------------
   Delete
------------------------- */

function deleteLast() {

    currentValue =
        currentValue.slice(0, -1);

    updateDisplay();
}


/* -------------------------
   Percentage
------------------------- */

function percentage() {

    if (currentValue === "") {
        return;
    }


    const value =
        parseFloat(currentValue);


    currentValue =
        (value / 100).toString();


    updateDisplay();
}


/* -------------------------
   Plus / Minus
------------------------- */

function toggleSign() {

    if (currentValue === "") {
        return;
    }


    if (currentValue.startsWith("-")) {

        currentValue =
            currentValue.substring(1);

    } else {

        currentValue =
            "-" + currentValue;

    }


    updateDisplay();
}


/* -------------------------
   Number Buttons
------------------------- */

document.querySelectorAll(
    "[data-number]"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            addNumber(
                button.dataset.number
            );

        }
    );

});


/* -------------------------
   Operator Buttons
------------------------- */

document.querySelectorAll(
    "[data-operator]"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            chooseOperator(
                button.dataset.operator
            );

        }
    );

});


/* -------------------------
   Action Buttons
------------------------- */

document.querySelectorAll(
    "[data-action]"
)
.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const action =
                button.dataset.action;


            if (action === "clear") {

                clearCalculator();

            }


            else if (action === "delete") {

                deleteLast();

            }


            else if (action === "percent") {

                percentage();

            }


            else if (action === "sign") {

                toggleSign();

            }

        }
    );

});


/* -------------------------
   Equals Button
------------------------- */

equalsBtn.addEventListener(
    "click",
    calculate
);


/* -------------------------
   Theme
------------------------- */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        if (
            document.body.classList.contains(
                "light"
            )
        ) {

            themeBtn.textContent = "🌙";

        } else {

            themeBtn.textContent = "☀";

        }

    }
);


/* -------------------------
   Keyboard Support
------------------------- */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        // Numbers and decimal
        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            addNumber(key);

        }


        // Operators
        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);

        }


        // Enter / Equal
        else if (
            key === "Enter" ||
            key === "="
        ) {

            calculate();

        }


        // Backspace
        else if (
            key === "Backspace"
        ) {

            deleteLast();

        }


        // Escape = Clear
        else if (
            key === "Escape"
        ) {

            clearCalculator();

        }


        // Percentage
        else if (
            key === "%"
        ) {

            percentage();

        }

    }
);


/* -------------------------
   Initial Display
------------------------- */

updateDisplay();