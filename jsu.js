/*
  Javascript Utilities.
  
  Just trying to not rewrite the same rubbish over and over again ...

  author: patrick garnaut
  url: https://github.com/pgarnaut/gestures
*/


/*
  FIFO Buffer.
  
  0th element will always be the least-recently added.
  (len-1)'th element will always be the most-recently added.
  
  TODO:
    * this is a crappy hacky implementation - clean it up
  
*/
var JSU_DEBUG = false;

function LOG(msg){if(JSU_DEBUG) console.log(msg);}

/*
  FIFO Buffer (Queue).
  
  0th element is oldest element. n'th is newest. 
*/
var FIFO = function(length){
  var front = 0, back = 0, count = 0, buf = [];
  
  return {
    get: function(idx){
      idx = idx || 0;
      LOG("getting: " + buf[(front + idx) % length] + " from " + idx);
      if(count === 0) return undefined;
      return buf[(front + idx) % length];
    },
    
    push: function(val){
      LOG("putting: " + val + " in " + back);
      buf[back] = val;
      
      if(count === length) // buf full, we just overwrote an element
        front = (front + 1) % length;
      else
        count++;
        
      back = (back + 1) % length;
    },
    
    dequeue: function(){
      if(count === 0) return undefined;
      
      var val = buf[front];
      buf[front] = undefined;
      
      front = (front + 1) % length;
      count--;
      return val;
    },
    
    pop: function(){
      return this.dequeue();
    },
    
    size: function(){
      return count;
    },
    
    // get array, in order of newest to oldest, up to a max of len elements
    toArray: function(len){
      var res = [];
      for(var i=0; i<len && i<length; i++){
        res[i] = this.get(i);
      }
      return res;
    },
    
    clear: function(){
      count = 0;
      front = 0;
      back = 0;
      buf = []; // does this allow memory to potentially be free'd up?
    },
  };
};


/*
  LIFO Buffer (Stack).
  
  0th element is most recently added. n'th is n'th oldest. 
*/
var LIFO = function(length){
  var top = 0, count = 0, buf = [];
  
  return {
    get: function(idx){
      idx = idx || 0;
      LOG("getting: " + [(top - idx + length) % length] + " from " + (top - idx + length) % length);
      if(count <= idx) return undefined;
      return buf[(top - idx + length) % length];
    },
    
    push: function(val){
      
      top = (top + 1) % length;
      buf[top] = val;
      if(count !== length)
        count++;
        
      LOG("putting: " + val + " in " + top);
    },
    
    pop: function(){
      if(count === 0) return undefined;
      
      var val = buf[top];
      buf[top] = undefined;
      
      top = (top - 1 + length) % length;
      count--;
      
      return val;
    },
    
    size: function(){
      return count;
    },
    
    // get array, in order of newest to oldest, up to a max of len elements
    toArray: function(len){
      var res = [];
      for(var i=0; i<len && i<length; i++){
        res[i] = this.get(i);
      }
      return res;
    },
    
    clear: function(){
      count = 0;
      top = 0;
      buf = []; // does this allow memory to potentially be free'd up?
    },
    
  };
};

var FifoTests = function(){
  return {
    run: function(){
      return this.simple() && this.popper() && this.arrTest();
    },
    simple: function(){
      LOG("FIFO simple test");
      var len = 5;
      var buf = FIFO(len);
      var vals = [5,6,3,8,7,8];
      
      // fill it up to capacity
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
        if(buf.get(i) !== vals[i])
          return false;
      }
      
      // check all there, in correct order (0'th is oldest, n'th is newest)
      for(var i=0; i<len; i++){
        if(buf.get(i) !== vals[i])
          return false;
      }
      
      // fill it over capacity
      var first = buf.get(0);
      buf.push(vals[len]);
      
      // oldest should now be second element added
      if(buf.get() !== vals[1])
        return false;
        
      // newest should be the one just added
      if(buf.get(len-1) !== vals[len])
        return false;
      
      // all passed
      return true;
    },
    
    popper: function(){
      LOG("LIFO dequeue test");
      var len = 5;
      var buf = FIFO(len);
      var vals = [5,6,3,8,7,8];
      
      // fill it up to capacity
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
      }
      // chop elements off
      for(var i=0; i<len; i++){
        if(buf.dequeue() !== vals[i])
          return false;
        // TODO: test size is smaller
        if(buf.size() !== len - i - 1)
          return false;
      }
      
      // buffer should now be empty
      if(buf.get() || buf.dequeue() || buf.size() !== 0)
        return false;
        
      return true;
    },
    
    arrTest: function(){
      // test lifo buffer with arrays as values
      var vals = [ ['a', 'b'], ['c', 'd', 'e'] ];
      var buf = FIFO(2);
      var len = 2;
      
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
        if(buf.get(i) != vals[i])
          return false;
      }
      
      return true;
    },
    
  };
};

var LifoTests = function(){
  return {
    run: function(){
      return this.simple() && this.popper() && this.arrTest();
    },
    simple: function(){
      LOG("LIFO simple test");
      var len = 5;
      var buf = LIFO(len);
      var vals = [5,6,3,8,7,8];
      
      // fill it up to capacity
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
        
        if(buf.get() !== vals[i])
          return false;
      }
      
      // check all there, in correct order (0'th is newest, n'th is oldest)
      for(var i=0; i<len; i++){
        if(buf.get(i) !== vals[len - 1 - i])
          return false;
      }
      
      // fill it over capacity
      var first = buf.get(0);
      buf.push(vals[len]);
      
      // top of stack should obviously be the newest
      if(buf.get() !== vals[len])
        return false;
      // oldest/bottom in stack should now be the second one added (oldest overwritten)
      if(buf.get(len - 1) !== vals[1])
        return false;
        
      // all passed
      return true;
    },
    
    popper: function(){
      LOG("LIFO dequeue test");
      var len = 5;
      var buf = LIFO(len);
      var vals = [5,6,3,8,7,8];
      
      // fill it up to capacity
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
      }
      // chop elements off, should come off in reverse order (remember it's a stack! duh)
      for(var i=0; i<len; i++){
        if(buf.pop() !== vals[len - 1 - i])
          return false;
          
        // TODO: test size is smaller
        if(buf.size() !== len - i - 1)
          return false;
      }
      
      // buffer should now be empty
      if(buf.get() || buf.pop() || buf.size() !== 0)
        return false;
        
      return true;
    },
    
    arrTest: function(){
      // test lifo buffer with arrays as values
      var vals = [ ['a', 'b'], ['c', 'd', 'e'] ];
      var buf = LIFO(2);
      var len = 2;
      
      for(var i=0; i<len; i++){
        buf.push(vals[i]);
        if(buf.get(0) != vals[i])
          return false;
      }
      
      return true;
    },
    
  };
};

(function jsu_unittests(){
  console.log("FIFO tests: " + (FifoTests().run()? 'passed' : 'failed'));
  console.log("LIFO tests: " + (LifoTests().run()? 'passed' : 'failed'));
})();

function addClickScroll (container){
  var clicked, startPos = [0,0], containerPos = [0,0];
  
  container.mousedown(function(e){
      console.log("mouse down");
      e.preventDefault();
      clicked = true;
      startPos = [e.pageX, e.pageY];
      containerPos = [$(this).scrollLeft(), $(this).scrollTop()];
  });
  
  container.mousemove(function(e){
      if(!clicked) { return; }
      
      var newPos = [e.pageX, e.pageY];
      container.scrollTop(containerPos[1] + startPos[1] - newPos[1]);   
      container.scrollLeft(containerPos[0] + startPos[0] - newPos[0]);    
  });
  
  $('body').mouseup(function(e){
      clicked = false; 
  });
}

function addTouchScroll (container){
  var startPos = [0,0], containerPos = [0,0];
  
  // touch
  container.bind("touchstart",function(evt){
    containerPos = [$(this).scrollLeft(), $(this).scrollTop()];
    startPos = [evt.originalEvent.touches[0].pageX, evt.originalEvent.touches[0].pageY];
  });

  // drag
  container.bind("touchmove",function(evt){
    var currentPos = [evt.originalEvent.touches[0].pageX, evt.originalEvent.touches[0].pageY];
    $("#attr-window").scrollTop(containerPos[1] + startPos[1]  - currentPos[1]);
    $("#attr-window").scrollLeft(containerPos[0] + startPos[0]  - currentPos[0]);
  });

  // release - don't really need to capture this event
  container.bind("touchend",function(evt){
    startPos = [0,0];
  });
};