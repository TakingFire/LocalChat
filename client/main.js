let ws = new WebSocket(`ws://${location.hostname}:8000`);

$('#input-name').val(localStorage['name'] || '');
console.log(location.hostname);

ws.onopen = function(event) {
  $('#submit').val('Submit').prop('disabled', false);
}

ws.onclose = function() {
  $('#submit').val('Disconnected').prop('disabled', true);
}

ws.onmessage = function(data) {
  const msg = JSON.parse(data.data);
  const time = new Date(msg.time);
  const el = `<div class="post">
                <span class="name">${msg.name}</span>
                <span class="time" title="${time.toString()}">${time.getHours()%12+':'+time.getMinutes()}</span><br>
                <span class="text">${msg.text.replaceAll('\n', '<br>')}</span>
              </div>`;
  $('#feed').prepend(el);
}

$('#form').on('submit', function(e) {
  e.preventDefault();
  const data = JSON.stringify({
    name: $('#input-name').val().trim(),
    text: $('#input-text').val().trim()
  });
  ws.send(data);

  $('#input-text').val('');
  localStorage['name'] = $('#input-name').val();
  return false;
})

$('#hide').on('click', function() {
  $('#form').children().not('#hide').toggle();
})

window.onbeforeunload = function() {
  ws.close();
}
