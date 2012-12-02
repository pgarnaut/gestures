function display(msg){
  $("#directions").append(msg);
  $('#directions').scrollTop($('#directions').height())
}

var pixelBuffering = 10;

var app = {
  buf: LIFO(40000),
  dirBuf: LIFO(20),
  
  p0: [0,0],
  p1: [0,0],
  
  init: function(){
    console.log("running");
    //return;
    document.onmousemove = app.capture;
    
    setInterval(app.swallow, 150);
  },
  
  capture: function(e){
    var evt = e || window.event;
    var x1 = event.clientX;
    var y1 = event.clientY;
    //LOG("buffering: " + x1 + ', ' + y1);
    app.buf.push([x1, y1]);
    lastPos = [x1, y1];
  },
  
  swallow: function(){
    app.p0 = app.p1;
    app.p1 = app.buf.get();
    //console.log("swallow: " + app.p0 + ', ' + app.p1);
    if(app.p0 && app.p1)
      app.getDirection(app.p0, app.p1);
  },
  
  getDirection: function(p0, p1){
    //LOG('p0 ' + p0);
    //LOG('p1 ' + p1);
    var x0=p0[0], y0=p0[1];
    var x1=p1[0], y1=p1[1];
    var dir = '';
    
    if(y1-y0 > pixelBuffering) 
      dir = 'S';
    else if(y1-y0 < -1*pixelBuffering)
      dir = 'N';
      
    if(x1-x0 > pixelBuffering) 
      dir += 'E';
    else if(x1-x0 < -1*pixelBuffering)
      dir += 'W';
    
    if(dir !== '')
      LOG('direction: ' + dir);
     
    display(dir + '\n');
    LOG('new dir');
    app.dirBuf.push(dir);
  },
  
}

