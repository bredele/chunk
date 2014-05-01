
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

var SIZE = 800;
var RANGE = 1024000;


/**
 * Expose 'Chunk'
 */

module.exports = Chunk;


/**
 * Create chunks from a file
 * according webrtc datachannel mtu and
 * app cache.
 *
 * @param {Blob|File} file
 * @api public
 */

function Chunk(file) {
  if(!(this instanceof Chunk)) return new Chunk(file);
  // NOTE: we could may be get better performance with
  // a pool of file reader
  var blobs = this.blob(file);
  var reader = new FileReader();
  var i = 0;
  var _this = this;
  reader.onload = function(event) {
    _this.chunk(event.target.result, blobs[i++][1]);
    if(i < blobs.length) reader.readAsDataURL(blobs[i][0]);
  };
  reader.readAsDataURL(blobs[i][0]);
}


// Emitter queue

Emitter(Chunk.prototype);
Queue(Chunk.prototype);


/**
 * Create chunks from slice. 
 * The default size is 800 bytes.
 *
 * It'll encode the data in order to be reconstruct
 * by tye callee.
 *
 * @param  {Blob | File} blob 
 * @param  {Numer} index 
 * @param  {Number} size 
 * @event chunk
 * @api private
 */

Chunk.prototype.chunk = function(blob, index, size) {
  size = size || SIZE;
  var l = Math.ceil(blob.length / size);
  for(var i = 0; i < l; i++) {
    var start = i * size;
    var chunk = blob.slice(start, Math.min(start + size, blob.length));
    this.queue('chunk', chunk, index + i);
  }
};


/**
 * Slice file into multiple blobs.
 * The default size is the app cache capacity.
 * 
 * @param  {Blob|File} file  
 * @param  {Number} range 
 * @return {Array}
 * @api private
 */

Chunk.prototype.blob = function(file, range) {
  range = range || RANGE;
  var size = file.size;
  var start = 0;
  var blobs = [];
  // NOTE: emit blob could be helpful with worker
  while(size > range) {
    blobs.push([file.slice(start, start + range), start]);
    size = size - range;
    start = start + range;
  }
  blobs.push([file.slice(start, start + size), start]);
  return blobs;
};
