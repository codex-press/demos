
let doc = document.documentElement;
if ('shape-outside' in doc.style || 'webkit-shape-outside' in doc.style)
  doc.className = doc.className + ' has-shapes';

