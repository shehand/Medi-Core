var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    client.close();
});


/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/dashboard', function (req, res, next) {
    res.render('home');
});
router.get('/users/add', function (req, res, next) {
    const name = "shehan dhaleesha";
    const password = "11111111";
    var error;

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            name: name,
            pass: password
        };

        dbo.collection("users").insertOne(myobj, function(err, res) {
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
