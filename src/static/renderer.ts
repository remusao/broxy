// Inject Elm App in the window
import { Broxy } from '../elm/Broxy';

import { ipcRenderer } from 'electron';

const elmApp = Broxy.fullscreen();

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

// -------------------------------------------------------------------------- //
// from Typescript to Elm (listen to internal events from main.ts)
// -------------------------------------------------------------------------- //
ipcRenderer.on('cliqzInfo', (event: any, arg: ISocksProxy) => {
  elmApp.ports.receiveISocksProxy.send(arg);
});
