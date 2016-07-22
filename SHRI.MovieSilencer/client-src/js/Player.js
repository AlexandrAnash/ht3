class Player {
    constructor() {
        this.video = document.getElementById('player');
        this.canvas = document.getElementById('player-canvas');
        this.canvasContext = this.canvas.getContext('2d');
        Promise.all([this.load()]).then(() => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        });
        this.video.muted = true;
        this.isPlay = false;
    }
    load() {
        return new Promise((resolve) => {
            this.video.addEventListener('canplaythrough', () => {
                resolve(this);
            });
        });
    }
    play(overlay) {
        this.video.play();
        this.draw();
        this.postprocess(overlay);
        this.isPlay = true;
    }
    pause() {
        this.video.pause();
        this.isPlay = false;
    }
    draw() {
        if (this.video.paused || this.video.ended) return false;
        this.canvasContext.drawImage(this.video, 0, 0);
        var idata = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < idata.data.length; i += 4) {
            const r = idata.data[i];
            const g = idata.data[i + 1];
            const b = idata.data[i + 2];
            const brightness = (3 * r + 4 * g + b) >>> 3;
            idata.data[i] = brightness;
            idata.data[i + 1] = brightness;
            idata.data[i + 2] = brightness;
        }
        this.canvasContext.putImageData(idata, 0, 0);
    }
    postprocess(overlay){
        var oldOperation = this.canvasContext.globalCompositeOperation;
        const width = this.canvasContext.canvas.width;
        const height = this.canvasContext.canvas.height;

        this.canvasContext.globalCompositeOperation = 'screen';
        this.canvasContext.globalAlpha = 0.25;
        this.canvasContext.drawImage(overlay, 0, 0, width, height); 
        this.canvasContext.globalAlpha = 1;
        this.canvasContext.globalCompositeOperation = oldOperation;
    }
    restart() {
        this.video.pause();
        this.video.currentTime = 0;
    }
}
export {Player}