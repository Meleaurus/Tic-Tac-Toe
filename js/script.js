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

const player = (username, symbol, turn, AICheck) => {
    let isAI = AICheck;
    let selected = turn;
    let boxes = [];
    const name = username;
    const sym = symbol;
    let wins = 0;
    // second game screws up Player 2's array, use dev tools
    const checkTiles = () => {
        const winArr = [['0', '1', '2'], ['3', '4', '5'], ['6', '7', '8'], ['2', '4', '6'],
        ['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8'], ['0', '4', '8']]
        // (implicitly returned) {must return explicitly}
        return winArr.some(arr =>
            arr.every(num => boxes.includes(num)))
    }
    return { isAI, name, boxes, selected, sym, wins, checkTiles }
}

const displayControl = (() => {
    const grids = document.querySelectorAll('.grid');
    const p1Score = document.querySelector('#p1Score');
    const p2Score = document.querySelector('#p2Score');
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

    // add easy med hard modes
    const makeAIMove = (player) => {
        // pick number from 0-8, check if that grid is empty 
        // if empty choose another one, else select it while loop?
        let choosing = true;
        while (choosing) {
            let num = Math.floor(Math.random() * 8);
            if (document.getElementById(`${num}`).textContent === '') {
                document.getElementById(`${num}`).textContent = 'O';
                player.boxes.push(`${num}`);
                choosing = false;
            }
        }
        checkBoard(player);
    }

    const checkBoard = (player) => {
        if (player.checkTiles()) {
            gameBoard.gameMsg(`${player.name}`);
            pause = true
            player.wins += 1;
            updateScore();
        } else if (Array.from(grids).every((grid) => grid.textContent !== '')) {
            pause = true;
            gameBoard.gameMsg('No one');
        }
    }

    const updateScore = () => {
        p1Score.textContent = `${allPlayers[0].name}'s Score: ${allPlayers[0].wins}`;
        p2Score.textContent = `${allPlayers[1].name}'s Score: ${allPlayers[1].wins}`;
    }

    const updateTurn = () => {
        const playerTurn = document.querySelector('#playerTurn');
        allPlayers.forEach((p) => {
            if (p.selected) {
                playerTurn.textContent = `${p.name}'s turn!`;
            }
        })
    }
    // connect player switching here with the player's sym
    const start = (isAIMode) => {
        gameBoard.container.addEventListener('click', (e) => {
            const box = e.target;
            // accomodate AI's move after p1 goes
            // must make ai move right after player1 move 
            // so p1 always clicking
            // fix this
            if (box.textContent === "" && box.classList.contains('grid') && pause === false) {
                for (let i = 0; i < allPlayers.length; i++) { // change to forEach?
                    const player = allPlayers[i];
                    // when i = 1, do stuff for ai move
                    if ((player.selected === true || player.isAI === true) && player.checkTiles() === false && pause === false) {
                        if (!isAIMode) {
                            player.selected = false;
                        }
                        if (player.isAI) {
                            makeAIMove(player);
                            break;
                        }
                        player.boxes.push(box.id);
                        box.textContent = player.sym;
                        // if (player.checkTiles()) {
                        //     gameBoard.gameMsg(`${player.name}`);
                        //     pause = true
                        //     player.wins += 1;
                        //     updateScore();
                        checkBoard(player);
                        // } else if (Array.from(grids).every((grid) => grid.textContent !== '')) {
                        //     pause = true;
                        //     gameBoard.gameMsg('No one');
                        // }
                    }
                    else if (!isAIMode) {
                        player.selected = true;
                    }
                    updateTurn();
                }
            }
        });
    }
    return { allPlayers, resetBoard, resetPlayers, updateScore, updateTurn, start }
})();

document.querySelector('#myForm1p').addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (ev.submitter.id === 'submit1p') {
        if (displayControl.allPlayers.length !== 0) {
            console.log('cleared')
            while (displayControl.allPlayers.length > 0) {
                displayControl.allPlayers.pop();
            }
            displayControl.resetBoard();
        }
        const newGame = document.querySelector('#newGame');
        const values = Array.from(document.querySelectorAll('#myForm1p input'))
            .reduce((acc, input) =>
                ({ ...acc, [input.id]: input.value }), {});
        const player1 = player(values.singleName, 'X', true, false);
        const AI = player('AI', 'O', false, true);
        displayControl.allPlayers.push(player1);
        displayControl.allPlayers.push(AI);
        displayControl.start(true);
        displayControl.updateScore()
        displayControl.updateTurn();
        newGame.addEventListener('click', () => {
            displayControl.resetPlayers(player1, AI);
            displayControl.resetBoard();
            displayControl.updateTurn();
        });
    }
    document.querySelector('#modal1p').style.display = 'none';
});

document.querySelector('#myForm2p').addEventListener('submit', (ev) => {
    // future project to create my own validator instead of required and alert
    ev.preventDefault(); // prevent refresh
    //cancel doesnt do anything problem
    if (ev.submitter.id === 'submit2p') {
        if (displayControl.allPlayers.length !== 0) {
            console.log('cleared')
            while (displayControl.allPlayers.length > 0) {
                displayControl.allPlayers.pop();
            }
            displayControl.resetBoard();
        }
        const newGame = document.querySelector('#newGame');
        const values = Array.from(document.querySelectorAll('#myForm2p input'))
            .reduce((acc, input) =>
                ({ ...acc, [input.id]: input.value }), {});
        const player1 = player(values.player1, "X", true);
        const player2 = player(values.player2, "O", false);
        // new problem, clear mid game if new game chosen
        displayControl.allPlayers.push(player1);
        displayControl.allPlayers.push(player2);
        displayControl.start(false);
        displayControl.updateScore();
        displayControl.updateTurn();
        // displayControl.startGame(player1, player2);
        newGame.addEventListener('click', () => {
            displayControl.resetPlayers(player1, player2)
            displayControl.resetBoard();
            displayControl.updateTurn();
        });
    }
    document.querySelector('#modal2p').style.display = 'none';
})