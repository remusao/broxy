// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const elmApp = window.elmApp;
const { ipcRenderer } = require('electron');


// Deal with main.js/Elm interop using ports
// All message passing shall be converted here.
//
// NOTE: port.subscribe asks for something from Elm to Javascript (update -> javascript)
// NOTE: port.send sends a message from Javascript to Elm (subscript -> update)
elmApp.ports.requestSocksProxyInfo.subscribe(() => {
  ipcRenderer.send('getCliqzInfo');
});

ipcRenderer.on('cliqzInfo', (event, arg) => {
  elmApp.ports.receiveSocksProxyInfo.send(arg);
});
