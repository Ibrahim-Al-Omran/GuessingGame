let goal, tries = 0, maxRange, mode;
let player1, player2;

class Human {
    constructor() {
        this.type = "Human";
    }
    getInput() {
        const guessInput = document.getElementById("guessInput").value;
        return parseInt(guessInput);
    }
}

class Computer {
    constructor() {
        this.type = "Computer";
        this._max = 0;
    }
    set maxValue(max) {
        this._max = max;
    }
    choose() {
        return Math.floor(Math.random() * (this._max + 1));
    }
}

class SmartComputer extends Computer {
    constructor() {
        super();
        this._min = 0;
    }
    set minValue(min) {
        this._min = min;
    }
    getInput() {
        const attempt = Math.floor(Math.random() * (this._max - this._min + 1)) + this._min;
        return attempt;
    }
}

function checker(guess) {
    if (guess < goal) {
        return "The number is higher!";
    } else if (guess > goal) {
        return "The number is lower!";
    } else {
        return "Congratulations! You guessed the number!";
    }
}

function updateFeedback(message) {
    document.getElementById("feedback").textContent = message;
}

function restartGame() {
    document.getElementById("setupSection").style.display = "block";
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("guessInput").value = "";
    document.getElementById("feedback").textContent = "";
    tries = 0;
    document.getElementById("submitGuess").disabled = false; 
}

function startGame() {
    mode = parseInt(document.getElementById("mode").value);
    maxRange = parseInt(document.getElementById("range").value);
    
    if (!maxRange || (mode === 1 && !document.getElementById("goal").value)) {
        alert("Please fill all required fields.");
        return;
    }

    document.getElementById("setupSection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";

    if (mode === 1) {
        player2 = new SmartComputer();
        player2.maxValue = maxRange;
        goal = parseInt(document.getElementById("goal").value);  
    } else if (mode === 2) {
        player1 = new Computer();
        player2 = new Human();
        player1.maxValue = maxRange;
        goal = player1.choose();  
    } else if (mode === 3) {
        player1 = new Computer();
        player2 = new SmartComputer();
        player1.maxValue = maxRange;
        goal = player1.choose();
        player2.maxValue = maxRange;
    }
}

function handleGuess() {
    let guess;
    if (player2 instanceof SmartComputer) {
        guess = player2.getInput();
        const feedback = checker(guess);
        updateFeedback(`Smart Computer guessed: ${guess}. ${feedback}`);
        if (feedback.includes("Congratulations")) {
            document.getElementById("submitGuess").disabled = true;
        } else if (feedback.includes("higher")) {
            player2.minValue = guess + 1;
        } else if (feedback.includes("lower")) {
            player2.maxValue = guess - 1;
        }
    } else {
        guess = player2.getInput();
        const feedback = checker(guess);
        updateFeedback(feedback);
        if (feedback.includes("Congratulations")) {
            document.getElementById("submitGuess").disabled = true;
        }
    }
    tries++;
    if (tries === 5 && !document.getElementById("feedback").textContent.includes("Congratulations")) {
        updateFeedback(`Out of tries! The correct number was ${goal}.`);
        document.getElementById("submitGuess").disabled = true;
    }
}

document.getElementById("startGame").addEventListener("click", startGame);
document.getElementById("submitGuess").addEventListener("click", handleGuess);
document.getElementById("restartGame").addEventListener("click", restartGame);
