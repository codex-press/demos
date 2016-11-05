
let doc = document.documentElement;
let div = document.createElement('div');
div.style.shapeOutside = 'content-box';
if (div.style.shapeOutside === 'content-box')
  doc.className = doc.className + ' has-shapes';

