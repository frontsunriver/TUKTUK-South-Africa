const functions = require('firebase-functions');
const securepaycheckout = require('./checkout');

exports.link = functions.https.onRequest(securepaycheckout.render_checkout);
exports.process = functions.https.onRequest(securepaycheckout.process_checkout);