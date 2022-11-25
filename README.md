## LocalChat
**A simple, realtime chat panel for the local network.**

### Setting Up
1. Install [Node.js](https://nodejs.org/) on the host computer.
2. In **./server**, run `npm install` to install dependencies.
3. Run `node server.js` to launch the webserver.
   - If hosting publicly, forward ports **80** and **8000**, or adjust manually in **server.js**.

Any client that connects to the host address (via web browser) will be served the chat page,\
and be connected to a realtime websocket for communication.

Chat logs will be saved in **./server/logs**, itemized by day.
