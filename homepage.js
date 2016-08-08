(function() {
  "use strict";

  var dom = require('dom').default;
  var log = require('log').default;

  dom('.signup-form').bind('submit', function(e) {
    e.preventDefault();

    if (!emailValid()) {
      return false;
    }

    dom('button.submit').css({pointerEvents: 'none'});
    dom('.signup').css({opacity: 0});

    fetch('/signup', {
      method: 'POST',
      body: new FormData($('form.signup-form'))
    })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
          dom('.thanks').css({display: 'block'});
          dom('.form').css({display: 'none'});
          dom('.signup').css({opacity: 1});
      }
      else {
        log(response);
        throw('signup error');
      }
    })
    .catch(function(response) {
      dom('button.submit').css({pointerEvents: ''});

      if (response &&
        response.responseJSON &&
        response.responseJSON.messages) {
          dom('.error').text(response.responseJSON.messages.join('. '))
      }

      dom('.error').css({display: block});
      dom('.signup').css({opacity: 1});
    });

    return false;
  });


  function emailValid(e) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (re.test($('input.email').value)) {
      // take off the invalid state
      if (dom('input.email').is('.invalid')) {
        dom('input.email').removeClass('invalid');
        dom('.email-error').css({visibility: 'hidden'});
      }
      return true;
    }
    // it's bad!
    else {
      dom('input.email').addClass('invalid');
      dom('.email-error').css({visibility: 'visible'});
      
      var input = dom.find(document, 'input.email')
      
      input.focus();

      // so these don't get hooked repeatedly
      input.removeEventListener('input', emailValid);
      input.addEventListener('input', emailValid);

      // if this is an event, we need to return true so the keypress is done
      if (e)
        return true;

      return false;
    }
  };

})();
