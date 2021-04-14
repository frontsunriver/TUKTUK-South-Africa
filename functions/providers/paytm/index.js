const functions = require('firebase-functions');
const paytmcheckout = require('./checkout');

exports.link = functions.https.onRequest(paytmcheckout.render_checkout);
exports.process = functions.https.onRequest(paytmcheckout.process_checkout);