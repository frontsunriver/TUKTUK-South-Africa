function getTemplate(base64data,signature) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Liqpay Payment Checkout</title>
        </head>
        <body>
            <div id="liqpay_checkout"></div>
            <script>
            window.LiqPayCheckoutCallback = function() {
            LiqPayCheckout.init({
                    data: "${base64data}",
                    signature: "${signature}",
                    embedTo: "#liqpay_checkout",
                    language: "en",
                    mode: "embed" // embed || popup
                }).on("liqpay.callback", function(data){
                    if(data.status==="success"){
                        window.open("success?order_id=" + data.order_id + "&amount=" + data.amount + "&transaction_id=" + data.transaction_id, "_self");
                    }else{
                        window.open("cancel", "_self");
                    }
                }).on("liqpay.ready", function(data){
                    console.log("Widget Ready");
                }).on("liqpay.close", function(data){
                    console.log("Widget Close");
                });
            };
            </script>
            <script src="//static.liqpay.ua/libjs/checkout.js" async></script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;