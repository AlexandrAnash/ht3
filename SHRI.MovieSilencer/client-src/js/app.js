import {SubtitlesService} from './subtitlesService';
import {SubtitlesFactory} from './subtitlesFactory';
import {OverlayEffect} from './overlayEffect';
import {Player} from './player';
import {Subtitle} from './Subtitle';

document.addEventListener('DOMContentLoaded', ContentLoaded);
function ContentLoaded() {
    var subtitlesFactory = new SubtitlesFactory();
    let player = new Player();
    return Promise.all([
        subtitlesFactory.loadSubtitles('attachment/subs.srt'),
        player.load()
    ]).then(function() {

        let video = player.video;
        let overlayEffect = new OverlayEffect();
        let overlayVideo = overlayEffect.video;

        var subtitlesService = new SubtitlesService(subtitles, player);

        let elementPlay = document.getElementById('player-play');
        let elementPause = document.getElementById('player-pause');
        let elementRestart = document.getElementById('player-restart');

        elementPlay.addEventListener('click', playPress.bind(this));
        elementPause.addEventListener('click', pausePress.bind(this));
        elementRestart.addEventListener('click', restartPress.bind(this));

        function playPress() {
            elementPlay.classList.add('btn-yellow');
            elementPause.classList.remove('btn-yellow');
            player.play();
            requestAnimationFrame(loop);
            overlayVideo.play();
            subtitlesService.play(video.currentTime * 1000);

            function loop() {
                if (!video.paused && !video.ended) {
                    player.draw();
                    player.postprocess(overlayVideo);
                    requestAnimationFrame(loop);
                }
                subtitlesService.checkSubtitle(video.currentTime * 1000);
                if (subtitlesService.isSubtitleShow) {
                    video.pause();
                }
            };

        }

        function pausePress() {
            elementPlay.classList.remove('btn-yellow');
            elementPause.classList.add('btn-yellow');

            player.pause();
            overlayVideo.pause();
        }

        function restartPress() {
            player.restart();
            overlayVideo.restart();
            subtitlesService.restart();
        }
    });


    //function draw() {
    //    var canvas = document.getElementById("img-1");
    //    var ctx = canvas.getContext("2d");

    //    ctx.globalCompositeOperation = "multiply";

    //    ctx.fillStyle = "blue";
    //    ctx.fillRect(10, 1, 100, 100);

    //    ctx.fillStyle = "red";
    //    ctx.fillRect(50, 50, 100, 100);
    //};

} 