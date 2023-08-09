const express = require("express");
const app = express();
// const server=require("http").createServer(app)




app.use(express.json());
const cors = require("cors");
app.use(cors());






  //Routes
  app.post("/nav",async(req,res)=>{
    
const {key,secret}=req.body
// const key="7JL6ho3WoVXq2T6rHRx7FUvQciAJgA"
// const secret= "7hmBQDj6wH24ro1ktMu636g3Y8dx7Em93als99jq4HH2g58VQBIKFXqQKLCO"
// cons
const initial_wallet=100 //can be changed accordingly

const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient("7JL6ho3WoVXq2T6rHRx7FUvQciAJgA","7hmBQDj6wH24ro1ktMu636g3Y8dx7Em93als99jq4HH2g58VQBIKFXqQKLCO").then(client => {
    client.apis.Wallet.getBalances()
    .then(function(response) {
    //   console.log(response.body["result"]);
      const resp=response.body["result"].filter(item=>{
        if(item["asset_id"]==5){
            console.log(item.balance)
            res.send((item.balance/initial_wallet)*100)
        }
      })
    }).catch(function(e) {
      console.log("Error 111: ", e);
      res.send({e})
    });


});

  })



  

app.listen(8000, () => {
  console.log("Server started on port 8000");
});





