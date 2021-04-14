function getTemplate(
    checkout_url,
    merchant_id,
    merchant_key,
    order_id,
    amount,
    success_url,
    cancel_url
){
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Payfast Payment Checkout</title>
        </head>
        <body>
            <center>
                <h1>Please do not refresh this page...</h1>
            </center>
            <form action="${checkout_url}" method="POST" name="payfast">

                <input type="hidden" name="merchant_id" value="${merchant_id}">
                <input type="hidden" name="merchant_key" value="${merchant_key}">
                <input type="hidden" name="return_url" value="${success_url}">
                <input type="hidden" name="cancel_url" value="${cancel_url}">
                <input type="hidden" name="amount" value="${amount}">
                <input type="hidden" name="item_name" value="${order_id}">

            <script type="text/javascript">
                document.payfast.submit();
            </script>
            </form>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;