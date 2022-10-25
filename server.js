const express = require("express");
const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient

const app = express()
app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

/* ---- Connection with the DB ---- */
const db_url = "mongodb://localhost:27017"
const db_name = 'db2'
let db

MongoClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)
  db = client.db(db_name)
  console.log(`Connected to MongoDB`)
  console.log(`Database: ${db_name}`)
  app.listen(3000, () => console.log('listening on 3000'))
})

/* ---- Begin Logic ---- */

app.get('/', (req, res) => {
  db.collection('songs').aggregate([{
    $match:{
      $and: [
        {"Highest Charting Position" : {$lt: 10}},
        {"Popularity": {$gt: 80}}
    ]}}]).toArray().then(results => {
      res.render('songs.ejs', { songs: results })
    })
})