(function() {
  "use strict";

  var dom = require('dom').default;
  var log = require('log').default;
  var article = require('article').default;
  var app = require('app').default;

  article.once('ready', function() {
    var inputEl = dom.find('input.email');

    dom('.signup form').bind('submit', function(e) {
      e.preventDefault();

      if (!emailValid()) {
        inputValidator();
        inputEl.removeEventListener('input', inputValidator);
        inputEl.addEventListener('input', inputValidator);
        return;
      }

      dom('button.submit').css({pointerEvents: 'none'});
      dom('.signup').css({opacity: 0});

      // submits to parent frame
      app.send('signup', {email: dom.find('input.email').value});
    });


    app.on('signupResponse', function(response) {
      if (response.messages) {
        dom('button.submit').css({pointerEvents: ''});
        dom('.signup h2').text(response.messages.join('. '))
      }
      else {
        dom('.signup h2').text('Thanks!');
        dom('.signup form').css({display: 'none'});
      }
    });

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    function emailValid() {
      return re.test(inputEl.value);
    };

    function inputValidator() {

      // take off the invalid state
      if (emailValid()) {
        dom('input.email').removeClass('invalid');
        dom('.email-error').css({visibility: 'hidden'});
      }
      // add invaild state
      else {
        dom('input.email').addClass('invalid');
        dom('.email-error').css({visibility: 'visible'});
        inputEl.focus();
      }
    };

  });

})();
