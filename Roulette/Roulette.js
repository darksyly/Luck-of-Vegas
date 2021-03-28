console.log("start");
var bc = require("./Blockchain");



class Roulette {
    
    blockchain;
    seed;
    lastRoundIndex;
    blockchainSize;
    

    constructor (seed, lenghtOfChain)
    {
        this.blockchainSize = lenghtOfChain;
        this.seed = seed;
        this.lastRoundIndex = 0;
        this.blockchain = [];
        this.blockchain.push(new bc.BlockchainNode(seed, null, 0, 14, "Roulette"));
        for(var i=0; i<lenghtOfChain - 1; i++)
        {
            this.blockchain.push(new bc.BlockchainNode(seed, this.blockchain[this.blockchain.length - 1].hash, 0, 14, "Roulette"));
        }
        console.log("Created new Roulette Block");
    }

    calculateValueFromHash() {
        var ret = parseInt(this.blockchain[this.lastRoundIndex].getHash(), 16) % 15;
        this.lastRoundIndex += 1;
        if(this.lastRoundIndex >= 500)
        {
            //add old seed to probably fair (database)
            this.seed = bc.BlockchainNode.randomSeed();
            this.lastRoundIndex = 0;
            this.blockchain = [];
            this.blockchain.push(new bc.BlockchainNode(this.seed, null, 0, 14, "Roulette"));
            for(var i=0; i<this.blockchainSize - 1; i++)
            {
                this.blockchain.push(new bc.BlockchainNode(this.seed, this.blockchain[this.blockchain.length - 1].hash, 0, 14, "Roulette"));
            }
            console.log("Created new Roulette Block");
        }
        return ret;
    }

}


/*class Bets
{
    userId;
    betColor;
    betAmount;
}*/



var r = new Roulette(bc.BlockchainNode.randomSeed(), 500);


var express = require('express');
var app = express();
app.use(express.json())


app.post('/RouletteBet', function (req, res)
{
    //req.body.id compare to id in database
    //check if user has enough money to make the bet
    var erg = r.calculateValueFromHash();
    var erg2 = {
        "erg" : {
           "money" : 0, //geld aus datenbank nehemen
           "rouletteResult": erg
        }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(erg2));
    res.end();
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
 })