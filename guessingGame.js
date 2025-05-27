let goal, tries = 0, maxRange, mode;
let player1, player2;
let guessHistory = [];

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

function updateGuessHistory(guess, feedback) {
    guessHistory.push({ guess, feedback });
    
    // Create or update the history display
    let historyElement = document.getElementById("guessHistory");
    if (!historyElement) {
        historyElement = document.createElement("div");
        historyElement.id = "guessHistory";
        historyElement.style.marginTop = "20px";
        historyElement.style.textAlign = "left";
        historyElement.style.border = "1px solid #ccc";
        historyElement.style.padding = "10px";
        historyElement.style.borderRadius = "6px";
        historyElement.style.maxHeight = "200px";
        historyElement.style.overflowY = "auto";
        
        const heading = document.createElement("h3");
        heading.textContent = "Guess History";
        
        document.getElementById("gameSection").insertBefore(heading, document.getElementById("restartGame"));
        document.getElementById("gameSection").insertBefore(historyElement, document.getElementById("restartGame"));
    }
    
    // Add the new guess to the history
    const guessItem = document.createElement("p");
    guessItem.style.margin = "5px 0";
    guessItem.innerHTML = `<strong>Attempt ${tries}:</strong> Guessed ${guess} - ${feedback}`;
    historyElement.appendChild(guessItem);
    historyElement.scrollTop = historyElement.scrollHeight;
}

function restartGame() {
    document.getElementById("setupSection").style.display = "block";
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("guessInput").value = "";
    document.getElementById("feedback").textContent = "";
    tries = 0;
    guessHistory = [];
    document.getElementById("submitGuess").disabled = false;
    
    // Remove history elements if they exist
    const historyHeading = document.querySelector("#gameSection h3");
    const historyElement = document.getElementById("guessHistory");
    if (historyHeading) historyHeading.remove();
    if (historyElement) historyElement.remove();
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
        
        // Start automatic guessing for computer player
        document.getElementById("submitGuess").style.display = "none"; // Hide the button
        document.getElementById("guessInput").style.display = "none"; // Hide the input field
        autoGuess();
    } else if (mode === 2) {
        player1 = new Computer();
        player2 = new Human();
        player1.maxValue = maxRange;
        goal = player1.choose();
        
        // Human is guessing, so keep the button and input visible
        document.getElementById("submitGuess").style.display = "block";
        document.getElementById("guessInput").style.display = "inline-block";
    } else if (mode === 3) {
        player1 = new Computer();
        player2 = new SmartComputer();
        player1.maxValue = maxRange;
        goal = player1.choose();
        player2.maxValue = maxRange;
        
        // Start automatic guessing
        document.getElementById("submitGuess").style.display = "none"; // Hide the button
        document.getElementById("guessInput").style.display = "none"; // Hide the input field
        autoGuess();
    }
}

function autoGuess() {
    if (tries < 5 && !document.getElementById("feedback").textContent.includes("Congratulations")) {
        handleGuess();
        setTimeout(autoGuess, 2000); // Call again after 1 second
    }
}

function handleGuess() {
    let guess;
    let feedbackText;
    
    if (player2 instanceof SmartComputer) {
        guess = player2.getInput();
        feedbackText = checker(guess);
        updateFeedback(`Smart Computer guessed: ${guess}. ${feedbackText}`);
        updateGuessHistory(guess, feedbackText);
        
        if (feedbackText.includes("Congratulations")) {
            document.getElementById("submitGuess").disabled = true;
        } else if (feedbackText.includes("higher")) {
            player2.minValue = guess + 1;
        } else if (feedbackText.includes("lower")) {
            player2.maxValue = guess - 1;
        }
    } else {
        guess = player2.getInput();
        feedbackText = checker(guess);
        updateFeedback(feedbackText);
        updateGuessHistory(guess, feedbackText);
        
        if (feedbackText.includes("Congratulations")) {
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
