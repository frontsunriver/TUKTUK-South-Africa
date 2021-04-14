const templateLib = require('./template');

const paypal_client_id= 'XXXXXXXXXXXXXX';

module.exports.render_checkout = function(request, response){
    var amount = request.body.amount;
    var currency = request.body.currency;
    var server_url = request.protocol + "://" + request.get('host');
    response.send(templateLib.getTemplate(server_url,paypal_client_id,amount,currency));
};