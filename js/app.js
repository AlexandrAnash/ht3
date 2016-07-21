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

var _subtitlesService = require('./subtitlesService');

var _subtitlesFactory = require('./subtitlesFactory');

var _overlayEffect = require('./overlayEffect');

var _player = require('./player');

var _audio = require('./audio');

var _Subtitle = require('./Subtitle');

document.addEventListener('DOMContentLoaded', ContentLoaded);
function ContentLoaded() {
    var subtitlesFactory = new _subtitlesFactory.SubtitlesFactory();
    return Promise.all([subtitlesFactory.loadSubtitles('attachment/subs.srt')]).then(function (promiseData) {
        var player = new _player.Player();
        var audio = new _audio.Audio();
        var subtitles = promiseData[0];
        var video = player.video;
        var overlayEffect = new _overlayEffect.OverlayEffect();
        var overlayVideo = overlayEffect.video;

        var subtitlesService = new _subtitlesService.SubtitlesService(subtitles, player);

        var elementPlay = document.getElementById('player-play');
        var elementPause = document.getElementById('player-pause');
        var elementRestart = document.getElementById('player-restart');
        var rifID = void 0;
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

},{"./Subtitle":1,"./audio":3,"./overlayEffect":4,"./player":5,"./subtitlesFactory":6,"./subtitlesService":7}],3:[function(require,module,exports){
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
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.video.pause();
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
exports.SubtitlesFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subtitle = require('./Subtitle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

var SubtitlesFactory = function () {
    function SubtitlesFactory() {
        _classCallCheck(this, SubtitlesFactory);
    }

    _createClass(SubtitlesFactory, [{
        key: 'loadSubtitles',
        value: function loadSubtitles(stringLoad) {
            var _this = this;

            return fetch(stringLoad).then(function (responce) {
                return responce.text();
            }).then(function (data) {
                var srt = data.replace(/\r\n|\r|\n/g, '\n');
                return srt.split('\n\n').map(function (subItem) {
                    return _this.formattedToSubtitle(subItem);
                });
            });
        }
    }, {
        key: 'formattedToSubtitle',
        value: function formattedToSubtitle(data) {
            var _this2 = this;

            var subparts = data.split('\n');
            var time = subparts[1].split(' --> ').map(function (t) {
                return _this2.timeParser(t);
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

    return SubtitlesFactory;
}();

exports.SubtitlesFactory = SubtitlesFactory;

},{"./Subtitle":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SubtitlesService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Subtitle = require('./Subtitle');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE;

var SubtitlesService = function () {
    function SubtitlesService(subtitles, player) {
        _classCallCheck(this, SubtitlesService);

        this.isPause = false;
        this.subtitles = subtitles;
        this.restart();
        this.canvasContext = player.canvasContext;
        this.player = player;
        this.isDraw = false;
    }

    _createClass(SubtitlesService, [{
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
            var _this = this;

            var width = this.player.canvas.width;
            var height = this.player.canvas.height;
            var fontSize = 50;
            this.canvasContext.fillStyle = '#000000';
            this.canvasContext.font = fontSize + 'px Oranienbaum';
            this.canvasContext.fillRect(0, 0, width, height);
            this.canvasContext.fillStyle = '#ffffff';
            var lineHeight = 58;

            this.currentSub.message.split('\n').map(function (row, i) {
                _this.canvasContext.fillText(row, fontSize, fontSize + i * lineHeight);
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
                    var _this2 = this;

                    this.isSubtitleShow = false;
                    this.currentIndex = this.subtitles.findIndex(function (item) {
                        if (item === _this2.currentSub) {
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
    }]);

    return SubtitlesService;
}();

exports.SubtitlesService = SubtitlesService;

},{"./Subtitle":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQtc3JjXFxqc1xcU3VidGl0bGUuanMiLCJjbGllbnQtc3JjXFxqc1xcYXBwLmpzIiwiY2xpZW50LXNyY1xcanNcXGF1ZGlvLmpzIiwiY2xpZW50LXNyY1xcanNcXG92ZXJsYXlFZmZlY3QuanMiLCJjbGllbnQtc3JjXFxqc1xccGxheWVyLmpzIiwiY2xpZW50LXNyY1xcanNcXHN1YnRpdGxlc0ZhY3RvcnkuanMiLCJjbGllbnQtc3JjXFxqc1xcc3VidGl0bGVzU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0lDQU8sUSxHQUNILGtCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsT0FBTyxFQUFqQjtBQUNBLFNBQUssU0FBTCxHQUFpQixPQUFPLFNBQXhCO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBTyxPQUF0QjtBQUNBLFNBQUssS0FBTCxHQUFhLE9BQU8sT0FBUCxHQUFpQixPQUFPLFNBQXJDO0FBQ0EsU0FBSyxPQUFMLEdBQWUsT0FBTyxPQUF0QjtBQUNILEM7O1FBRUcsUSxHQUFBLFE7Ozs7O0FDVFA7O0FBQ0Q7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsYUFBOUM7QUFDQSxTQUFTLGFBQVQsR0FBeUI7QUFDckIsUUFBTSxtQkFBbUIsd0NBQXpCO0FBQ0EsV0FBTyxRQUFRLEdBQVIsQ0FBWSxDQUNmLGlCQUFpQixhQUFqQixDQUErQixxQkFBL0IsQ0FEZSxDQUFaLEVBRUosSUFGSSxDQUVDLFVBQVMsV0FBVCxFQUFzQjtBQUMxQixZQUFNLFNBQVMsb0JBQWY7QUFDQSxZQUFNLFFBQVMsa0JBQWY7QUFDQSxZQUFNLFlBQVksWUFBWSxDQUFaLENBQWxCO0FBQ0EsWUFBTSxRQUFRLE9BQU8sS0FBckI7QUFDQSxZQUFNLGdCQUFnQixrQ0FBdEI7QUFDQSxZQUFNLGVBQWUsY0FBYyxLQUFuQzs7QUFFQSxZQUFJLG1CQUFtQix1Q0FBcUIsU0FBckIsRUFBZ0MsTUFBaEMsQ0FBdkI7O0FBRUEsWUFBSSxjQUFjLFNBQVMsY0FBVCxDQUF3QixhQUF4QixDQUFsQjtBQUNBLFlBQUksZUFBZSxTQUFTLGNBQVQsQ0FBd0IsY0FBeEIsQ0FBbkI7QUFDQSxZQUFJLGlCQUFpQixTQUFTLGNBQVQsQ0FBd0IsZ0JBQXhCLENBQXJCO0FBQ0EsWUFBSSxjQUFKO0FBQ0Esb0JBQVksZ0JBQVosQ0FBNkIsT0FBN0IsRUFBc0MsVUFBVSxJQUFWLENBQWUsSUFBZixDQUF0QztBQUNBLHFCQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFdBQVcsSUFBWCxDQUFnQixJQUFoQixDQUF2QztBQUNBLHVCQUFlLGdCQUFmLENBQWdDLE9BQWhDLEVBQXlDLGFBQWEsSUFBYixDQUFrQixJQUFsQixDQUF6Qzs7QUFFQSxpQkFBUyxTQUFULEdBQXFCO0FBQ2pCLHdCQUFZLFNBQVosQ0FBc0IsR0FBdEIsQ0FBMEIsWUFBMUI7QUFDQSx5QkFBYSxTQUFiLENBQXVCLE1BQXZCLENBQThCLFlBQTlCO0FBQ0E7O0FBRUEscUJBQVMsSUFBVCxHQUFnQjtBQUNaLGlDQUFpQixhQUFqQixDQUErQixNQUFNLFdBQU4sR0FBb0IsSUFBbkQ7QUFDQSxvQkFBSSxpQkFBaUIsY0FBckIsRUFBcUM7QUFDakMsd0JBQUksaUJBQWlCLE1BQWpCLEtBQTRCLEtBQWhDLEVBQXVDO0FBQ25DLCtCQUFPLEtBQVA7QUFDQSx5Q0FBaUIsSUFBakIsQ0FBc0IsWUFBdEI7QUFDSCxxQkFIRCxNQUdPO0FBQ0gseUNBQWlCLElBQWpCO0FBQ0EsK0JBQU8sV0FBUCxDQUFtQixJQUFuQixDQUF3QixnQkFBeEIsRUFBMEMsWUFBMUM7QUFDSDtBQUNKLGlCQVJELE1BUU87QUFDSCwyQkFBTyxJQUFQLENBQVksWUFBWjtBQUNBLDBCQUFNLElBQU47QUFDQSxpQ0FBYSxJQUFiO0FBQ0g7QUFDRCx3QkFBUSxzQkFBc0IsSUFBdEIsQ0FBUjtBQUNIO0FBQ0o7O0FBRUQsaUJBQVMsVUFBVCxHQUFzQjtBQUNsQix3QkFBWSxTQUFaLENBQXNCLE1BQXRCLENBQTZCLFlBQTdCO0FBQ0EseUJBQWEsU0FBYixDQUF1QixHQUF2QixDQUEyQixZQUEzQjtBQUNBLGlDQUFxQixLQUFyQjtBQUNBLG1CQUFPLEtBQVA7QUFDQSx5QkFBYSxLQUFiO0FBQ0Esa0JBQU0sS0FBTjtBQUNBLDZCQUFpQixLQUFqQjtBQUNIOztBQUVELGlCQUFTLFlBQVQsR0FBd0I7QUFDcEIsbUJBQU8sT0FBUDtBQUNBLDZCQUFpQixPQUFqQjtBQUNBLGtCQUFNLE9BQU47QUFDSDtBQUNKLEtBM0RNLENBQVA7O0FBOERBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUVIOzs7Ozs7Ozs7Ozs7O0lDckZNLEs7QUFDSCxxQkFBYztBQUFBOztBQUNWLGFBQUssS0FBTCxHQUFhLFNBQVMsY0FBVCxDQUF3QixPQUF4QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNIOzs7OytCQUVNO0FBQ0gsZ0JBQUksS0FBSyxNQUFULEVBQWlCO0FBQ2pCLGlCQUFLLEtBQUwsQ0FBVyxJQUFYO0FBQ0EsaUJBQUssTUFBTCxHQUFjLElBQWQ7QUFDSDs7O2dDQUVPO0FBQ0osZ0JBQUksQ0FBQyxLQUFLLE1BQVYsRUFBa0I7QUFDbEIsaUJBQUssS0FBTCxDQUFXLEtBQVg7QUFDQSxpQkFBSyxNQUFMLEdBQWMsS0FBZDtBQUNIOzs7a0NBQ1M7QUFDTixpQkFBSyxLQUFMLENBQVcsS0FBWDtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLENBQXpCO0FBQ0EsaUJBQUssTUFBTCxHQUFjLEtBQWQ7QUFDSDs7Ozs7O1FBRUcsSyxHQUFBLEs7Ozs7Ozs7Ozs7O0lDdkJELGEsR0FDSCx5QkFBYztBQUFBOztBQUNWLFNBQUssS0FBTCxHQUFhLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FBYjtBQUNILEM7O1FBRUcsYSxHQUFBLGE7Ozs7Ozs7Ozs7Ozs7SUNMRCxNO0FBQ0gsc0JBQWM7QUFBQTs7QUFBQTs7QUFDVixhQUFLLEtBQUwsR0FBYSxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBYjtBQUNBLGFBQUssTUFBTCxHQUFjLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFkO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsSUFBdkIsQ0FBckI7QUFDQSxnQkFBUSxHQUFSLENBQVksQ0FBQyxLQUFLLElBQUwsRUFBRCxDQUFaLEVBQTJCLElBQTNCLENBQWdDLFlBQU07QUFDbEMsa0JBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsTUFBSyxLQUFMLENBQVcsVUFBL0I7QUFDQSxrQkFBSyxNQUFMLENBQVksTUFBWixHQUFxQixNQUFLLEtBQUwsQ0FBVyxXQUFoQztBQUNILFNBSEQ7QUFJQSxhQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLElBQW5CO0FBQ0g7Ozs7K0JBQ007QUFBQTs7QUFDSCxtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBYTtBQUM1Qix1QkFBSyxLQUFMLENBQVcsZ0JBQVgsQ0FBNEIsZ0JBQTVCLEVBQThDLFlBQU07QUFDaEQ7QUFDSCxpQkFGRDtBQUdILGFBSk0sQ0FBUDtBQUtIOzs7NkJBQ0ksTyxFQUFTO0FBQ1YsaUJBQUssS0FBTCxDQUFXLElBQVg7QUFDQSxpQkFBSyxJQUFMO0FBQ0EsaUJBQUssV0FBTCxDQUFpQixPQUFqQjtBQUNIOzs7Z0NBQ087QUFDSixpQkFBSyxLQUFMLENBQVcsS0FBWDtBQUNIOzs7K0JBQ007QUFDSCxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEtBQUssS0FBTCxDQUFXLEtBQXBDLEVBQTJDLE9BQU8sS0FBUDtBQUMzQyxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLENBQTZCLEtBQUssS0FBbEMsRUFBeUMsQ0FBekMsRUFBNEMsQ0FBNUM7QUFDQSxnQkFBSSxRQUFRLEtBQUssYUFBTCxDQUFtQixZQUFuQixDQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQyxLQUFLLE1BQUwsQ0FBWSxLQUFsRCxFQUF5RCxLQUFLLE1BQUwsQ0FBWSxNQUFyRSxDQUFaO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLElBQU4sQ0FBVyxNQUEvQixFQUF1QyxLQUFLLENBQTVDLEVBQStDO0FBQzNDLG9CQUFNLElBQUksTUFBTSxJQUFOLENBQVcsQ0FBWCxDQUFWO0FBQ0Esb0JBQU0sSUFBSSxNQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsQ0FBVjtBQUNBLG9CQUFNLElBQUksTUFBTSxJQUFOLENBQVcsSUFBSSxDQUFmLENBQVY7QUFDQSxvQkFBTSxhQUFjLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUFqQixLQUF3QixDQUEzQztBQUNBLHNCQUFNLElBQU4sQ0FBVyxDQUFYLElBQWdCLFVBQWhCO0FBQ0Esc0JBQU0sSUFBTixDQUFXLElBQUksQ0FBZixJQUFvQixVQUFwQjtBQUNBLHNCQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsSUFBb0IsVUFBcEI7QUFDSDtBQUNELGlCQUFLLGFBQUwsQ0FBbUIsWUFBbkIsQ0FBZ0MsS0FBaEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUM7QUFDSDs7O29DQUNXLE8sRUFBUTtBQUNoQixnQkFBSSxlQUFlLEtBQUssYUFBTCxDQUFtQix3QkFBdEM7QUFDQSxnQkFBTSxRQUFRLEtBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixLQUF4QztBQUNBLGdCQUFNLFNBQVMsS0FBSyxhQUFMLENBQW1CLE1BQW5CLENBQTBCLE1BQXpDOztBQUVBLGlCQUFLLGFBQUwsQ0FBbUIsd0JBQW5CLEdBQThDLFFBQTlDO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixXQUFuQixHQUFpQyxJQUFqQztBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsU0FBbkIsQ0FBNkIsT0FBN0IsRUFBc0MsQ0FBdEMsRUFBeUMsQ0FBekMsRUFBNEMsS0FBNUMsRUFBbUQsTUFBbkQ7QUFDQSxpQkFBSyxhQUFMLENBQW1CLFdBQW5CLEdBQWlDLENBQWpDO0FBQ0EsaUJBQUssYUFBTCxDQUFtQix3QkFBbkIsR0FBOEMsWUFBOUM7QUFDSDs7O2tDQUNTO0FBQ04saUJBQUssS0FBTCxDQUFXLEtBQVg7QUFDQSxpQkFBSyxLQUFMLENBQVcsV0FBWCxHQUF5QixDQUF6QjtBQUNIOzs7Ozs7UUFFRyxNLEdBQUEsTTs7Ozs7Ozs7Ozs7O0FDekRQOzs7O0FBRUQsSUFBTSxTQUFTLElBQWY7QUFBQSxJQUNJLFNBQVMsS0FBSyxNQURsQjtBQUFBLElBRUksT0FBTyxLQUFLLE1BRmhCOztJQUlNLGdCOzs7Ozs7O3NDQUNZLFUsRUFBWTtBQUFBOztBQUN0QixtQkFBTyxNQUFNLFVBQU4sRUFDRixJQURFLENBQ0csVUFBQyxRQUFELEVBQWM7QUFDaEIsdUJBQU8sU0FBUyxJQUFULEVBQVA7QUFDSCxhQUhFLEVBSUYsSUFKRSxDQUlHLFVBQUMsSUFBRCxFQUFVO0FBQ1osb0JBQUksTUFBTSxLQUFLLE9BQUwsQ0FBYSxhQUFiLEVBQTRCLElBQTVCLENBQVY7QUFDQSx1QkFBTyxJQUNGLEtBREUsQ0FDSSxNQURKLEVBRUYsR0FGRSxDQUVFLFVBQUMsT0FBRDtBQUFBLDJCQUFhLE1BQUssbUJBQUwsQ0FBeUIsT0FBekIsQ0FBYjtBQUFBLGlCQUZGLENBQVA7QUFHSCxhQVRFLENBQVA7QUFVSDs7OzRDQUVtQixJLEVBQU07QUFBQTs7QUFDdEIsZ0JBQU0sV0FBVyxLQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWpCO0FBQ0EsZ0JBQUksT0FBTyxTQUFTLENBQVQsRUFBWSxLQUFaLENBQWtCLE9BQWxCLEVBQTJCLEdBQTNCLENBQStCLFVBQUMsQ0FBRDtBQUFBLHVCQUFPLE9BQUssVUFBTCxDQUFnQixDQUFoQixDQUFQO0FBQUEsYUFBL0IsQ0FBWDtBQUNBLG1CQUFPLHVCQUFhO0FBQ2hCLG9CQUFJLFNBQVMsQ0FBVCxDQURZO0FBRWhCLDJCQUFXLEtBQUssQ0FBTCxDQUZLO0FBR2hCLHlCQUFTLEtBQUssQ0FBTCxDQUhPO0FBSWhCLHlCQUFTLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsSUFBbEIsQ0FBdUIsSUFBdkI7QUFKTyxhQUFiLENBQVA7QUFNSDs7O21DQUVVLFUsRUFBWTtBQUNuQixnQkFBTSxTQUFTLFdBQVcsS0FBWCxDQUFpQixHQUFqQixDQUFmO0FBQ0EsZ0JBQU0sZUFBZSxPQUFPLENBQVAsRUFBVSxLQUFWLENBQWdCLEdBQWhCLENBQXJCO0FBQ0EsZ0JBQU0sUUFBUSxTQUFTLE9BQU8sQ0FBUCxDQUFULEVBQW9CLEVBQXBCLENBQWQ7QUFDQSxnQkFBTSxVQUFVLFNBQVMsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBaEI7QUFDQSxnQkFBTSxVQUFVLFNBQVMsYUFBYSxDQUFiLENBQVQsRUFBMEIsRUFBMUIsQ0FBaEI7QUFDQSxnQkFBTSxlQUFlLFNBQVMsYUFBYSxDQUFiLENBQVQsRUFBMEIsRUFBMUIsQ0FBckI7QUFDQSxtQkFBTyxPQUFPLEtBQVAsR0FDSCxTQUFTLE9BRE4sR0FFSCxTQUFTLE9BRk4sR0FHSCxZQUhKO0FBSUg7Ozs7OztRQUVHLGdCLEdBQUEsZ0I7Ozs7Ozs7Ozs7OztBQzVDUDs7OztBQUVELElBQU0sU0FBUyxJQUFmO0FBQUEsSUFDSSxTQUFTLEtBQUssTUFEbEI7QUFBQSxJQUVJLE9BQU8sS0FBSyxNQUZoQjs7SUFJTSxnQjtBQUNGLDhCQUFZLFNBQVosRUFBdUIsTUFBdkIsRUFBK0I7QUFBQTs7QUFDM0IsYUFBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLGFBQUssU0FBTCxHQUFpQixTQUFqQjtBQUNBLGFBQUssT0FBTDtBQUNBLGFBQUssYUFBTCxHQUFxQixPQUFPLGFBQTVCO0FBQ0EsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUNBLGFBQUssTUFBTCxHQUFjLEtBQWQ7QUFFSDs7OztzQ0FDYSxJLEVBQU07QUFDaEIsZ0JBQUksS0FBSyxjQUFULEVBQXlCO0FBQ3pCLGdCQUFJLEtBQUssVUFBTCxDQUFnQixTQUFoQixJQUE2QixJQUE3QixJQUFxQyxLQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsSUFBMkIsSUFBcEUsRUFBMEU7QUFDdEUscUJBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIO0FBQ0o7OzsrQkFDTTtBQUFBOztBQUNILGdCQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixLQUFqQztBQUNBLGdCQUFNLFNBQVMsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixNQUFsQztBQUNBLGdCQUFNLFdBQVcsRUFBakI7QUFDQSxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLEdBQStCLFNBQS9CO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixJQUFuQixHQUE2QixRQUE3QjtBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsS0FBbEMsRUFBeUMsTUFBekM7QUFDQSxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLEdBQStCLFNBQS9CO0FBQ0EsZ0JBQU0sYUFBYSxFQUFuQjs7QUFFQSxpQkFBSyxVQUFMLENBQWdCLE9BQWhCLENBQ0osS0FESSxDQUNFLElBREYsRUFFSixHQUZJLENBRUEsVUFBQyxHQUFELEVBQU0sQ0FBTixFQUFZO0FBQ2Isc0JBQUssYUFBTCxDQUFtQixRQUFuQixDQUE0QixHQUE1QixFQUFpQyxRQUFqQyxFQUEyQyxXQUFXLElBQUksVUFBMUQ7QUFDSCxhQUpJO0FBS0EsaUJBQUssTUFBTCxHQUFjLElBQWQ7QUFDSDs7OzZCQUNJLFksRUFBYztBQUNmLGdCQUFJLEtBQUssY0FBVCxFQUF5QjtBQUNyQixxQkFBSyxJQUFMO0FBQ0EscUJBQUssTUFBTCxDQUFZLFdBQVosQ0FBd0IsSUFBeEIsQ0FBNkIsSUFBN0IsRUFBbUMsWUFBbkM7QUFDQSwyQkFBVyxZQUFXO0FBQUE7O0FBQ2xCLHlCQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSx5QkFBSyxZQUFMLEdBQW9CLEtBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsVUFBQyxJQUFELEVBQVU7QUFDbkQsNEJBQUksU0FBUyxPQUFLLFVBQWxCLEVBQThCO0FBQzFCLG1DQUFPLElBQVA7QUFDSDtBQUNKLHFCQUptQixJQUlmLENBSkw7QUFLQSx5QkFBSyxVQUFMLEdBQWtCLEtBQUssU0FBTCxDQUFlLEtBQUssWUFBcEIsQ0FBbEI7QUFDQSx5QkFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLHdCQUFJLEtBQUssT0FBVCxFQUFrQjtBQUNsQix5QkFBSyxNQUFMLENBQVksS0FBWixDQUFrQixJQUFsQjtBQUNILGlCQVhVLENBV1QsSUFYUyxDQVdKLElBWEksQ0FBWCxFQVdjLEtBQUssVUFBTCxDQUFnQixLQVg5QjtBQVlIO0FBRUo7OztnQ0FDTztBQUNKLGlCQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0g7OztrQ0FDUztBQUNOLGlCQUFLLGNBQUwsR0FBc0IsS0FBdEI7QUFDQSxpQkFBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsaUJBQUssVUFBTCxHQUFrQixLQUFLLFNBQUwsQ0FBZSxLQUFLLFlBQXBCLENBQWxCO0FBQ0g7Ozs7OztRQUVHLGdCLEdBQUEsZ0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Y2xhc3MgU3VidGl0bGUge1xyXG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IHBhcmFtcy5pZDtcclxuICAgICAgICB0aGlzLnN0YXJ0VGltZSA9IHBhcmFtcy5zdGFydFRpbWU7XHJcbiAgICAgICAgdGhpcy5lbmRUaW1lID0gcGFyYW1zLmVuZFRpbWU7XHJcbiAgICAgICAgdGhpcy5kZWxheSA9IHBhcmFtcy5lbmRUaW1lIC0gcGFyYW1zLnN0YXJ0VGltZTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBwYXJhbXMubWVzc2FnZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge1N1YnRpdGxlfSIsIu+7v2ltcG9ydCB7U3VidGl0bGVzU2VydmljZX0gZnJvbSAnLi9zdWJ0aXRsZXNTZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJ0aXRsZXNGYWN0b3J5fSBmcm9tICcuL3N1YnRpdGxlc0ZhY3RvcnknO1xyXG5pbXBvcnQge092ZXJsYXlFZmZlY3R9IGZyb20gJy4vb3ZlcmxheUVmZmVjdCc7XHJcbmltcG9ydCB7UGxheWVyfSBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7QXVkaW99IGZyb20gJy4vYXVkaW8nO1xyXG5pbXBvcnQge1N1YnRpdGxlfSBmcm9tICcuL1N1YnRpdGxlJztcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBDb250ZW50TG9hZGVkKTtcclxuZnVuY3Rpb24gQ29udGVudExvYWRlZCgpIHtcclxuICAgIGNvbnN0IHN1YnRpdGxlc0ZhY3RvcnkgPSBuZXcgU3VidGl0bGVzRmFjdG9yeSgpO1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcclxuICAgICAgICBzdWJ0aXRsZXNGYWN0b3J5LmxvYWRTdWJ0aXRsZXMoJ2F0dGFjaG1lbnQvc3Vicy5zcnQnKSxcclxuICAgIF0pLnRoZW4oZnVuY3Rpb24ocHJvbWlzZURhdGEpIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKCk7XHJcbiAgICAgICAgY29uc3QgYXVkaW8gID0gbmV3IEF1ZGlvKCk7XHJcbiAgICAgICAgY29uc3Qgc3VidGl0bGVzID0gcHJvbWlzZURhdGFbMF07XHJcbiAgICAgICAgY29uc3QgdmlkZW8gPSBwbGF5ZXIudmlkZW87XHJcbiAgICAgICAgY29uc3Qgb3ZlcmxheUVmZmVjdCA9IG5ldyBPdmVybGF5RWZmZWN0KCk7XHJcbiAgICAgICAgY29uc3Qgb3ZlcmxheVZpZGVvID0gb3ZlcmxheUVmZmVjdC52aWRlbztcclxuXHJcbiAgICAgICAgdmFyIHN1YnRpdGxlc1NlcnZpY2UgPSBuZXcgU3VidGl0bGVzU2VydmljZShzdWJ0aXRsZXMsIHBsYXllcik7XHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50UGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItcGxheScpO1xyXG4gICAgICAgIGxldCBlbGVtZW50UGF1c2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLXBhdXNlJyk7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRSZXN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1yZXN0YXJ0Jyk7XHJcbiAgICAgICAgbGV0IHJpZklEO1xyXG4gICAgICAgIGVsZW1lbnRQbGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxheVByZXNzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGVsZW1lbnRQYXVzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBhdXNlUHJlc3MuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgZWxlbWVudFJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0UHJlc3MuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsYXlQcmVzcygpIHtcclxuICAgICAgICAgICAgZWxlbWVudFBsYXkuY2xhc3NMaXN0LmFkZCgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBlbGVtZW50UGF1c2UuY2xhc3NMaXN0LnJlbW92ZSgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBsb29wKCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgICAgICAgICAgc3VidGl0bGVzU2VydmljZS5jaGVja1N1YnRpdGxlKHZpZGVvLmN1cnJlbnRUaW1lICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VidGl0bGVzU2VydmljZS5pc1N1YnRpdGxlU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdWJ0aXRsZXNTZXJ2aWNlLmlzRHJhdyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlc1NlcnZpY2UucGxheShvdmVybGF5VmlkZW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlc1NlcnZpY2UuZHJhdygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIucG9zdHByb2Nlc3MuY2FsbChzdWJ0aXRsZXNTZXJ2aWNlLCBvdmVybGF5VmlkZW8pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBsYXkob3ZlcmxheVZpZGVvKTtcclxuICAgICAgICAgICAgICAgICAgICBhdWRpby5wbGF5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheVZpZGVvLnBsYXkoKTsgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJpZklEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGF1c2VQcmVzcygpIHtcclxuICAgICAgICAgICAgZWxlbWVudFBsYXkuY2xhc3NMaXN0LnJlbW92ZSgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBlbGVtZW50UGF1c2UuY2xhc3NMaXN0LmFkZCgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyaWZJRCk7XHJcbiAgICAgICAgICAgIHBsYXllci5wYXVzZSgpO1xyXG4gICAgICAgICAgICBvdmVybGF5VmlkZW8ucGF1c2UoKTtcclxuICAgICAgICAgICAgYXVkaW8ucGF1c2UoKTtcclxuICAgICAgICAgICAgc3VidGl0bGVzU2VydmljZS5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzdGFydFByZXNzKCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICBzdWJ0aXRsZXNTZXJ2aWNlLnJlc3RhcnQoKTtcclxuICAgICAgICAgICAgYXVkaW8ucmVzdGFydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvL2Z1bmN0aW9uIGRyYXcoKSB7XHJcbiAgICAvLyAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbWctMVwiKTtcclxuICAgIC8vICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIC8vICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBcIm11bHRpcGx5XCI7XHJcblxyXG4gICAgLy8gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmx1ZVwiO1xyXG4gICAgLy8gICAgY3R4LmZpbGxSZWN0KDEwLCAxLCAxMDAsIDEwMCk7XHJcblxyXG4gICAgLy8gICAgY3R4LmZpbGxTdHlsZSA9IFwicmVkXCI7XHJcbiAgICAvLyAgICBjdHguZmlsbFJlY3QoNTAsIDUwLCAxMDAsIDEwMCk7XHJcbiAgICAvL307XHJcblxyXG59ICIsIu+7v2NsYXNzIEF1ZGlvIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXVkaW8nKTtcclxuICAgICAgICB0aGlzLmlzUGxheSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwbGF5KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzUGxheSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuYXVkaW8ucGxheSgpO1xyXG4gICAgICAgIHRoaXMuaXNQbGF5ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzUGxheSkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuYXVkaW8ucGF1c2UoKTtcclxuICAgICAgICB0aGlzLmlzUGxheSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmVzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmF1ZGlvLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy5hdWRpby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy5pc1BsYXkgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge0F1ZGlvfSIsIu+7v2NsYXNzIE92ZXJsYXlFZmZlY3Qge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LWNhbnZhcycpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7T3ZlcmxheUVmZmVjdH0iLCLvu79jbGFzcyBQbGF5ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXInKTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBQcm9taXNlLmFsbChbdGhpcy5sb2FkKCldKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnZpZGVvLnZpZGVvV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHRoaXMudmlkZW8udmlkZW9IZWlnaHQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy52aWRlby5tdXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBsb2FkKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwbGF5KG92ZXJsYXkpIHtcclxuICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcclxuICAgICAgICB0aGlzLmRyYXcoKTtcclxuICAgICAgICB0aGlzLnBvc3Rwcm9jZXNzKG92ZXJsYXkpO1xyXG4gICAgfVxyXG4gICAgcGF1c2UoKSB7XHJcbiAgICAgICAgdGhpcy52aWRlby5wYXVzZSgpO1xyXG4gICAgfVxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBpZiAodGhpcy52aWRlby5wYXVzZWQgfHwgdGhpcy52aWRlby5lbmRlZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCk7XHJcbiAgICAgICAgdmFyIGlkYXRhID0gdGhpcy5jYW52YXNDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkYXRhLmRhdGEubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgY29uc3QgciA9IGlkYXRhLmRhdGFbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGcgPSBpZGF0YS5kYXRhW2kgKyAxXTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGlkYXRhLmRhdGFbaSArIDJdO1xyXG4gICAgICAgICAgICBjb25zdCBicmlnaHRuZXNzID0gKDMgKiByICsgNCAqIGcgKyBiKSA+Pj4gMztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpXSA9IGJyaWdodG5lc3M7XHJcbiAgICAgICAgICAgIGlkYXRhLmRhdGFbaSArIDFdID0gYnJpZ2h0bmVzcztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpICsgMl0gPSBicmlnaHRuZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKGlkYXRhLCAwLCAwKTtcclxuICAgIH1cclxuICAgIHBvc3Rwcm9jZXNzKG92ZXJsYXkpe1xyXG4gICAgICAgIHZhciBvbGRPcGVyYXRpb24gPSB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uO1xyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jYW52YXNDb250ZXh0LmNhbnZhcy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLmNhbnZhc0NvbnRleHQuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzY3JlZW4nO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5nbG9iYWxBbHBoYSA9IDAuMjU7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmRyYXdJbWFnZShvdmVybGF5LCAwLCAwLCB3aWR0aCwgaGVpZ2h0KTsgXHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gb2xkT3BlcmF0aW9uO1xyXG4gICAgfVxyXG4gICAgcmVzdGFydCgpIHtcclxuICAgICAgICB0aGlzLnZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IDA7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtQbGF5ZXJ9Iiwi77u/aW1wb3J0IHtTdWJ0aXRsZX0gZnJvbSAnLi9TdWJ0aXRsZSc7XHJcblxyXG5jb25zdCBTRUNPTkQgPSAxMDAwLFxyXG4gICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXHJcbiAgICBIT1VSID0gNjAgKiBNSU5VVEU7XHJcblxyXG5jbGFzcyBTdWJ0aXRsZXNGYWN0b3J5IHtcclxuICAgIGxvYWRTdWJ0aXRsZXMoc3RyaW5nTG9hZCkge1xyXG4gICAgICAgIHJldHVybiBmZXRjaChzdHJpbmdMb2FkKVxyXG4gICAgICAgICAgICAudGhlbigocmVzcG9uY2UpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25jZS50ZXh0KCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3J0ID0gZGF0YS5yZXBsYWNlKC9cXHJcXG58XFxyfFxcbi9nLCAnXFxuJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3J0IFxyXG4gICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnXFxuXFxuJylcclxuICAgICAgICAgICAgICAgICAgICAubWFwKChzdWJJdGVtKSA9PiB0aGlzLmZvcm1hdHRlZFRvU3VidGl0bGUoc3ViSXRlbSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXR0ZWRUb1N1YnRpdGxlKGRhdGEpIHtcclxuICAgICAgICBjb25zdCBzdWJwYXJ0cyA9IGRhdGEuc3BsaXQoJ1xcbicpO1xyXG4gICAgICAgIGxldCB0aW1lID0gc3VicGFydHNbMV0uc3BsaXQoJyAtLT4gJykubWFwKCh0KSA9PiB0aGlzLnRpbWVQYXJzZXIodCkpO1xyXG4gICAgICAgIHJldHVybiBuZXcgU3VidGl0bGUoe1xyXG4gICAgICAgICAgICBpZDogc3VicGFydHNbMF0sXHJcbiAgICAgICAgICAgIHN0YXJ0VGltZTogdGltZVswXSxcclxuICAgICAgICAgICAgZW5kVGltZTogdGltZVsxXSxcclxuICAgICAgICAgICAgbWVzc2FnZTogc3VicGFydHMuc2xpY2UoMikuam9pbignXFxuJylcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGltZVBhcnNlcih0aW1lU3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2h1bmtzID0gdGltZVN0cmluZy5zcGxpdCgnOicpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZENodW5rcyA9IGNodW5rc1syXS5zcGxpdCgnLCcpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gcGFyc2VJbnQoY2h1bmtzWzBdLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IHBhcnNlSW50KGNodW5rc1sxXSwgMTApO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChzZWNvbmRDaHVua3NbMF0sIDEwKTtcclxuICAgICAgICBjb25zdCBtaWxsaVNlY29uZHMgPSBwYXJzZUludChzZWNvbmRDaHVua3NbMV0sIDEwKTtcclxuICAgICAgICByZXR1cm4gSE9VUiAqIGhvdXJzICtcclxuICAgICAgICAgICAgTUlOVVRFICogbWludXRlcyArXHJcbiAgICAgICAgICAgIFNFQ09ORCAqIHNlY29uZHMgK1xyXG4gICAgICAgICAgICBtaWxsaVNlY29uZHM7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtTdWJ0aXRsZXNGYWN0b3J5fSIsIu+7v2ltcG9ydCB7U3VidGl0bGV9IGZyb20gJy4vU3VidGl0bGUnO1xyXG5cclxuY29uc3QgU0VDT05EID0gMTAwMCxcclxuICAgIE1JTlVURSA9IDYwICogU0VDT05ELFxyXG4gICAgSE9VUiA9IDYwICogTUlOVVRFO1xyXG5cclxuY2xhc3MgU3VidGl0bGVzU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdWJ0aXRsZXMsIHBsYXllcikge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVzID0gc3VidGl0bGVzO1xyXG4gICAgICAgIHRoaXMucmVzdGFydCgpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHBsYXllci5jYW52YXNDb250ZXh0O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuaXNEcmF3ID0gZmFsc2U7XHJcblxyXG4gICAgfVxyXG4gICAgY2hlY2tTdWJ0aXRsZSh0aW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTdWJ0aXRsZVNob3cpIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3ViLnN0YXJ0VGltZSA8PSB0aW1lICYmIHRoaXMuY3VycmVudFN1Yi5lbmRUaW1lID49IHRpbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1N1YnRpdGxlU2hvdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMucGxheWVyLmNhbnZhcy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSB0aGlzLnBsYXllci5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGZvbnRTaXplID0gNTA7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9ICcjMDAwMDAwJztcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZm9udCA9IGAke2ZvbnRTaXplfXB4IE9yYW5pZW5iYXVtYDtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZmlsbFJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmZmZmJztcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gNTg7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFN1Yi5tZXNzYWdlXHJcblx0XHRcdC5zcGxpdCgnXFxuJylcclxuXHRcdFx0Lm1hcCgocm93LCBpKSA9PiB7XHJcblx0XHRcdCAgICB0aGlzLmNhbnZhc0NvbnRleHQuZmlsbFRleHQocm93LCBmb250U2l6ZSwgZm9udFNpemUgKyBpICogbGluZUhlaWdodCk7XHJcblx0XHRcdH0pO1xyXG4gICAgICAgIHRoaXMuaXNEcmF3ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHBsYXkob3ZlcmxheVZpZGVvKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTdWJ0aXRsZVNob3cpIHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBvc3Rwcm9jZXNzLmNhbGwodGhpcywgb3ZlcmxheVZpZGVvKTtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNTdWJ0aXRsZVNob3cgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gdGhpcy5zdWJ0aXRsZXMuZmluZEluZGV4KChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHRoaXMuY3VycmVudFN1Yikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSArIDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdWIgPSB0aGlzLnN1YnRpdGxlc1t0aGlzLmN1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzRHJhdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNQYXVzZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIudmlkZW8ucGxheSgpO1xyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIHRoaXMuY3VycmVudFN1Yi5kZWxheSk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICByZXN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuaXNTdWJ0aXRsZVNob3cgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3ViID0gdGhpcy5zdWJ0aXRsZXNbdGhpcy5jdXJyZW50SW5kZXhdO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7U3VidGl0bGVzU2VydmljZX0iXX0=
