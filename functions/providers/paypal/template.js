function getTemplate(server_url,SB_CLIENT_ID, amount,currency) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Paypal Checkout</title>
        </head>
        <body>      
        <script  src="https://www.paypal.com/sdk/js?client-id=${SB_CLIENT_ID}&currency=${currency}"></script>
            <div id="paypal-button-container"></div> 
            <script>
                paypal.Buttons({
                    createOrder: function(data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '${amount}'
                                }
                            }]
                        });
                    },
                    onApprove: function(data, actions) {
                        return actions.order.capture().then(function(details) {
                            actions.redirect("${server_url}/success?&amount=${amount}&transaction_id=" + details.id);
                        });
                    },
                    onCancel: function (data,actions) {
                        actions.redirect('${server_url}/cancel');
                    },
                    onError: function (err,actions) {
                        actions.redirect('${server_url}/cancel');
                    }
                }).render('#paypal-button-container');
            </script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;
