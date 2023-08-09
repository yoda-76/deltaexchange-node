const express = require("express");
const app = express();
// const server=require("http").createServer(app)




app.use(express.json());
const cors = require("cors");
app.use(cors());






  //Routes
  app.post("/nav",async(req,res)=>{
    
const {key,secret}=req.body
const DeltaRestClient = require("delta-rest-client");
new DeltaRestClient(key,secret).then(client => {
    client.apis.Wallet.getBalances()
    .then(function(response) {
    //   console.log(response.body["result"]);
      const resp=response.body["result"].filter(item=>{
        if(item["asset_id"]==5){
            console.log(item.balance)
            res.send(item.balance)
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





