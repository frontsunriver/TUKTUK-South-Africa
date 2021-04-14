function getTemplate(payData,server_url,public_key) {
    return `
        <html>
        <head>
            <meta charset="utf-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Flutterwave Payment Checkout</title>
        </head>
        <body>
            <script src="https://checkout.flutterwave.com/v3.js"></script>
            <script>
                function makePayment() {
                    FlutterwaveCheckout({
                        tx_ref:"${payData.order_id}",
                        public_key: "${public_key}",
                        amount: ${payData.amount},
                        currency: "NGN",
                        redirect_url: "${server_url}/flutterwave-process",
                        customer: {
                            email: "${payData.email}",
                        },

                    })
                }
                makePayment();
            </script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;