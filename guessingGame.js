const prompt = require('prompt-sync')();

let guess, goal, mode, player1, player2;
let tries = 0;

class Human{
    get getInput(){
        return parseInt(prompt("Please enter your guess: "));
    }
}

class Computer{
    constructor(){
        this._max = 0;
    }
    
    set maxValue(max){
        this._max = max;
    }
    get choose(){
        return Math.floor(Math.random() * (this._max+1));
    }
}

class SmartComputer extends Computer {  
    constructor(){
        super();  
        this._min = 0;
    }
    set minValue(min){
        this._min = min;
    }
    get getInput(){
        var attempt = Math.floor(Math.random() * (this._max - this._min + 1)) + this._min;
        console.log("Smart Computer guessed", attempt);
        return attempt;
    }
}

function checker(){
    if(guess < goal){
        console.log("The number is higher than", guess);
        return -1;
    }
    else if (guess > goal){
        console.log("The number is lower than", guess);
        return 1;
    }
    else if (guess == goal){
        console.log('You have successfully guessed the number')
        return 0;
    }
}

// Main function
function main(){
    console.log("Welcome to the Guessing Game!\nYou will have 5 tries to guess the number.");
    console.log("Options: \n1. Human vs. Computer\n2. Computer vs. Human\n3. Computer vs. Computer\n");
    mode = parseInt(prompt("Choose your game mode (first one chooses, second one guesses): "));

    while (![1, 2, 3].includes(mode)) {
        console.log("Invalid input! Please choose a valid mode.");
        mode = parseInt(prompt("Choose your game mode (first one chooses, second one guesses): "));
    }

    console.log(`You have chosen mode ${mode}`);
    let max = parseInt(prompt("What is range you want to set for the game? (0 to your input) "));
    
    // Initializing objects based on the mode chosen
    if(mode == 1){
        player2 = new SmartComputer();
        goal = parseInt(prompt("What number are you thinking of? "));
        player2.maxValue = max;
    }
    else if (mode == 2){
        player1 = new Computer();
        player2 = new Human();
        player1.maxValue = max;
        goal = player1.choose;
    }
    else if (mode == 3){
        player1 = new Computer();
        player2 = new SmartComputer();
        player1.maxValue = max;
        goal = player1.choose;
        player2.maxValue = max;
    }

    // Game loop
    while(tries < 5){
        guess = player2.getInput; 
        if(player2 instanceof SmartComputer){
            let result = checker();
            if (result == -1) player2.minValue = guess + 1;
            else if (result == 1) player2.maxValue = guess - 1; 
            else break; 
        }
        else{
            if (checker() == 0) break; 
        }
        tries++;
    }
    
    if (tries === 5 && guess !== goal) {
        console.log(`You've used all your tries. The correct number was ${goal}.`);
    }
}

main();
