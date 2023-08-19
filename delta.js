const initialWallet = 100; // can be changed accordingly
const hardcodedApiKey = "YOUR_API_KEY";
const hardcodedApiSecret = "YOUR_API_SECRET";

const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient(hardcodedApiKey, hardcodedApiSecret).then(client => {
    client.apis.Wallet.getBalances()
        .then(function (response) {
            response.body["result"].filter(item => {
                if (item["asset_id"] == 5) {
                    console.log((item.balance / initialWallet) * 100);
                }
            });
        })
        .catch(function (e) {
            console.log("Error:", e);
        });

    client.apis.Assets.getAssets()
        .then(function (response) {
            console.log("Assets.getAssets success:", response);
        })
        .catch(function (e) {
            console.log("Error:", e);
        });
});
