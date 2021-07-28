const express = require('express');
const app = express();
const connection = require('./database/db');


app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection
.authenticate()
.then(()=>{})
.catch((err)=>console.log(err))

// app.use('/', UserController);

app.get('/',(req, res) => {
  res.render('index')
})

app.listen(8080);