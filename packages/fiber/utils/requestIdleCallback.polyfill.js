window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb, options) {
    var start = Date.now();
    var timeoutTime = start + (options.timeout || 0);
    var perFrameTime = 1000 / 60;
    return setTimeout(function () {
      Object.defineProperty(ret, {
        'didTimeout': {
          get() {
            return Date.now() > timeoutTime;
          }
        },
        'timeRemaining': {
          get() {
            return function () {
              return Math.max(0, perFrameTime - (Date.now() - start));
            }
          }
        }
      });
      cb(ret);
    }, 1);
  };

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };
