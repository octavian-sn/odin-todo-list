const modal = (() => {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal__window');
    const overlay = document.getElementById('overlay');
    const restart = document.getElementById('restart'); 
    const button = document.getElementById('modal__button');
    button.addEventListener('click', () => {
        game.newGame();
        close();
    });
    overlay.addEventListener('click', close);
    restart.addEventListener('click', () => {game.newGame()});

    // Open pop-up
    function open() {
        modalMessage.innerHTML = game.winner;
        if (modal == null) return
        modal.classList.add('active')
        overlay.classList.add('active')
        board.gameBoard.classList.add('inactive');
    }
    // Close pop-up
    function close() {
        if (modal == null) return
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    return {button, open};
})()