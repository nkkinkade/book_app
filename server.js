'use strict';

const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
// const { response } = require('express');
// const { response } = require('express');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');

// Middleware!
// Wire up static files from public folder
app.use(express.static('public'));
// Handle POST body from forms!
app.use(express.urlencoded({ extended: true }));
// AJAX might POST a body with JSON in it
app.use(express.json());

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => { throw err; });


// Page Routes
app.get('/', (request, response) => {
  let viewModel = {

  }
  response.render('pages/index', viewModel);
});
app.get('/library',getBooks);

app.post('/book',addBook);

app.get('/search', (request, response) => {
  let viewModel = {

  }
  response.render('pages/searches/new',viewModel)
});

app.post('/searches', createSearch);

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

function handleError(error, response) {
  response.render('pages/error', { error: 'Uh Oh' });
}

function addBook(request, response) {
  // console.log(request.body);
  let { title, authors, image_url, description, isbn } = request.body;
  let values = [ title, authors, image_url, description, isbn];
  let SQL = 'INSERT INTO books (title, authors, image_url, description, isbn) VALUES ($1, $2, $3, $4, $5);';
  console.log(values)
  return client.query(SQL, values)
    .then(response.redirect('/library'))
    .catch(err => handleError(err, response));
}

function getBooks(request, response) {
  let SQL = 'SELECT * from books;';

  return client.query(SQL)
    .then(results => response.render('pages/library', { results: results.rows }))
    .catch(handleError);
}


function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?';
  console.log(request.body)
  return superagent.get(url)
    .query({
      q: request.body.q
    })
    .then(data=> {
      let bookData = data.body.items
      let books = [];
      bookData.forEach(book => books.push(new Book(book)))
      return books
    })
    .then(results => {
      console.log(results)
      response.render('pages/show',{searchResults:results})
    })
    .catch(err=> {
      console.log(err)
    });
}

function Book(bookData) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
  // this.url = bookData.url ? bookData.url.replace('http:', 'https:') : 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = bookData.volumeInfo.title ? bookData.volumeInfo.title: 'No Title Available';
  this.authors = bookData.volumeInfo.authors.join(', ').toString() ? bookData.volumeInfo.authors: 'No Authors Available';
  this.image_url = bookData.volumeInfo.imageLinks.smallThumbnail ? bookData.volumeInfo.imageLinks.smallThumbnail : placeholderImage;
  this.description = bookData.volumeInfo.description ? bookData.volumeInfo.description: 'No Description Available';
  this.isbn = bookData.volumeInfo.industryIdentifiers.map(i=> i.identifier).join(', ').toString() ? bookData.volumeInfo.industryIdentifiers: 'No ISBN Available';
}


// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

