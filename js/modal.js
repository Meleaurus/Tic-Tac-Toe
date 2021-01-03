const modal2p = document.querySelector('#modal2p');

const modal1p = document.querySelector('#modal1p');

const single = document.querySelector('#single');

const twoPlayer = document.querySelector('#twoPlayer');

const cancel1p = document.querySelector('#cancel1p');

const cancel2p = document.querySelector('#cancel2p');

single.onclick = () => {
    modal1p.style.display = 'flex';
}

cancel1p.onclick = () => {
    modal1p.style.display = 'none';
}

twoPlayer.onclick = () => {
    modal2p.style.display = 'flex';
}

cancel2p.onclick = () => {
    modal2p.style.display = 'none';
}


