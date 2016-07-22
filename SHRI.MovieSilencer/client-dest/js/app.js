(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subtitle = function Subtitle(params) {
    _classCallCheck(this, Subtitle);

    this.id = params.id;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.delay = params.endTime - params.startTime;
    this.message = params.message;
};

exports.Subtitle = Subtitle;

},{}],2:[function(require,module,exports){
'use strict';

var _subtitleProcessor = require('./subtitleProcessor');

var _overlayEffect = require('./overlayEffect');

var _player = require('./player');

var _audio = require('./audio');

var _Subtitle = require('./Subtitle');

document.addEventListener('DOMContentLoaded', ContentLoaded);

function ContentLoaded() {
    var player = new _player.Player();
    var audio = new _audio.Audio();
    var video = player.video;
    var overlayEffect = new _overlayEffect.OverlayEffect();
    var overlayVideo = overlayEffect.video;
    var rifID = void 0;

    var subtitleProcessor = new _subtitleProcessor.SubtitleProcessor(player);

    var elementPlay = document.getElementById('player-play');
    var elementPause = document.getElementById('player-pause');
    var elementRestart = document.getElementById('player-restart');
    elementPlay.addEventListener('click', playPress.bind(this));
    elementPause.addEventListener('click', pausePress.bind(this));
    elementRestart.addEventListener('click', restartPress.bind(this));

    function playPress() {
        if (player.isPlay) return;

        elementPlay.classList.add('btn-yellow');
        elementPause.classList.remove('btn-yellow');
        loop();
    }
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
    function pausePress() {
        if (player.isPlay === false) return;

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

},{"./Subtitle":1,"./audio":3,"./overlayEffect":4,"./player":5,"./subtitleProcessor":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Audio = function () {
    function Audio() {
        _classCallCheck(this, Audio);

        this.audio = document.getElementById('audio');
        this.isPlay = false;
    }

    _createClass(Audio, [{
        key: 'play',
        value: function play() {
            if (this.isPlay) return;
            this.audio.play();
            this.isPlay = true;
        }
    }, {
        key: 'pause',
        value: function pause() {
            if (!this.isPlay) return;
            this.audio.pause();
            this.isPlay = false;
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlay = false;
        }
    }]);

    return Audio;
}();

exports.Audio = Audio;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OverlayEffect = function OverlayEffect() {
    _classCallCheck(this, OverlayEffect);

    this.video = document.getElementById('overlay-canvas');
};

exports.OverlayEffect = OverlayEffect;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player() {
        var _this = this;

        _classCallCheck(this, Player);

        this.video = document.getElementById('player');
        this.canvas = document.getElementById('player-canvas');
        this.canvasContext = this.canvas.getContext('2d');
        Promise.all([this.load()]).then(function () {
            _this.canvas.width = _this.video.videoWidth;
            _this.canvas.height = _this.video.videoHeight;
        });
        this.video.muted = true;
        this.isPlay = false;
    }

    _createClass(Player, [{
        key: 'load',
        value: function load() {
            var _this2 = this;

            return new Promise(function (resolve) {
                _this2.video.addEventListener('canplaythrough', function () {
                    resolve(_this2);
                });
            });
        }
    }, {
        key: 'play',
        value: function play(overlay) {
            this.video.play();
            this.draw();
            this.postprocess(overlay);
            this.isPlay = true;
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.video.pause();
            this.isPlay = false;
        }
    }, {
        key: 'draw',
        value: function draw() {
            if (this.video.paused || this.video.ended) return false;
            this.canvasContext.drawImage(this.video, 0, 0);
            var idata = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
            for (var i = 0; i < idata.data.length; i += 4) {
                var r = idata.data[i];
                var g = idata.data[i + 1];
                var b = idata.data[i + 2];
                var brightness = 3 * r + 4 * g + b >>> 3;
                idata.data[i] = brightness;
                idata.data[i + 1] = brightness;
                idata.data[i + 2] = brightness;
            }
            this.canvasContext.putImageData(idata, 0, 0);
        }
    }, {
        key: 'postprocess',
        value: function postprocess(overlay) {
            var oldOperation = this.canvasContext.globalCompositeOperation;
            var width = this.canvasContext.canvas.width;
            var height = this.canvasContext.canvas.height;

            this.canvasContext.globalCompositeOperation = 'screen';
            this.canvasContext.globalAlpha = 0.25;
            this.canvasContext.drawImage(overlay, 0, 0, width, height);
            this.canvasContext.globalAlpha = 1;
            this.canvasContext.globalCompositeOperation = oldOperation;
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.video.pause();
            this.video.currentTime = 0;
        }
    }]);

    return Player;
}();

exports.Player = Player;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubtitleProcessor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subtitle = require('./Subtitle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

var SubtitleProcessor = function () {
    function SubtitleProcessor(player) {
        var _this = this;

        _classCallCheck(this, SubtitleProcessor);

        this.isPause = false;
        this.canvasContext = player.canvasContext;
        this.player = player;
        this.isDraw = false;
        this.loadSubtitles('attachment/subs.srt').then(function (data) {
            _this.subtitles = data;
            _this.restart();
        });
    }

    _createClass(SubtitleProcessor, [{
        key: 'checkSubtitle',
        value: function checkSubtitle(time) {
            if (this.isSubtitleShow) return;
            if (this.currentSub.startTime <= time && this.currentSub.endTime >= time) {
                this.isSubtitleShow = true;
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this2 = this;

            var width = this.player.canvas.width;
            var height = this.player.canvas.height;
            var fontSize = 50;
            this.canvasContext.fillStyle = '#000000';
            this.canvasContext.font = fontSize + 'px Oranienbaum';
            this.canvasContext.fillRect(0, 0, width, height);
            this.canvasContext.fillStyle = '#ffffff';
            var lineHeight = 58;

            this.currentSub.message.split('\n').map(function (row, i) {
                _this2.canvasContext.fillText(row, fontSize, fontSize + i * lineHeight);
            });
            this.isDraw = true;
        }
    }, {
        key: 'play',
        value: function play(overlayVideo) {
            if (this.isSubtitleShow) {
                this.draw();
                this.player.postprocess.call(this, overlayVideo);
                setTimeout(function () {
                    var _this3 = this;

                    this.isSubtitleShow = false;
                    this.currentIndex = this.subtitles.findIndex(function (item) {
                        if (item === _this3.currentSub) {
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
    }, {
        key: 'pause',
        value: function pause() {
            this.isPause = true;
        }
    }, {
        key: 'restart',
        value: function restart() {
            this.isSubtitleShow = false;
            this.currentIndex = 0;
            this.currentSub = this.subtitles[this.currentIndex];
        }
    }, {
        key: 'loadSubtitles',
        value: function loadSubtitles(stringLoad) {
            var _this4 = this;

            return fetch(stringLoad).then(function (responce) {
                return responce.text();
            }).then(function (data) {
                var srt = data.replace(/\r\n|\r/g, '\n');
                return srt.split('\n\n').map(function (subItem) {
                    return _this4.formattedToSubtitle(subItem);
                });
            });
        }
    }, {
        key: 'formattedToSubtitle',
        value: function formattedToSubtitle(data) {
            var _this5 = this;

            var subparts = data.split('\n');
            var time = subparts[1].split(' --> ').map(function (t) {
                return _this5.timeParser(t);
            });
            return new _Subtitle.Subtitle({
                id: subparts[0],
                startTime: time[0],
                endTime: time[1],
                message: subparts.slice(2).join('\n')
            });
        }
    }, {
        key: 'timeParser',
        value: function timeParser(timeString) {
            var chunks = timeString.split(':');
            var secondChunks = chunks[2].split(',');
            var hours = parseInt(chunks[0], 10);
            var minutes = parseInt(chunks[1], 10);
            var seconds = parseInt(secondChunks[0], 10);
            var milliSeconds = parseInt(secondChunks[1], 10);
            return HOUR * hours + MINUTE * minutes + SECOND * seconds + milliSeconds;
        }
    }]);

    return SubtitleProcessor;
}();

exports.SubtitleProcessor = SubtitleProcessor;

},{"./Subtitle":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQtc3JjXFxqc1xcU3VidGl0bGUuanMiLCJjbGllbnQtc3JjXFxqc1xcYXBwLmpzIiwiY2xpZW50LXNyY1xcanNcXGF1ZGlvLmpzIiwiY2xpZW50LXNyY1xcanNcXG92ZXJsYXlFZmZlY3QuanMiLCJjbGllbnQtc3JjXFxqc1xccGxheWVyLmpzIiwiY2xpZW50LXNyY1xcanNcXHN1YnRpdGxlUHJvY2Vzc29yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7SUNBTyxRLEdBQ0gsa0JBQVksTUFBWixFQUFvQjtBQUFBOztBQUNoQixTQUFLLEVBQUwsR0FBVSxPQUFPLEVBQWpCO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLE9BQU8sU0FBeEI7QUFDQSxTQUFLLE9BQUwsR0FBZSxPQUFPLE9BQXRCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsT0FBTyxPQUFQLEdBQWlCLE9BQU8sU0FBckM7QUFDQSxTQUFLLE9BQUwsR0FBZSxPQUFPLE9BQXRCO0FBQ0gsQzs7UUFFRyxRLEdBQUEsUTs7Ozs7QUNUUDs7QUFDRDs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxhQUE5Qzs7QUFFQSxTQUFTLGFBQVQsR0FBeUI7QUFDckIsUUFBTSxTQUFTLG9CQUFmO0FBQ0EsUUFBTSxRQUFRLGtCQUFkO0FBQ0EsUUFBTSxRQUFRLE9BQU8sS0FBckI7QUFDQSxRQUFNLGdCQUFnQixrQ0FBdEI7QUFDQSxRQUFNLGVBQWUsY0FBYyxLQUFuQztBQUNBLFFBQUksY0FBSjs7QUFFQSxRQUFJLG9CQUFvQix5Q0FBc0IsTUFBdEIsQ0FBeEI7O0FBRUEsUUFBTSxjQUFjLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFwQjtBQUNBLFFBQU0sZUFBZSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBckI7QUFDQSxRQUFNLGlCQUFpQixTQUFTLGNBQVQsQ0FB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QixDQUFoQjtBQUNBLGdCQUFNLFVBQVUsU0FBUyxhQUFhLENBQWIsQ0FBVCxFQUEwQixFQUExQixDQUFoQjtBQUNBLGdCQUFNLGVBQWUsU0FBUyxhQUFhLENBQWIsQ0FBVCxFQUEwQixFQUExQixDQUFyQjtBQUNBLG1CQUFPLE9BQU8sS0FBUCxHQUNILFNBQVMsT0FETixHQUVILFNBQVMsT0FGTixHQUdILFlBSEo7QUFJSDs7Ozs7O1FBRUcsaUIsR0FBQSxpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79jbGFzcyBTdWJ0aXRsZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXJhbXMpIHtcclxuICAgICAgICB0aGlzLmlkID0gcGFyYW1zLmlkO1xyXG4gICAgICAgIHRoaXMuc3RhcnRUaW1lID0gcGFyYW1zLnN0YXJ0VGltZTtcclxuICAgICAgICB0aGlzLmVuZFRpbWUgPSBwYXJhbXMuZW5kVGltZTtcclxuICAgICAgICB0aGlzLmRlbGF5ID0gcGFyYW1zLmVuZFRpbWUgLSBwYXJhbXMuc3RhcnRUaW1lO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IHBhcmFtcy5tZXNzYWdlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7U3VidGl0bGV9Iiwi77u/aW1wb3J0IHtTdWJ0aXRsZVByb2Nlc3Nvcn0gZnJvbSAnLi9zdWJ0aXRsZVByb2Nlc3Nvcic7XHJcbmltcG9ydCB7T3ZlcmxheUVmZmVjdH0gZnJvbSAnLi9vdmVybGF5RWZmZWN0JztcclxuaW1wb3J0IHtQbGF5ZXJ9IGZyb20gJy4vcGxheWVyJztcclxuaW1wb3J0IHtBdWRpb30gZnJvbSAnLi9hdWRpbyc7XHJcbmltcG9ydCB7U3VidGl0bGV9IGZyb20gJy4vU3VidGl0bGUnO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIENvbnRlbnRMb2FkZWQpO1xyXG5cclxuZnVuY3Rpb24gQ29udGVudExvYWRlZCgpIHtcclxuICAgIGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCk7XHJcbiAgICBjb25zdCB2aWRlbyA9IHBsYXllci52aWRlbztcclxuICAgIGNvbnN0IG92ZXJsYXlFZmZlY3QgPSBuZXcgT3ZlcmxheUVmZmVjdCgpO1xyXG4gICAgY29uc3Qgb3ZlcmxheVZpZGVvID0gb3ZlcmxheUVmZmVjdC52aWRlbztcclxuICAgIGxldCByaWZJRDtcclxuXHJcbiAgICB2YXIgc3VidGl0bGVQcm9jZXNzb3IgPSBuZXcgU3VidGl0bGVQcm9jZXNzb3IocGxheWVyKTtcclxuXHJcbiAgICBjb25zdCBlbGVtZW50UGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItcGxheScpO1xyXG4gICAgY29uc3QgZWxlbWVudFBhdXNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1wYXVzZScpO1xyXG4gICAgY29uc3QgZWxlbWVudFJlc3RhcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLXJlc3RhcnQnKTtcclxuICAgIGVsZW1lbnRQbGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxheVByZXNzLmJpbmQodGhpcykpO1xyXG4gICAgZWxlbWVudFBhdXNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGF1c2VQcmVzcy5iaW5kKHRoaXMpKTtcclxuICAgIGVsZW1lbnRSZXN0YXJ0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVzdGFydFByZXNzLmJpbmQodGhpcykpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHBsYXlQcmVzcygpIHtcclxuICAgICAgICBpZiAocGxheWVyLmlzUGxheSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBlbGVtZW50UGxheS5jbGFzc0xpc3QuYWRkKCdidG4teWVsbG93Jyk7XHJcbiAgICAgICAgZWxlbWVudFBhdXNlLmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi15ZWxsb3cnKTtcclxuICAgICAgICBsb29wKCk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgIHN1YnRpdGxlUHJvY2Vzc29yLmNoZWNrU3VidGl0bGUodmlkZW8uY3VycmVudFRpbWUgKiAxMDAwKTtcclxuICAgICAgICBpZiAoc3VidGl0bGVQcm9jZXNzb3IuaXNTdWJ0aXRsZVNob3cpIHtcclxuICAgICAgICAgICAgaWYgKHN1YnRpdGxlUHJvY2Vzc29yLmlzRHJhdyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgICAgICAgICAgc3VidGl0bGVQcm9jZXNzb3IucGxheShvdmVybGF5VmlkZW8pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3VidGl0bGVQcm9jZXNzb3IuZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgcGxheWVyLnBvc3Rwcm9jZXNzLmNhbGwoc3VidGl0bGVQcm9jZXNzb3IsIG92ZXJsYXlWaWRlbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheShvdmVybGF5VmlkZW8pO1xyXG4gICAgICAgICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgIG92ZXJsYXlWaWRlby5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJpZklEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIHBhdXNlUHJlc3MoKSB7XHJcbiAgICAgICAgaWYgKHBsYXllci5pc1BsYXkgPT09IGZhbHNlKSByZXR1cm47XHJcblxyXG4gICAgICAgIGVsZW1lbnRQbGF5LmNsYXNzTGlzdC5yZW1vdmUoJ2J0bi15ZWxsb3cnKTtcclxuICAgICAgICBlbGVtZW50UGF1c2UuY2xhc3NMaXN0LmFkZCgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJpZklEKTtcclxuICAgICAgICBwbGF5ZXIucGF1c2UoKTtcclxuICAgICAgICBvdmVybGF5VmlkZW8ucGF1c2UoKTtcclxuICAgICAgICBhdWRpby5wYXVzZSgpO1xyXG4gICAgICAgIHN1YnRpdGxlUHJvY2Vzc29yLnBhdXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzdGFydFByZXNzKCkge1xyXG4gICAgICAgIHBsYXllci5yZXN0YXJ0KCk7XHJcbiAgICAgICAgc3VidGl0bGVQcm9jZXNzb3IucmVzdGFydCgpO1xyXG4gICAgICAgIGF1ZGlvLnJlc3RhcnQoKTtcclxuICAgIH1cclxufTsiLCLvu79jbGFzcyBBdWRpbyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmF1ZGlvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1ZGlvJyk7XHJcbiAgICAgICAgdGhpcy5pc1BsYXkgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcGxheSgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1BsYXkpIHJldHVybjtcclxuICAgICAgICB0aGlzLmF1ZGlvLnBsYXkoKTtcclxuICAgICAgICB0aGlzLmlzUGxheSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc1BsYXkpIHJldHVybjtcclxuICAgICAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5pc1BsYXkgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHJlc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5hdWRpby5wYXVzZSgpO1xyXG4gICAgICAgIHRoaXMuYXVkaW8uY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMuaXNQbGF5ID0gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtBdWRpb30iLCLvu79jbGFzcyBPdmVybGF5RWZmZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1jYW52YXMnKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge092ZXJsYXlFZmZlY3R9Iiwi77u/Y2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLWNhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgUHJvbWlzZS5hbGwoW3RoaXMubG9hZCgpXSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy52aWRlby52aWRlb1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLnZpZGVvLnZpZGVvSGVpZ2h0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudmlkZW8ubXV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNQbGF5ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsb2FkKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwbGF5KG92ZXJsYXkpIHtcclxuICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICB0aGlzLnBvc3Rwcm9jZXNzKG92ZXJsYXkpO1xyXG4gICAgICAgIHRoaXMuaXNQbGF5ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8ucGF1c2UoKTtcclxuICAgICAgICB0aGlzLmlzUGxheSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBpZiAodGhpcy52aWRlby5wYXVzZWQgfHwgdGhpcy52aWRlby5lbmRlZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCk7XHJcbiAgICAgICAgdmFyIGlkYXRhID0gdGhpcy5jYW52YXNDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkYXRhLmRhdGEubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgY29uc3QgciA9IGlkYXRhLmRhdGFbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGcgPSBpZGF0YS5kYXRhW2kgKyAxXTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGlkYXRhLmRhdGFbaSArIDJdO1xyXG4gICAgICAgICAgICBjb25zdCBicmlnaHRuZXNzID0gKDMgKiByICsgNCAqIGcgKyBiKSA+Pj4gMztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpXSA9IGJyaWdodG5lc3M7XHJcbiAgICAgICAgICAgIGlkYXRhLmRhdGFbaSArIDFdID0gYnJpZ2h0bmVzcztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpICsgMl0gPSBicmlnaHRuZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKGlkYXRhLCAwLCAwKTtcclxuICAgIH1cclxuICAgIHBvc3Rwcm9jZXNzKG92ZXJsYXkpe1xyXG4gICAgICAgIHZhciBvbGRPcGVyYXRpb24gPSB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uO1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNDb250ZXh0LmNhbnZhcy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0NvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzY3JlZW4nO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5nbG9iYWxBbHBoYSA9IDAuMjU7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmRyYXdJbWFnZShvdmVybGF5LCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTsgXHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gb2xkT3BlcmF0aW9uO1xyXG4gICAgfVxyXG4gICAgcmVzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtQbGF5ZXJ9Iiwi77u/aW1wb3J0IHtTdWJ0aXRsZX0gZnJvbSAnLi9TdWJ0aXRsZSc7XHJcblxyXG5jb25zdCBTRUNPTkQgPSAxMDAwLFxyXG4gICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXHJcbiAgICBIT1VSID0gNjAgKiBNSU5VVEU7XHJcblxyXG5jbGFzcyBTdWJ0aXRsZVByb2Nlc3NvciB7XHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXIpIHtcclxuICAgICAgICB0aGlzLmlzUGF1c2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQgPSBwbGF5ZXIuY2FudmFzQ29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMubG9hZFN1YnRpdGxlcygnYXR0YWNobWVudC9zdWJzLnNydCcpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zdWJ0aXRsZXMgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJlc3RhcnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNoZWNrU3VidGl0bGUodGltZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU3VidGl0bGVTaG93KSByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFN1Yi5zdGFydFRpbWUgPD0gdGltZSAmJiB0aGlzLmN1cnJlbnRTdWIuZW5kVGltZSA+PSB0aW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTdWJ0aXRsZVNob3cgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGRyYXcoKSB7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnBsYXllci5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5wbGF5ZXIuY2FudmFzLmhlaWdodDtcclxuICAgICAgICBjb25zdCBmb250U2l6ZSA9IDUwO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSAnIzAwMDAwMCc7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZvbnQgPSBgJHtmb250U2l6ZX1weCBPcmFuaWVuYmF1bWA7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZmZmZic7XHJcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IDU4O1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdWIubWVzc2FnZVxyXG5cdFx0XHQuc3BsaXQoJ1xcbicpXHJcblx0XHRcdC5tYXAoKHJvdywgaSkgPT4ge1xyXG5cdFx0XHQgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxUZXh0KHJvdywgZm9udFNpemUsIGZvbnRTaXplICsgaSAqIGxpbmVIZWlnaHQpO1xyXG5cdFx0XHR9KTtcclxuICAgICAgICB0aGlzLmlzRHJhdyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwbGF5KG92ZXJsYXlWaWRlbykge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU3VidGl0bGVTaG93KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllci5wb3N0cHJvY2Vzcy5jYWxsKHRoaXMsIG92ZXJsYXlWaWRlbyk7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzU3VidGl0bGVTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHRoaXMuc3VidGl0bGVzLmZpbmRJbmRleCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtID09PSB0aGlzLmN1cnJlbnRTdWIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkgKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViID0gdGhpcy5zdWJ0aXRsZXNbdGhpcy5jdXJyZW50SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0RyYXcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzUGF1c2UpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnZpZGVvLnBsYXkoKTtcclxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLmN1cnJlbnRTdWIuZGVsYXkpOyAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBwYXVzZSgpIHtcclxuICAgICAgICB0aGlzLmlzUGF1c2UgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmVzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmlzU3VidGl0bGVTaG93ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN1YiA9IHRoaXMuc3VidGl0bGVzW3RoaXMuY3VycmVudEluZGV4XTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbG9hZFN1YnRpdGxlcyhzdHJpbmdMb2FkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoKHN0cmluZ0xvYWQpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25jZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbmNlLnRleHQoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBzcnQgPSBkYXRhLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNydCBcclxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoJ1xcblxcbicpXHJcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgoc3ViSXRlbSkgPT4gdGhpcy5mb3JtYXR0ZWRUb1N1YnRpdGxlKHN1Ykl0ZW0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9ybWF0dGVkVG9TdWJ0aXRsZShkYXRhKSB7XHJcbiAgICAgICAgY29uc3Qgc3VicGFydHMgPSBkYXRhLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICBsZXQgdGltZSA9IHN1YnBhcnRzWzFdLnNwbGl0KCcgLS0+ICcpLm1hcCgodCkgPT4gdGhpcy50aW1lUGFyc2VyKHQpKTtcclxuICAgICAgICByZXR1cm4gbmV3IFN1YnRpdGxlKHtcclxuICAgICAgICAgICAgaWQ6IHN1YnBhcnRzWzBdLFxyXG4gICAgICAgICAgICBzdGFydFRpbWU6IHRpbWVbMF0sXHJcbiAgICAgICAgICAgIGVuZFRpbWU6IHRpbWVbMV0sXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHN1YnBhcnRzLnNsaWNlKDIpLmpvaW4oJ1xcbicpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRpbWVQYXJzZXIodGltZVN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IHRpbWVTdHJpbmcuc3BsaXQoJzonKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRDaHVua3MgPSBjaHVua3NbMl0uc3BsaXQoJywnKTtcclxuICAgICAgICBjb25zdCBob3VycyA9IHBhcnNlSW50KGNodW5rc1swXSwgMTApO1xyXG4gICAgICAgIGNvbnN0IG1pbnV0ZXMgPSBwYXJzZUludChjaHVua3NbMV0sIDEwKTtcclxuICAgICAgICBjb25zdCBzZWNvbmRzID0gcGFyc2VJbnQoc2Vjb25kQ2h1bmtzWzBdLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWlsbGlTZWNvbmRzID0gcGFyc2VJbnQoc2Vjb25kQ2h1bmtzWzFdLCAxMCk7XHJcbiAgICAgICAgcmV0dXJuIEhPVVIgKiBob3VycyArXHJcbiAgICAgICAgICAgIE1JTlVURSAqIG1pbnV0ZXMgK1xyXG4gICAgICAgICAgICBTRUNPTkQgKiBzZWNvbmRzICtcclxuICAgICAgICAgICAgbWlsbGlTZWNvbmRzO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7U3VidGl0bGVQcm9jZXNzb3J9Il19
