const modal = document.querySelector('#modal');

const twoPlayer = document.querySelector('#twoPlayer');

const cancel = document.querySelector('#cancel');

twoPlayer.onclick = () => {
    modal.style.display = 'flex';
}

cancel.onclick = () => {
    modal.style.display = 'none';
}


