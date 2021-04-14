const functions = require('firebase-functions');
const paystackcheckout = require('./checkout');

exports.link = functions.https.onRequest(paystackcheckout.render_checkout);
exports.process = functions.https.onRequest(paystackcheckout.process_checkout);