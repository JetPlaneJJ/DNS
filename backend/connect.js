// connect.js
// specifies settings for database connections

const keys = require("dotenv").config(); // to retrieve password on local end
const MongoClient = require("mongodb").MongoClient;

const uri = process.env.MONGO_URL; // secret key MUST ALSO be created on Heroku config vars
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = client.connect();

var methods = {
  queryDb: function (query, callback) {
    connection.then(() => {
      return client
        .db("AssistiveTechLib")
        .collection("Products")
        .find(query)
        .toArray(function (err, result) {
          if (err) throw err;
          return callback(result);
        });
    });
  },

  getTags: function (query, callback) {
    connection.then(() => {
      return client
        .db("AssistiveTechLib")
        .collection("Tags")
        .find(query)
        .toArray(function (err, result) {
          if (err) throw err;
          return callback(result);
        });
    });
  },

  checkUserExists: function (query, callback) {
    connection.then(() => {
      return client
        .db("AssistiveTechLib")
        .collection("Users")
        .count(query, function (err, result) {
          if (err) throw err;
          return callback(result);
        });
    });
  },

  registerUser: function (query, callback) {
    console.log("entered registerUser");
    console.log("query: " + query);
    connection.then(() => {
      return client
        .db("AssistiveTechLib")
        .collection("Users")
        .insertOne(query, function (err, result) {
          if (err) throw err;
          console.log("user insert");
        });
    });
  },

  loginUser: function (query, callback) {
    console.log("entered loginUser");
    connection.then(() => {
      return client
        .db("AssistiveTechLib")
        .collection("Users")
        .count(query, function (err, result) {
          if (err) throw err;
          return callback(result);
        });
    });
  },

  insertField: function (pid, url) {
    connection.then(function (err, db) {
      var dbo = db.db("AssistiveTechLib");
      dbo.collection("Products").updateOne(
        { ProductId: pid },
        {
          $set: { EmbeddedLink: url },
        }
      );
    });
  },

  insertTags: function (username, tags) {
    connection.then(function (err, db) {
      var dbo = db.db("AssistiveTechLib");
      dbo.collection("Users").updateOne(
        { username: username },
        {
          $set: { tags: tags },
        }
      );
    });
  },

  getDefaultTags: function (query, callback) {
    connection.then(function (err, db) {
      var dbo = db.db("AssistiveTechLib");
      dbo.collection("Users").findOne(query, function (err, result) {
        if (err) throw err;
        return callback(result);
      });
    });
  },
};
module.exports = methods;
