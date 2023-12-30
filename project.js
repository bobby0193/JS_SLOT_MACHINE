// 1. Deposit funds
// 2. Determine number of lines
// 3. Collect bet amount
// 4. Spin slot machine
// 5. Chek if won
// 6. Give winnings
// 7. Play again or cash out


const promt = require('prompt-sync')();

// Slot machine

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
};


const SUMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

// Deposit & bet

const deposit = () => {
    while (true) {
        const depositAmount = promt('Enter deposit amount: ');
        const numberDepositAmount = parseFloat(depositAmount);

        // Verfy if the user entered a number & minimum amount
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log('Please enter a valid amount');
        } else {
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = promt('Enter number of lines: ');
        const numberOfLines = parseInt(lines);

        // Verfy if the user entered a number & minimum amount
        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log('Invalide number of lines');
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = promt('Enter bet amount per line: ');
        const numberBet = parseFloat(bet);

        // Verfy if the user entered a number & minimum amount
        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log('Invalide bet amount, try again');
        } else {
            return numberBet;
        }
    }
};

// Slot Machine Mechanism

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];

    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelsSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelsSymbols.length);
            const selectedSymbol = reelsSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelsSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

// Transposing reels (fixing the matrix)

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = '';
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += ' | ';
            }
        }
        console.log(rowString);
    }
};

// Collecting winnings

const getwWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SUMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
};

// Game
const game = () => {
    let balance = deposit();
    while (true) {
        console.log(`Your balance is $${balance.toString()}`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getwWinnings(rows, bet, numberOfLines);
        console.log(`You won $${winnings.toString()}`);
        balance += winnings;

        if (balance <= 0) {
            console.log('You are out of money');
            break;
        }

        const playAgain = promt('Play again? (y/n) ');
        if (playAgain != 'y') {
            console.log(`Your final balance is $${balance.toString()}`);
            console.log('Thank you for playing');
            break;
        }
    }
};

game();