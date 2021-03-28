const crypto = require('crypto');

console.log("start from the other side");
module.exports = {
    BlockchainNode: class BlockchainNode
    {
        date;
        previousHash;
        hash;
        seed;
        //min = 0; //min value of random number
        //max; //max value of random number
        gameName;
    
        constructor(seed = null, previousHash = null, /*min = 0, max,*/ GameName)
        {
            this.seed = seed;
            this.previousHash = previousHash;
            this.gameName = GameName;
            this.date = new Date().toString();
            this.hash = crypto.createHash('sha256').update(
                "GameName: " + this.gameName +
                "\nDate: " + this.date + 
                "\nSeed: " + this.seed + 
                "\nPreviousHash: " + this.previousHash
            ).digest('hex');
        }
    
        getHash() {
            //console.log(this.previousHash + ":" + this.GameName)
            //return crypto.createHash('sha256').update(this.previousHash + ":" + this.GameName).digest('hex');
            return this.hash;
        }

        static randomSeed() {
            return crypto.randomBytes(32).toString('hex');
        }

        toString()
        {
            return "GameName: " + this.gameName +
                " Date: " + this.date + 
                " Seed: " + this.seed + 
                " PreviousHash: " + this.previousHash +
                " Hash: " + this.hash;
        }
    }
}
