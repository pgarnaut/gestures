/*
  Just messing around with some ideas.

  author: pgarnaut
  url: https://github.com/pgarnaut/gestures
*/

// this is just for testing/dev - will be removed later
function display(elt, msg){
    elt.append(msg + ' ');
    elt.scrollTop(elt.height());
}

function GSLOG(msg){
  if(false)
    console.log(msg);
}

var pixelBuffering = 30;
var dirBuffering = 3;

var app = {
  buf: LIFO(40000), // swallowed mouse position buffer
  dbuf: LIFO(dirBuffering),
  lastPos: [0,0], // last mouse position - updated for every mouse move event
  
  match: {},
  
  init: function(){
    GSLOG("running");
    //return;
    
    //app.addTrigger("W", function(){alert('triggered');});
    
    document.onmousemove = app.capture;
    setInterval(app.swallow, 50);
  },
  
  addTrigger: function(dir, f){
    var padded = '';
    for(var i = 0; i < dirBuffering; i++)
      padded += dir; // haha ...
      
    GSLOG('adding trigger for ' + padded);
    app.match[padded] = f;
  },
  
  capture: function(e){
    if(!e.altKey)
      return;
    var evt = e || window.event;
    app.lastPos = [evt.clientX, evt.clientY];
  },
  
  swallow: function(){
    app.buf.push(app.lastPos);
    //GSLOG("swallow: " + app.p0 + ', ' + app.p1);
    if(app.buf.size() >= 2 && app.buf.get(1) !== app.lastPos)
      app.getDirection(app.buf.get(), app.buf.get(1));
  },
  
  getDirection: function(p0, p1){
    var x0=p0[0], y0=p0[1];
    var x1=p1[0], y1=p1[1];
    var dir = '';
    
    if(y1-y0 > pixelBuffering) 
      dir = 'N';
    else if(y1-y0 < -1*pixelBuffering)
      dir = 'S';
      
    if(x1-x0 > pixelBuffering) 
      dir += 'W';
    else if(x1-x0 < -1*pixelBuffering)
      dir += 'E';
      
    if(dir){
      app.dbuf.push(dir);
      display($("#raw-directions"), dir);
    }
    
    var dirMag = app.dbuf.toArray(dirBuffering).join('');
    
    // the gesture matching ...
    for(var d in app.match){
      if(dirMag === d){
        app.match[d]();
        app.clearBuffers();
      }
    }
    
  },
  
  clearBuffers: function(){
    app.buf.clear();
    app.dbuf.clear();
    app.lastPos = [0,0];
  },
  
}

