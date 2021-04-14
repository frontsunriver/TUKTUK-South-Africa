var request = require('request');
const templateLib = require('./template');

const PULIC_KEY = 'XXXXXXXXXXXXXX';
const SECURE_KEY = 'XXXXXXXXXXXXXX';
const API_URL = 'https://api.culqi.com/v2/charges';

module.exports.render_checkout = (req, res) => {
  let payData = {
    title:'Booking',
    amount: req.body.amount * 100,
    order_id: req.body.order_id,
    email: req.body.email
  };
  res.send(templateLib.getTemplate(payData, PULIC_KEY));
};


module.exports.process_checkout = (req, res)  => {
  let server_url = req.protocol + "://" + req.get('host');

  var body = {
    "amount": req.query.amount,
    "currency_code": "PEN",
    "email": req.query.email,
    "source_id": req.query.token
  }

  var options = {
    'method': 'POST',
    'url': API_URL,
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + SECURE_KEY
    },
    'body': JSON.stringify(body)
  };

  request(options, (error, response) => {
    if(error){
      res.redirect(server_url + '/cancel');
    }else{
      if(response.statusCode === 201){
        res.redirect(`${server_url}/success?order_id=${req.query.order_id}&amount=${parseFloat(req.query.amount) / 100}&transaction_id=${JSON.parse(response.body).id}`)
      }else{
        res.redirect(server_url + '/cancel');
      }
    }
  });

};