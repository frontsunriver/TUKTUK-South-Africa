const functions = require('firebase-functions');
const flutterwavecheckout = require('./checkout');

exports.link = functions.https.onRequest(flutterwavecheckout.render_checkout);
exports.process = functions.https.onRequest(flutterwavecheckout.process_checkout);
