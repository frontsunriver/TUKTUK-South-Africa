const request = require('request');
const fs = require('fs');
const path = require('path');

const templateLib = require('./template');

const MERCHANT_CODE = 'XXXXXXXXXXXXXX';
const CLIENT_ID = 'XXXXXXXXXXXXXX';
const CLIENT_SECRET = 'XXXXXXXXXXXXXX';
const SECURE_PAY_TOKEN_URL = 'https://hello.sandbox.auspost.com.au/oauth2/ausujjr7T0v0TTilk3l5/v1/token';
const SECURE_PAY_PAYMENT_URL = 'https://payments-stest.npe.auspost.zone/v2/payments';

module.exports.render_checkout = (req, res) => {
  let payData = {
    amount: req.body.amount,
    order_id: req.body.order_id
  };

  let server_url = req.protocol + "://" + req.get('host');
  res.send(templateLib.getTemplate(payData, server_url, CLIENT_ID, MERCHANT_CODE));
};


module.exports.process_checkout = async (req, res)  => {
  let server_url = req.protocol + "://" + req.get('host');
  let card_token = req.query.token;
  let amount = req.query.amount;
  let order_id = req.query.order_id;

  const fs = require('fs');
  const os = require('os');
  const tmpdir = os.tmpdir();
  const filePath = path.join(tmpdir,'token.json');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      let options = {
        'method': 'POST',
        'url': SECURE_PAY_TOKEN_URL,
        'headers': {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
        'body': 'grant_type=client_credentials&scope=https://api.payments.auspost.com.au/payhive/payments/read https://api.payments.auspost.com.au/payhive/payments/write https://api.payments.auspost.com.au/payhive/payment-instruments/read https://api.payments.auspost.com.au/payhive/payment-instruments/write'
      };

      request(options, (error, response) => {
        if (response.body.length > 1) {
          let data = JSON.parse(response.body);
          if (data.access_token) {
            let accessInfo = {
              expires_in: data.expires_in,
              token: data.access_token,
              datetime: new Date()
            };
            fs.writeFile(filePath, JSON.stringify(accessInfo), err => {
              if (err) {
                res.redirect(server_url + '/cancel');
              }
              let options = {
                'method': 'POST',
                'url': SECURE_PAY_PAYMENT_URL,
                'headers': {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + accessInfo.token
                },
                'body': { 
                      "amount":amount,
                      "merchantCode":MERCHANT_CODE,
                      "token":card_token,
                      "ip":"127.0.0.1",
                      "orderId":order_id
                },
                json: true
              };
              request(options, (error, response) => {
                let result = response.body;
                if(result.status && result.status === 'paid'){
                    let success_url = server_url + "/success?order_id=" + result.orderId + "&amount=" + result.amount + "&transaction_id=" + result.bankTransactionId;
                    res.redirect(success_url);
                }else{
                    res.redirect(server_url + '/cancel');
                }
              });      
            });
          }
        }
      });
    }
    if (data) {
      let accessInfo = JSON.parse(data);
      const date1 = new Date();
      const date2 = new Date(accessInfo.datetime);
      const diffTime = date1 - date2;
      const diffMins = diffTime / 1000;
      
      if(diffMins<accessInfo.expires_in){
        let options = {
          'method': 'POST',
          'url': SECURE_PAY_PAYMENT_URL,
          'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessInfo.token
          },
          'body': { 
            "amount":amount,
            "merchantCode":MERCHANT_CODE,
            "token":card_token,
            "ip":"127.0.0.1",
            "orderId":order_id
          },
          json: true
        };
        request(options, (error, response) => {
          let result  = response.body;
          if(result.status && result.status === 'paid'){
              let success_url = server_url + "/success?order_id=" + result.orderId + "&amount=" + result.amount + "&transaction_id=" + result.bankTransactionId;
              res.redirect(success_url);
          }else{
              res.redirect(server_url + '/cancel');
          }
        });          
      }else{
        let options = {
          'method': 'POST',
          'url': SECURE_PAY_TOKEN_URL,
          'headers': {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
          },
          'body': 'grant_type=client_credentials&scope=https://api.payments.auspost.com.au/payhive/payments/read https://api.payments.auspost.com.au/payhive/payments/write https://api.payments.auspost.com.au/payhive/payment-instruments/read https://api.payments.auspost.com.au/payhive/payment-instruments/write'
        };
  
        request(options, (error, response) => {
          if (response.body.length > 1) {
            let data = JSON.parse(response.body);
            if (data.access_token) {
              let accessInfo = {
                expires_in: data.expires_in,
                token: data.access_token,
                datetime: new Date()
              };
              fs.writeFile(filePath, JSON.stringify(accessInfo), err => {
                if (err) throw err;
                let options = {
                  'method': 'POST',
                  'url': SECURE_PAY_PAYMENT_URL,
                  'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessInfo.token
                  },
                  'body': { 
                    "amount":amount,
                    "merchantCode":MERCHANT_CODE,
                    "token":card_token,
                    "ip":"127.0.0.1",
                    "orderId":order_id
                  },
                  json: true
                };
                request(options, (error, response) => {
                    let result = response.body;
                    if(result.status && result.status === 'paid'){
                        let success_url = server_url + "/success?order_id=" + result.orderId + "&amount=" + result.amount + "&transaction_id=" + result.bankTransactionId;
                        res.redirect(success_url);
                    }else{
                        res.redirect(server_url + '/cancel');
                    }
                }); 
              });
            }
          }
        });
      }
    }
  });
};