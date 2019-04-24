var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    client.close();
});


router.get('/dashboard', function (req, res, next) {
    res.render('home/home');
});

router.post('submit', function (req, res, next) {
    const name = req.body.problemDescription;
    var error;

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            description: name,
        };

        dbo.collection("publicposts").insertOne(myobj, function(err, res) {
            if (err){
                error = "Ops! Error... Please Try again";
            }else{
                error = "Query submitted Successfully";
                db.close();
            }
        });
    });
});

module.exports = router;
