const functions = require('firebase-functions');
const paypalcheckout = require('./checkout');

exports.link = functions.https.onRequest(paypalcheckout.render_checkout);