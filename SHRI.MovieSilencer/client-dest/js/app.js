(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subtitle = function Subtitle(params) {
    _classCallCheck(this, Subtitle);

    this.id = params.id;
    this.timerStart = params.timerStart;
    this.timerEnd = params.timerEnd;
    this.message = params.message;
};

exports.Subtitle = Subtitle;

},{}],2:[function(require,module,exports){
'use strict';

var _subtitlesService = require('./subtitlesService');

var _subtitlesFactory = require('./subtitlesFactory');

var _overlayEffect = require('./overlayEffect');

var _player = require('./player');

var _Subtitle = require('./Subtitle');

document.addEventListener('DOMContentLoaded', ContentLoaded);
function ContentLoaded() {
    var subtitlesFactory = new _subtitlesFactory.SubtitlesFactory();
    var player = new _player.Player();
    return Promise.all([subtitlesFactory.loadSubtitles('attachment/subs.srt'), player.load()]).then(function () {

        var video = player.video;
        var overlayEffect = new _overlayEffect.OverlayEffect();
        var overlayVideo = overlayEffect.video;

        var subtitlesService = new _subtitlesService.SubtitlesService(subtitles, player);

        var elementPlay = document.getElementById('player-play');
        var elementPause = document.getElementById('player-pause');
        var elementRestart = document.getElementById('player-restart');

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

},{"./Subtitle":1,"./overlayEffect":3,"./player":4,"./subtitlesFactory":5,"./subtitlesService":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player() {
        _classCallCheck(this, Player);

        this.video = document.getElementById('player');
        this.canvas = document.getElementById('player-canvas');
        this.canvasContext = this.canvas.getContext('2d');
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
    }

    _createClass(Player, [{
        key: 'load',
        value: function load() {
            var _this = this;

            return new Promise(function (resolve) {
                return _this.video.onload = function () {
                    return resolve(_this);
                };
            });
        }
    }, {
        key: 'play',
        value: function play() {
            this.video.play();
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
            this.canvasContext.globalCompositeOperation = 'screen';
            this.canvasContext.globalAlpha = 0.2;
            this.canvasContext.drawImage(overlay, 0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.globalAlpha = 1;
            this.canvasContext.globalCompositeOperation = oldOperation;
        }
    }]);

    return Player;
}();

exports.Player = Player;

},{}],5:[function(require,module,exports){
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
                var subtitles = [];
                var srt = data.replace(/\r\n|\r|\n/g, '\n');
                var count = 0;
                var arrayStringSubtitles = srt.split('\n\n');
                for (var i = 0; i < arrayStringSubtitles.length; i++) {
                    var subparts = arrayStringSubtitles[i].split('\n');
                    if (subparts.length > 2) {
                        subtitles[count] = _this.formattedToSubtitle(subparts);
                    }
                    count++;
                }
                return subtitles;
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
    }, {
        key: 'formattedToSubtitle',
        value: function formattedToSubtitle(subparts) {
            var id = subparts[0];
            var startTime = subparts[1].split(' --> ')[0];
            var endTime = subparts[1].split(' --> ')[1];
            var message = subparts[2];
            if (subparts.length > 3) {
                for (var j = 3; j < subparts.length; j++) {
                    message += '\n' + subparts[j];
                }
            }
            return new _Subtitle.Subtitle({
                id: id,
                timerStart: this.timeParser(startTime),
                timerEnd: this.timeParser(endTime),
                message: message
            });
        }
    }]);

    return SubtitlesFactory;
}();

exports.SubtitlesFactory = SubtitlesFactory;

},{"./Subtitle":1}],6:[function(require,module,exports){
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
    function SubtitlesService(subtitles, canvasContext, player) {
        _classCallCheck(this, SubtitlesService);

        this.isPause = false;
        this.subtitles = subtitles;
        this.resetSubtitle();
        this.canvasContext = canvasContext;
        this.player = player;
    }

    _createClass(SubtitlesService, [{
        key: 'checkSubtitle',
        value: function checkSubtitle(time) {
            if (this.currentSub.timerStart <= time) {
                this.isSubtitleShow = true;
                this.play(time);
                this.player.pause();
            }
        }
    }, {
        key: 'play',
        value: function play(time) {
            if (this.isSubtitleShow) {

                this.draw();
                setTimeout(function () {
                    this.isSubtitleShow = false;
                    this.currentSub = this.subtitles[this.currentIndex++];
                    this.player.play();
                }.bind(this), this.currentSub.timerEnd - time);
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            this.isPause = true;
        }
    }, {
        key: 'draw',
        value: function draw() {
            var maxWidth = 600;
            var lineHeight = 60;

            this.canvasContext.textAlign = 'center';

            this.canvasContext.font = '51px \'Oranienbaum\'';
            this.canvasContext.fillStyle = 'white';
            var x = 0;
            var y = 0;
            this.wrapText(this.canvasContext, this.currentSub.message, x, y, maxWidth, lineHeight);
        }
    }, {
        key: 'resetSubtitle',
        value: function resetSubtitle() {
            this.isSubtitleShow = false;
            this.currentIndex = 0;
            this.currentSub = this.subtitles[this.currentIndex];
        }
        ////

    }, {
        key: 'wrapText',
        value: function wrapText(context, text, x, y, maxWidth, lineHeight) {
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
    }]);

    return SubtitlesService;
}();

exports.SubtitlesService = SubtitlesService;

},{"./Subtitle":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQtc3JjXFxqc1xcU3VidGl0bGUuanMiLCJjbGllbnQtc3JjXFxqc1xcYXBwLmpzIiwiY2xpZW50LXNyY1xcanNcXG92ZXJsYXlFZmZlY3QuanMiLCJjbGllbnQtc3JjXFxqc1xccGxheWVyLmpzIiwiY2xpZW50LXNyY1xcanNcXHN1YnRpdGxlc0ZhY3RvcnkuanMiLCJjbGllbnQtc3JjXFxqc1xcc3VidGl0bGVzU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0lDQU8sUSxHQUNILGtCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFDaEIsU0FBSyxFQUFMLEdBQVUsT0FBTyxFQUFqQjtBQUNBLFNBQUssVUFBTCxHQUFrQixPQUFPLFVBQXpCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLE9BQU8sUUFBdkI7QUFDQSxTQUFLLE9BQUwsR0FBZSxPQUFPLE9BQXRCO0FBQ0gsQzs7UUFFRyxRLEdBQUEsUTs7Ozs7QUNSUDs7QUFDRDs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQSxTQUFTLGdCQUFULENBQTBCLGtCQUExQixFQUE4QyxhQUE5QztBQUNBLFNBQVMsYUFBVCxHQUF5QjtBQUNyQixRQUFJLG1CQUFtQix3Q0FBdkI7QUFDQSxRQUFJLFNBQVMsb0JBQWI7QUFDQSxXQUFPLFFBQVEsR0FBUixDQUFZLENBQ2YsaUJBQWlCLGFBQWpCLENBQStCLHFCQUEvQixDQURlLEVBRWYsT0FBTyxJQUFQLEVBRmUsQ0FBWixFQUdKLElBSEksQ0FHQyxZQUFXOztBQUVmLFlBQUksUUFBUSxPQUFPLEtBQW5CO0FBQ0EsWUFBSSxnQkFBZ0Isa0NBQXBCO0FBQ0EsWUFBSSxlQUFlLGNBQWMsS0FBakM7O0FBRUEsWUFBSSxtQkFBbUIsdUNBQXFCLFNBQXJCLEVBQWdDLE1BQWhDLENBQXZCOztBQUVBLFlBQUksY0FBYyxTQUFTLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBbEI7QUFDQSxZQUFJLGVBQWUsU0FBUyxjQUFULENBQXdCLGNBQXhCLENBQW5CO0FBQ0EsWUFBSSxpQkFBaUIsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUFyQjs7QUFFQSxvQkFBWSxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxVQUFVLElBQVYsQ0FBZSxJQUFmLENBQXRDO0FBQ0EscUJBQWEsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBVyxJQUFYLENBQWdCLElBQWhCLENBQXZDO0FBQ0EsdUJBQWUsZ0JBQWYsQ0FBZ0MsT0FBaEMsRUFBeUMsYUFBYSxJQUFiLENBQWtCLElBQWxCLENBQXpDOztBQUVBLGlCQUFTLFNBQVQsR0FBcUI7QUFDakIsd0JBQVksU0FBWixDQUFzQixHQUF0QixDQUEwQixZQUExQjtBQUNBLHlCQUFhLFNBQWIsQ0FBdUIsTUFBdkIsQ0FBOEIsWUFBOUI7QUFDQSxtQkFBTyxJQUFQO0FBQ0Esa0NBQXNCLElBQXRCO0FBQ0EseUJBQWEsSUFBYjtBQUNBLDZCQUFpQixJQUFqQixDQUFzQixNQUFNLFdBQU4sR0FBb0IsSUFBMUM7O0FBRUEscUJBQVMsSUFBVCxHQUFnQjtBQUNaLG9CQUFJLENBQUMsTUFBTSxNQUFQLElBQWlCLENBQUMsTUFBTSxLQUE1QixFQUFtQztBQUMvQiwyQkFBTyxJQUFQO0FBQ0EsMkJBQU8sV0FBUCxDQUFtQixZQUFuQjtBQUNBLDBDQUFzQixJQUF0QjtBQUNIO0FBQ0QsaUNBQWlCLGFBQWpCLENBQStCLE1BQU0sV0FBTixHQUFvQixJQUFuRDtBQUNBLG9CQUFJLGlCQUFpQixjQUFyQixFQUFxQztBQUNqQywwQkFBTSxLQUFOO0FBQ0g7QUFDSjtBQUVKOztBQUVELGlCQUFTLFVBQVQsR0FBc0I7QUFDbEIsd0JBQVksU0FBWixDQUFzQixNQUF0QixDQUE2QixZQUE3QjtBQUNBLHlCQUFhLFNBQWIsQ0FBdUIsR0FBdkIsQ0FBMkIsWUFBM0I7O0FBRUEsbUJBQU8sS0FBUDtBQUNBLHlCQUFhLEtBQWI7QUFDSDs7QUFFRCxpQkFBUyxZQUFULEdBQXdCO0FBQ3BCLG1CQUFPLE9BQVA7QUFDQSx5QkFBYSxPQUFiO0FBQ0EsNkJBQWlCLE9BQWpCO0FBQ0g7QUFDSixLQXRETSxDQUFQOztBQXlEQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFFSDs7Ozs7Ozs7Ozs7SUNoRk0sYSxHQUNILHlCQUFjO0FBQUE7O0FBQ1YsU0FBSyxLQUFMLEdBQWEsU0FBUyxjQUFULENBQXdCLGdCQUF4QixDQUFiO0FBQ0gsQzs7UUFFRyxhLEdBQUEsYTs7Ozs7Ozs7Ozs7OztJQ0xELE07QUFDSCxzQkFBYztBQUFBOztBQUNWLGFBQUssS0FBTCxHQUFhLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFiO0FBQ0EsYUFBSyxNQUFMLEdBQWMsU0FBUyxjQUFULENBQXdCLGVBQXhCLENBQWQ7QUFDQSxhQUFLLGFBQUwsR0FBcUIsS0FBSyxNQUFMLENBQVksVUFBWixDQUF1QixJQUF2QixDQUFyQjtBQUNBLGFBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsS0FBSyxLQUFMLENBQVcsVUFBL0I7QUFDQSxhQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssS0FBTCxDQUFXLFdBQWhDO0FBRUg7Ozs7K0JBQ007QUFBQTs7QUFDSCxtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBYTtBQUM1Qix1QkFBTyxNQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CO0FBQUEsMkJBQU0sY0FBTjtBQUFBLGlCQUEzQjtBQUNILGFBRk0sQ0FBUDtBQUdIOzs7K0JBQ007QUFDSCxpQkFBSyxLQUFMLENBQVcsSUFBWDtBQUNIOzs7K0JBQ007QUFDSCxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxNQUFYLElBQXFCLEtBQUssS0FBTCxDQUFXLEtBQXBDLEVBQTJDLE9BQU8sS0FBUDtBQUMzQyxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLENBQTZCLEtBQUssS0FBbEMsRUFBeUMsQ0FBekMsRUFBNEMsQ0FBNUM7QUFDQSxnQkFBSSxRQUFRLEtBQUssYUFBTCxDQUFtQixZQUFuQixDQUFnQyxDQUFoQyxFQUFtQyxDQUFuQyxFQUFzQyxLQUFLLE1BQUwsQ0FBWSxLQUFsRCxFQUF5RCxLQUFLLE1BQUwsQ0FBWSxNQUFyRSxDQUFaO0FBQ0EsaUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLElBQU4sQ0FBVyxNQUEvQixFQUF1QyxLQUFLLENBQTVDLEVBQStDO0FBQzNDLG9CQUFNLElBQUksTUFBTSxJQUFOLENBQVcsQ0FBWCxDQUFWO0FBQ0Esb0JBQU0sSUFBSSxNQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsQ0FBVjtBQUNBLG9CQUFNLElBQUksTUFBTSxJQUFOLENBQVcsSUFBSSxDQUFmLENBQVY7QUFDQSxvQkFBTSxhQUFjLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUFqQixLQUF3QixDQUEzQztBQUNBLHNCQUFNLElBQU4sQ0FBVyxDQUFYLElBQWdCLFVBQWhCO0FBQ0Esc0JBQU0sSUFBTixDQUFXLElBQUksQ0FBZixJQUFvQixVQUFwQjtBQUNBLHNCQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsSUFBb0IsVUFBcEI7QUFDSDtBQUNELGlCQUFLLGFBQUwsQ0FBbUIsWUFBbkIsQ0FBZ0MsS0FBaEMsRUFBdUMsQ0FBdkMsRUFBMEMsQ0FBMUM7QUFDSDs7O29DQUNXLE8sRUFBUTtBQUNoQixnQkFBSSxlQUFlLEtBQUssYUFBTCxDQUFtQix3QkFBdEM7QUFDQSxpQkFBSyxhQUFMLENBQW1CLHdCQUFuQixHQUE4QyxRQUE5QztBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsV0FBbkIsR0FBaUMsR0FBakM7QUFDQSxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLENBQTZCLE9BQTdCLEVBQXNDLENBQXRDLEVBQXlDLENBQXpDLEVBQTRDLEtBQUssTUFBTCxDQUFZLEtBQXhELEVBQStELEtBQUssTUFBTCxDQUFZLE1BQTNFO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixXQUFuQixHQUFpQyxDQUFqQztBQUNBLGlCQUFLLGFBQUwsQ0FBbUIsd0JBQW5CLEdBQThDLFlBQTlDO0FBQ0g7Ozs7OztRQUVHLE0sR0FBQSxNOzs7Ozs7Ozs7Ozs7QUN6Q1A7Ozs7QUFFRCxJQUFNLFNBQVMsSUFBZjtBQUFBLElBQ0ksU0FBUyxLQUFLLE1BRGxCO0FBQUEsSUFFSSxPQUFPLEtBQUssTUFGaEI7O0lBSU0sZ0I7Ozs7Ozs7c0NBQ1ksVSxFQUFZO0FBQUE7O0FBQ3RCLG1CQUFPLE1BQU0sVUFBTixFQUNGLElBREUsQ0FDRyxVQUFDLFFBQUQsRUFBYztBQUNoQix1QkFBTyxTQUFTLElBQVQsRUFBUDtBQUNILGFBSEUsRUFJRixJQUpFLENBSUcsVUFBQyxJQUFELEVBQVU7QUFDWixvQkFBSSxZQUFZLEVBQWhCO0FBQ0Esb0JBQUksTUFBTSxLQUFLLE9BQUwsQ0FBYSxhQUFiLEVBQTRCLElBQTVCLENBQVY7QUFDQSxvQkFBSSxRQUFRLENBQVo7QUFDQSxvQkFBTSx1QkFBdUIsSUFBSSxLQUFKLENBQVUsTUFBVixDQUE3QjtBQUNBLHFCQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUkscUJBQXFCLE1BQXpDLEVBQWlELEdBQWpELEVBQXNEO0FBQ2xELHdCQUFNLFdBQVcscUJBQXFCLENBQXJCLEVBQXdCLEtBQXhCLENBQThCLElBQTlCLENBQWpCO0FBQ0Esd0JBQUcsU0FBUyxNQUFULEdBQWtCLENBQXJCLEVBQXdCO0FBQ3BCLGtDQUFVLEtBQVYsSUFBbUIsTUFBSyxtQkFBTCxDQUF5QixRQUF6QixDQUFuQjtBQUNIO0FBQ0Q7QUFDSDtBQUNELHVCQUFPLFNBQVA7QUFDSCxhQWpCRSxDQUFQO0FBa0JIOzs7bUNBRVUsVSxFQUFZO0FBQ25CLGdCQUFNLFNBQVMsV0FBVyxLQUFYLENBQWlCLEdBQWpCLENBQWY7QUFDQSxnQkFBTSxlQUFlLE9BQU8sQ0FBUCxFQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBckI7QUFDQSxnQkFBTSxRQUFRLFNBQVMsT0FBTyxDQUFQLENBQVQsRUFBb0IsRUFBcEIsQ0FBZDtBQUNBLGdCQUFNLFVBQVUsU0FBUyxPQUFPLENBQVAsQ0FBVCxFQUFvQixFQUFwQixDQUFoQjtBQUNBLGdCQUFNLFVBQVUsU0FBUyxhQUFhLENBQWIsQ0FBVCxFQUEwQixFQUExQixDQUFoQjtBQUNBLGdCQUFNLGVBQWUsU0FBUyxhQUFhLENBQWIsQ0FBVCxFQUEwQixFQUExQixDQUFyQjtBQUNBLG1CQUFPLE9BQU8sS0FBUCxHQUNILFNBQVMsT0FETixHQUVILFNBQVMsT0FGTixHQUdILFlBSEo7QUFJSDs7OzRDQUNtQixRLEVBQVU7QUFDMUIsZ0JBQU0sS0FBSyxTQUFTLENBQVQsQ0FBWDtBQUNBLGdCQUFNLFlBQVksU0FBUyxDQUFULEVBQVksS0FBWixDQUFrQixPQUFsQixFQUEyQixDQUEzQixDQUFsQjtBQUNBLGdCQUFNLFVBQVUsU0FBUyxDQUFULEVBQVksS0FBWixDQUFrQixPQUFsQixFQUEyQixDQUEzQixDQUFoQjtBQUNBLGdCQUFJLFVBQVUsU0FBUyxDQUFULENBQWQ7QUFDQSxnQkFBSSxTQUFTLE1BQVQsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDckIscUJBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFTLE1BQTdCLEVBQXFDLEdBQXJDLEVBQTBDO0FBQ3RDLCtCQUFXLE9BQU8sU0FBUyxDQUFULENBQWxCO0FBQ0g7QUFDSjtBQUNELG1CQUFPLHVCQUFhO0FBQ2hCLG9CQUFJLEVBRFk7QUFFaEIsNEJBQVksS0FBSyxVQUFMLENBQWdCLFNBQWhCLENBRkk7QUFHaEIsMEJBQVUsS0FBSyxVQUFMLENBQWdCLE9BQWhCLENBSE07QUFJaEIseUJBQVM7QUFKTyxhQUFiLENBQVA7QUFNSDs7Ozs7O1FBRUcsZ0IsR0FBQSxnQjs7Ozs7Ozs7Ozs7O0FDMURQOzs7O0FBRUQsSUFBTSxTQUFTLElBQWY7QUFBQSxJQUNJLFNBQVMsS0FBSyxNQURsQjtBQUFBLElBRUksT0FBTyxLQUFLLE1BRmhCOztJQUlNLGdCO0FBQ0YsOEJBQVksU0FBWixFQUF1QixhQUF2QixFQUFzQyxNQUF0QyxFQUE4QztBQUFBOztBQUMxQyxhQUFLLE9BQUwsR0FBZSxLQUFmO0FBQ0EsYUFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsYUFBSyxhQUFMO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLGFBQXJCO0FBQ0EsYUFBSyxNQUFMLEdBQWMsTUFBZDtBQUNIOzs7O3NDQUNhLEksRUFBTTtBQUNoQixnQkFBSSxLQUFLLFVBQUwsQ0FBZ0IsVUFBaEIsSUFBOEIsSUFBbEMsRUFBd0M7QUFDcEMscUJBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNBLHFCQUFLLElBQUwsQ0FBVSxJQUFWO0FBQ0EscUJBQUssTUFBTCxDQUFZLEtBQVo7QUFDSDtBQUNKOzs7NkJBQ0ksSSxFQUFNO0FBQ1AsZ0JBQUksS0FBSyxjQUFULEVBQXlCOztBQUVyQixxQkFBSyxJQUFMO0FBQ0EsMkJBQVcsWUFBVztBQUNsQix5QkFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EseUJBQUssVUFBTCxHQUFrQixLQUFLLFNBQUwsQ0FBZSxLQUFLLFlBQUwsRUFBZixDQUFsQjtBQUNBLHlCQUFLLE1BQUwsQ0FBWSxJQUFaO0FBQ0gsaUJBSlUsQ0FJVCxJQUpTLENBSUosSUFKSSxDQUFYLEVBSWMsS0FBSyxVQUFMLENBQWdCLFFBQWhCLEdBQTJCLElBSnpDO0FBS0g7QUFFSjs7O2dDQUNPO0FBQ0osaUJBQUssT0FBTCxHQUFlLElBQWY7QUFDSDs7OytCQUNNO0FBQ0gsZ0JBQUksV0FBVyxHQUFmO0FBQ0EsZ0JBQUksYUFBYSxFQUFqQjs7QUFFQSxpQkFBSyxhQUFMLENBQW1CLFNBQW5CLEdBQStCLFFBQS9COztBQUVBLGlCQUFLLGFBQUwsQ0FBbUIsSUFBbkIsR0FBMEIsc0JBQTFCO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixTQUFuQixHQUErQixPQUEvQjtBQUNBLGdCQUFJLElBQUksQ0FBUjtBQUNBLGdCQUFJLElBQUksQ0FBUjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxLQUFLLGFBQW5CLEVBQWtDLEtBQUssVUFBTCxDQUFnQixPQUFsRCxFQUEyRCxDQUEzRCxFQUE4RCxDQUE5RCxFQUFpRSxRQUFqRSxFQUEyRSxVQUEzRTtBQUNIOzs7d0NBQ2U7QUFDWixpQkFBSyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsaUJBQUssWUFBTCxHQUFvQixDQUFwQjtBQUNBLGlCQUFLLFVBQUwsR0FBa0IsS0FBSyxTQUFMLENBQWUsS0FBSyxZQUFwQixDQUFsQjtBQUNIO0FBQ0Q7Ozs7aUNBQ1MsTyxFQUFTLEksRUFBTSxDLEVBQUcsQyxFQUFHLFEsRUFBVSxVLEVBQVk7QUFDaEQsZ0JBQUksSUFBSjtBQUNBLGdCQUFJLEVBQUo7QUFDQSxnQkFBSSxJQUFKO0FBQ0EsZ0JBQUksS0FBSjtBQUNBLGdCQUFJLFFBQUo7QUFDQSxnQkFBSSxPQUFKO0FBQ0EsZ0JBQUksU0FBSjtBQUNBLGdCQUFJLENBQUo7O0FBRUEsbUJBQU8sS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFQOztBQUVBLGlCQUFLLEtBQUssQ0FBVixFQUFhLEtBQUssS0FBSyxNQUF2QixFQUErQixJQUEvQixFQUFxQztBQUNqQyx1QkFBTyxFQUFQO0FBQ0Esd0JBQVEsS0FBSyxFQUFMLEVBQVMsS0FBVCxDQUFlLEdBQWYsQ0FBUjs7QUFFQSxxQkFBSyxJQUFJLENBQVQsRUFBWSxJQUFJLE1BQU0sTUFBdEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDL0IsK0JBQVcsT0FBTyxNQUFNLENBQU4sQ0FBUCxHQUFrQixHQUE3QjtBQUNBLDhCQUFVLFFBQVEsV0FBUixDQUFvQixRQUFwQixDQUFWO0FBQ0EsZ0NBQVksUUFBUSxLQUFwQjs7QUFFQSx3QkFBSSxZQUFZLFFBQWhCLEVBQTBCO0FBQ3RCLGdDQUFRLFFBQVIsQ0FBaUIsSUFBakIsRUFBdUIsQ0FBdkIsRUFBMEIsQ0FBMUI7QUFDQSwrQkFBTyxNQUFNLENBQU4sSUFBVyxHQUFsQjtBQUNBLDZCQUFLLFVBQUw7QUFDSCxxQkFKRCxNQUlPO0FBQ0gsK0JBQU8sUUFBUDtBQUNIO0FBQ0o7O0FBRUQsd0JBQVEsUUFBUixDQUFpQixJQUFqQixFQUF1QixDQUF2QixFQUEwQixDQUExQjtBQUNBLHFCQUFLLFVBQUw7QUFDSDtBQUNKOzs7Ozs7UUFFRyxnQixHQUFBLGdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2NsYXNzIFN1YnRpdGxlIHtcclxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xyXG4gICAgICAgIHRoaXMuaWQgPSBwYXJhbXMuaWQ7XHJcbiAgICAgICAgdGhpcy50aW1lclN0YXJ0ID0gcGFyYW1zLnRpbWVyU3RhcnQ7XHJcbiAgICAgICAgdGhpcy50aW1lckVuZCA9IHBhcmFtcy50aW1lckVuZDtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBwYXJhbXMubWVzc2FnZTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge1N1YnRpdGxlfSIsIu+7v2ltcG9ydCB7U3VidGl0bGVzU2VydmljZX0gZnJvbSAnLi9zdWJ0aXRsZXNTZXJ2aWNlJztcclxuaW1wb3J0IHtTdWJ0aXRsZXNGYWN0b3J5fSBmcm9tICcuL3N1YnRpdGxlc0ZhY3RvcnknO1xyXG5pbXBvcnQge092ZXJsYXlFZmZlY3R9IGZyb20gJy4vb3ZlcmxheUVmZmVjdCc7XHJcbmltcG9ydCB7UGxheWVyfSBmcm9tICcuL3BsYXllcic7XHJcbmltcG9ydCB7U3VidGl0bGV9IGZyb20gJy4vU3VidGl0bGUnO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIENvbnRlbnRMb2FkZWQpO1xyXG5mdW5jdGlvbiBDb250ZW50TG9hZGVkKCkge1xyXG4gICAgdmFyIHN1YnRpdGxlc0ZhY3RvcnkgPSBuZXcgU3VidGl0bGVzRmFjdG9yeSgpO1xyXG4gICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIoKTtcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgc3VidGl0bGVzRmFjdG9yeS5sb2FkU3VidGl0bGVzKCdhdHRhY2htZW50L3N1YnMuc3J0JyksXHJcbiAgICAgICAgcGxheWVyLmxvYWQoKVxyXG4gICAgXSkudGhlbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IHZpZGVvID0gcGxheWVyLnZpZGVvO1xyXG4gICAgICAgIGxldCBvdmVybGF5RWZmZWN0ID0gbmV3IE92ZXJsYXlFZmZlY3QoKTtcclxuICAgICAgICBsZXQgb3ZlcmxheVZpZGVvID0gb3ZlcmxheUVmZmVjdC52aWRlbztcclxuXHJcbiAgICAgICAgdmFyIHN1YnRpdGxlc1NlcnZpY2UgPSBuZXcgU3VidGl0bGVzU2VydmljZShzdWJ0aXRsZXMsIHBsYXllcik7XHJcblxyXG4gICAgICAgIGxldCBlbGVtZW50UGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItcGxheScpO1xyXG4gICAgICAgIGxldCBlbGVtZW50UGF1c2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLXBhdXNlJyk7XHJcbiAgICAgICAgbGV0IGVsZW1lbnRSZXN0YXJ0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1yZXN0YXJ0Jyk7XHJcblxyXG4gICAgICAgIGVsZW1lbnRQbGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcGxheVByZXNzLmJpbmQodGhpcykpO1xyXG4gICAgICAgIGVsZW1lbnRQYXVzZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHBhdXNlUHJlc3MuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgZWxlbWVudFJlc3RhcnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCByZXN0YXJ0UHJlc3MuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHBsYXlQcmVzcygpIHtcclxuICAgICAgICAgICAgZWxlbWVudFBsYXkuY2xhc3NMaXN0LmFkZCgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBlbGVtZW50UGF1c2UuY2xhc3NMaXN0LnJlbW92ZSgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBwbGF5ZXIucGxheSgpO1xyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XHJcbiAgICAgICAgICAgIG92ZXJsYXlWaWRlby5wbGF5KCk7XHJcbiAgICAgICAgICAgIHN1YnRpdGxlc1NlcnZpY2UucGxheSh2aWRlby5jdXJyZW50VGltZSAqIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9vcCgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdmlkZW8ucGF1c2VkICYmICF2aWRlby5lbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllci5kcmF3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnBvc3Rwcm9jZXNzKG92ZXJsYXlWaWRlbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3VidGl0bGVzU2VydmljZS5jaGVja1N1YnRpdGxlKHZpZGVvLmN1cnJlbnRUaW1lICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3VidGl0bGVzU2VydmljZS5pc1N1YnRpdGxlU2hvdykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcGF1c2VQcmVzcygpIHtcclxuICAgICAgICAgICAgZWxlbWVudFBsYXkuY2xhc3NMaXN0LnJlbW92ZSgnYnRuLXllbGxvdycpO1xyXG4gICAgICAgICAgICBlbGVtZW50UGF1c2UuY2xhc3NMaXN0LmFkZCgnYnRuLXllbGxvdycpO1xyXG5cclxuICAgICAgICAgICAgcGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgICAgIG92ZXJsYXlWaWRlby5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzdGFydFByZXNzKCkge1xyXG4gICAgICAgICAgICBwbGF5ZXIucmVzdGFydCgpO1xyXG4gICAgICAgICAgICBvdmVybGF5VmlkZW8ucmVzdGFydCgpO1xyXG4gICAgICAgICAgICBzdWJ0aXRsZXNTZXJ2aWNlLnJlc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy9mdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgLy8gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLTFcIik7XHJcbiAgICAvLyAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAvLyAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJtdWx0aXBseVwiO1xyXG5cclxuICAgIC8vICAgIGN0eC5maWxsU3R5bGUgPSBcImJsdWVcIjtcclxuICAgIC8vICAgIGN0eC5maWxsUmVjdCgxMCwgMSwgMTAwLCAxMDApO1xyXG5cclxuICAgIC8vICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgLy8gICAgY3R4LmZpbGxSZWN0KDUwLCA1MCwgMTAwLCAxMDApO1xyXG4gICAgLy99O1xyXG5cclxufSAiLCLvu79jbGFzcyBPdmVybGF5RWZmZWN0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb3ZlcmxheS1jYW52YXMnKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge092ZXJsYXlFZmZlY3R9Iiwi77u/Y2xhc3MgUGxheWVyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLWNhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLnZpZGVvLnZpZGVvV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy52aWRlby52aWRlb0hlaWdodDtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGxvYWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpZGVvLm9ubG9hZCA9ICgpID0+IHJlc29sdmUodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBwbGF5KCkge1xyXG4gICAgICAgIHRoaXMudmlkZW8ucGxheSgpO1xyXG4gICAgfVxyXG4gICAgZHJhdygpIHtcclxuICAgICAgICBpZiAodGhpcy52aWRlby5wYXVzZWQgfHwgdGhpcy52aWRlby5lbmRlZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5kcmF3SW1hZ2UodGhpcy52aWRlbywgMCwgMCk7XHJcbiAgICAgICAgdmFyIGlkYXRhID0gdGhpcy5jYW52YXNDb250ZXh0LmdldEltYWdlRGF0YSgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkYXRhLmRhdGEubGVuZ3RoOyBpICs9IDQpIHtcclxuICAgICAgICAgICAgY29uc3QgciA9IGlkYXRhLmRhdGFbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGcgPSBpZGF0YS5kYXRhW2kgKyAxXTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGlkYXRhLmRhdGFbaSArIDJdO1xyXG4gICAgICAgICAgICBjb25zdCBicmlnaHRuZXNzID0gKDMgKiByICsgNCAqIGcgKyBiKSA+Pj4gMztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpXSA9IGJyaWdodG5lc3M7XHJcbiAgICAgICAgICAgIGlkYXRhLmRhdGFbaSArIDFdID0gYnJpZ2h0bmVzcztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpICsgMl0gPSBicmlnaHRuZXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKGlkYXRhLCAwLCAwKTtcclxuICAgIH1cclxuICAgIHBvc3Rwcm9jZXNzKG92ZXJsYXkpe1xyXG4gICAgICAgIHZhciBvbGRPcGVyYXRpb24gPSB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc2NyZWVuJztcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQWxwaGEgPSAwLjI7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0LmRyYXdJbWFnZShvdmVybGF5LCAwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTsgXHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gb2xkT3BlcmF0aW9uO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCB7UGxheWVyfSIsIu+7v2ltcG9ydCB7U3VidGl0bGV9IGZyb20gJy4vU3VidGl0bGUnO1xyXG5cclxuY29uc3QgU0VDT05EID0gMTAwMCxcclxuICAgIE1JTlVURSA9IDYwICogU0VDT05ELFxyXG4gICAgSE9VUiA9IDYwICogTUlOVVRFO1xyXG5cclxuY2xhc3MgU3VidGl0bGVzRmFjdG9yeSB7XHJcbiAgICBsb2FkU3VidGl0bGVzKHN0cmluZ0xvYWQpIHtcclxuICAgICAgICByZXR1cm4gZmV0Y2goc3RyaW5nTG9hZClcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbmNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uY2UudGV4dCgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN1YnRpdGxlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNydCA9IGRhdGEucmVwbGFjZSgvXFxyXFxufFxccnxcXG4vZywgJ1xcbicpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5U3RyaW5nU3VidGl0bGVzID0gc3J0LnNwbGl0KCdcXG5cXG4nKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlTdHJpbmdTdWJ0aXRsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJwYXJ0cyA9IGFycmF5U3RyaW5nU3VidGl0bGVzW2ldLnNwbGl0KCdcXG4nKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihzdWJwYXJ0cy5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnRpdGxlc1tjb3VudF0gPSB0aGlzLmZvcm1hdHRlZFRvU3VidGl0bGUoc3VicGFydHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1YnRpdGxlcztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGltZVBhcnNlcih0aW1lU3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgY2h1bmtzID0gdGltZVN0cmluZy5zcGxpdCgnOicpO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZENodW5rcyA9IGNodW5rc1syXS5zcGxpdCgnLCcpO1xyXG4gICAgICAgIGNvbnN0IGhvdXJzID0gcGFyc2VJbnQoY2h1bmtzWzBdLCAxMCk7XHJcbiAgICAgICAgY29uc3QgbWludXRlcyA9IHBhcnNlSW50KGNodW5rc1sxXSwgMTApO1xyXG4gICAgICAgIGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChzZWNvbmRDaHVua3NbMF0sIDEwKTtcclxuICAgICAgICBjb25zdCBtaWxsaVNlY29uZHMgPSBwYXJzZUludChzZWNvbmRDaHVua3NbMV0sIDEwKTtcclxuICAgICAgICByZXR1cm4gSE9VUiAqIGhvdXJzICtcclxuICAgICAgICAgICAgTUlOVVRFICogbWludXRlcyArXHJcbiAgICAgICAgICAgIFNFQ09ORCAqIHNlY29uZHMgK1xyXG4gICAgICAgICAgICBtaWxsaVNlY29uZHM7XHJcbiAgICB9XHJcbiAgICBmb3JtYXR0ZWRUb1N1YnRpdGxlKHN1YnBhcnRzKSB7XHJcbiAgICAgICAgY29uc3QgaWQgPSBzdWJwYXJ0c1swXTtcclxuICAgICAgICBjb25zdCBzdGFydFRpbWUgPSBzdWJwYXJ0c1sxXS5zcGxpdCgnIC0tPiAnKVswXTtcclxuICAgICAgICBjb25zdCBlbmRUaW1lID0gc3VicGFydHNbMV0uc3BsaXQoJyAtLT4gJylbMV07XHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBzdWJwYXJ0c1syXTtcclxuICAgICAgICBpZiAoc3VicGFydHMubGVuZ3RoID4gMykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMzsgaiA8IHN1YnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9ICdcXG4nICsgc3VicGFydHNbal07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTdWJ0aXRsZSh7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgdGltZXJTdGFydDogdGhpcy50aW1lUGFyc2VyKHN0YXJ0VGltZSksXHJcbiAgICAgICAgICAgIHRpbWVyRW5kOiB0aGlzLnRpbWVQYXJzZXIoZW5kVGltZSksXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnQge1N1YnRpdGxlc0ZhY3Rvcnl9Iiwi77u/aW1wb3J0IHtTdWJ0aXRsZX0gZnJvbSAnLi9TdWJ0aXRsZSc7XHJcblxyXG5jb25zdCBTRUNPTkQgPSAxMDAwLFxyXG4gICAgTUlOVVRFID0gNjAgKiBTRUNPTkQsXHJcbiAgICBIT1VSID0gNjAgKiBNSU5VVEU7XHJcblxyXG5jbGFzcyBTdWJ0aXRsZXNTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKHN1YnRpdGxlcywgY2FudmFzQ29udGV4dCwgcGxheWVyKSB7XHJcbiAgICAgICAgdGhpcy5pc1BhdXNlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zdWJ0aXRsZXMgPSBzdWJ0aXRsZXM7XHJcbiAgICAgICAgdGhpcy5yZXNldFN1YnRpdGxlKCk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250ZXh0ID0gY2FudmFzQ29udGV4dDtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIH1cclxuICAgIGNoZWNrU3VidGl0bGUodGltZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdWIudGltZXJTdGFydCA8PSB0aW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTdWJ0aXRsZVNob3cgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXkodGltZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGxheWVyLnBhdXNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcGxheSh0aW1lKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNTdWJ0aXRsZVNob3cpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc1N1YnRpdGxlU2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3ViID0gdGhpcy5zdWJ0aXRsZXNbdGhpcy5jdXJyZW50SW5kZXgrK107XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5jdXJyZW50U3ViLnRpbWVyRW5kIC0gdGltZSk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHBhdXNlKCkge1xyXG4gICAgICAgIHRoaXMuaXNQYXVzZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkcmF3KCkge1xyXG4gICAgICAgIGxldCBtYXhXaWR0aCA9IDYwMDtcclxuICAgICAgICBsZXQgbGluZUhlaWdodCA9IDYwO1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHQudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5mb250ID0gJzUxcHggXFwnT3JhbmllbmJhdW1cXCcnO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgdGhpcy53cmFwVGV4dCh0aGlzLmNhbnZhc0NvbnRleHQsIHRoaXMuY3VycmVudFN1Yi5tZXNzYWdlLCB4LCB5LCBtYXhXaWR0aCwgbGluZUhlaWdodCk7XHJcbiAgICB9XHJcbiAgICByZXNldFN1YnRpdGxlKCkge1xyXG4gICAgICAgIHRoaXMuaXNTdWJ0aXRsZVNob3cgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3ViID0gdGhpcy5zdWJ0aXRsZXNbdGhpcy5jdXJyZW50SW5kZXhdO1xyXG4gICAgfVxyXG4gICAgLy8vL1xyXG4gICAgd3JhcFRleHQoY29udGV4dCwgdGV4dCwgeCwgeSwgbWF4V2lkdGgsIGxpbmVIZWlnaHQpIHtcclxuICAgICAgICB2YXIgY2FycztcclxuICAgICAgICB2YXIgaWk7XHJcbiAgICAgICAgdmFyIGxpbmU7XHJcbiAgICAgICAgdmFyIHdvcmRzO1xyXG4gICAgICAgIHZhciB0ZXN0TGluZTtcclxuICAgICAgICB2YXIgbWV0cmljcztcclxuICAgICAgICB2YXIgdGVzdFdpZHRoO1xyXG4gICAgICAgIHZhciBuO1xyXG5cclxuICAgICAgICBjYXJzID0gdGV4dC5zcGxpdCgnXFxuJyk7XHJcblxyXG4gICAgICAgIGZvciAoaWkgPSAwOyBpaSA8IGNhcnMubGVuZ3RoOyBpaSsrKSB7XHJcbiAgICAgICAgICAgIGxpbmUgPSAnJztcclxuICAgICAgICAgICAgd29yZHMgPSBjYXJzW2lpXS5zcGxpdCgnICcpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChuID0gMDsgbiA8IHdvcmRzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXN0TGluZSA9IGxpbmUgKyB3b3Jkc1tuXSArICcgJztcclxuICAgICAgICAgICAgICAgIG1ldHJpY3MgPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHRlc3RMaW5lKTtcclxuICAgICAgICAgICAgICAgIHRlc3RXaWR0aCA9IG1ldHJpY3Mud2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RXaWR0aCA+IG1heFdpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsVGV4dChsaW5lLCB4LCB5KTtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gd29yZHNbbl0gKyAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgeSArPSBsaW5lSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gdGVzdExpbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFRleHQobGluZSwgeCwgeSk7XHJcbiAgICAgICAgICAgIHkgKz0gbGluZUhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IHtTdWJ0aXRsZXNTZXJ2aWNlfSJdfQ==
