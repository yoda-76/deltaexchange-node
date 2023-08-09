

const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient("k6yPWzNpaYnxOt6TjhgVnrRQB9qubc", "J7gy4yTEoIDxoZPekyyoYF4MS7bDYC2JuN0PNMiXmo59g7sut4hwSw1qDrrS").then(client => {
  // Get List of Products
//   client.apis.Products.getProducts().then(function(response) {
//     var products = JSON.parse(response.data.toString());
//     console.log("\nProducts:\n----\n", JSON.stringify(products));
//   });

  // Get Open orders for product_id = 3
//   client.apis.Orders.getBalances().then(function(
//     response
//   ) {
//     var orders = JSON.parse(response.data.toString());
//     console.log("Open Orders:", orders);
//     // res.send(portfolio)
//   });
  client.apis.Wallet.getBalances()
    .then(function(response) {
      console.log("Wallet.getBalances success: ", response.body);
    }).catch(function(e) {
      console.log("Error 111: ", e);
    });


});
