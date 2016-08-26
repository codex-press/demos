var app = require('app');
var Plugin = require('plugin');

app.register('.sticky', Sticky);
             
function Sticky() {
};

Sticky.prototype = new Plugin();

Sticky.prototype.initialize = function() {
  this.view.on('scroll', function() { console.log('arguments') })
};

