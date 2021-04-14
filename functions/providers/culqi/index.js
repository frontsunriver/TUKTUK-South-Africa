const functions = require('firebase-functions');
const culqicheckout = require('./checkout');

exports.link = functions.https.onRequest(culqicheckout.render_checkout);
exports.process = functions.https.onRequest(culqicheckout.process_checkout);