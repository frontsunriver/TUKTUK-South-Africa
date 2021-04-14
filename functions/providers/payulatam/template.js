function getTemplate(apiKeys,orderDetails,signature,responseUrl) {
    return `
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>PayuLatam Payment Checkout</title>
        </head>
        <body>
            <form name="payuform" method="post" action="${apiKeys.checkoutUrl}">
                <input name="merchantId" type="hidden" value="${apiKeys.merchantId}">
                <input name="accountId" type="hidden" value="${apiKeys.accountId}">
                <input name="description" type="hidden" value="Booking Payment">
                <input name="referenceCode" type="hidden" value="${orderDetails.order_id}">
                <input name="amount" type="hidden" value="${orderDetails.amount}">
                <input name="tax" type="hidden" value="0">
                <input name="taxReturnBase" type="hidden" value="0">
                <input name="currency" type="hidden" value="${orderDetails.currency}">
                <input name="signature" type="hidden" value="${signature}">
                <input name="test" type="hidden" value="1">
                <input name="buyerEmail" type="hidden" value="${orderDetails.email}">
                <input name="responseUrl"    type="hidden"  value="${responseUrl}" >
                <input name="confirmationUrl" type="hidden" value="">
                <input name="Submit" type="submit" value="Enviar">
            </form>
            <script type="text/javascript">
                document.payuform.submit();
            </script>
        </script>
        </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;