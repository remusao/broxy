// Inject Elm App in the window
const Elm = require('../elm/Broxy'); // eslint-disable-line import/no-unresolved

const container = document.getElementById('container');
window.elmApp = Elm.Broxy.embed(container);
