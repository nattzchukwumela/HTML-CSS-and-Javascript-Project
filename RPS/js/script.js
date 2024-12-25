// Game state management
class GameState {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.WINNING_SCORE = 10;
        this.choices = ['ROCK', 'PAPER', 'SCISSORS'];
        this.gameRules = {
            ROCK: { beats: 'SCISSORS', losesTo: 'PAPER' },
            PAPER: { beats: 'ROCK', losesTo: 'SCISSORS' },
            SCISSORS: { beats: 'PAPER', losesTo: 'ROCK' }
        };
    }

    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
    }
}

// UI Controller
class UIController {
    constructor() {
        // Cache DOM elements
        this.elements = {
            gameBox: document.getElementById('gameBox'),
            startGame: document.getElementById('startGame'),
            playerChoice: document.getElementById('playerArsenal'),
            computerChoice: document.getElementById('computerArsenal'),
            playerPoints: document.getElementById('playerPoint'),
            computerPoints: document.getElementById('computerPoints'),
            result: document.getElementById('result'),
            nameInput: document.getElementById('name-input'),
            popups: {
                main: document.getElementById('popup'),
                gameOver: document.getElementById('popup-box-2'),
                quit: document.getElementById('popup-box-3')
            },
            buttons: {
                okay: document.getElementById('true'),
                cancel: document.getElementById('false'),
                replay: document.getElementById('btnReplay'),
                quit: document.getElementById('quit'),
                ok: document.getElementById('ok')
            },
            weaponHighlights: {
                rock: document.querySelector('.wip1'),
                paper: document.querySelector('.wip2'),
                scissors: document.querySelector('.wip3')
            }
        };

        // Store the highlight style as a constant
        this.HIGHLIGHT_STYLE = '5px 5px 5px 1px rgb(79, 156, 224), -5px -5px 5px 1px teal';
    }

    // Show a popup
    showPopup(popupName) {
        this.elements.popups[popupName].classList.add('display-popup');
    }

    // Hide a popup
    hidePopup(popupName) {
        this.elements.popups[popupName].classList.remove('display-popup');
    }

    // Update the score display
    updateScore(playerName, playerScore, computerScore) {
        this.elements.playerPoints.textContent = `${playerName}: ${playerScore}`;
        this.elements.computerPoints.textContent = `Computer: ${computerScore}`;
    }

    // Update the choices display
    updateChoices(playerChoice, computerChoice) {
        this.elements.playerChoice.textContent = playerChoice;
        this.elements.computerChoice.textContent = computerChoice;
    }

    // Highlight the computer's choice
    highlightComputerChoice(choice) {
        // Reset all highlights
        Object.values(this.elements.weaponHighlights).forEach(el => {
            el.style.boxShadow = 'none';
        });

        // Add highlight to selected weapon
        const weaponMap = {
            'ROCK': 'rock',
            'PAPER': 'paper',
            'SCISSORS': 'scissors'
        };

        if (weaponMap[choice]) {
            this.elements.weaponHighlights[weaponMap[choice]].style.boxShadow = this.HIGHLIGHT_STYLE;
        }
    }

    // Show an error for invalid name input
    showNameError() {
        this.elements.nameInput.classList.add('error');
        setTimeout(() => {
            this.elements.nameInput.classList.remove('error');
        }, 500);
    }

    // Update UI to start the game
    startGameUI(playerName) {
        this.hidePopup('main');
        this.elements.startGame.style.display = 'none';
        this.elements.gameBox.style.visibility = 'visible';
        this.elements.gameBox.style.transform = 'scale(1)';
        this.updateScore(playerName, 0, 0);
    }
}

// Game Controller
class GameController {
    constructor() {
        this.gameState = new GameState();
        this.ui = new UIController();
        this.playerName = '';
        this.initializeEventListeners();
    }

    // Initialize event listeners for the game
    initializeEventListeners() {
        // Start game button
        this.ui.elements.startGame.addEventListener('click', () => this.ui.showPopup('main'));

        // Name input handlers
        this.ui.elements.buttons.okay.addEventListener('click', () => this.handleNameSubmission());
        this.ui.elements.buttons.cancel.addEventListener('click', () => this.ui.hidePopup('main'));

        // Weapon selection
        const playerWeapons = document.querySelectorAll('.playerWeapon');
        playerWeapons.forEach(weapon => {
            weapon.addEventListener('click', () => this.handleRound(weapon.value));
        });

        // Game over handlers
        this.ui.elements.buttons.replay.addEventListener('click', () => this.handleReplay());
        this.ui.elements.buttons.quit.addEventListener('click', () => this.handleQuit());
        this.ui.elements.buttons.ok.addEventListener('click', () => this.ui.hidePopup('quit'));
    }

    // Handle name submission
    handleNameSubmission() {
        const nameInput = this.ui.elements.nameInput.value.trim();
        if (!nameInput) {
            this.ui.showNameError();
            return;
        }

        this.playerName = nameInput;
        this.ui.startGameUI(this.playerName);
    }

    // Get computer's choice
    getComputerChoice() {
        return this.gameState.choices[Math.floor(Math.random() * this.gameState.choices.length)];
    }

    // Determine the winner of the round
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'TIE GAME!';
        return this.gameState.gameRules[playerChoice].beats === computerChoice ? 'YOU WIN!' : 'YOU LOSE!';
    }

    // Handle a round of the game
    handleRound(playerChoice) {
        const computerChoice = this.getComputerChoice();
        const result = this.determineWinner(playerChoice, computerChoice);

        this.ui.updateChoices(playerChoice, computerChoice);
        this.ui.highlightComputerChoice(computerChoice);
        this.ui.elements.result.textContent = result;

        this.updateScores(result);
        this.checkGameOver();
    }

    // Update the scores based on the round result
    updateScores(result) {
        if (result === 'YOU WIN!') {
            this.gameState.playerScore++;
        } else if (result === 'YOU LOSE!') {
            this.gameState.computerScore++;
        }
        this.ui.updateScore(this.playerName, this.gameState.playerScore, this.gameState.computerScore);
    }

    // Check if the game is over
    checkGameOver() {
        if (this.gameState.playerScore === this.gameState.WINNING_SCORE || 
            this.gameState.computerScore === this.gameState.WINNING_SCORE) {
            const winner = this.gameState.playerScore === this.gameState.WINNING_SCORE ? 'Player' : 'Computer';
            document.getElementById('winner').textContent = `${winner} Wins!`;
            this.ui.elements.gameBox.style.visibility = 'hidden';
            this.ui.showPopup('gameOver');
            this.gameState.reset();
            this.resetUI();
        }
    }

    // Reset the UI for a new game
    resetUI() {
        this.ui.updateScore(this.playerName, 0, 0);
        this.ui.updateChoices('Arsenal', 'Arsenal');
        this.ui.elements.result.textContent = '-';
        Object.values(this.ui.elements.weaponHighlights).forEach(el => {
            el.style.boxShadow = 'none';
        });
    }

    // Handle replaying the game
    handleReplay() {
        this.ui.elements.gameBox.style.visibility = 'visible';
        this.ui.elements.gameBox.style.transform = 'scale(1)';
    }

    // Handle quitting the game
    handleQuit() {
        this.ui.hidePopup('gameOver');
        this.ui.elements.startGame.style.display = 'block';
        this.ui.showPopup('quit');
    }
}

// Initialize game
const game = new GameController();
