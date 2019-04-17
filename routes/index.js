var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";
// router.use(csrfProtection);

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', {csrfToken: req.csrfToken()});
});

router.get('/dashboard', function (req, res, next) {
    var resultArray = [];
    var commentArray = [];

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");
        var cursor = dbo.collection("public_posts").find().sort({'_id':-1});
        var comments = dbo.collection("post_comments").find();

        comments.forEach(function (doc, err) {
            if(err) throw err;
            commentArray.push(doc);
        });

        cursor.forEach(function (doc, err) {
            if (err) throw err;
            resultArray.push(doc);
        }, function () {
            db.close();
            console.log(commentArray);
            res.render("home/home", {public_posts: resultArray, post_comments:commentArray});
        });

    });

});

router.post('/posts/add', function (req, res, next) {
    const description = req.body.problemDescription;
    backURL=req.header('Referer') || '/';

    var error;

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            problem_description: description,
        };

        dbo.collection("public_posts").insertOne(myobj, function(err){
            if (err){
                error = "Ops! Error... Please Try again";
            }else{
                error = "Query submitted Successfully";
                db.close();
                res.redirect(backURL);
            }
        });
    });
});

router.post("/placeComment", function (req, res, next) {
    backURL=req.header('Referer') || '/';
    const comment = req.body.placeCommentInputArea;
    const postID = req.body.publicPostIDValue;
    console.log(postID);

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            comment: comment,
            postID: postID
        };

        dbo.collection("post_comments").insertOne(myobj, function (err) {
            if (err){

            }else{
                db.close();
                res.redirect(backURL);
            }
        });
    });
});

router.get("/comments", function (req, res, next) {
    res.render("user/publicPost");
});

router.post("/register", function (req, res, next) {

});

router.get("/register", function (req, res, next) {

});

module.exports = router;
