const gameBoard = (() => {
    const container = document.querySelector('#container');
    const setUp = () => {
        for (let i = 0; i < 9; i++) {
            const grid = document.createElement('div');
            grid.classList.add('grid');
            container.appendChild(grid);
            // event listener here, then return grid if fired
            // and if grid is empty
            // add grid coords to player boxes arr
        }
    }
    return { container, setUp };
})();

gameBoard.setUp();

const player = (symbol, turn) => {
    let selected = turn;
    let boxes = [];
    const sym = symbol;
    let wins = 0;
    const makeMove = (grid) => {
        console.log("yeet")
    }
    return { boxes, selected, sym, wins, makeMove }
}

const player1 = player("X", true);
const player2 = player("O", false);

const displayControl = (() => {
    // connect player switching here with the player's sym
    const players = [player1, player2];
    gameBoard.container.addEventListener('click', (e) => {
        const box = e.target;
        if (box.textContent === "") {
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if (player.selected === true) {
                    player.selected = false;
                    player.boxes.push(box);
                    box.textContent = player.sym;
                }
                else {
                    player.selected = true;
                }
            }
        }
    });
    // if grid fired mark player 1 symbol, change turn
})();