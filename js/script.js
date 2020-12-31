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

const player = (username, symbol, turn) => {
    let selected = turn;
    let boxes = [];
    const name = username;
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
    return { name, boxes, selected, sym, wins, checkWin }
}

const displayControl = (() => {
    const grids = document.querySelectorAll('.grid');
    let pause = false;
    let allPlayers = [];
    const resetBoard = () => {
        grids.forEach(grid => grid.textContent = '');
        gameBoard.gameMsg('', false)
        pause = false;
    }
    const resetPlayers = (p1, p2) => {
        const players = [p1, p2]
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
    }
    // connect player switching here with the player's sym
    const start = () => {
        gameBoard.container.addEventListener('click', (e) => {
            // arr here is not changing b/c own scope? players arr
            const box = e.target;
            if (box.textContent === "" && box.classList.contains('grid')) {
                for (let i = 0; i < allPlayers.length; i++) { // change to forEach?
                    const player = allPlayers[i];
                    if (player.selected === true && player.checkWin() === false && pause === false) {
                        player.selected = false;
                        player.boxes.push(box.id);
                        box.textContent = player.sym;
                        player.checkWin();
                        console.log(player.checkWin())
                        if (player.checkWin()) {
                            gameBoard.gameMsg(`${player.name}`);
                            pause = true
                            player.wins += 1;
                        } else if (Array.from(grids).every((grid) => grid.textContent !== '')) {
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
    }
    return { allPlayers, resetBoard, resetPlayers, start }
})();

document.querySelector('#myForm').addEventListener('submit', (ev) => {
    ev.preventDefault(); // prevent refresh
    //cancel doesnt do anything problem
    if (ev.submitter.id === 'submit') {
        if (displayControl.allPlayers.length !== 0) {
            console.log('cleared')
            while (displayControl.allPlayers.length > 0) {
                displayControl.allPlayers.pop();
            }
            displayControl.resetBoard();
        }
        const newGame = document.querySelector('#newGame');
        const values = Array.from(myForm.querySelectorAll('#myForm input'))
            .reduce((acc, input) =>
                ({ ...acc, [input.id]: input.value }), {})
        const player1 = player(values.player1, "X", true);
        const player2 = player(values.player2, "O", false);
        // new problem, clear mid game if new game chosen
        displayControl.allPlayers.push(player1);
        displayControl.allPlayers.push(player2);
        displayControl.start();
        // displayControl.startGame(player1, player2);
        newGame.addEventListener('click', () => {
            displayControl.resetPlayers(player1, player2)
            displayControl.resetBoard();
        });
    }
    document.querySelector('#modal').style.display = 'none';
})