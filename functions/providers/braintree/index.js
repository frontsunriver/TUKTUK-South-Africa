const functions = require('firebase-functions');
const braintreecheckout = require('./checkout');

exports.link = functions.https.onRequest(braintreecheckout.render_checkout);
exports.process = functions.https.onRequest(braintreecheckout.process_checkout);