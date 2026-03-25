const mongoose = require('mongoose');

const uri2 = "mongodb://admin:Mukesh356@ac-mrq4uga-shard-00-00.7cmeihs.mongodb.net:27017,ac-mrq4uga-shard-00-01.7cmeihs.mongodb.net:27017,ac-mrq4uga-shard-00-02.7cmeihs.mongodb.net:27017/test?ssl=true&replicaSet=atlas-b40f8q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

console.log("Testing Atlas Connection...");
mongoose.connect(uri2)
    .then(() => {
        console.log("SUCCESSFULLY CONNECTED TO ATLAS VIA DIRECT STRING");
        process.exit(0);
    })
    .catch(err2 => {
        console.log("DIRECT STRING FAILED: " + err2.message);
        process.exit(1);
    });
