function getTemplate(payData,PUBLIC_KEY) {
  return `
  <!doctype html>
  <html>
  <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Culqi Payment Checkout</title>
  </head>
    <body>
    <script src="https://checkout.culqi.com/js/v3"></script>
    <script>
      Culqi.publicKey = '${PUBLIC_KEY}';
      Culqi.settings({
        title: '${payData.title}',
        currency: 'PEN',
        description: '${payData.order_id}',
        amount: ${payData.amount},
        email: '${payData.email}'
      });
      Culqi.open();
      function culqi() {
        if (Culqi.token) {
            var token = Culqi.token.id;
            window.open("culqi-process?order_id=${payData.order_id}&email=${payData.email}&amount=${payData.amount}&token=" + token, "_self");
        } else { 
            window.open("cancel", "_self");
        }
      };
    </script>
    </body>
  </html>
  `;
}

module.exports.getTemplate = getTemplate;