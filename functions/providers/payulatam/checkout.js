const templateLib = require('./template');
var crypto = require('crypto');

const md5 = x => crypto.createHash('md5').update(x).digest('hex');

const keys = {
    checkoutUrl: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
    merchantId: 1111111,
    apiKey: 'XXXXXXXXXXXXXX',
    accountId: 1111111
};

module.exports.render_checkout = function (request, response) {
    var orderDetails = {
        order_id: request.body.order_id,
        email: request.body.email,
        amount: request.body.amount,
        currency: request.body.currency
    };

    var transaction_unique_key = `${keys.apiKey}~${keys.merchantId}~${orderDetails.order_id}~${orderDetails.amount}~${orderDetails.currency}`;

    var signature = md5(transaction_unique_key);

    let responseUrl = request.protocol + "://" + request.get('host') + "/payulatam-process";

    response.send(templateLib.getTemplate(
        keys,
        orderDetails,
        signature,
        responseUrl,
    ));
};

module.exports.process_checkout = function (request, response) {
    const server_url = request.protocol + "://" + request.get('host');
    if (request.query.transactionState === "4") {
        response.redirect(`${server_url}/success?amount=${request.query.TX_VALUE}&transaction_id=${request.query.transactionId}`)
    } else {
        response.redirect('/cancel');
    }
};