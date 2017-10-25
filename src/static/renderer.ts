import { App } from 'browser-core';
import * as WebSocket from 'ws';

// Inject Elm App in the window
import { Broxy } from '../elm/Broxy';

const webRequestEvents = [
  'onBeforeRequest',
  'onBeforeSendHeaders',
  'onHeadersReceived',
];

// Deal with main.js/Elm interop using ports
// All message passing shall be converted here.
export interface ISocksProxy {
  proxyPort: number;
  proxyHost: string;
}

export interface ICliqzModules {
  modules: string[];
}

const elmApp = Broxy.fullscreen();

// Run Cliqz in Electron!
const cliqzApp = new App();

elmApp.ports.receiveICliqzModules.send({
  modules: cliqzApp.moduleList.map(m => m.name),
});

cliqzApp.start().then(() => {
  const proxyPeerBackground = cliqzApp.modules['proxy-peer'].background;
  const info = proxyPeerBackground.proxyPeer.httpLifeCycleHijack.socksProxy.server.address();
  elmApp.ports.receiveISocksProxy.send({
    proxyHost: info.address,
    proxyPort: info.port,
  });
});
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// -------------------------------------------------------------------------- //
// from Elm to Typescript (listen to Elm commands)
// -------------------------------------------------------------------------- //
const handleWebRequest = (data: any, respond: any) => {
  const message = JSON.parse(data);
  const webRequest = cliqzApp.modules['webrequest-pipeline'].background;
  const eventName = message.functionName;
  console.log('received: ', message);

  if (!webRequestEvents.includes(eventName) || !(eventName in webRequest)) {
    return;
  }

  // wrapping in a promise as eventHandler may or may not return one
  Promise.resolve()
    .then(() => webRequest[eventName](...message.args))
    .then((response) =>
       respond(
         JSON.stringify({
           response,
           responseId: message.uuid,
         }),
       ),
    );
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) =>
  ws.on('message', (data) => handleWebRequest(data, ws.send.bind(ws))),
);
