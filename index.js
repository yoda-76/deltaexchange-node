const express = require("express");
const app = express();
// const server=require("http").createServer(app)
const axios = require('axios');




app.use(express.json());
const cors = require("cors");
app.use(cors());






//Routes
app.post("/nav",async(req,res)=>{
    // const assetData= await fetch("https://cdn.deltaex.org/v2/tickers?contract_types=spot").then(res=>{
    //   console.log(res)
    // })
    let assetData=await axios.get("https://cdn.deltaex.org/v2/tickers?contract_types=spot")
    // console.log(assetData.data.result)
    const assets=assetData.data.result
    // console.log(assets)

    
const {key,secret}=req.body
console.log(key,secret)
// const key="7JL6ho3WoVXq2T6rHRx7FUvQciAJgA"
// const secret= "7hmBQDj6wH24ro1ktMu636g3Y8dx7Em93als99jq4HH2g58VQBIKFXqQKLCO"
const initial_wallet=100 //can be changed accordingly

const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient(key,secret).then(client => {
    client.apis.Wallet.getBalances()
    .then(function(response) {
      try {
        const parsedData = JSON.parse(response.text).result;
        let total=0
        parsedData.map(coin=>{
          if(coin.asset_symbol!='USDT' && coin.available_balance>0){  
            assets.map(asset=>{
              if(asset.oi_value_symbol===coin.asset_symbol){
                total+=asset.close*coin.available_balance
              }
            })
          }
        })
        console.log("total:",total)
        res.send({status:true,data:{total}})
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
    }).catch(function(e) {
      console.log("Error 111: ", e);
      res.send({e})
    });
    // client.apis.Positions.getPositions({
    //   product_ids: "8"
    // })
    // .then(function(response) {
    //   console.log("Positions.getPositions success: ", response.data);
    //   res.send(response)

    // }).catch(function(e) {
    //   console.log("Error 111: ", e);
    //   res.send(e)
      
    // });
    // client.apis.Assets.getAssets()
    // .then(function(response) {
    //   console.log("Assets.getAssets success:",response);
    //   res.send(response)
    // })
    // .catch(function(e) {
    //   console.log("Error 111: ", e);
    // });


});

  })



  

app.listen(8000, () => {
  console.log("Server started on port 8000");
});





