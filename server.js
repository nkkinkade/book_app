'use strict';

const express = require('express');

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

app.get('*', (request, response) => response.status(404).send('This route does not exist'));

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));