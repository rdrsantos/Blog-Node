const express = require('express');
const app = express();
const connection = require('./database/db');
const CategoriesController = require('./categories/CategoriesController');
const PostsController = require('./posts/PostsController');

const { attachPaginate } = require('knex-paginate');
attachPaginate();

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
  .limit(6)
  .orderBy('id', 'desc')
  .then((posts) => {
    console.log(posts.length)
    res.render('index', {posts})
  })
  .catch(err => {
    console.log(err);
  })
})

app.get('/page/:num', (req, res) => {
  const {num: page} = req.params;
  let offset;
  if(page == 1){
    offset = 0;
  }else{
    offset = (parseInt(page) - 1) * 4;
  }
  
  if(page !== undefined){
    connection('posts')
    .join('categories', 'categories.id', 'posts.category_id')
    .select(['posts.*', 'categories.title as category'])
    .orderBy('id', 'desc')
    .paginate({ perPage: 6, currentPage: page, isLengthAware:true})
    .then((data) => {
      let next = (data.pagination.lastPage == page) ? false : true;

      let posts = data.data;

      res.render('posts/pagination', {posts, page: parseInt(page), next})
    })
    .catch(err => {
      console.log(err);
    })
  }
})


app.post('/filter', (req, res) => {
  const {search} = req.body;
  if(search !== undefined) {
    connection('posts')
    .innerJoin('categories', 'posts.category_id', 'categories.id')
    .select('posts.*', 'categories.title as category')
    .where('posts.title', 'like', `%${search}%`)
    .then((posts)=>{
      res.render('index', {posts})
    })

  }
})
app.listen(8080);