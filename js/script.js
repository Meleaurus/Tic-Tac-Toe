const gameBoard = (() => {
    const container = document.querySelector('#container');
    const msg = document.querySelector('#msg');
    const scoreboard = document.querySelector('#scoreboard');
    const scoreElems = document.querySelectorAll('.score');
    const gameMsg = (outcome, visible) => {
        if (visible === false) {
            msg.textContent = '';
        } else {
            msg.textContent = `${outcome} has won!`
        }
    }
    const setUp = () => {
        for (let i = 0; i < 9; i++) {
            const grid = document.createElement('div');
            grid.classList.add('grid');
            grid.id = i;
            container.appendChild(grid);
        }
    }
    return { container, gameMsg, setUp };
})();

gameBoard.setUp();

const player = (symbol, turn) => {
    let selected = turn;
    let boxes = [];
    const sym = symbol;
    let wins = 0;
    // second game screws up Player 2's array, use dev tools
    const checkWin = () => {
        const winArr = [['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], ['2', '4', '6'],
        ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], ['0', '4', '8']]
        // (implicitly returned) {must return explicitly}
        return winArr.some(arr =>
            arr.every(num => boxes.includes(num)))
    }
    return { boxes, selected, sym, wins, checkWin }
}

const player1 = player("X", true);
const player2 = player("O", false);

const displayControl = (() => {
    let pause = false;
    const newGame = document.querySelector('#newGame');
    const players = [player1, player2];

    const resetBoard = () => {
        const grids = document.querySelectorAll('.grid');
        grids.forEach(grid => grid.textContent = '');
        gameBoard.gameMsg('', false)
        players.forEach(player => {
            // player.boxes = []; doesn't work because it assigns a new []
            while (player.boxes.length > 0) {
                player.boxes.pop();
            }
            if (player.sym === 'X') {
                player.selected = true;
            } else {
                player.selected = false;
            }
        })
        pause = false;
    }

    const updateScore = () => {
        console.log('fill')
    }
    // connect player switching here with the player's sym
    gameBoard.container.addEventListener('click', (e) => {
        const box = e.target;
        if (box.textContent === "") {
            for (let i = 0; i < players.length; i++) { // change to forEach?
                const player = players[i];
                if (player.selected === true && player.checkWin() === false && pause === false) {
                    player.selected = false;
                    player.boxes.push(box.id);
                    box.textContent = player.sym;
                    player.checkWin();
                    console.log(player.checkWin())
                    if (player.checkWin()) {
                        if (player.sym === 'X') {
                            gameBoard.gameMsg('Player 1');
                        } else {
                            gameBoard.gameMsg('Player 2');
                        }
                        pause = true
                        player.wins += 1;
                    } else if (player1.boxes.length + player2.boxes.length === 9) {
                        pause = true;
                        gameBoard.gameMsg('No one');
                    }
                }
                else {
                    player.selected = true;
                }
            }
        }
    });
    newGame.addEventListener('click', () => resetBoard());
    // if grid fired mark player 1 symbol, change turn
})();