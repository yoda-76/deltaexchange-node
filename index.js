const express = require("express");
const app = express();
// const server=require("http").createServer(app)




app.use(express.json());
const cors = require("cors");
app.use(cors());






  //Routes
  app.post("/nav",async(req,res)=>{
    
const {key,secret}=req.body
console.log(key,secret)
// const key="7JL6ho3WoVXq2T6rHRx7FUvQciAJgA"
// const secret= "7hmBQDj6wH24ro1ktMu636g3Y8dx7Em93als99jq4HH2g58VQBIKFXqQKLCO"
// cons
const initial_wallet=100 //can be changed accordingly

const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient(key,secret).then(client => {
    client.apis.Wallet.getBalances()
    .then(function(response) {
    //   console.log(response.body["result"]);
      response.body["result"].filter(item=>{
        if(item["asset_id"]==5){
            console.log((item.balance/initial_wallet)*100)
            // res.send({status:200,data:(item.balance/initial_wallet)*100})
        }
      })
    }).catch(function(e) {
      console.log("Error 111: ", e);
      res.send({e})
    });
    client.apis.Assets.getAssets()
    .then(function(response) {
      console.log("Assets.getAssets success:",response);
      res.send(response)
    })
    .catch(function(e) {
      console.log("Error 111: ", e);
    });


});

  })



  

app.listen(8000, () => {
  console.log("Server started on port 8000");
});





