
function emailValid(e) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (re.test($('input.email').value)) {
    // take off the invalid state
    if ($('input.email').classList.contains('invalid')) {
      $('input.email').classList.remove('invalid');
      $('.email-error').style.visibility = 'hidden';
    }
    return true;
  }
  // it's bad!
  else {
    $('input.email').classList.add('invalid');
    $('input.email').focus();
    $('.email-error').style.visibility = 'visible';

    // so these don't get hooked repeatedly
    $('input.email').removeEventListener('input', emailValid);
    $('input.email').addEventListener('input', emailValid);

    // if this is an event, we need to return true so the keypress is done
    if (e)
      return true;

    return false;
  }
};


$('.signup-form').addEventListener('submit', function(e) {
  e.preventDefault();

  if (!emailValid()) {
    return false;
  }

  $('button.submit').style.pointerEvents = 'none';
  $('.signup').style.opacity = 0;

  fetch("/signup", {
    method: 'POST',
    body: new FormData($('form.signup-form'))
  }).then(function(response) {
    if (response.status >= 200 && response.status < 300) {
        $('.thanks').style.display = 'block';
        $('.form').style.display = 'none'
        $('.signup').style.opacity = 1;
    }
    else {
      log(response);
      throw('signup error');
    }
  })
  .catch(function(response) {
    $('button.submit').style.pointerEvents = '';

    if (response &&
      response.responseJSON &&
      response.responseJSON.messages) {
        $('.error').text(response.responseJSON.messages.join('. '))
    }

    $('.error').show();
    $('.signup').css({opacity: 1});
  });

  return false;
});

