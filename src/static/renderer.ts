import { App } from 'browser-core';
import { ipcRenderer } from 'electron';
import * as WebSocket from 'ws';

// Inject Elm App in the window
import { Broxy } from '../elm/Broxy';

const elmApp = Broxy.fullscreen();

let cliqzApp: any;
// Run Cliqz in Electron!
cliqzApp = new App();
global.CLIQZ = {
  app: cliqzApp,
};

cliqzApp.start().then(() => {
  const info = cliqzApp.modules['proxy-peer'].background.proxyPeer.httpLifeCycleHijack.socksProxy.server.address();
  elmApp.ports.receiveISocksProxy.send({
    proxyHost: info.address,
    proxyPort: info.port,
  });
});
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// Deal with main.js/Elm interop using ports
// All message passing shall be converted here.

export interface ISocksProxy {
  proxyPort: number;
  proxyHost: string;
}

// -------------------------------------------------------------------------- //
// from Elm to Typescript (listen to Elm commands)
// -------------------------------------------------------------------------- //
elmApp.ports.requestISocksProxy.subscribe(() => {
  ipcRenderer.send('getCliqzInfo');
});

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {

    const message = JSON.parse(data);
    console.log('received: ', message);

    if (message.functionName === 'onBeforeRequest') {
      const response = CLIQZ.app.modules['webrequest-pipeline'].background.onBeforeRequest(...message.args);

      ws.send(JSON.stringify({
        response,
        responseId: message.uuid,
      }));
    }

  });

});
