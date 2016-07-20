import SubtitlesParser from './subtitlesParser';
document.addEventListener('DOMContentLoaded', () => {
    let canvas = document.getElementById('player-canvas');
    let canvasContext = canvas.getContext('2d');
    let player = document.getElementById('player');

    var assistant = document.createElement('canvas');
    var assistantContext = assistant.getContext('2d');
    console.log('aaaa', new SubtitlesParser());
    var overlayCanvas = document.getElementById('overlay-canvas');
    player.addEventListener('loadedmetadata', function () {
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
    });
    player.addEventListener('play', function () {
        requestAnimationFrame(loop);
        overlayCanvas.play();
        function loop() {
            if (!player.paused && !player.ended) {
                draw(player, canvasContext, assistantContext);
                postprocess(canvas, canvasContext, overlayCanvas);
                requestAnimationFrame(loop);
            }
        };
    }, 0);

    player.addEventListener('pause', function () {
        let canvas = document.getElementById('player-canvas');
        let canvasContext = canvas.getContext('2d');
        overlayCanvas.pause();
    }, 0);

    function draw(video, canvasContext, assistantContext) {
        if (video.paused || video.ended) return false;
        canvasContext.drawImage(video, 0, 0);
        // Grab the pixel data from the backing canvas
        var idata = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        // Loop through the pixels, turning them grayscale
        for (let i = 0; i < idata.data.length; i += 4) {
            const r = idata.data[i];
            const g = idata.data[i + 1];
            const b = idata.data[i + 2];
            const brightness = (3 * r + 4 * g + b) >>> 3;
            idata.data[i] = brightness;
            idata.data[i + 1] = brightness;
            idata.data[i + 2] = brightness;
        }
        // Draw the pixels onto the visible canvas
        canvasContext.putImageData(idata, 0, 0);

    };
    //function draw() {
    //    var canvas = document.getElementById("img-1");
    //    var ctx = canvas.getContext("2d");

    //    ctx.globalCompositeOperation = "multiply";

    //    ctx.fillStyle = "blue";
    //    ctx.fillRect(10, 1, 100, 100);

    //    ctx.fillStyle = "red";
    //    ctx.fillRect(50, 50, 100, 100);
    //};

    function postprocess(c, context, overlay) {
        var oldOperation = context.globalCompositeOperation;
        context.globalCompositeOperation = 'screen';
        context.globalAlpha = 0.2;
        context.drawImage(overlay, 0, 0, c.width, c.height); 
        context.globalAlpha = 1;
        context.globalCompositeOperation = oldOperation;
    }
});