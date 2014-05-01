
/**
 * Test dependencies.
 * @qpi private
 */

var Emitter = require('component-emitter');
var Queue = require('emitter-queue');


/**
 * Expose 'Chunk'
 */

module.exports = Chunk;


/**
 * chunk constructor.
 * @api public
 */

function Chunk(file, range) {
  if(!(this instanceof Chunk)) return new Chunk(file, range);
  var _this = this;
  // this.reader = new FileReader();

  // // should we use onload?
  // this.reader.onloadend = function(evt) {
  //   console.log('onloaded');
  //   var target = evt.target;
  //   if (target.readyState === FileReader.DONE) {
  //     _this.queue('blob', target.result);
  //   }
  // };
  if(file) this.read(file, range);
}


Emitter(Chunk.prototype);
Queue(Chunk.prototype);


Chunk.prototype.read = function(file, range) {
  var reader = new FileReader();
  var start = 0;
  var finished = false;
  var size = file.size;
  range = range || 1024000;
  var read = function() {
    if(size > range) {
      var blob = file.slice(start, start + range);
      reader.readAsArrayBuffer(blob);
      size = size - range;
      start = start + range;
    } else {
      var blob = file.slice(start, start + size);
      reader.readAsArrayBuffer(blob);
      finished = true;
    }
  };
  reader.onload = function() {
    // can read again
    if(!finished) {
      read();
    }
  };
  read();
};


  // range = range || 1200;
  // console.log(file.size);
  // var blob = file.slice(0, 1200);
  // this.reader.readAsArrayBuffer(blob);


  // console.log(file.size);
  // range = range || 1200;
  // var size = file.size;
  // var start = 0;
  // var blob;
  // while(size > range) {
  //   console.log('while', start, start + range);
  //   blob = file.slice(start, start + range);
  //   this.reader.readAsBinaryString(blob);
  //   size = size - range;
  //   start = start + range;
  // }
  // console.log('reste', start, start + size);
  // blob = file.slice(start, start + size);
  // this.reader.readAsArrayBuffer(blob);
