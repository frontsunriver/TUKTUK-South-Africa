const functions = require('firebase-functions');
const payulatamcheckout = require('./checkout');

exports.link = functions.https.onRequest(payulatamcheckout.render_checkout);
exports.process = functions.https.onRequest(payulatamcheckout.process_checkout);
