'use strict';

const express = require('express');
// const { request, response } = require('express');
const superagent = require('superagent');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

// Middleware!
// Wire up static files from public folder
app.use(express.static('./public'));
// Handle POST body from forms!
app.use(express.urlencoded({ extended: true }));
// AJAX might POST a body with JSON in it
app.use(express.json());


// Page Routes
app.get('/', (request, response) => {
  let viewModel = {

  }
  response.render('pages/index', viewModel);
})

app.get('/searches/new', (request, response) => {
  let viewModel = {

  }
  response.render('pages/searches/new',viewModel)
})

app.post('/searches', createSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));


function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?';
  // let {search} = request.body
  console.log(request.body)
  return superagent.get(url)
    .query({
      q: request.body.q
    })
    .then(data=> {
      // console.log(data.body.items);
      let bookData = data.body.items
      let books = [];
      bookData.forEach(book => books.push(new Book(book)))
      return books
    })
    .then(results => {
      response.render('pages/searches/show',{searchResults:results})
    })
    .catch(err=> {
      console.log(err)
    });
}

function Book(bookData) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = bookData.volumeInfo.title;
  this.authors = bookData.volumeInfo.authors;
  this.description = bookData.volumeInfo.description
  this.categories = bookData.volumeInfo.categories
  this.image = bookData.volumeInfo.imageLinks.smallThumbnail;
}


// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
