var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";

MongoClient.connect(uri, { useNewUrlParser: true } , function(err, client) {
    if (err) throw err;

    const db = client.db("contacts");
    db.collection('users').find({}).toArray(function(err, result) {
        if (err) throw err;
        res.render('../user/dashboard', {users: result});
    });
});

router.get('/dashboard', function (req, res, next) {
    res.render('home/home');
});

module.exports = router;
