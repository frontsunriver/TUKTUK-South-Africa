const crypto  = require('crypto');
const templateLib = require('./template');

const public_key = "XXXXXXXXXXXXXX";
const private_key = "XXXXXXXXXXXXXX";

module.exports.render_checkout = function (request, response) {

    let server_url = request.protocol + "://" + request.get('host');

    let json_string = {
        "public_key":public_key,
        "version":"3",
        "action":"pay",
        "amount":request.body.amount,
        "currency":"UAH",
        "description":"Payment Desription",
        "order_id": request.body.order_id,
        "server_url":server_url
    };
    
    let base64data =Buffer.from(JSON.stringify(json_string)).toString('base64');

    let sign_string =  private_key + base64data + private_key;
    
    let sha1 = crypto.createHash('sha1');
	sha1.update(sign_string);
    let signature =  sha1.digest('base64');	

    response.send(templateLib.getTemplate(base64data,signature));   
};
