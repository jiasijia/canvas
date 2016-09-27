(function(){
  window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  var d = document.getElementById('d'),
      c = document.querySelector('#canvas'),
      context = c.getContext('2d');

  var width = c.width,
      height = c.height,
      num = 100,
      speed = 0,
      maxRadius = 10, 
      minRadius = 5;

  /*粒子*/
  var particles = {};
  newParticle = (function(){
  	var nextIndex = 0;
  	return function(xv, yv){
	  particles[nextIndex++] = {
  	  	index: nextIndex,
    		x: width/2,
    		y: height/2,
    		r: Math.random() * 1,
    		f: getRandomColor(),       //fill
        s: getRandomColor(),       //stroke
        o: 0.2,  //opacity
        xv: xv,
        yv: yv,
  	  };
  	};
  })();
  
  var getRandomColor = function(){
    return '#'+(Math.random()*0xffffff<<0).toString(16);
  }

  requestAnimationFrame(loop = function(){
    context.globalAlpha = 1;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, width);

    newParticle(Math.random() * 5 - 3, Math.random() * 5 - 3);

    var n = 0;//粒子数量
  	for(var i in particles) {
  	  var p = particles[i];
      if (p.x > width || p.y > height || p.x < 0 || p.y < 0) {
        delete particles[i];
      }
      //context.globalAlpha = p.o == 0.2 ? 1 : 0.2;
      context.fillStyle = p.f;
      context.strokeStyle = p.s;
      context.beginPath();
  	  context.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
      //context.fill();
      context.stroke();

      n++;
      p.x = p.x + p.xv;
      p.y = p.y + p.yv;
      p.r += (Math.abs(p.xv) + Math.abs(p.yv)) * 0.1;  
  	}
    
  	requestAnimationFrame(loop);
  })
})()
