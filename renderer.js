// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer, remote } = require('electron');
const main = remote.require('./main.js');


// Send async message to main process
ipcRenderer.send('getCliqzInfo');


// Listen for async-reply message from main process
ipcRenderer.on('cliqzInfo', (event, arg) => {
  const elt = document.getElementById('socks-proxy');
  elt.innerHTML = `
  Please connect to socks proxy using the following information:
  ${JSON.stringify(arg)}
`;
  // // Send sync message to main process
  // const mainValue = ipcRenderer.sendSync('sync', 3);
  // // Print 4
  // console.log(mainValue);
});


// Listen for main message
// ipcRenderer.on('ping', (event, arg) => {
//   // Print 5
//   console.log(arg);
//   // Invoke method directly on main process
//   main.pong(6);
// });
