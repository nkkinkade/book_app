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
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }
  superagent.get(url)
    .then(googleResponse => googleResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/show', {searchRes: results })
    );
}

// function Book(info) {
//   const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';
//   this.image = info.image || placeholderImage;
//   this.title = info.title || 'No title available';
//   this.author = info.author || 'No author available';
// }


// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
