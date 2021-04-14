const checksum_lib = require('./checksum');
const templateLib = require('./template');

const PAYTM_MEWRCHANT_ID = "XXXXXXXXXXXXXX";
const PAYTM_MERCHANT_KEY = 'XXXXXXXXXXXXXX';
const PAYTM_WEBSITE = "WEBSTAGING";
const PAYTM_INDUSTRY_TYPE_ID = "Retail";
const PAYTM_CHANNEL_ID = "WEB";

const PAYTM_CHECKOUT_URL = "https://securegw-stage.paytm.in/order/process";

module.exports.render_checkout = function(request, response){

    var order_id = request.body.order_id;
    var amount = request.body.amount;
    var cust_id = request.body.cust_id;
    var mobile_no = request.body.mobile_no;
    var email = request.body.email;

    var callback_url = request.protocol + "://" + request.get('host') + '/paytm-process';

    var paytmParams = {
      "MID" : PAYTM_MEWRCHANT_ID,
      "WEBSITE" : PAYTM_WEBSITE,
      "INDUSTRY_TYPE_ID" : PAYTM_INDUSTRY_TYPE_ID,
      "CHANNEL_ID" : PAYTM_CHANNEL_ID,
      "ORDER_ID" : order_id,
      "CUST_ID" : cust_id,
      "MOBILE_NO" : mobile_no,
      "EMAIL" : email,
      "TXN_AMOUNT" : amount,
      "CALLBACK_URL" : callback_url,
    };

	checksum_lib.genchecksum(paytmParams, PAYTM_MERCHANT_KEY, (err, checksum) => {
        if(!err){    
            response.send(templateLib.getTemplate(PAYTM_CHECKOUT_URL,paytmParams,checksum));
        }
    });
};


module.exports.process_checkout = function(request, response){

    var received_data = request.body;
    var paytmChecksum = "";
    var paytmParams = {};

    var full_url = request.protocol + "://" + request.get('host');

    var success_url = full_url + "/success?order_id=" + received_data.ORDERID + "&amount=" + received_data.TXNAMOUNT + "&transaction_id=" + received_data.TXNID;
    var cancel_url = full_url + "/cancel";

    for(var key in received_data){
        if(key === "CHECKSUMHASH") {
            paytmChecksum = received_data[key];
        } else {
            paytmParams[key] = received_data[key];
        }
    }

    var isValidChecksum = checksum_lib.verifychecksum(paytmParams, PAYTM_MERCHANT_KEY, paytmChecksum);
    if(isValidChecksum) {
        if(received_data.STATUS === 'TXN_SUCCESS'){
            response.redirect(success_url);
        }else{
            response.redirect(cancel_url);
        }
    } else {
        response.redirect(cancel_url);
    }   
};