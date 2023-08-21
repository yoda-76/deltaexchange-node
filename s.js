let ap=100, p=0, uc=0, unc=50,dif=0,c=0
unc-=ap/10
p=ap
uc=ap/10
while(uc+unc>0 && c<100){
    dif=uc-(ap/100*5)
    ap=ap-(ap/100*5)    
    //rebalance
    uc=ap/10
    unc=unc-(uc-dif)
    // ap=Number(ap.toFixed(4))
    c++
    console.log("ap: ", Number(ap.toFixed(4)))
    console.log("dif: ",Number(dif.toFixed(4)))
    console.log("uc: ", Number(uc.toFixed(4)))
    console.log("unc: ", Number(unc.toFixed(4)))
    console.log(c)
    console.log("\n")

}
console.log(c)