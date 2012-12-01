/*
  Javascript Utilities.
  
  Just trying to not rewrite the same rubbish over and over again ...
*/


/*
  LIFO Buffer.
  
  0th element will always be the least-recently added.
  (len-1)'th element will always be the most-recently added.
  
  TODO:
    * this is a crappy hacky implementation - clean it up
  
*/
function LOG(msg){console.log(msg);}

var Lifo = function(length){

  var next = 0, buffer = [], count = 0, wasFilled = false; 

  return {
    // get i'th oldest element, zero being the oldest (i.e. front of queue)
    get: function(idx){
      idx = idx || 0;

      if(next > 0 && !wasFilled)
        idx = next - 1;
      else
        idx = (next + idx) % length;
        
      //LOG("getting " +buffer[idx]+" from: " + idx);
      return buffer[idx]; // TODO: <-- doesn't work obviously
    }, 
    
    dequeue: function(){
      if(count === 0)
        return undefined;
        
      var val = buffer[next];
      count--;
      //LOG("getting " +val+" from: " + next);
      buffer[next] = undefined;
      next = (next + 1) % length;
      return val;
    },
    
    // enqueue
    push: function(item){
      //LOG('args: '+arguments[0][0]);
      count = Math.min(count + 1, length);
      if(count === length)
        wasFilled = true;
        
      //LOG("putting " + item + " in: " + next);
      buffer[next] = item;
      next = (next + 1) % length;
    },
    
    // num of elements actually stored in here
    size: function(){
      return count;
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
      var buf = Lifo(len);
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
      var buf = Lifo(len);
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
      var buf = Lifo(2);
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
