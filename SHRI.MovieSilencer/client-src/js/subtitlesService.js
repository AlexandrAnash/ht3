import {Subtitle} from './Subtitle';

const SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

class SubtitlesService {
    constructor(subtitles, player) {
        this.isPause = false;
        this.subtitles = subtitles;
        this.restart();
        this.canvasContext = player.canvasContext;
        this.player = player;
        this.isDraw = false;

    }
    checkSubtitle(time) {
        if (this.isSubtitleShow) return;
        if (this.currentSub.startTime <= time && this.currentSub.endTime >= time) {
            this.isSubtitleShow = true;
        }
    }
    draw() {
        const width = this.player.canvas.width;
        const height = this.player.canvas.height;
        const fontSize = 50;
        this.canvasContext.fillStyle = '#000000';
        this.canvasContext.font = `${fontSize}px Oranienbaum`;
        this.canvasContext.fillRect(0, 0, width, height);
        this.canvasContext.fillStyle = '#ffffff';
        const lineHeight = 58;

        this.currentSub.message
			.split('\n')
			.map((row, i) => {
			    this.canvasContext.fillText(row, fontSize, fontSize + i * lineHeight);
			});
        this.isDraw = true;
    }
    play(overlayVideo) {
        if (this.isSubtitleShow) {
            this.draw();
            this.player.postprocess.call(this, overlayVideo);
            setTimeout(function() {
                this.isSubtitleShow = false;
                this.currentIndex = this.subtitles.findIndex((item) => {
                    if (item === this.currentSub) {
                        return item;
                    }
                }) + 1;
                this.currentSub = this.subtitles[this.currentIndex];
                this.isDraw = false;
                if (this.isPause) return;
                this.player.video.play();
            }.bind(this), this.currentSub.delay);    
        }
        
    }
    pause() {
        this.isPause = true;
    }
    restart() {
        this.isSubtitleShow = false;
        this.currentIndex = 0;
        this.currentSub = this.subtitles[this.currentIndex];
    }
}
export {SubtitlesService}