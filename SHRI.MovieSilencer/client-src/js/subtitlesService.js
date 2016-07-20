import {Subtitle} from './Subtitle';

const SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

class SubtitlesService {
    constructor(subtitles, canvasContext, player) {
        this.isPause = false;
        this.subtitles = subtitles;
        this.resetSubtitle();
        this.canvasContext = canvasContext;
        this.player = player;
    }
    checkSubtitle(time) {
        if (this.currentSub.timerStart <= time) {
            this.isSubtitleShow = true;
            this.play(time);
            this.player.pause();
        }
    }
    play(time) {
        if (this.isSubtitleShow) {

            this.draw();
            setTimeout(function() {
                this.isSubtitleShow = false;
                this.currentSub = this.subtitles[this.currentIndex++];
                this.player.play();
            }.bind(this), this.currentSub.timerEnd - time);    
        }
        
    }
    pause() {
        this.isPause = true;
    }
    draw() {
        let maxWidth = 600;
        let lineHeight = 60;

        this.canvasContext.textAlign = 'center';

        this.canvasContext.font = '51px \'Oranienbaum\'';
        this.canvasContext.fillStyle = 'white';
        let x = 0;
        let y = 0;
        this.wrapText(this.canvasContext, this.currentSub.message, x, y, maxWidth, lineHeight);
    }
    resetSubtitle() {
        this.isSubtitleShow = false;
        this.currentIndex = 0;
        this.currentSub = this.subtitles[this.currentIndex];
    }
    ////
    wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars;
        var ii;
        var line;
        var words;
        var testLine;
        var metrics;
        var testWidth;
        var n;

        cars = text.split('\n');

        for (ii = 0; ii < cars.length; ii++) {
            line = '';
            words = cars[ii].split(' ');

            for (n = 0; n < words.length; n++) {
                testLine = line + words[n] + ' ';
                metrics = context.measureText(testLine);
                testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + ' ';
                    y += lineHeight;
                } else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);
            y += lineHeight;
        }
    }
}
export {SubtitlesService}