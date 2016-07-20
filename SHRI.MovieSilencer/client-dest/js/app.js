(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _subtitlesParser = require('./subtitlesParser');

var _subtitlesParser2 = _interopRequireDefault(_subtitlesParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('player-canvas');
    var canvasContext = canvas.getContext('2d');
    var player = document.getElementById('player');

    var assistant = document.createElement('canvas');
    var assistantContext = assistant.getContext('2d');
    console.log('aaaa', new _subtitlesParser2.default());
    var overlayCanvas = document.getElementById('overlay-canvas');
    player.addEventListener('loadedmetadata', function () {
        canvas.width = player.videoWidth;
        canvas.height = player.videoHeight;
    });
    player.addEventListener('play', function () {
        requestAnimationFrame(loop);
        overlayCanvas.play();
        function loop() {
            if (!player.paused && !player.ended) {
                draw(player, canvasContext, assistantContext);
                postprocess(canvas, canvasContext, overlayCanvas);
                requestAnimationFrame(loop);
            }
        };
    }, 0);

    player.addEventListener('pause', function () {
        var canvas = document.getElementById('player-canvas');
        var canvasContext = canvas.getContext('2d');
        overlayCanvas.pause();
    }, 0);

    function draw(video, canvasContext, assistantContext) {
        if (video.paused || video.ended) return false;
        canvasContext.drawImage(video, 0, 0);
        // Grab the pixel data from the backing canvas
        var idata = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        // Loop through the pixels, turning them grayscale
        for (var i = 0; i < idata.data.length; i += 4) {
            var r = idata.data[i];
            var g = idata.data[i + 1];
            var b = idata.data[i + 2];
            var brightness = 3 * r + 4 * g + b >>> 3;
            idata.data[i] = brightness;
            idata.data[i + 1] = brightness;
            idata.data[i + 2] = brightness;
        }
        // Draw the pixels onto the visible canvas
        canvasContext.putImageData(idata, 0, 0);
    };
    //function draw() {
    //    var canvas = document.getElementById("img-1");
    //    var ctx = canvas.getContext("2d");

    //    ctx.globalCompositeOperation = "multiply";

    //    ctx.fillStyle = "blue";
    //    ctx.fillRect(10, 1, 100, 100);

    //    ctx.fillStyle = "red";
    //    ctx.fillRect(50, 50, 100, 100);
    //};

    function postprocess(c, context, overlay) {
        var oldOperation = context.globalCompositeOperation;
        context.globalCompositeOperation = 'screen';
        context.globalAlpha = 0.2;
        context.drawImage(overlay, 0, 0, c.width, c.height);
        context.globalAlpha = 1;
        context.globalCompositeOperation = oldOperation;
    }
});

},{"./subtitlesParser":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubtitlesParser = function SubtitlesParser() {
    _classCallCheck(this, SubtitlesParser);

    this.a = 5;
};

exports.default = SubtitlesParser;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQtc3JjXFxqc1xcYXBwLmpzIiwiY2xpZW50LXNyY1xcanNcXHN1YnRpdGxlc1BhcnNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUM7Ozs7OztBQUNELFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDaEQsUUFBSSxTQUFTLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFiO0FBQ0EsUUFBSSxnQkFBZ0IsT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQXBCO0FBQ0EsUUFBSSxTQUFTLFNBQVMsY0FBVCxDQUF3QixRQUF4QixDQUFiOztBQUVBLFFBQUksWUFBWSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBaEI7QUFDQSxRQUFJLG1CQUFtQixVQUFVLFVBQVYsQ0FBcUIsSUFBckIsQ0FBdkI7QUFDQSxZQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLCtCQUFwQjtBQUNBLFFBQUksZ0JBQWdCLFNBQVMsY0FBVCxDQUF3QixnQkFBeEIsQ0FBcEI7QUFDQSxXQUFPLGdCQUFQLENBQXdCLGdCQUF4QixFQUEwQyxZQUFZO0FBQ2xELGVBQU8sS0FBUCxHQUFlLE9BQU8sVUFBdEI7QUFDQSxlQUFPLE1BQVAsR0FBZ0IsT0FBTyxXQUF2QjtBQUNILEtBSEQ7QUFJQSxXQUFPLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFlBQVk7QUFDeEMsOEJBQXNCLElBQXRCO0FBQ0Esc0JBQWMsSUFBZDtBQUNBLGlCQUFTLElBQVQsR0FBZ0I7QUFDWixnQkFBSSxDQUFDLE9BQU8sTUFBUixJQUFrQixDQUFDLE9BQU8sS0FBOUIsRUFBcUM7QUFDakMscUJBQUssTUFBTCxFQUFhLGFBQWIsRUFBNEIsZ0JBQTVCO0FBQ0EsNEJBQVksTUFBWixFQUFvQixhQUFwQixFQUFtQyxhQUFuQztBQUNBLHNDQUFzQixJQUF0QjtBQUNIO0FBQ0o7QUFDSixLQVZELEVBVUcsQ0FWSDs7QUFZQSxXQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFlBQVk7QUFDekMsWUFBSSxTQUFTLFNBQVMsY0FBVCxDQUF3QixlQUF4QixDQUFiO0FBQ0EsWUFBSSxnQkFBZ0IsT0FBTyxVQUFQLENBQWtCLElBQWxCLENBQXBCO0FBQ0Esc0JBQWMsS0FBZDtBQUNILEtBSkQsRUFJRyxDQUpIOztBQU1BLGFBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUIsYUFBckIsRUFBb0MsZ0JBQXBDLEVBQXNEO0FBQ2xELFlBQUksTUFBTSxNQUFOLElBQWdCLE1BQU0sS0FBMUIsRUFBaUMsT0FBTyxLQUFQO0FBQ2pDLHNCQUFjLFNBQWQsQ0FBd0IsS0FBeEIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEM7QUFDQTtBQUNBLFlBQUksUUFBUSxjQUFjLFlBQWQsQ0FBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsRUFBaUMsT0FBTyxLQUF4QyxFQUErQyxPQUFPLE1BQXRELENBQVo7QUFDQTtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLElBQU4sQ0FBVyxNQUEvQixFQUF1QyxLQUFLLENBQTVDLEVBQStDO0FBQzNDLGdCQUFNLElBQUksTUFBTSxJQUFOLENBQVcsQ0FBWCxDQUFWO0FBQ0EsZ0JBQU0sSUFBSSxNQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsQ0FBVjtBQUNBLGdCQUFNLElBQUksTUFBTSxJQUFOLENBQVcsSUFBSSxDQUFmLENBQVY7QUFDQSxnQkFBTSxhQUFjLElBQUksQ0FBSixHQUFRLElBQUksQ0FBWixHQUFnQixDQUFqQixLQUF3QixDQUEzQztBQUNBLGtCQUFNLElBQU4sQ0FBVyxDQUFYLElBQWdCLFVBQWhCO0FBQ0Esa0JBQU0sSUFBTixDQUFXLElBQUksQ0FBZixJQUFvQixVQUFwQjtBQUNBLGtCQUFNLElBQU4sQ0FBVyxJQUFJLENBQWYsSUFBb0IsVUFBcEI7QUFDSDtBQUNEO0FBQ0Esc0JBQWMsWUFBZCxDQUEyQixLQUEzQixFQUFrQyxDQUFsQyxFQUFxQyxDQUFyQztBQUVIO0FBQ0Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGFBQVMsV0FBVCxDQUFxQixDQUFyQixFQUF3QixPQUF4QixFQUFpQyxPQUFqQyxFQUEwQztBQUN0QyxZQUFJLGVBQWUsUUFBUSx3QkFBM0I7QUFDQSxnQkFBUSx3QkFBUixHQUFtQyxRQUFuQztBQUNBLGdCQUFRLFdBQVIsR0FBc0IsR0FBdEI7QUFDQSxnQkFBUSxTQUFSLENBQWtCLE9BQWxCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDLEVBQUUsS0FBbkMsRUFBMEMsRUFBRSxNQUE1QztBQUNBLGdCQUFRLFdBQVIsR0FBc0IsQ0FBdEI7QUFDQSxnQkFBUSx3QkFBUixHQUFtQyxZQUFuQztBQUNIO0FBQ0osQ0F2RUQ7Ozs7Ozs7Ozs7O0lDRHNCLGUsR0FDbEIsMkJBQWM7QUFBQTs7QUFDVixTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0gsQzs7a0JBSGlCLGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/aW1wb3J0IFN1YnRpdGxlc1BhcnNlciBmcm9tICcuL3N1YnRpdGxlc1BhcnNlcic7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllci1jYW52YXMnKTtcclxuICAgIGxldCBjYW52YXNDb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBsZXQgcGxheWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcicpO1xyXG5cclxuICAgIHZhciBhc3Npc3RhbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHZhciBhc3Npc3RhbnRDb250ZXh0ID0gYXNzaXN0YW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjb25zb2xlLmxvZygnYWFhYScsIG5ldyBTdWJ0aXRsZXNQYXJzZXIoKSk7XHJcbiAgICB2YXIgb3ZlcmxheUNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdmVybGF5LWNhbnZhcycpO1xyXG4gICAgcGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHBsYXllci52aWRlb1dpZHRoO1xyXG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBwbGF5ZXIudmlkZW9IZWlnaHQ7XHJcbiAgICB9KTtcclxuICAgIHBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwbGF5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgICAgICBvdmVybGF5Q2FudmFzLnBsYXkoKTtcclxuICAgICAgICBmdW5jdGlvbiBsb29wKCkge1xyXG4gICAgICAgICAgICBpZiAoIXBsYXllci5wYXVzZWQgJiYgIXBsYXllci5lbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgZHJhdyhwbGF5ZXIsIGNhbnZhc0NvbnRleHQsIGFzc2lzdGFudENvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgcG9zdHByb2Nlc3MoY2FudmFzLCBjYW52YXNDb250ZXh0LCBvdmVybGF5Q2FudmFzKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9LCAwKTtcclxuXHJcbiAgICBwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItY2FudmFzJyk7XHJcbiAgICAgICAgbGV0IGNhbnZhc0NvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBvdmVybGF5Q2FudmFzLnBhdXNlKCk7XHJcbiAgICB9LCAwKTtcclxuXHJcbiAgICBmdW5jdGlvbiBkcmF3KHZpZGVvLCBjYW52YXNDb250ZXh0LCBhc3Npc3RhbnRDb250ZXh0KSB7XHJcbiAgICAgICAgaWYgKHZpZGVvLnBhdXNlZCB8fCB2aWRlby5lbmRlZCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGNhbnZhc0NvbnRleHQuZHJhd0ltYWdlKHZpZGVvLCAwLCAwKTtcclxuICAgICAgICAvLyBHcmFiIHRoZSBwaXhlbCBkYXRhIGZyb20gdGhlIGJhY2tpbmcgY2FudmFzXHJcbiAgICAgICAgdmFyIGlkYXRhID0gY2FudmFzQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHBpeGVscywgdHVybmluZyB0aGVtIGdyYXlzY2FsZVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaWRhdGEuZGF0YS5sZW5ndGg7IGkgKz0gNCkge1xyXG4gICAgICAgICAgICBjb25zdCByID0gaWRhdGEuZGF0YVtpXTtcclxuICAgICAgICAgICAgY29uc3QgZyA9IGlkYXRhLmRhdGFbaSArIDFdO1xyXG4gICAgICAgICAgICBjb25zdCBiID0gaWRhdGEuZGF0YVtpICsgMl07XHJcbiAgICAgICAgICAgIGNvbnN0IGJyaWdodG5lc3MgPSAoMyAqIHIgKyA0ICogZyArIGIpID4+PiAzO1xyXG4gICAgICAgICAgICBpZGF0YS5kYXRhW2ldID0gYnJpZ2h0bmVzcztcclxuICAgICAgICAgICAgaWRhdGEuZGF0YVtpICsgMV0gPSBicmlnaHRuZXNzO1xyXG4gICAgICAgICAgICBpZGF0YS5kYXRhW2kgKyAyXSA9IGJyaWdodG5lc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIERyYXcgdGhlIHBpeGVscyBvbnRvIHRoZSB2aXNpYmxlIGNhbnZhc1xyXG4gICAgICAgIGNhbnZhc0NvbnRleHQucHV0SW1hZ2VEYXRhKGlkYXRhLCAwLCAwKTtcclxuXHJcbiAgICB9O1xyXG4gICAgLy9mdW5jdGlvbiBkcmF3KCkge1xyXG4gICAgLy8gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW1nLTFcIik7XHJcbiAgICAvLyAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbiAgICAvLyAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJtdWx0aXBseVwiO1xyXG5cclxuICAgIC8vICAgIGN0eC5maWxsU3R5bGUgPSBcImJsdWVcIjtcclxuICAgIC8vICAgIGN0eC5maWxsUmVjdCgxMCwgMSwgMTAwLCAxMDApO1xyXG5cclxuICAgIC8vICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiO1xyXG4gICAgLy8gICAgY3R4LmZpbGxSZWN0KDUwLCA1MCwgMTAwLCAxMDApO1xyXG4gICAgLy99O1xyXG5cclxuICAgIGZ1bmN0aW9uIHBvc3Rwcm9jZXNzKGMsIGNvbnRleHQsIG92ZXJsYXkpIHtcclxuICAgICAgICB2YXIgb2xkT3BlcmF0aW9uID0gY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb247XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc2NyZWVuJztcclxuICAgICAgICBjb250ZXh0Lmdsb2JhbEFscGhhID0gMC4yO1xyXG4gICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKG92ZXJsYXksIDAsIDAsIGMud2lkdGgsIGMuaGVpZ2h0KTsgXHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgY29udGV4dC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSBvbGRPcGVyYXRpb247XHJcbiAgICB9XHJcbn0pOyIsIu+7v2V4cG9ydCBkZWZhdWx0IGNsYXNzIFN1YnRpdGxlc1BhcnNlciB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmEgPSA1O1xyXG4gICAgfVxyXG59Il19
