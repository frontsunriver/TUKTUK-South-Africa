function getTemplate(token, order_id, amount, currency) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <script src="https://js.braintreegateway.com/web/dropin/1.22.0/js/dropin.min.js"></script>
            <title>Braintree Payment Checkout</title>
        </head>
        <body>
            <div id="dropin-container"></div>
            <div style="width:100%;height:60px;margin: 0 auto">
                <center>
                    <button id="submit-button"
                        style="padding: 10px;padding-left: 100px;padding-right: 100px;font-size:16px;color: #fff;background-color:red;font-size:18px;background: #00c4ff;border-radius: 6px;box-shadow:none;border:0;">Pay</button>
                </center>
            </div>
            <script>
                var button = document.querySelector('#submit-button');
                var dropinInstance;
                braintree.dropin.create({
                    authorization: '${token}',
                    container: '#dropin-container',
                    paypal: {
                        flow: 'checkout',
                        amount: '${amount}',
                        currency: '${currency}'
                    }
                }, (createErr, instance) => {
                    if (instance) {
                        dropinInstance = instance;
                        dropinInstance.on('paymentMethodRequestable', event => {
                            if (event.paymentMethodIsSelected) {
                                dropinInstance.requestPaymentMethod((err, payload) => {
                                    if (!err) {
                                        window.ReactNativeWebView.postMessage(payload.nonce);
                                        button.style.display="none";
                                    }
                                    if (err) {
                                        dropinInstance.clearSelectedPaymentMethod();
                                        window.ReactNativeWebView.postMessage("Error");
                                        button.style.display="block";
                                    }
                                });
                            }
                        });

                        button.addEventListener('click', ()=>{
                            dropinInstance.requestPaymentMethod((err, payload) => {
                                if (!err) {
                                    var request = new XMLHttpRequest();
                                    request.open('POST', 'braintree-process', true);
                                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                                    request.onload = function() {
                                        var data = JSON.parse(this.response);
                                        if(data.error){
                                            window.open("cancel", "_self");
                                        }else{
                                            if (data.res.success) {
                                                window.open("success?order_id=${order_id}&amount=${amount}&transaction_id=" + data.res.transaction.id, "_self");
                                            }
                                            else {
                                                window.open("cancel", "_self");
                                            }
                                        }
                                    }
                                    request.send(JSON.stringify({ "nonce": payload.nonce, "amount": "${amount}" }));
                                    button.style.display="none";
                                }
                                if (err) {
                                    dropinInstance.clearSelectedPaymentMethod();
                                    button.style.display="block";
                                }
                            });
                        });
                    }
                    if (createErr) {
                        console.log(createErr);
                    }
                });
            </script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;
