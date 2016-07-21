import {SubtitlesService} from './subtitlesService';
import {SubtitlesFactory} from './subtitlesFactory';
import {OverlayEffect} from './overlayEffect';
import {Player} from './player';
import {Audio} from './audio';
import {Subtitle} from './Subtitle';

document.addEventListener('DOMContentLoaded', ContentLoaded);
function ContentLoaded() {
    const subtitlesFactory = new SubtitlesFactory();
    return Promise.all([
        subtitlesFactory.loadSubtitles('attachment/subs.srt'),
    ]).then(function(promiseData) {
        const player = new Player();
        const audio  = new Audio();
        const subtitles = promiseData[0];
        const video = player.video;
        const overlayEffect = new OverlayEffect();
        const overlayVideo = overlayEffect.video;

        var subtitlesService = new SubtitlesService(subtitles, player);

        let elementPlay = document.getElementById('player-play');
        let elementPause = document.getElementById('player-pause');
        let elementRestart = document.getElementById('player-restart');
        let rifID;
        elementPlay.addEventListener('click', playPress.bind(this));
        elementPause.addEventListener('click', pausePress.bind(this));
        elementRestart.addEventListener('click', restartPress.bind(this));

        function playPress() {
            elementPlay.classList.add('btn-yellow');
            elementPause.classList.remove('btn-yellow');
            loop();

            function loop() {
                subtitlesService.checkSubtitle(video.currentTime * 1000);
                if (subtitlesService.isSubtitleShow) {
                    if (subtitlesService.isDraw === false) {
                        player.pause();
                        subtitlesService.play(overlayVideo);
                    } else {
                        subtitlesService.draw();
                        player.postprocess.call(subtitlesService, overlayVideo);
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
            subtitlesService.pause();
        }

        function restartPress() {
            player.restart();
            subtitlesService.restart();
            audio.restart();
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