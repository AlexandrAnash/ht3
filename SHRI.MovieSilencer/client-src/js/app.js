document.addEventListener('DOMContentLoaded', () => {
    let playerConvas = document.querySelector('.player-convas');
    let player = document.querySelector('.player');
    let playerConvasContext = playerConvas.getContext('2d');
    let widthConvas = Math.floor(playerConvas.clientWidth / 100);
    let heightConvas = Math.floor(playerConvas.clientHeight / 100);
    playerConvas.width = widthConvas;
    playerConvas.height = heightConvas;
    player.addEventListener('play', function () {
        draw(this, playerConvasContext, widthConvas, heightConvas);
    }, false);

    function draw(v, c, w, h) {
        if (v.paused || v.ended) return false;
        c.drawImage(v, 0, 0, w, h);
        setTimeout(draw, 20, v, c, w, h);
    }
});