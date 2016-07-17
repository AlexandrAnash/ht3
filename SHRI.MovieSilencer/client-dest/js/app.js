'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var playerConvas = document.querySelector('.player-convas');
    var player = document.querySelector('.player');
    var playerConvasContext = playerConvas.getContext('2d');
    var widthConvas = Math.floor(playerConvas.clientWidth / 100);
    var heightConvas = Math.floor(playerConvas.clientHeight / 100);
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
//# sourceMappingURL=app.js.map
