const functions = require('firebase-functions');
const stripecheckout = require('./checkout');

exports.link = functions.https.onRequest(stripecheckout.render_checkout);
exports.process = functions.https.onRequest(stripecheckout.process_checkout);