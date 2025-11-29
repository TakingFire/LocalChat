const { WebSocketServer } = require('ws');
const http = require('http');
const fs = require('fs').promises;

const server = http.createServer();

let messages = [
  {
    name: 'Hints',
    text: 'Press F8 to show/hide the input box.\nPress F9 for connection instructions.',
    time: Date.now(),
  },
];

server.on('request', async (req, res) => {
  try {
    const url = (req.url == '/' ? '/index.html' : req.url).replace('..', '.');
    let file = await fs.readFile('../client' + url, 'utf8');
    res.writeHead(200).end(file);
  } catch (err) {
    res.writeHead(404).end();
  }
});

server.listen(80);

const socket = new WebSocketServer({ port: 8000 });

socket.on('connection', (ws) => {
  console.log('Client Connected');

  for (msg of messages) {
    ws.send(JSON.stringify(msg));
  }

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    msg.time = Date.now();
    messages.push(msg);
    console.log(msg);

    socket.clients.forEach((client) => {
      client.send(JSON.stringify(msg));
    });

    const now = new Date();
    fs.writeFile(
      `./logs/${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}.txt`,
      `${msg.name} - ${new Date(msg.time).toTimeString().split(' ')[0]}\n${msg.text}\n\n`,
      { flag: 'a' },
    );
  });

  ws.on('close', function () {
    console.log('Client Disconnected');
  });
});
