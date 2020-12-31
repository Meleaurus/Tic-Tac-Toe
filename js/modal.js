const modal = document.querySelector('#modal');

const twoPlayer = document.querySelector('#twoPlayer');

const cancel = document.querySelector('#cancel');

twoPlayer.onclick = () => {
    modal.style.display = 'block';
}

cancel.onclick = () => {
    modal.style.display = 'none';
}


