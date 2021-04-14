const functions = require('firebase-functions');
const liqpaycheckout = require('./checkout');

exports.link = functions.https.onRequest(liqpaycheckout.render_checkout);