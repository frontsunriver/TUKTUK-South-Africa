function getTemplate(public_key, order_id, email, amount, ) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>PayStack Payment Checkout</title>
            <style>
                a{
                    color:black;
                }
                a:link{
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <script src="https://js.paystack.co/v1/inline.js"></script>
            <a id="back" href="/cancel">&larr;</a>
            <div id="paystackEmbedContainer"></div>
            <script>
              PaystackPop.setup({
                key: '${public_key}',
                email: '${email}',
                amount: ${amount * 100},
                metadata: {
                    order_id: '${order_id}'
                },
                container: 'paystackEmbedContainer',
                callback: function(data){
                    window.open("paystack-process?reference=" + data.reference, "_self");
                }
              });
            </script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;