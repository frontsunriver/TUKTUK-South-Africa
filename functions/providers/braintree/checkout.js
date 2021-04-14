const braintree = require("braintree");
const templateLib = require('./template');

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox, 
    merchantId: 'XXXXXXXXXXXXXX', 
    publicKey: 'XXXXXXXXXXXXXX',
    privateKey: 'XXXXXXXXXXXXXX'
});

module.exports.render_checkout = function(request, response){
    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var currency = request.body.currency;

    gateway.clientToken.generate({
    }, (err, res) => {
        if (err) {
            response.send({ "error": err });
        } else if (res) {
            response.send(templateLib.getTemplate(res.clientToken,order_id,amount,currency));
        } else {
            response.send({ "error": "Some other error" });
        }
    });
};

module.exports.process_checkout = function(request, response){
    gateway.transaction.sale(
        {
            amount: request.body.amount,
            paymentMethodNonce: request.body.nonce,
            options: {
                submitForSettlement: true
            }
        },
        (err, res) => {
            if (err) {
                response.send({ error: err });
            } else {
                response.send({ res: res});
            }
        }
    );
};