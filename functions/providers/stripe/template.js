function getTemplate(stripe_public_key, sessionId) {
    return `
        <html>
            <head>
            <head> 
            <title>Stripe Checkout</title>
            </head>
            <body>
            <script src="https://js.stripe.com/v3"></script>
            <h1>Loading...</h1>
            <div id="error-message"></div>
            <script>
                (function () {
                var stripe = Stripe('${stripe_public_key}');
                window.onload = function () {
                    stripe.redirectToCheckout({
                        sessionId: '${sessionId}'
                    })
                    .then(function (result) {
                        if (result.error) {
                        var displayError = document.getElementById('error-message');
                        displayError.textContent = result.error.message;
                        }
                    });
                };
                })();
            </script>
            </body>
        </html>
    `;
}

module.exports.getTemplate = getTemplate;