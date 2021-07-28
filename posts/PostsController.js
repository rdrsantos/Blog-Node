const express = require('express');
const router = express.Router();
const connection = require('../database/db');

router.get('/posts', (req, res) => {
  connection('categories')
  .join('posts', 'categories.id', 'posts.category_id')
  .select()
  .then((posts)=>{
    res.render('posts', {posts});
  })
  .catch(err=>{
    console.log(err)
  })
})

router.get('/posts/new', (req, res) => {
  connection('categories')
  .select()
  .then((categories)=>{
    res.render('posts/new', {categories});
  })
  .catch(err=>{
    console.log(err)
  })
})

router.post('/posts/add', (req, res)=>{
  const {title, category_id, body} = req.body;
  if( title !== undefined &&
      category_id !== undefined &&
      body !== undefined
    ){
      connection('posts')
      .insert({
        title,
        slug: title,
        category_id,
        body
      })
      .then(()=>{
        res.redirect('/posts')
      })
      .catch(err=>{
        console.log(err);
      })
    } else {
      res.redirect('/posts');
    }
})

//delete
router.post('/post/delete', (req, res) => {
  const { id } = req.body;
  if(id !== undefined ){
    connection('posts')
    .where({id})
    .del()
    .then(() => {
      res.redirect('/posts')
    })
    .catch(err => {
      console.log(err);
    })
  }
})


router.get('/post/edit/:id', (req, res) => {
  const {id} = req.params;
  if(id !== undefined){
    connection
    .select()
    .where({id})
    .from('posts')
    .then((post) => {
      connection('categories')
      .select()
      .then((categories) => {
        res.render('posts/edit', {post: post[0], categories})
      })
    })
    .catch( err =>{
      console.log(err)
    })
  }
})

//editar
router.post('/post/update', (req, res)=>{
  const {id, title, category_id, body} = req.body;
  if(id !== undefined) {
    connection('posts')
    .where({id})
    .update({
      title,
      slug: title,
      body,
      category_id
    })
    .then(()=>{
      res.redirect('/posts')
    })
    .catch(err => {
      console.log(err)
    })
  }
})
module.exports = router;