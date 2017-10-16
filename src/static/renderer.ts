// Inject Elm App in the window
import { App } from 'browser-core';
import { Broxy } from '../elm/Broxy';

const elmApp = Broxy.fullscreen();

let cliqzApp: any;
// Run Cliqz in Electron!
cliqzApp = new App();
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
  try {
    const info = cliqzApp.modules['proxy-peer'].background.proxyPeer.httpLifeCycleHijack.socksProxy.server.address();
    elmApp.ports.receiveISocksProxy.send({
      proxyHost: info.address,
      proxyPort: info.port,
    });
  } catch (ex) {
    console.log('Could not get information about proxy peer');
  }
});

// -------------------------------------------------------------------------- //
// from Typescript to Elm (listen to internal events from main.ts)
// -------------------------------------------------------------------------- //
// ipcRenderer.on('cliqzInfo', (event: any, arg: ISocksProxy) => {
//   elmApp.ports.receiveISocksProxy.send(arg);
// });
