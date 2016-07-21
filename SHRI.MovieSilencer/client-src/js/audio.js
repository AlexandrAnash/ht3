class Audio {
    constructor() {
        this.audio = document.getElementById('audio');
        this.isPlay = false;
    }
    
    play() {
        if (this.isPlay) return;
        this.audio.play();
        this.isPlay = true;
    }
    
    pause() {
        if (!this.isPlay) return;
        this.audio.pause();
        this.isPlay = false;
    }
    restart() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.isPlay = false;
    }
}
export {Audio}