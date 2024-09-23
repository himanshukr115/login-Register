const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session');
const app = express()
const port = 3000
app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1:27017/LocalToMail');

app.get('/', (req, res) => {
  res.render('home')
})
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const loginRouter = require('./routers/login');
app.use('/', loginRouter)
const registerRouter = require('./routers/register');
app.use('/', registerRouter)
const dashboardRouter = require('./routers/dashboard');
app.use('/', dashboardRouter)
const logoutRouter = require('./routers/logout');
app.use('/', logoutRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})