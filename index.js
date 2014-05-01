
/**
 * Test dependencies.
 * @qpi private
 */

var Emitter = require('component-emitter');
var Queue = require('emitter-queue');


/**
 * Static variables.
 * @api private
 */

var size = 800;
var range = 1024000;


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
  // NOTE: we could may be get better performance with
  // a pool of file reader
  this.reader = new FileReader();
  this.file = file;
  this.total = file.size;
  if(file) this.read(file, range);
}


// Emitter queue

Emitter(Chunk.prototype);
Queue(Chunk.prototype);


Chunk.prototype.slice = function(begin, end) {
  var blob = this.file.slice(begin, end);
  this.reader.readAsDataURL(blob);
};

Chunk.prototype.encode = function(binary) {
};

Chunk.prototype.read = function(file) {
  var size = this.total;
  var start = 0;
  var _this = this;
  var read = function() {
    if(size > range) {
      _this.slice(start, start + range);
      start = start + range;
      size = size - range;
    } else {
      _this.slice(start, start + size);
      size = 0;
    }
  };
  this.reader.onload = function(event) {
    var result = event.target.result;
    _this.queue('blob', event.target.result);
    if(size) read();
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
