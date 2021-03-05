// connect.js
// specifies settings for database connections

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jial8:i26nwmaVFQ53rRA@pnwlibrarysheets.2k6c1.mongodb.net/AssistiveTechLib?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var methods = {
    queryDb: function (query, callback) {
        client.connect(err => {
            console.log("entered queryDb without error");
            return client.db("AssistiveTechLib").collection("Products").find(query).toArray(function (err, result) {
                if (err) throw err;
                return callback(result);
            });
        });
    },

    getTags: function (query, callback) {
        client.connect(err => {
            console.log("entered getTags without error");
            return client.db("AssistiveTechLib").collection("Tags").find(query).toArray(function(err, result) {
                if (err) throw err;
                return callback(result);
            })
        });
    },

    checkUserExists: function (query, callback) {
        client.connect(err => {
            console.log("entered checkUserExists without error")
            return client.db("AssistiveTechLib").collection("Users").count(query, function (err, result) {
                if (err) throw err;
                return callback(result);
            });
        });
    },

    registerUser: function (query, callback) {
        console.log("entered registerUser");
        console.log("query: " + query);
        client.connect(err => {
            return client.db("AssistiveTechLib").collection("Users").insertOne(query, function (err, result) {
                if (err) throw err;
                console.log("user insert")
            });
        });
    },

    loginUser: function (query, callback) {
        console.log("entered loginUser")
        client.connect(err => {
            return client.db("AssistiveTechLib").collection("Users").count(query, function (err, result) {
                if (err) throw err;
                return callback(result);
            });
        });
    }, 

    insertField: function (pid, url) {
        client.connect(function (err, db) {
            var dbo = db.db("AssistiveTechLib");
            dbo.collection('Products').updateOne(
                {ProductId: pid},
                {
                    $set: {'ImgurLink': url}
                }
            )
        });
    },

    insertTags: function (username, tags) {
        client.connect(function (err, db) {
            var dbo = db.db("AssistiveTechLib");
            dbo.collection('Users').updateOne(
                {username: username},
                {
                    $set: {'tags': tags}
                }
            )
        });
    },

    getDefaultTags: function (query, callback) {
        client.connect(function (err, db) {
            var dbo = db.db("AssistiveTechLib");
            dbo.collection('Users').findOne(query, function (err, result) {
                if (err) throw err;
                return callback(result);
            });
        });
    }

}
module.exports = methods;