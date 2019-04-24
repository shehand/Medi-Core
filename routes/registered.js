var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";

router.get('/dashboard', function (req, res, next) {
    var resultArray = [];

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");
        var cursor = dbo.collection("registered_posts").find().sort({'_id':-1});

        cursor.forEach(function (doc, err) {
            if (err) throw err;
            resultArray.push(doc);
        }, function () {
            db.close();
            res.render("home/home", {public_posts: resultArray});
        });

    });

});

router.post("/comments", function (req, res, next) {
    const postID = req.body.publicPostIDValue;
    var commentArray = [];

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        var dbo = db.db("medicore");

        var cursor = dbo.collection("registered_post_comments").find({postID: postID});
        cursor.forEach(function (doc, err) {
            if (err) throw err;
            commentArray.push(doc);
        }, function () {
            db.close();
            res.render("user/registeredUser/privatePosts", {postID: postID, comments: commentArray});
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

        dbo.collection("registered_posts").insertOne(myobj, function(err){
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

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            comment: comment,
            postID: postID[0]
        };

        dbo.collection("registered_post_comments").insertOne(myobj, function (err) {
            if (err){

            }else{
                db.close();
                res.redirect("/dashboard");
            }
        });
    });
});

router.post("create/group", function (req, res, next) {
    backURL=req.header('Referer') || '/';
    const groupName = req.body;
    const creater = req.body;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
       if(err) throw  err;

       var dbo = db.db("medicore");

       var myobj = {
           name: groupName,
           creater: creater
       };

       dbo.collection("groups").insertOne(myobj, function (err) {
          if(err){

          } else{
              db.close();
              res.redirect(backURL);
          }
       });
    });
});

router.post("add/users", function (req, res, next) {
    backURL=req.header('Referer') || '/';
    const userID = req.body;
    const groupID = req.body;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if(err) throw  err;

        var dbo = db.db("medicore");

        var myobj = {
            userID: userID,
            groupID: groupID
        };

        dbo.collection("groups_members").insertOne(myobj, function (err) {
            if(err){

            } else{
                db.close();
                res.redirect(backURL);
            }
        });
    });
});

router.post("create/group_threads", function (req, res, next) {
    backURL=req.header('Referer') || '/';
    const creater = req.body;
    const groupID = req.body;

    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if(err) throw  err;

        var dbo = db.db("medicore");

        var myobj = {
            creater: creater,
            groupID: groupID
        };

        dbo.collection("groups_threads").insertOne(myobj, function (err) {
            if(err){

            } else{
                db.close();
                res.redirect(backURL);
            }
        });
    });
});



module.exports = router;
