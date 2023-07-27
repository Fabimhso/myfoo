const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express()

const port = process.env.PORT || 3333

const router = require('./routes/router')

app.use(session({
  secret: 'APasd7Uhysrf6yhO4LDYCHJS',
  resave: true,
  saveUninitialized: true
}));
app.use(express.urlencoded({
  extended: true
}))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))

// Routes
app.use(router)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})