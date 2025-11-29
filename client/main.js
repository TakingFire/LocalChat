let ws = new WebSocket(`ws://${location.hostname}:8000`);

$('#ip').html(location.hostname);

$('#input-name').val(localStorage['name'] || '');
console.log(location.hostname);

ws.onopen = function (event) {
  $('#submit').val('Submit').prop('disabled', false);
};

ws.onclose = ws.onerror = function () {
  $('#submit').val('Disconnected').prop('disabled', true);
};

ws.onmessage = function (data) {
  const msg = JSON.parse(data.data);
  const time = new Date(msg.time);
  const el = $(
    `<div class="post">
      <span class="name"></span>
      <span class="time" title="${time.toString()}"></span><br>
      <span class="text"></span>
    </div>`,
  );
  el.find('.name').text(msg.name);
  el.find('.time').text(
    (time.getHours() % 12) + ':' + (time.getMinutes().toString().length < 2 ? '0' : '') + time.getMinutes(),
  );
  el.find('.text').text(msg.text);
  $('#feed').prepend(el);
};

$('#form').on('submit', function (e) {
  e.preventDefault();
  const data = JSON.stringify({
    name: $('#input-name').val().trim(),
    text: $('#input-text').val().trim(),
  });
  ws.send(data);

  $('#input-text').val('');
  localStorage['name'] = $('#input-name').val();
  return false;
});

$(document).on('keydown', function (e) {
  if (e.which == 120) {
    $('.panel').eq(0).toggle();
  }
  if (e.which == 119) {
    $('.panel').eq(1).toggle();
  }
});

window.onbeforeunload = function () {
  ws.close();
};
