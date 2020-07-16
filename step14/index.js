const compression = require('compression')
const express = require('express')
const favicon = require('serve-favicon')

var database = require('./database')
var encodings = require('./middlewares/encodings')

const app = express()

app.use(compression())

app.use(favicon('./public/favicon.ico'))

// for html rendering
app.set('views', './views')
app.set('view engine', 'pug')

// setup middleware to decode the content-type
// see http://docs.opengeospatial.org/is/17-069r3/17-069r3.html#_encodings
app.use(encodings)

// connect to the database, and 
// create a root for every collection in the database
database.connect( function(err) {
  if (err) console.log(err);

  database.getCollections( './data', function(err, collections) {
    if(err) console.log(err);

    collections.forEach( root => {
      app.use(`/${root}.:ext?`, require('./route'))
      console.log(`/${root} running`)
    })
  })
})

module.exports = app