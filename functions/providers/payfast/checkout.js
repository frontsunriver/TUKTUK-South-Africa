const templateLib = require('./template');

const PAYFAST_MEWRCHANT_ID = "17545723";
const PAYFAST_MERCHANT_KEY = 'r351l6pt0ymik';
const PAYFAST_CHECKOUT_URL = "https://sandbox.payfast.co.za/eng/process";

module.exports.render_checkout = function(request, response){

    var order_id = request.body.order_id;
    var amount = request.body.amount;

    var full_url = request.protocol + "://" + request.get('host');
    var success_url = full_url + "/success";
    var cancel_url = full_url + "/cancel";

    response.send(templateLib.getTemplate(
        PAYFAST_CHECKOUT_URL,
        PAYFAST_MEWRCHANT_ID,
        PAYFAST_MERCHANT_KEY,
        order_id,
        amount,
        success_url,
        cancel_url
    ));
};