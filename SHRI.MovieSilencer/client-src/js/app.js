import {SubtitleProcessor} from './subtitleProcessor';
import {OverlayEffect} from './overlayEffect';
import {Player} from './player';
import {Audio} from './audio';
import {Subtitle} from './Subtitle';

document.addEventListener('DOMContentLoaded', ContentLoaded);

function ContentLoaded() {
    const player = new Player();
    const audio = new Audio();
    const video = player.video;
    const overlayEffect = new OverlayEffect();
    const overlayVideo = overlayEffect.video;

    var subtitleProcessor = new SubtitleProcessor(player);

    const elementPlay = document.getElementById('player-play');
    const elementPause = document.getElementById('player-pause');
    const elementRestart = document.getElementById('player-restart');
    let rifID;
    elementPlay.addEventListener('click', playPress.bind(this));
    elementPause.addEventListener('click', pausePress.bind(this));
    elementRestart.addEventListener('click', restartPress.bind(this));

    function playPress() {
        elementPlay.classList.add('btn-yellow');
        elementPause.classList.remove('btn-yellow');
        loop();

        function loop() {
            subtitleProcessor.checkSubtitle(video.currentTime * 1000);
            if (subtitleProcessor.isSubtitleShow) {
                if (subtitleProcessor.isDraw === false) {
                    player.pause();
                    subtitleProcessor.play(overlayVideo);
                } else {
                    subtitleProcessor.draw();
                    player.postprocess.call(subtitleProcessor, overlayVideo);
                }
            } else {
                player.play(overlayVideo);
                audio.play();
                overlayVideo.play();
            }
            rifID = requestAnimationFrame(loop);
        };
    }

    function pausePress() {
        elementPlay.classList.remove('btn-yellow');
        elementPause.classList.add('btn-yellow');
        cancelAnimationFrame(rifID);
        player.pause();
        overlayVideo.pause();
        audio.pause();
        subtitleProcessor.pause();
    }

    function restartPress() {
        player.restart();
        subtitleProcessor.restart();
        audio.restart();
    }
};