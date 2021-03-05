// connect.js
// specifies settings for database connections
 
const keys = require('dotenv').config(); // to retrieve password on local end
const MongoClient = require('mongodb').MongoClient; 

const uri = process.env.MONGO_URL; // secret key MUST ALSO be created on Heroku config vars
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => { if (err) throw err} ); // attempt to connect to Mongo

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