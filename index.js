const express = require('express');
const app = express();
const connection = require('./database/db');
const CategoriesController = require('./categories/CategoriesController');
const PostsController = require('./posts/PostsController');

app.set('view engine', 'ejs');

//static
app.use(express.static('public'));

//body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/', CategoriesController);
app.use('/', PostsController);

app.get('/',(req, res) => {
  connection('posts')
  .join('categories', 'categories.id', 'posts.category_id')
  .select(['posts.*', 'categories.title as category'])
  .then((data) => {
    let posts = data;
    posts.forEach(item => {
      item.body = item.body.substring(0,100)
    })
    res.render('index', {posts})
  })
  .catch(err => {
    console.log(err);
  })
})

app.listen(8080);