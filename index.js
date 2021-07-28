const express = require('express');
const app = express();
const CategoriesController = require('./categories/CategoriesController')

app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', CategoriesController);

app.get('/',(req, res) => {
  res.render('index')
})

app.listen(8080);