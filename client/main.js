new QRCode(document.getElementById('qrcode'), {
  text: location.host,
  width: 128,
  height: 128,
});

const alert_audio =
  'data:audio/mpeg;base64,SUQzAwAAAAAAUFRJVDIAAAARAAAATm90aWZpY2F0aW9uIFBvcFRQRTEAAAALAAAARWxNYXNNYWxvMVRYWFgAAAAWAAAAV2Vic2l0ZQBGcmVlU291bmQuT1JH//OExAAAAAAAAAAAAFhpbmcAAAAPAAAABAAABOAAXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl93d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3/////////////////////////////////AAAAUExBTUUzLjEwMAR4AAAAAAAAAAAVCCQDACEAAeAAAATgaJvrhwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//PExAAiqIqsH1gYAVJJLd43Db/v+/8PxuN08YjD+OQ1hrkUbmXfMxjQYyALMIOLEdyWUgGBgYGBgbj+AAAZ/h4//wEfh//gP/+hhn/AD3/mGCP8AD3/mGCP8AD3/1IIwAAAPDw8PDAAAAAAPDw8PDAAAABAeHh/UgA78A8PDw8MAAAAEB4eHn6AABwAHh4eHpAAAAP8PHoCABsAAAAA0CAwCAsMCgUAvMYAgECATAQW/5gWCgMAsCgsYUB15hKEhggCZhUX5maZZ0PmAwBICBUDBGwIsDAZADUDADgBUDK/oVUDNERYkDBNwM4DAXgcEDCAQLoCIAeDeYLDgsKFIhfET4ILCzhlwufVEFQ+EcoXMK2FTEBRSJCDLfHJFyi5SHDnDnCOhviEoxpCDLfmJdJkyLxeMSHFsgJMniHE1/LpdMi8XkS6XUnMUWSSor/5eLxiXS6kXjZaKKv///y8bLLqKknWj1/////+rRVSWiipIyRRMUkjJFExwAdm72K9//OUxOg4g4qfH524ZPpLs/SVbc3TSybvwleLKVuNJMMFzJE02aPPAgzN2IGDqJRdggB9EvSCaQ9eaE+2uasbXNggubyFEfwoj+FEfwY8CseBWPAtEh2iQ7RL1j0relb0tEh2iQ7RIdY8CseBVngRmSHGeQ4zyHFfwIr+BFfwIzyHGeSzvJZn8kz+SZ/JO8lnpndM6vjV8avjdM7pndM6vjSvbnBXwnNWQXNggubBBcGOE4McJwY4TmwQXNggubBBVCfYlQn2JUJ98q04wqtSPVWpHqoU75UKd8qFO+VakeqtSPVWfjKhB/q5CD/VyEH+//OkxOlCFDqIt9t4AMyFohlQtEMqFohlQhFsyEItmQhFuSFohlOtEKk60Q6q/urAUtu3//4pIjBI2EjbIlLIlGoLDi0BwKKPQVXmrROupijYScBlJJZSqKYqhlJJZSqKYqhlJJZaUUxUFEkkoEFophpMSSSopUUw0miJNopSWMpNFMVRSkkspNFMVRSkkspNFMVRSkkspNFMVRSkkspNFMVRSkkspNFMVRSkkspNFMVVTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NkxPMhALKiXjDMgaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';

const alert = new Audio(alert_audio);
alert.volume = 0.5;

let ws = new WebSocket(`ws://${location.host}:8000`);

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
  alert.play();
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

$('#toggle-input').on('click', function (e) {
  console.log('Press');
  $('#form').toggle();
});

window.onbeforeunload = function () {
  ws.close();
};
