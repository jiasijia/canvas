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

  var fontSize = 22,
      listText = 'abcdefghigklmnopqrst'.split(''),
      columns = width / fontSize,
      list = [];


  for (var i = 0; i < columns; i++) {
  	list[i] = 1;
  }
  
  var deg = Math.PI/180;
  function draw()
  {
    //ctx.globalCompositeOperation = 'source-over';
  	ctx.fillStyle = "rgba(0, 0, 0, 0.05";
  	ctx.fillRect(0, 0, width, height);
  	ctx.save();

  	ctx.shadowColor = 'red';
  	ctx.shadowBlur = '6';
  	ctx.shadowOffsetX = 10;
  	ctx.shadowOffsetY = 5;
  	ctx.font = 'bold 40px Arial';
  	ctx.textBaseLine = 'middle';
  	ctx.textAlign = 'center';
  	ctx.transform(1, 0, 0, 1, 0, 0);

    

  	ctx.fillStyle = "#eefbf5";
  	ctx.beginPath();
  	ctx.fillText('THE MARTIRX', width/2, height - 300);
  	ctx.font = "18px Microsoft Yahei";
  	ctx.fillText('REVOLUTIONS', width/2, height - 250);
  	ctx.fill();

  	ctx.restore();
  	ctx.shadowColor = '';
	  ctx.shadowBlur = '0';
  	ctx.font = fontSize + "px Arial";
  	ctx.fillStyle = '#0F0';
    ctx.save();

    var n = 20;
  	for(var i = 0; i < columns; i++ ) {
      //ctx.restore();
  		var word = listText[Math.floor(Math.random() * listText.length)];
  		//var word = String.fromCharCode(3e4+Math.random()*33);
      //ctx.scale = Math.floor(Math.random(3));
  		ctx.fillText(word , i * fontSize, list[i] * fontSize);
  		ctx.fill();
      //ctx.save();
  		list[i] +=1;

  		if (list[i] * fontSize > height || Math.random() > 0.95) {
  			list[i] = 0;
  		}
  	}
    n += 20;
  	requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

})()
