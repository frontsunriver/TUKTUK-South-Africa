function getTemplate(paytm_checkout_url,paytmParams, checksum) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Paytm Payment Checkout</title>
        </head>
        <body>
            <center>
                <h1>Please do not refresh this page...</h1>
            </center>
            <form method="post" action="${paytm_checkout_url}" name="paytm">
            <table border="1">
                <tbody>
                    <input type="hidden" name="MID" value="${paytmParams.MID}">
                    <input type="hidden" name="WEBSITE" value="${paytmParams.WEBSITE}">
                    <input type="hidden" name="ORDER_ID" value="${paytmParams.ORDER_ID}">
                    <input type="hidden" name="CUST_ID" value="${paytmParams.CUST_ID}">
                    <input type="hidden" name="MOBILE_NO" value="${paytmParams.MOBILE_NO}">
                    <input type="hidden" name="EMAIL" value="${paytmParams.EMAIL}">
                    <input type="hidden" name="INDUSTRY_TYPE_ID" value="${paytmParams.INDUSTRY_TYPE_ID}">
                    <input type="hidden" name="CHANNEL_ID" value="${paytmParams.CHANNEL_ID}">
                    <input type="hidden" name="TXN_AMOUNT" value="${paytmParams.TXN_AMOUNT}">
                    <input type="hidden" name="CALLBACK_URL" value="${paytmParams.CALLBACK_URL}">
                    <input type="hidden" name="CHECKSUMHASH" value="${checksum}">
                </tbody>
            </table>
            <script type="text/javascript">
                document.paytm.submit();
            </script>
            </form>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;