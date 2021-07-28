const express = require('express');
const router = express.Router();
const connection = require('../database/db');


router.get('/categories/new', (req, res) => {
  res.render('categories/new');
})

router.post('/categories/add', (req, res) => {
  const {title} = req.body;
    if(title !== undefined && title !== ''){
      connection.insert(
        {
          title,
          tag: title
        }
      ).into('categories')
      .then(() => {
        res.redirect('/categories')
      }).catch(err => console.log(err))
    }
})

router.get('/categories', (req, res) => {
  connection
  .select()
  .table('categories')
  .then((categories) => {
    res.render('categories/index', {categories});
  }).catch(err => {
    console.log(err)
  })
})

//deletar 
router.post('/category/delete', (req, res) => {
  const {id} = req.body;
  if(id !== undefined){
    connection('categories')
    .where({id})
    .del()
    .then(() => {
      res.redirect('/categories');
    })
    .catch(err => {
      console.log(err)
    })
  }
})


router.get('/category/edit/:id', (req, res) => {
  const {id} = req.params;
  if(id !== undefined){
    connection
    .select()
    .where({id})
    .from('categories')
    .then((category) => {
      res.render('categories/edit', {category: category[0]})
    })
    .catch( err =>{
      console.log(err)
    })
  }
})

//editar
router.post('/category/update', (req, res)=>{
  const {id, title} = req.body;
  if(id !== undefined) {
    connection('categories')
    .where({id})
    .updade({
      title
    })
    .then(()=>{
      res.redirect('/categories')
    })
    .catch(err => {
      console.log(err)
    })
  }
})

module.exports = router;