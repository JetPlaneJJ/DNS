const fs = require('fs')
const path = require('path')
const express = require('express')
const database = require("./connect")
const app = express()

const index = fs.readFileSync(
  path.resolve(__dirname, '..', 'src/index.html'),
  'utf8',
)
const browse = fs.readFileSync(
  path.resolve(__dirname, '..', 'src/categories.html'),
  'utf8',
)
const product = fs.readFileSync(
  path.resolve(__dirname, '..', 'src/product-page.html'),
  'utf8',
)

app.get('/api/healthcheck', (req, res) => {
  return res.send('Healthy!')
})

app.get('/searchquery', (req, res) => {
  database.queryDb(req.query['query'], function(result) {
    res.json(result);
  })
})

app.get('/getTags', (req, res) => {
  typeTags = [];
  featureTags = [];
  database.getTags({"category": "type"}, function(result) {
    typeTags = result;
    database.getTags({"category": "feature"}, function(result) {
      featureTags = result;
      return res.json([typeTags, featureTags]);
    })
  })
})

app.get('/insertDefaultTags', (req, res) => {
  var username = req.query['username'];
  var tags = req.query['tags'];
  database.checkUserExists({"username": username}, function(result) {
    if (result == 0) {
      return res.json("There was an error accessing your account");
    } else {
      database.insertTags(username, tags, function(result) {
      });
      return res.json("Success");
    }
  })
})

app.get('/getDefaultTags', (req, res) => {
  var username = req.query['username'];
  database.getDefaultTags({username: username}, function(result) {
    return res.json(result.tags);
  })
})

app.use(express.static(path.resolve(__dirname, "..")))
app.use('/categories.html', (req, res) => res.send(browse))
app.use('/product-page.html', (req, res) => res.send(product))
app.use('/register.html', (req, res) => res.send(register))
app.use('/login.html', (req, res) => res.send(login))
app.use('/profile.html', (req, res) => res.send(profile))
app.use('/taxonomy.html', (req, res) => res.send(taxonomy))
app.use('/about.html', (req, res) => res.send(about))
app.use('/contact.html', (req, res) => res.send(contact))
app.use('/logout.html', (req, res) => res.send(logout))
app.use('/', (req, res) => res.send(index))

const port = process.env.PORT || 8081;
app.listen(port, function() {
  console.log('server successfully started on port ' + port);
});
module.exports = app