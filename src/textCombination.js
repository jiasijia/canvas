(function(){
  window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  var canvas = document.querySelector('#c'),
      ctx = canvas.getContext('2d');
      canvas.width = width = window.innerWidth;
      canvas.height = height = window.innerHeight;

  var particles = [],
      focalLength = 250,
      speed = 0.1;


  function getImageData(){
    drawText();
    var imageData = ctx.getImageData(0, 0, width, height);
    ctx.clearRect(0, 0, width, height);
    for (var x = 0; x < imageData.width; x+=5) {
      for(var y = 0; y < imageData.height; y+=5) {
        var i = (y * imageData.width + x) * 4;
        if (imageData.data[i+3] > 128) {
          var p = new particle(x, y, 0, 2);
          particles.push(p);
        }
      }
    }
  }

  function init() {
    for (var i in particles) {
      var p = particles[i];
      p.tx = Math.random() * width;
      p.ty = Math.random() * height;
      p.tz = Math.random() * focalLength * 2 - focalLength;
    }
  }

  function particle(x, y, z, r){
    /*最初位置*/
    this.dx = x;
    this.dy = y;
    this.dz = z;
    
    /*最终位置*/
    this.tx = 0;
    this.ty = 0;
    this.tz = 0;

    /*实时位置*/
    this.x = x;
    this.y = y;
    this.z = z;

    this.r = r;
  }
  particle.prototype.paint = function()
  {
    ctx.save();
    var scale = focalLength / (focalLength + this.z);

    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(width/2 + (this.x - width/2) * scale, height/2 + (this.y - height/2) * scale, this.r * scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }


  function drawText() {
    ctx.save()
    ctx.font = 'bold 200px arial';
    ctx.fillStyle = 'rgba(168, 168, 168, 1)';
    ctx.textAlign = 'center';
    ctx.textBaseLine = 'middle';
    ctx.fillText('测试', width/2, height/2)
    ctx.fill();
    ctx.restore();
  }

  getImageData();
  init();

  var drift = false; /*游离*/
  var pause = false;
  requestAnimationFrame(loop = function(){
    ctx.clearRect(0, 0, width, height);

    for (var i in particles) {
      var p = particles[i];

      p.paint();
      if (drift === true){
        if (Math.abs(p.x - p.dx) < 0.1 && Math.abs(p.y - p.dy) < 0.1) {
          p.x = p.dx;
          p.y = p.dy;
          p.z = p.dz;
          
          p.paint();
        } else {
          p.x += (p.dx - p.x) * speed;
          p.y += (p.dy - p.y) * speed;
          p.z += (p.dz - p.z) * speed;
        }
      } else {
        if (Math.abs(p.x - p.tx) < 0.1 && Math.abs(p.y - p.ty) < 0.1) {
          p.x = p.tx;
          p.y = p.ty;
          p.z = p.tz;
          drift = true;
        } else {
          p.x += (p.tx - p.x) * speed;
          p.y += (p.ty - p.y) * speed;
          p.z += (p.tz - p.z) * speed;
        }
      }
      
    }
    if (!pause) {
      requestAnimationFrame(loop);
    } 
  })

})()
