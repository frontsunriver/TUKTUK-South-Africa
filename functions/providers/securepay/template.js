function getTemplate(payData,server_url,CLIENT_ID,MERCHANT_CODE) {
    return `
    <!doctype html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SecurePay Payment Checkout</title>
    </head>
      <body>
        <form onsubmit="return false;" style="margin:0 auto;">
            <div id="securepay-ui-container"></div>
            <div id="action-buttons">
                <button style="
                    background-color: #4CAF50;
                    border: none;
                    color: white;
                    padding: 12px 32px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius:5px;
                    "
                   onclick="mySecurePayUI.tokenise();">Pay</button>
                <button style="
                    background-color: #555555;
                    border: none;
                    color: white;
                    padding: 12px 22px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    font-size: 16px;
                    border-radius:5px;
                    " 
                    onclick="mySecurePayUI.reset();">Reset</button>
            </div>
        </form>
        <script id="securepay-ui-js" src="https://payments-stest.npe.auspost.zone/v3/ui/client/securepay-ui.min.js"></script>
        <script type="text/javascript">
          var mySecurePayUI = new securePayUI.init({
            containerId: 'securepay-ui-container',
            scriptId: 'securepay-ui-js',
            clientId: '${CLIENT_ID}',
            merchantCode: '${MERCHANT_CODE}',
            card: { // card specific config and callbacks
                onTokeniseSuccess: function(tokenisedCard) {
                    window.open("securepay-process?order_id=${payData.order_id}&amount=${payData.amount}&token=" + tokenisedCard.token, "_self");
                },
                onTokeniseError: function(errors) {
                    window.open("${server_url}/cancel", "_self");
                }
            },
            style: {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                label: {
                  font: {
                      family: 'Arial, Helvetica, sans-serif',
                      size: '1.1rem',
                      color: 'darkblue'
                  }
                },
                input: {
                 font: {
                     family: 'Arial, Helvetica, sans-serif',
                     size: '1.1rem',
                     color: 'darkblue'
                 }
               }  
            },
            onLoadComplete: function() {
                var elem = document.getElementById("securepay-ui-iframe-0");
                elem.style.border = 'none';
                document.getElementById("securepay-ui-container").style.width = '300px';
                document.getElementById("securepay-ui-container").style.margin = '0 auto';
                document.getElementById("action-buttons").style.width = '300px';
                document.getElementById("action-buttons").style.margin = '0 auto';
            }
          });
        </script>
      </body>
    </html>
    `;
}

module.exports.getTemplate = getTemplate;