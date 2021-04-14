var request = require('request');
const templateLib = require('./template');

const FLUTTERWAVE_PUBLIC_KEY = "XXXXXXXXXXXXXX";
const FLUTTERWAVE_SECRET_KEY = "XXXXXXXXXXXXXX";

module.exports.render_checkout = function (req, res) {

    let payData = {
        amount: req.body.amount,
        order_id: req.body.order_id,
        email: req.body.email
    };

    let server_url = req.protocol + "://" + req.get('host');

    res.send(templateLib.getTemplate(payData,server_url,FLUTTERWAVE_PUBLIC_KEY));   
};

module.exports.process_checkout = function(req, res){
    let server_url = req.protocol + "://" + req.get('host');
    var options = {
      'method': 'GET',
      'url': `https://api.flutterwave.com/v3/transactions/${req.query.transaction_id}/verify`,
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`
      }
    };
    request(options, (error, response) => { 
      let txData = JSON.parse(response.body);
      if (txData.status === "success"){
        res.redirect(`${server_url}/success?order_id=${txData.data.tx_ref}&amount=${txData.data.amount}&transaction_id=${txData.data.id}`)
      }else{
        res.redirect('/cancel');
      }
    });
};