(function(){
  window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  window.cancelAnimationFrame = (function(){
    return  window.cancelAnimationFrame       ||
            window.webkitcancelAnimationFrame ||
            window.mozcancelAnimationFrame    ||
            function( callback ){
              clearTimeout(callback);
            };
  })();

  var canvas = document.querySelector('#c'),
        ctx = canvas.getContext('2d');
        canvas.width = width = window.innerWidth;
        canvas.height = height = window.innerHeight * 2/3;

  var density = 20,
      speed = 1,
      pieces = [],
      handle;

  var stats = new Stats();
      stats.setMode(0);
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.right = '0px';
      stats.domElement.style.top = '0px';
      document.body.appendChild( stats.domElement );

  var img = new Image();

  img.src = 'img/jing1.jpg';
  //img.width = 800;
  //img.height = 800;

  var left = width/2 - img.width/2,
      top = height/2 - img.height/2;

  function initVertical() {
    var index = 1;
    pieces = [];
    for (var i = 0; i < img.width; i += density) {
      for (var j = 0; j < img.height; j += density) {
        var p = new piece(i + left, j + top);
        p.cacheCtx.drawImage(img, i, j, density, density, 0, 0, density, density);
        p.index = index;
        pieces.push(p);
        index++;
      }
    }
  }
  function initHorizontal() {
    var index = 1;
    pieces = [];
    for (var j = 0; j < img.height; j += density) {
      for (var i = 0; i < img.width; i += density) {
        var p = new piece(i + left, j + top);
        p.cacheCtx.drawImage(img, i, j, density, density, 0, 0, density, density);
        p.index = index;
        pieces.push(p);
        index++;
      }
    }
  }

  function initOutIn() {
    var index = 1,layerNum, x, y, w, h;
        pieces = [];

    for (var i = 0; i < Math.ceil(Math.min(img.height, img.width)/ (2 * density)); i++) {
      w = img.width/density - 2 * i;
      h = img.height/density - 2 * i
      layerNum = 2 * w + 2 * h - 4;

      for (var j = 1; j <=layerNum; j++ ) {
        if (j <= h) {
            x = i * density;
            y = i * density + (j - 1) * density;
        } else if (j <= w + h - 1) {
            x = i * density + (j - h) * density;
            y = i * density + (h - 1) * density;
        } else if (j <= w + 2 * h - 2) {
            x = i * density + (w - 1) * density;
            y = i * density + (h - 1) * density - (j - (w + h - 1)) * density
        } else if (j <= layerNum) {
            x = i * density + (layerNum - j + 1) * density;
            y = i * density;
        }
        var p = new piece(x + left, y + top);
        p.cacheCtx.drawImage(img, x, y, density, density, 0, 0, density, density);
        p.index = index;
        pieces.push(p);
        index++;
      }
    }
  }

  function initInOut() {
    var index = 1, layerNum, x, y, w, h;
        pieces = [];

    for (var i = Math.ceil(Math.min(img.height, img.width)/ (2 * density)); i > 0 ; i--) {
      w = img.width/density - 2 * i;
      h = img.height/density - 2 * i
      layerNum = 2 * w + 2 * h - 4;
      for (var j = layerNum; j > 0; j-- ) {
        if (j <= h) {
            x = i * density;
            y = i * density + (j - 1) * density;
        } else if (j <= w + h - 1) {
            x = i * density + (j - h) * density;
            y = i * density + (h - 1) * density;
        } else if (j <= w + 2 * h - 2) {
            x = i * density + (w - 1) * density;
            y = i * density + (h - 1) * density - (j - (w + h - 1)) * density
        } else if (j <= layerNum) {
            x = i * density + (layerNum - j + 1) * density;
            y = i * density;
        }
        var p = new piece(x + left, y + top);
        p.cacheCtx.drawImage(img, x, y, density, density, 0, 0, density, density);
        p.index = index;
        pieces.push(p);
        index++;
      }
    }
  }

  function piece(x, y) {
    this.index = 1;

    this.dx = x;
    this.dy = y;

    this.tx = 0;
    this.ty = 0;

    this.x = 0;
    this.y = 0;
    this.cacheCanvas = document.createElement('canvas');
    this.cacheCtx = this.cacheCanvas.getContext('2d');
    this.cacheCanvas.width = density;
    this.cacheCanvas.height = density;
  }

  function animate()
  {
    var action = true;
    var thisTime = +new Date();
    var lastTime, endTime;
    var handle = requestAnimationFrame(loop = function() {
      lastTime = +new Date();
      ctx.clearRect(0, 0, width, height);
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      for (var i in pieces) {
        var p = pieces[i];
        if ( (lastTime - thisTime) > i * speed) {
          ctx.save();
          ctx.drawImage(p.cacheCanvas, p.x, p.y);
          ctx.restore();

          if (Math.abs(p.dx - p.x) < 1 && Math.abs(p.dy - p.y) < 1) {
            p.x = p.dx;
            p.y = p.dy;
            if (lastTime - thisTime > 1000) action = false;
          } else {
            p.x += (p.dx - p.x) * 0.2;
            p.y += (p.dy - p.y) * 0.2;
          }
        }
      }
      stats.update();
      if (action) {
          requestAnimationFrame(loop);
      }
    })
  }

  function action(type) {
    speed = document.querySelector('#speed').value;
    cancelAnimationFrame(handle);
    switch(type) {
        case 'horizontal':
            initHorizontal();
            break;

        case 'vertical' :
            initVertical();
            break;

        case 'outin':
            initOutIn();
            break;

        case 'inout':
            initInOut();
            break;
    }
    animate();
  }

  img.onload = function() {
    initHorizontal();
    //initVertical();
    //initOutIn();
    //initInOut();
    animate();
    var s = document.querySelector('#s');
    var z = document.querySelector('#speed')
    s.addEventListener('change', function(){
      action(this.value);
    });
    z.addEventListener('change', function(){
      action(this.value);
    });
  }
})()
