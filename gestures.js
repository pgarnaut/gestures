// this is just for testing/dev - will be removed later
function display(msg){
  if(msg.raw){
    $("#raw-directions").append(msg.raw);
    $('#raw-directions').scrollTop($('#raw-directions').height())
  }
  else if(msg.clean){
    $("#clean-directions").append(msg.clean);
    $('#clean-directions').scrollTop($('#clean-directions').height())
  }
    
}

var pixelBuffering = 10;

var app = {
  buf: LIFO(40000),
  dirBuf: LIFO(20),
  clean: LIFO(20),
  counts: LIFO(40),
  
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
    
    app.dirBuf.push(dir);
    
    // TODO: smarts to be added here (and in a separate periodic function maybe)
    if(dir && app.clean.get() !== dir){
      console.log(app.clean.get()  + ' unique from ' + dir);
      app.clean.push(dir);
      display({clean: dir+' '});
    }
    
    if(app.counts.size() > 0 && dir === app.counts.get().direction)
      app.counts.get().count++;
    else if(dir)
      app.counts.push({direction: dir, count: 1});
    
    if(dir)
      display({clean: app.counts.get().direction +': '+app.counts.get().count+' '});
    
    display({raw: dir + ' '});
  },
  
}

